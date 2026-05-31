import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ImageIcon } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { WhatsAppFloat } from "@/components/site/WhatsAppFloat";
import { getCategory, CATEGORIES, type Product } from "@/lib/products";

export const Route = createFileRoute("/kategori/$slug")({
  loader: ({ params }) => {
    const category = getCategory(params.slug);
    if (!category) throw notFound();
    return { category };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData?.category.name ?? "Kategori"} — Sarı Gold Kuyumculuk`,
      },
      {
        name: "description",
        content:
          loaderData?.category.intro ??
          "Sarı Gold Kuyumculuk ürün koleksiyonu.",
      },
    ],
  }),
  component: CategoryPage,
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center text-foreground">
      <p>Bir hata oluştu: {error.message}</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-foreground">
      <h1 className="font-display text-3xl text-gradient-gold">Kategori bulunamadı</h1>
      <Link to="/" className="font-ui text-xs text-primary hover:underline">
        ← Anasayfaya dön
      </Link>
    </div>
  ),
});

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group relative bg-card border border-border hover:border-primary/60 transition-all duration-500 hover:-translate-y-1 hover:shadow-gold overflow-hidden">
      <div className="absolute top-0 left-0 w-12 h-px bg-gradient-to-r from-primary to-transparent" />
      <div className="absolute bottom-0 right-0 w-12 h-px bg-gradient-to-l from-primary to-transparent" />

      <div className="aspect-square bg-gradient-to-br from-background to-card flex items-center justify-center overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center gap-3 text-primary/40">
            <ImageIcon size={48} strokeWidth={1} />
            <span className="font-ui text-[10px] uppercase tracking-widest">
              Fotoğraf Yakında
            </span>
          </div>
        )}
      </div>

      <div className="p-5 text-center border-t border-border/60">
        <h3 className="font-display text-lg text-gold-pale">{product.name}</h3>
        <p className="font-serif italic text-xs text-muted-foreground mt-1">
          {product.description}
        </p>
      </div>
    </div>
  );
}

function CategoryPage() {
  const { category } = Route.useLoaderData();

  return (
    <main className="min-h-screen bg-background text-foreground antialiased">
      <Header />

      <section className="pt-32 pb-16 deco-bg">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-ui text-[10px] text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft size={12} /> Anasayfa
          </Link>

          <div className="text-center max-w-2xl mx-auto">
            <div className="text-6xl mb-6">{category.icon}</div>
            <div className="font-ui text-[10px] text-primary mb-3">Koleksiyon</div>
            <h1 className="font-display text-4xl md:text-5xl text-gradient-gold">
              {category.name}
            </h1>
            <div className="mt-4 mx-auto w-24 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
            <p className="font-serif italic text-lg text-muted-foreground mt-5">
              {category.intro}
            </p>
          </div>
        </div>
      </section>

      <section className="pb-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
            {category.products.map((p: Product) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          <div className="mt-16 text-center border-t border-border/40 pt-10">
            <p className="font-serif italic text-muted-foreground mb-6">
              Diğer koleksiyonlarımıza göz atın
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {CATEGORIES.filter((c) => c.slug !== category.slug).map((c) => (
                <Link
                  key={c.slug}
                  to="/kategori/$slug"
                  params={{ slug: c.slug }}
                  className="px-5 py-2 border border-border hover:border-primary text-foreground/80 hover:text-primary font-ui text-xs transition-colors"
                >
                  {c.icon} {c.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </main>
  );
}
