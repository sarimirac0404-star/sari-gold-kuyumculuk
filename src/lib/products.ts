// Ürün verileri — fotoğrafları değiştirmek için `image` alanını
// `/products/dosya-adi.jpg` ile güncelleyin ve görseli `public/products/`
// klasörüne yükleyin. `image` boş bırakılırsa zarif bir yer tutucu gösterilir.

export type Product = {
  id: string;
  name: string;
  description: string;
  image?: string; // örn: "/products/yuzuk-1.jpg"
};

export type Category = {
  slug: string;
  icon: string;
  name: string;
  desc: string;
  intro: string;
  products: Product[];
};



const placeholders = (prefix: string, count: number): Product[] =>
  Array.from({ length: count }).map((_, i) => ({
    id: `${prefix}-${i + 1}`,
    name: `${prefix} Model ${i + 1}`,
    description: "Fotoğraf yakında eklenecek",
    image: "",
  }));

export const CATEGORIES: Category[] = [
  {
    slug: "yuzukler",
    icon: "💍",
    name: "Yüzükler",
    desc: "Nişan & Pırlanta",
    intro:
      "Nişan, alyans ve pırlanta yüzük koleksiyonumuz — el işçiliği zarafet.",
    products: [
      {
        id: "yuzuk-1",
        name: "Telkari Altın Yüzük",
        description: "El işçiliği telkari - 22 ayar altın",
        image: "/products/yuzuk-1.jpg",
      },
      {
        id: "yuzuk-2",
        name: "Gül Motifli Telkari Yüzük",
        description: "Üç boyutlu gül tasarımı - 22 ayar altın",
        image: "/products/yuzuk-2.jpg",
      },
      ...placeholders("Yüzük", 4),
    ],
  },
  {
    slug: "kolyeler",
    icon: "📿",
    name: "Kolyeler",
    desc: "Zarif Tasarımlar",
    intro: "Her zevke uygun zarif altın kolye koleksiyonu.",
    products: placeholders("Kolye", 6),
  },
  {
    slug: "bilezikler",
    icon: "⌚",
    name: "Bilezikler",
    desc: "El İşçiliği",
    intro: "Geleneksel ve modern bilezik modelleri.",
    products: placeholders("Bilezik", 6),
  },
  {
    slug: "bileklikler",
    icon: "🔗",
    name: "Bileklikler",
    desc: "Şık Detaylar",
    intro: "Günlük ve özel kullanım için bileklik modelleri.",
    products: placeholders("Bileklik", 6),
  },
  {
    slug: "kupeler",
    icon: "👂",
    name: "Küpeler",
    desc: "Zarif Dokunuş",
    intro: "Sallantılı, tektaş ve klasik küpe koleksiyonu.",
    products: placeholders("Küpe", 6),
  },
  {
    slug: "kelepceler",
    icon: "⚜️",
    name: "Kelepçeler",
    desc: "Güçlü Duruş",
    intro: "İddialı tasarımlarıyla kelepçe modelleri.",
    products: placeholders("Kelepçe", 6),
  },
  {
    slug: "gerdanliklar",
    icon: "💎",
    name: "Gerdanlıklar",
    desc: "Görkemli Tasarım",
    intro: "Özel günler için göz alıcı gerdanlık koleksiyonu.",
    products: placeholders("Gerdanlık", 6),
  },
];

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
