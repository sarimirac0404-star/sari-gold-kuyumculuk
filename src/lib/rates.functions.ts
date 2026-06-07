import { createServerFn } from "@tanstack/react-start";

export interface GoldRate {
  name: string;
  buying: number;
  selling: number;
  change?: number;
}

export interface RatesPayload {
  gold: GoldRate[];
  currency: GoldRate[];
  updatedAt: string;
  error?: string | null;
}

interface KurpanoItem {
  Type: number; // 1=gold, 2=currency, 4=silver
  ProductName: string;
  TableSort: number;
  RoundPurchasePrice: string;
  RoundSalesPrice: string;
}

interface KurpanoResponse {
  Status: boolean;
  Value: KurpanoItem[];
}

// Sadece bu ürünler gösterilecek — kurpano.com/sarigold ile birebir aynı sıra.
const ALLOWED = [
  "EUR",
  "USD",
  "HAS ALTIN",
  "24 AYAR 1 GR",
  "22 AYAR BİLEZİK",
  "ESKİ ATA LİRA",
  "YENİ ATA LİRA",
  "GÜMÜŞ",
  "ESKİ ÇEYREK",
  "ESKİ YARIM",
  "ESKİ TAM",
  "YENİ ÇEYREK",
  "YENİ YARIM",
  "YENİ TAM",
] as const;

function parseTrNumber(s: string): number {
  if (!s) return 0;
  // "6.466" -> 6466 ; "52,83" -> 52.83 ; "96,401" -> 96.401
  const normalized = s.replace(/\./g, "").replace(",", ".");
  const n = parseFloat(normalized);
  return Number.isFinite(n) ? n : 0;
}

async function loadOffsets(): Promise<Record<string, { buying: number; selling: number }>> {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("rate_offsets")
      .select("item_name, buying_offset, selling_offset");
    if (error || !data) return {};
    const map: Record<string, { buying: number; selling: number }> = {};
    for (const r of data) {
      map[r.item_name] = {
        buying: Number(r.buying_offset) || 0,
        selling: Number(r.selling_offset) || 0,
      };
    }
    return map;
  } catch {
    return {};
  }
}

function applyOffset(
  rate: GoldRate,
  offsets: Record<string, { buying: number; selling: number }>,
): GoldRate {
  const off = offsets[rate.name];
  if (!off) return rate;
  return {
    ...rate,
    buying: rate.buying ? rate.buying + off.buying : rate.buying,
    selling: rate.selling ? rate.selling + off.selling : rate.selling,
  };
}

export const getRates = createServerFn({ method: "GET" }).handler(
  async (): Promise<RatesPayload> => {
    const empty: RatesPayload = {
      gold: [],
      currency: [],
      updatedAt: new Date().toISOString(),
      error: null,
    };

    try {
      const res = await fetch(
        "https://kurpano.com/sarigold/GetCurrentCompanyProductPrice",
        {
          headers: {
            "user-agent": "Mozilla/5.0",
            accept: "application/json",
            referer: "https://kurpano.com/sarigold",
          },
        },
      );
      if (!res.ok) {
        return { ...empty, error: `Kur servisi hatası (${res.status})` };
      }
      const data = (await res.json()) as KurpanoResponse;
      if (!data?.Status || !Array.isArray(data.Value)) {
        return { ...empty, error: "Kur bilgisi şu an alınamıyor" };
      }

      const byName = new Map<string, KurpanoItem>();
      for (const it of data.Value) byName.set(it.ProductName.trim(), it);

      const offsets = await loadOffsets();

      const all: GoldRate[] = ALLOWED.map((name) => {
        const it = byName.get(name);
        return {
          name,
          buying: it ? parseTrNumber(it.RoundPurchasePrice) : 0,
          selling: it ? parseTrNumber(it.RoundSalesPrice) : 0,
        };
      }).map((r) => applyOffset(r, offsets));

      const currency = all.filter((r) => r.name === "EUR" || r.name === "USD");
      const gold = all.filter((r) => r.name !== "EUR" && r.name !== "USD");

      return {
        gold,
        currency,
        updatedAt: new Date().toISOString(),
        error: null,
      };
    } catch (err) {
      console.error("rates fetch failed", err);
      return { ...empty, error: "Kur bilgisi şu an alınamıyor" };
    }
  },
);
