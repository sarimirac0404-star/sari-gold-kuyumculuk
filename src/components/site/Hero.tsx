export function Hero() {
  return (
    <section
      id="anasayfa"
      className="relative min-h-screen flex items-center justify-center overflow-hidden deco-bg"
    >
      {/* Art deco pattern overlay */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.08] pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="deco" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <path
              d="M40 0 L80 40 L40 80 L0 40 Z M40 20 L60 40 L40 60 L20 40 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-primary"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#deco)" />
      </svg>

      {/* Radial gold glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.76_0.13_85/0.15)_0%,transparent_60%)] pointer-events-none" />

      <div className="relative z-10 text-center px-6 max-w-4xl animate-fade-in">
        {/* Top ornament */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-primary" />
          <span className="font-ui text-[10px] text-primary">Eleşkirt</span>
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-primary" />
        </div>

        <h1 className="shimmer font-display text-5xl md:text-7xl lg:text-8xl leading-[1.05] font-bold">
          SARI GOLD
        </h1>
        <p className="font-display text-2xl md:text-4xl text-gold-pale mt-2 tracking-[0.3em]">
          KUYUMCULUK
        </p>

        <p className="mt-10 font-serif text-xl md:text-2xl text-foreground/85 italic">
          “Altının İhtişamı, Güvenin Adresi”
        </p>

        <div className="mt-12">
          <a
            href="#urunler"
            className="group relative inline-flex items-center gap-3 px-10 py-4 border border-primary text-primary font-ui text-xs overflow-hidden transition-colors duration-500 hover:text-primary-foreground"
          >
            <span className="absolute inset-0 bg-gradient-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <span className="relative">Koleksiyonu Keşfet</span>
            <span className="relative">→</span>
          </a>
        </div>

        {/* Bottom ornament */}
        <div className="mt-20 flex items-center justify-center gap-3 text-primary/70">
          <span className="text-2xl">◆</span>
          <span className="text-base">◇</span>
          <span className="text-2xl">◆</span>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-ui text-[10px] text-muted-foreground animate-pulse">
        Aşağı kaydır
      </div>
    </section>
  );
}
