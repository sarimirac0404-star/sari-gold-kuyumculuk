import { Link } from "@tanstack/react-router";
import { CATEGORIES } from "@/lib/products";

export function Categories() {
  return (
    <section id="urunler" className="py-28 relative deco-bg">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-16 reveal">
          <div className="font-ui text-[10px] text-primary mb-3">Koleksiyon</div>
          <h2 className="font-display text-4xl md:text-5xl text-gradient-gold">
            Ürün Kategorileri
          </h2>
          <div className="mt-4 mx-auto w-24 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
          <p className="font-serif italic text-muted-foreground mt-4">
            Kategoriye tıklayın, ürünleri keşfedin
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {CATEGORIES.map((c, i) => (
            <Link
              key={c.slug}
              to="/kategori/$slug"
              params={{ slug: c.slug }}
              className="group reveal relative aspect-[3/4] bg-card border border-border hover:border-primary transition-all duration-500 hover:-translate-y-2 hover:shadow-gold-strong overflow-hidden cursor-pointer block"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <span className="absolute top-3 left-3 text-primary/60 group-hover:text-primary transition-colors">◆</span>
              <span className="absolute top-3 right-3 text-primary/60 group-hover:text-primary transition-colors">◆</span>
              <span className="absolute bottom-3 left-3 text-primary/60 group-hover:text-primary transition-colors">◆</span>
              <span className="absolute bottom-3 right-3 text-primary/60 group-hover:text-primary transition-colors">◆</span>

              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <div className="text-5xl md:text-6xl mb-6 transition-transform duration-500 group-hover:scale-110">
                  {c.icon}
                </div>
                <h3 className="font-display text-xl md:text-2xl text-gold-pale group-hover:text-primary transition-colors">
                  {c.name}
                </h3>
                <p className="font-serif italic text-sm text-muted-foreground mt-1">{c.desc}</p>
                <div className="mt-5 h-px w-10 bg-primary/50 group-hover:w-20 transition-all duration-500" />
                <div className="mt-3 font-ui text-[10px] text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Ürünleri Gör →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
