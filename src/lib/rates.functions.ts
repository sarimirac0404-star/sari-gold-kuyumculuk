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

interface CollectApiItem {
  name: string;
  buying: number | string;
  selling: number | string;
  rate?: number | string;
}

const GOLD_LABELS: Record<string, string> = {
  "gram-altin": "Gram Altın",
  "ceyrek-altin": "Çeyrek Altın",
  "yarim-altin": "Yarım Altın",
  "tam-altin": "Tam Altın",
};

const CURRENCY_LABELS: Record<string, string> = {
  USD: "USD/TRY",
  EUR: "EUR/TRY",
};

const num = (v: number | string | undefined): number => {
  if (v == null) return 0;
  if (typeof v === "number") return v;
  return parseFloat(String(v).replace(",", ".")) || 0;
};

export const getRates = createServerFn({ method: "GET" }).handler(async (): Promise<RatesPayload> => {
  const key = process.env.COLLECTAPI_KEY;
  const empty: RatesPayload = {
    gold: [],
    currency: [],
    updatedAt: new Date().toISOString(),
    error: null,
  };

  if (!key) {
    return { ...empty, error: "Kur bilgisi şu an alınamıyor" };
  }

  const headers = {
    "content-type": "application/json",
    authorization: key.startsWith("apikey ") ? key : `apikey ${key}`,
  };

  try {
    const [goldRes, fxRes] = await Promise.all([
      fetch("https://api.collectapi.com/economy/goldPrice", { headers }),
      fetch("https://api.collectapi.com/economy/allCurrency", { headers }),
    ]);

    if (!goldRes.ok || !fxRes.ok) {
      return { ...empty, error: "Kur bilgisi şu an alınamıyor" };
    }

    const goldJson = (await goldRes.json()) as { result?: CollectApiItem[] };
    const fxJson = (await fxRes.json()) as { result?: CollectApiItem[] };

    const goldItems = (goldJson.result ?? []).filter((it) => GOLD_LABELS[it.name as string]);
    const gold: GoldRate[] = Object.keys(GOLD_LABELS).map((slug) => {
      const found = goldItems.find((g) => g.name === slug);
      return {
        name: GOLD_LABELS[slug],
        buying: num(found?.buying),
        selling: num(found?.selling),
        change: found?.rate != null ? num(found.rate) : undefined,
      };
    });

    const fxItems = (fxJson.result ?? []).filter((it) => CURRENCY_LABELS[it.name as string]);
    const currency: GoldRate[] = Object.keys(CURRENCY_LABELS).map((code) => {
      const found = fxItems.find((g) => g.name === code);
      return {
        name: CURRENCY_LABELS[code],
        buying: num(found?.buying),
        selling: num(found?.selling),
        change: found?.rate != null ? num(found.rate) : undefined,
      };
    });

    return {
      gold,
      currency,
      updatedAt: new Date().toISOString(),
      error: null,
    };
  } catch (err) {
    console.error("CollectAPI failed", err);
    return { ...empty, error: "Kur bilgisi şu an alınamıyor" };
  }
});
