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
        name: "Tek Taş Pırlanta Yüzük",
        description: "0.50 ct - 14 ayar altın",
        image: "/products/tek-tas-pirlanta.jpg",
      },
      {
        id: "yuzuk-2",
        name: "Alyans Modeli",
        description: "8 mm genişlik - 14 ayar",
        image: "/products/alyans-modeli.jpg",
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
    slug: "altin-kulce",
    icon: "🪙",
    name: "Altın & Külçe",
    desc: "Yatırımlık Değerler",
    intro: "Gram, çeyrek, yarım, tam ve külçe altın seçenekleri.",
    products: placeholders("Altın", 6),
  },
];

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
