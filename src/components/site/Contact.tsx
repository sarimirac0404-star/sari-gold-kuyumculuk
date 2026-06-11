import { MapPin, Phone, Clock, MessageCircle, Instagram } from "lucide-react";

const ADDRESS = "Cumhuriyet, Cumhuriyet Cd., 04600 Eleşkirt/Ağrı";
const PHONE = "+90 533 814 46 51";
const WHATSAPP = "905338144651";
const INSTAGRAM = "https://www.instagram.com/sarigold_kuyumculuk?igsh=eGFyamFlNTZrMG52";


export function Contact() {
  return (
    <section id="iletisim" className="py-28 bg-card relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-16 reveal">
          <div className="font-ui text-[10px] text-primary mb-3">İletişim</div>
          <h2 className="font-display text-4xl md:text-5xl text-gradient-gold">
            Mağazamıza Bekliyoruz
          </h2>
          <div className="mt-4 mx-auto w-24 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          <div className="reveal space-y-6">
            <div className="flex items-start gap-4 p-6 border border-border hover:border-primary/60 transition-colors">
              <MapPin className="text-primary flex-shrink-0 mt-1" size={22} strokeWidth={1.5} />
              <div>
                <div className="font-ui text-[10px] text-muted-foreground mb-1">Adres</div>
                <div className="font-serif text-lg text-foreground">{ADDRESS}</div>
              </div>
            </div>

            <a
              href={`tel:${PHONE.replace(/\s/g, "")}`}
              className="flex items-start gap-4 p-6 border border-border hover:border-primary/60 transition-colors"
            >
              <Phone className="text-primary flex-shrink-0 mt-1" size={22} strokeWidth={1.5} />
              <div>
                <div className="font-ui text-[10px] text-muted-foreground mb-1">Telefon</div>
                <div className="font-serif text-lg text-foreground">{PHONE}</div>
              </div>
            </a>

            <div className="flex items-start gap-4 p-6 border border-border hover:border-primary/60 transition-colors">
              <Clock className="text-primary flex-shrink-0 mt-1" size={22} strokeWidth={1.5} />
              <div>
                <div className="font-ui text-[10px] text-muted-foreground mb-1">Çalışma Saatleri</div>
                <div className="font-serif text-foreground space-y-0.5">
                  <div>Pazartesi - Cumartesi: 09:00 — 19:00</div>
                  <div className="text-muted-foreground">Pazar: Kapalı</div>
                </div>
              </div>
            </div>

            <a
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-3 w-full py-4 bg-[#25D366] text-white font-ui text-xs hover:opacity-90 transition-opacity"
            >
              <MessageCircle size={18} />
              WhatsApp ile İletişime Geçin
            </a>

            <a
              href={INSTAGRAM}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-3 w-full py-4 bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white font-ui text-xs hover:opacity-90 transition-opacity"
            >
              <Instagram size={18} />
              Instagram'da Takip Edin
            </a>
          </div>


          <div className="reveal">
            <div className="relative h-full min-h-[420px] border border-primary/40 overflow-hidden">
              <iframe
                title="Sarı Gold Kuyumculuk Konum"
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  ADDRESS + ", Turkey"
                )}&output=embed`}
                className="absolute inset-0 w-full h-full grayscale contrast-110"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
