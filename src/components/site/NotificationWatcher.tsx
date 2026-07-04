import { useEffect, useRef } from "react";
import { useServerFn } from "@tanstack/react-start";
import { listRecentProducts } from "@/lib/notify.functions";

const STORAGE_KEY = "sg_known_product_ids_v1";
const PERM_ASKED_KEY = "sg_notif_perm_asked_v1";
const POLL_INTERVAL_MS = 60_000;

export function NotificationWatcher() {
  const fetchRecent = useServerFn(listRecentProducts);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("Notification" in window)) return;
    if (initializedRef.current) return;
    initializedRef.current = true;

    let cancelled = false;
    let timer: number | undefined;

    async function ensurePermission() {
      if (Notification.permission === "default" && !sessionStorage.getItem(PERM_ASKED_KEY)) {
        sessionStorage.setItem(PERM_ASKED_KEY, "1");
        try {
          await Notification.requestPermission();
        } catch {
          /* ignore */
        }
      }
    }

    function loadKnown(): Set<string> {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return new Set();
        const arr = JSON.parse(raw);
        return new Set(Array.isArray(arr) ? arr : []);
      } catch {
        return new Set();
      }
    }

    function saveKnown(ids: Iterable<string>) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(ids)));
      } catch {
        /* ignore */
      }
    }

    async function tick(firstRun: boolean) {
      if (cancelled) return;
      try {
        const products = await fetchRecent();
        const known = loadKnown();
        const currentIds = products.map((p) => p.id);

        if (firstRun && known.size === 0) {
          // First ever visit — seed baseline so we don't fire for existing catalog.
          saveKnown(currentIds);
          return;
        }

        const newOnes = products.filter((p) => !known.has(p.id));
        if (newOnes.length > 0 && Notification.permission === "granted" && !firstRun) {
          for (const p of newOnes.slice(0, 3)) {
            try {
              new Notification("Sarı Gold Kuyumculuk — Yeni Ürün", {
                body: p.name,
                icon: "/favicon.png",
                tag: `sg-product-${p.id}`,
              });
            } catch {
              /* ignore */
            }
          }
        }

        // Merge to persist history
        const merged = new Set<string>(known);
        for (const id of currentIds) merged.add(id);
        saveKnown(merged);
      } catch {
        /* ignore transient */
      }
    }

    (async () => {
      await ensurePermission();
      await tick(true);
      timer = window.setInterval(() => tick(false), POLL_INTERVAL_MS);
    })();

    return () => {
      cancelled = true;
      if (timer) window.clearInterval(timer);
    };
  }, [fetchRecent]);

  return null;
}
