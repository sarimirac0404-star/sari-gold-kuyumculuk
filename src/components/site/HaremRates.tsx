export function HaremRates() {
  return (
    <section className="relative py-20 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-10">
          <div className="flex items-center gap-2 mb-3 justify-center">
            <span className="relative inline-flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-success pulse-dot" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            <span className="font-ui text-[10px] text-success uppercase tracking-widest">
              Harem Altın · Canlı
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl text-gradient-gold">
            Harem Altın Canlı Kur
          </h2>
          <p className="font-serif text-lg text-muted-foreground mt-2 italic">
            Veriler doğrudan Harem Altın piyasasından alınmaktadır
          </p>
        </div>

        <div className="relative border border-border bg-card overflow-hidden shadow-gold">
          <div className="absolute top-0 left-0 w-16 h-px bg-gradient-to-r from-primary to-transparent" />
          <div className="absolute bottom-0 right-0 w-16 h-px bg-gradient-to-l from-primary to-transparent" />
          <iframe
            src="https://canlipiyasalar.haremaltin.com/"
            title="Harem Altın Canlı Kur"
            className="w-full bg-white"
            style={{ height: 720, border: 0 }}
            loading="lazy"
          />
        </div>

        <p className="font-ui text-[10px] text-muted-foreground text-center mt-4">
          Kaynak: haremaltin.com — Gösterilen değerler bilgi amaçlıdır.
        </p>
      </div>
    </section>
  );
}
