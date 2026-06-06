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

// ============================================================
// FİYAT FARKLARI (TL cinsinden) — Harem Altın fiyatına eklenir
// Pozitif değer = üstünde, Negatif değer = altında
// Sadece bu sayıları değiştirerek farkları ayarlayabilirsiniz.
// ============================================================
const OFFSETS: Record<string, { buying: number; selling: number }> = {
  // Altın
  "Gram Altın":         { buying: 0, selling: 0 },
  "Has Altın":          { buying: 0, selling: 0 },
  "Çeyrek Altın":       { buying: 0, selling: 0 },
  "Yarım Altın":        { buying: 0, selling: 0 },
  "Tam Altın":          { buying: 0, selling: 0 },
  "Cumhuriyet Altını":  { buying: 0, selling: 0 },
  "Ata Altın":          { buying: 0, selling: 0 },
  "Reşat Altın":        { buying: 0, selling: 0 },
  "Hamit Altın":        { buying: 0, selling: 0 },
  "İki Buçuk Altın":    { buying: 0, selling: 0 },
  "Beşli Altın":        { buying: 0, selling: 0 },
  "Gremse Altın":       { buying: 0, selling: 0 },
  "22 Ayar Bilezik":    { buying: 0, selling: 0 },
  "18 Ayar Altın":      { buying: 0, selling: 0 },
  "14 Ayar Altın":      { buying: 0, selling: 0 },
  "Gümüş":              { buying: 0, selling: 0 },
  // Döviz
  "Dolar":              { buying: 0, selling: 0 },
  "Euro":               { buying: 0, selling: 0 },
};

function applyOffset(rate: GoldRate): GoldRate {
  const off = OFFSETS[rate.name];
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

      const gold = GOLD_MAP.map(([k, l]) => pick(k, l)).filter(
        (r) => r.buying > 0 || r.selling > 0,
      );
      const currency = CURRENCY_MAP.map(([k, l]) => pick(k, l)).filter(
        (r) => r.buying > 0 || r.selling > 0,
      );

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
