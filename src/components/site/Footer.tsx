import { Instagram, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-background border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <div className="font-display text-2xl text-gradient-gold tracking-wider">
            SARI GOLD
          </div>
          <div className="font-ui text-[10px] text-muted-foreground mt-1">
            Kuyumculuk · Eleşkirt / Ağrı
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="h-10 w-10 rounded-full border border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all"
          >
            <Instagram size={16} />
          </a>
          <a
            href="https://wa.me/905555555555"
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp"
            className="h-10 w-10 rounded-full border border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all"
          >
            <MessageCircle size={16} />
          </a>
        </div>

        <div className="font-ui text-[10px] text-muted-foreground">
          © 2025 Sarı Gold Kuyumculuk
        </div>
      </div>
    </footer>
  );
}
