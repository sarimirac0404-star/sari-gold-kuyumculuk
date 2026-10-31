import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/yasal")({
  head: () => ({
    meta: [
      { title: "Yasal Uyarı & Gizlilik | Sarı Gold Kuyumculuk" },
      { name: "description", content: "Sarı Gold Kuyumculuk yasal uyarı, gizlilik ve KVKK aydınlatma metni." },
      { property: "og:title", content: "Yasal Uyarı & Gizlilik | Sarı Gold Kuyumculuk" },
      { property: "og:description", content: "Sarı Gold Kuyumculuk yasal uyarı, gizlilik ve KVKK aydınlatma metni." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LegalPage,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="font-display text-2xl text-primary mb-3">{title}</h2>
      <div className="font-serif text-lg text-foreground/85 leading-relaxed space-y-2">{children}</div>
    </section>
  );
}

function LegalPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="font-ui text-xs text-muted-foreground hover:text-primary">← Ana Sayfa</Link>
        <h1 className="font-display text-4xl text-primary mt-6 mb-10">Yasal Uyarı & Gizlilik</h1>
        <Section title="Fiyat Bilgileri">
          <p>Sitede yer alan altın ve kur fiyatları bilgilendirme amaçlıdır ve anlık değişebilir. Kesin alım-satım fiyatları mağazamızda teyit edilir; sitedeki fiyatlar bağlayıcı teklif niteliği taşımaz.</p>
        </Section>
        <Section title="Ürün Görselleri">
          <p>Sitedeki ürün fotoğrafları Sarı Gold Kuyumculuk'a aittir; izinsiz kopyalanamaz ve kullanılamaz. Görseller ile gerçek ürün arasında renk ve ölçü farklılıkları olabilir.</p>
        </Section>
        <Section title="Kişisel Verilerin Korunması (KVKK)">
          <p>6698 sayılı Kanun kapsamında veri sorumlusu Sarı Gold Kuyumculuk'tur (Cumhuriyet Cd., 04600 Eleşkirt/Ağrı). Sitemiz üyelik veya form ile kişisel veri toplamaz.</p>
          <p>WhatsApp, telefon veya Instagram üzerinden bizimle iletişime geçtiğinizde paylaştığınız bilgiler yalnızca talebinize yanıt vermek için kullanılır ve üçüncü kişilerle paylaşılmaz.</p>
          <p>Kanunun 11. maddesindeki haklarınız için +90 533 814 46 51 numarasından bize ulaşabilirsiniz.</p>
        </Section>
        <Section title="Çerezler ve Bildirimler">
          <p>Site, temel işleyiş için tarayıcı depolamasını kullanabilir. Bildirim izni yalnızca onay verirseniz yeni ürün duyuruları için kullanılır; tarayıcı ayarlarınızdan istediğiniz zaman kapatabilirsiniz.</p>
        </Section>
      </div>
    </main>
  );
}
