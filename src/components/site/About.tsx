export function About() {
  return (
    <section id="hakkimizda" className="py-28 bg-card relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-16 items-center">
        <div className="reveal">
          <div className="font-ui text-[10px] text-primary mb-3">Hakkımızda</div>
          <h2 className="font-display text-4xl md:text-5xl text-gradient-gold leading-tight">
            Geleneğin & Güvenin Buluştuğu Adres
          </h2>

          <div className="my-8 flex items-center gap-3">
            <span className="h-px flex-1 bg-gradient-to-r from-primary to-transparent" />
            <span className="text-primary text-xl">◆ ◇ ◆</span>
            <span className="h-px flex-1 bg-gradient-to-l from-primary to-transparent" />
          </div>

          <p className="font-serif text-lg md:text-xl text-foreground/85 leading-relaxed">
            Eleşkirt'te yeni açılan kuyumcumuzla siz değerli müşterilerimize
            hizmet vermenin heyecanını yaşıyoruz. Her bir tasarımımızda,
            ustanın sabrını ve altının ihtişamını bir araya getiriyoruz.
          </p>

          <p className="font-serif text-base text-muted-foreground mt-6 italic">
            “Bir mücevher, sahibinin hikayesini taşır. Biz o hikayeye değer katarız.”
          </p>

          <div className="mt-10 grid grid-cols-1 gap-6 max-w-[180px]">
            <div>
              <div className="font-display text-3xl text-gradient-gold">%100</div>
              <div className="font-ui text-[10px] text-muted-foreground mt-1">Garanti</div>
            </div>
          </div>
        </div>

        {/* Decorative SVG art deco panel */}
        <div className="reveal relative aspect-square max-w-md mx-auto w-full">
          <svg viewBox="0 0 400 400" className="w-full h-full text-primary">
            <defs>
              <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="oklch(0.84 0.13 85)" />
                <stop offset="50%" stopColor="oklch(0.76 0.13 85)" />
                <stop offset="100%" stopColor="oklch(0.6 0.13 50)" />
              </linearGradient>
            </defs>
            <rect x="20" y="20" width="360" height="360" fill="none" stroke="url(#g)" strokeWidth="1" />
            <rect x="40" y="40" width="320" height="320" fill="none" stroke="url(#g)" strokeWidth="0.5" />
            <g stroke="url(#g)" fill="none" strokeWidth="1">
              <path d="M200 60 L340 200 L200 340 L60 200 Z" />
              <path d="M200 100 L300 200 L200 300 L100 200 Z" />
              <path d="M200 140 L260 200 L200 260 L140 200 Z" />
              <circle cx="200" cy="200" r="20" />
              <path d="M200 80 L200 320" />
              <path d="M80 200 L320 200" />
              <path d="M115 115 L285 285" />
              <path d="M285 115 L115 285" />
            </g>
            <g fill="url(#g)">
              <circle cx="200" cy="200" r="5" />
              <circle cx="200" cy="60" r="3" />
              <circle cx="200" cy="340" r="3" />
              <circle cx="60" cy="200" r="3" />
              <circle cx="340" cy="200" r="3" />
            </g>
          </svg>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,oklch(0.76_0.13_85/0.15),transparent_70%)] pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
