import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { RatesSection } from "@/components/site/RatesSection";
import { Categories } from "@/components/site/Categories";
import { About } from "@/components/site/About";
import { Features } from "@/components/site/Features";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { WhatsAppFloat } from "@/components/site/WhatsAppFloat";
import { useReveal } from "@/hooks/use-reveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sarı Gold Kuyumculuk — Eleşkirt / Ağrı Kuyumcu | Altın, Bilezik, Yüzük" },
      {
        name: "description",
        content:
          "Sarı Gold Kuyumculuk — Eleşkirt'in güvenilir kuyumcusu. 22 ayar & 14 ayar altın, bilezik, yüzük, kolye, küpe ve anlık altın & döviz fiyatları. Cumhuriyet Cd., Eleşkirt / Ağrı.",
      },
      { property: "og:title", content: "Sarı Gold Kuyumculuk — Eleşkirt / Ağrı" },
      { property: "og:url", content: "https://sari-gold-kuyumculuk.com/" },
      {
        property: "og:description",
        content: "Altının İhtişamı, Güvenin Adresi — Eleşkirt / Ağrı. 22 & 14 ayar altın, bilezik, yüzük, kolye, küpe.",
      },
    ],
    links: [
      { rel: "canonical", href: "https://sari-gold-kuyumculuk.com/" },
    ],
  }),
  component: Index,
});

function Index() {
  useReveal();
  return (
    <main className="min-h-screen bg-background text-foreground antialiased">
      <Header />
      <Hero />
      <RatesSection />
      <Categories />
      <About />
      <Features />
      <Contact />
      <Footer />
      <WhatsAppFloat />
    </main>
  );
}
