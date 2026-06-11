import { useEffect, useState } from "react";
import { Menu, X, MessageCircle } from "lucide-react";

const NAV = [
  { href: "#anasayfa", label: "Anasayfa" },
  { href: "#urunler", label: "Ürünler" },
  { href: "#hakkimizda", label: "Hakkımızda" },
  { href: "#iletisim", label: "İletişim" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-20">
        <a href="#anasayfa" className="flex flex-col leading-tight">
          <span className="font-display text-xl md:text-2xl text-gradient-gold tracking-wider">
            SARI GOLD
          </span>
          <span className="font-ui text-[10px] text-muted-foreground -mt-0.5">
            Kuyumculuk
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-10">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="font-ui text-xs text-foreground/80 hover:text-primary transition-colors"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="https://wa.me/905338144651"
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp"
            className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground transition-all"
          >
            <MessageCircle size={18} />
          </a>
          <button
            className="md:hidden text-primary"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md">
          <nav className="flex flex-col p-6 gap-4">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="font-ui text-sm text-foreground/80 hover:text-primary"
              >
                {n.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
