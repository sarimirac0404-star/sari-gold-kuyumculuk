import { Award, BadgeDollarSign, Handshake } from "lucide-react";

const ITEMS = [
  { Icon: Award, title: "Garantili Ürünler", desc: "Sertifikalı altın ve mücevher.", href: "#urunler" },
  { Icon: BadgeDollarSign, title: "En İyi Fiyat", desc: "Piyasanın en rekabetçi değerleri.", href: "#canli-kur" },
  { Icon: Handshake, title: "Güvenilir Hizmet", desc: "Yılların verdiği itibar ve güven.", href: "#hakkimizda" },
];

export function Features() {
  return (
    <section className="py-20 border-y border-border bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-3 gap-8">
        {ITEMS.map(({ Icon, title, desc, href }, i) => (
          <a
            key={title}
            href={href}
            className="reveal flex items-center gap-5 p-6 border border-border hover:border-primary/60 transition-all duration-500 cursor-pointer"
            style={{ transitionDelay: `${i * 100}ms` }}
          >
            <div className="flex-shrink-0 h-14 w-14 rounded-full border border-primary/50 flex items-center justify-center text-primary">
              <Icon size={22} strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="font-display text-xl text-gold-pale">{title}</h3>
              <p className="font-serif text-sm text-muted-foreground">{desc}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
