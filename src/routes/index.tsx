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
import logoAsset from "@/assets/sari-gold-logo.jpeg.asset.json";

const SITE_URL = "https://sari-gold-kuyumculuk.com";
const LOGO_URL = `${SITE_URL}${logoAsset.url}`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sarı Gold Kuyumculuk — Eleşkirt / Ağrı Kuyumcu" },
      {
        name: "description",
        content:
          "Sarı Gold Kuyumculuk — Eleşkirt / Ağrı kuyumcusu. 22 ayar ve 14 ayar altın, bilezik, yüzük, kolye, küpe ile canlı altın ve döviz fiyatları. Cumhuriyet Cd., Eleşkirt.",
      },
      {
        name: "keywords",
        content:
          "Sarı Gold Kuyumculuk, SARI GOLD KUYUMCULUK, sarı gold kuyumculuk, Sari Gold Kuyumculuk, SARI GOLD, sari gold, sarigold kuyumculuk, Eleşkirt kuyumcu, Ağrı kuyumcu, altın fiyatları",
      },
      { property: "og:title", content: "Sarı Gold Kuyumculuk — Eleşkirt / Ağrı Kuyumcu" },
      { property: "og:url", content: `${SITE_URL}/` },
      {
        property: "og:description",
        content: "Sarı Gold Kuyumculuk — Eleşkirt / Ağrı kuyumcusu. 22 ayar ve 14 ayar altın, bilezik, yüzük, kolye, küpe ile canlı altın ve döviz fiyatları. Cumhuriyet Cd., Eleşkirt.",
      },
      { property: "og:image", content: LOGO_URL },
      { name: "twitter:image", content: LOGO_URL },
    ],
    links: [
      { rel: "canonical", href: `${SITE_URL}/` },
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
