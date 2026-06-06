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

interface TruncgilItem {
  Buying: number;
  Selling: number;
  Change: number;
  Type: string;
  Name?: string;
}

const GOLD_MAP: Array<[string, string]> = [
  ["GRA", "Gram Altın"],
  ["HAS", "Has Altın"],
  ["CEYREKALTIN", "Çeyrek Altın"],
  ["YARIMALTIN", "Yarım Altın"],
  ["TAMALTIN", "Tam Altın"],
  ["CUMHURIYETALTINI", "Cumhuriyet Altını"],
  ["ATAALTIN", "Ata Altın"],
  ["RESATALTIN", "Reşat Altın"],
  ["HAMITALTIN", "Hamit Altın"],
  ["IKIBUCUKALTIN", "İki Buçuk Altın"],
  ["BESLIALTIN", "Beşli Altın"],
  ["GREMSEALTIN", "Gremse Altın"],
  ["22AYARBILEZIK", "22 Ayar Bilezik"],
  ["18AYARALTIN", "18 Ayar Altın"],
  ["14AYARALTIN", "14 Ayar Altın"],
  ["GUMUS", "Gümüş"],
];

const CURRENCY_MAP: Array<[string, string]> = [
  ["USD", "Dolar"],
  ["EUR", "Euro"],
];

// Fiyat farkları (offset'ler) /admin sayfasından yönetilir ve veritabanından okunur.
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
  if (!off || (rate.buying === 0 && rate.selling === 0)) return rate;
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
      const res = await fetch("https://finans.truncgil.com/v4/today.json", {
        headers: { "user-agent": "Mozilla/5.0" },
      });
      if (!res.ok) {
        return { ...empty, error: `Kur servisi hatası (${res.status})` };
      }
      const data = (await res.json()) as Record<string, TruncgilItem | string>;

      const pick = (key: string, label: string): GoldRate => {
        const it = data[key] as TruncgilItem | undefined;
        return {
          name: label,
          buying: it?.Buying ?? 0,
          selling: it?.Selling ?? 0,
          change: it?.Change,
        };
      };

      const gold = GOLD_MAP.map(([k, l]) => pick(k, l))
        .filter((r) => r.buying > 0 || r.selling > 0)
        .map(applyOffset);
      const currency = CURRENCY_MAP.map(([k, l]) => pick(k, l))
        .filter((r) => r.buying > 0 || r.selling > 0)
        .map(applyOffset);

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
