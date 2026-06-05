import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { RatesSection } from "@/components/site/RatesSection";
import { HaremRates } from "@/components/site/HaremRates";
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
      { title: "Sarı Gold Kuyumculuk — Eleşkirt / Ağrı" },
      {
        name: "description",
        content:
          "Eleşkirt'in güvenilir kuyumcusu Sarı Gold Kuyumculuk. Altın, gümüş, mücevher ve anlık altın & döviz fiyatları.",
      },
      { property: "og:title", content: "Sarı Gold Kuyumculuk" },
      {
        property: "og:description",
        content: "Altının İhtişamı, Güvenin Adresi — Eleşkirt / Ağrı",
      },
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
      <HaremRates />
      <Categories />
      <About />
      <Features />
      <Contact />
      <Footer />
      <WhatsAppFloat />
    </main>
  );
}
