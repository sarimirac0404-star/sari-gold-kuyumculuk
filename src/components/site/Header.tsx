import { useEffect, useState } from "react";
import { Menu, X, MessageCircle } from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";

const NAV = [
  { hash: "anasayfa", label: "Anasayfa" },
  { hash: "urunler", label: "Ürünler" },
  { hash: "hakkimizda", label: "Hakkımızda" },
  { hash: "iletisim", label: "İletişim" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const renderNavItem = (n: { hash: string; label: string }, onClick?: () => void) => {
    const className = "font-ui text-xs text-foreground/80 hover:text-primary transition-colors";
    if (isHome) {
      return (
        <a key={n.hash} href={`#${n.hash}`} onClick={onClick} className={className}>
          {n.label}
        </a>
      );
    }
    return (
      <Link
        key={n.hash}
        to="/"
        hash={n.hash}
        onClick={onClick}
        className={className}
      >
        {n.label}
      </Link>
    );
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-20">
        <Link to="/" className="flex flex-col leading-tight">
          <span className="font-display text-xl md:text-2xl text-gradient-gold tracking-wider">
            SARI GOLD
          </span>
          <span className="font-ui text-[10px] text-muted-foreground -mt-0.5">
            Kuyumculuk
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {NAV.map((n) => renderNavItem(n))}
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
            {NAV.map((n) => renderNavItem(n, () => setOpen(false)))}
          </nav>
        </div>
      )}
    </header>
  );
}
