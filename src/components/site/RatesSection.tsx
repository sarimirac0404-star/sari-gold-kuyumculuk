import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { getRates, type GoldRate } from "@/lib/rates.functions";

function formatTL(v: number) {
  if (!v) return "—";
  return new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(v);
}

function RateCard({ rate }: { rate: GoldRate }) {
  const positive = (rate.change ?? 0) >= 0;
  return (
    <div className="group relative p-6 bg-card border border-border hover:border-primary/60 transition-all duration-500 hover:-translate-y-1 hover:shadow-gold">
      <div className="absolute top-0 left-0 w-12 h-px bg-gradient-to-r from-primary to-transparent" />
      <div className="absolute bottom-0 right-0 w-12 h-px bg-gradient-to-l from-primary to-transparent" />

      <div className="flex items-start justify-between mb-4">
        <h3 className="font-display text-lg text-gold-pale">{rate.name}</h3>
        {rate.change != null && rate.buying > 0 && (
          <span
            className={`flex items-center gap-1 font-ui text-[10px] ${
              positive ? "text-success" : "text-destructive"
            }`}
          >
            {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(rate.change).toFixed(2)}%
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="font-ui text-[10px] text-muted-foreground mb-1">Alış</div>
          <div className="font-display text-xl text-foreground">{formatTL(rate.buying)}</div>
        </div>
        <div>
          <div className="font-ui text-[10px] text-muted-foreground mb-1">Satış</div>
          <div className="font-display text-xl text-primary">{formatTL(rate.selling)}</div>
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="p-6 bg-card border border-border animate-pulse">
      <div className="h-5 w-24 bg-muted rounded mb-6" />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="h-3 w-10 bg-muted rounded mb-2" />
          <div className="h-6 w-20 bg-muted rounded" />
        </div>
        <div>
          <div className="h-3 w-10 bg-muted rounded mb-2" />
          <div className="h-6 w-20 bg-muted rounded" />
        </div>
      </div>
    </div>
  );
}

export function RatesSection() {
  const fetchRates = useServerFn(getRates);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["rates"],
    queryFn: () => fetchRates(),
    refetchInterval: 15_000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    staleTime: 0,
  });


  const allRates = data ? [...data.gold, ...data.currency] : [];
  const timestamp = data?.updatedAt
    ? new Date(data.updatedAt).toLocaleTimeString("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "--:--";
  const showError = isError || (data?.error && allRates.every((r) => r.buying === 0));

  return (
    <section className="relative py-24 bg-gradient-to-b from-background via-card to-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 mb-3 justify-center md:justify-start">
              <span className="relative inline-flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-success pulse-dot" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              <span className="font-ui text-[10px] text-success uppercase tracking-widest">Canlı</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl text-gradient-gold">
              Sarı Gold Kuyumculuk Canlı Kur
            </h2>
            <p className="font-serif text-lg text-muted-foreground mt-2 italic">
              Anlık altın, gümüş ve döviz fiyatları
            </p>
          </div>
          <div className="font-ui text-[10px] text-muted-foreground">
            Son güncelleme: {timestamp}
          </div>
        </div>

        {showError ? (
          <div className="flex items-center justify-center gap-3 p-12 border border-destructive/40 bg-destructive/5 text-destructive">
            <AlertCircle size={20} />
            <span className="font-serif text-lg">Kur bilgisi şu an alınamıyor</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {isLoading || !data
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
              : allRates.map((r) => <RateCard key={r.name} rate={r} />)}
          </div>
        )}
      </div>
    </section>
  );
}
