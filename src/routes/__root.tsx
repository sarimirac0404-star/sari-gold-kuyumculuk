import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Toaster } from "@/components/ui/sonner";
import { NotificationWatcher } from "@/components/site/NotificationWatcher";
import logoAsset from "@/assets/sari-gold-logo.jpeg.asset.json";

const SITE_URL = "https://sari-gold-kuyumculuk.com";
const BRAND_NAME = "Sarı Gold Kuyumculuk";
const BRAND_NAME_VARIANTS = [
  "Sarı Gold Kuyumculuk",
  "SARI GOLD KUYUMCULUK",
  "sarı gold kuyumculuk",
  "Sari Gold Kuyumculuk",
  "SARI GOLD",
  "sari gold",
  "sarigold kuyumculuk",
];
const LOGO_URL = `${SITE_URL}${logoAsset.url}`;

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#0a0a0a" },
      { title: "Sarı Gold Kuyumculuk — Eleşkirt / Ağrı Kuyumcu" },
      { name: "description", content: "Sarı Gold Kuyumculuk — Eleşkirt / Ağrı kuyumcusu. 22 ayar ve 14 ayar altın, bilezik, yüzük, kolye, küpe ile canlı altın ve döviz fiyatları. Cumhuriyet Cd., Eleşkirt." },
      { name: "keywords", content: `${BRAND_NAME_VARIANTS.join(", ")}, Eleşkirt kuyumcu, Ağrı kuyumcu, altın fiyatları, sarı gold eleşkirt` },
      { name: "google-site-verification", content: "6FN4S1VFmXPjDb4VLCcMV2BDM_p4BhbiLWE10B0LM_o" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: BRAND_NAME },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Sarı Gold Kuyumculuk — Eleşkirt / Ağrı Kuyumcu" },
      { name: "twitter:title", content: "Sarı Gold Kuyumculuk — Eleşkirt / Ağrı Kuyumcu" },
      { property: "og:description", content: "Sarı Gold Kuyumculuk — Eleşkirt / Ağrı kuyumcusu. 22 ayar ve 14 ayar altın, bilezik, yüzük, kolye, küpe ile canlı altın ve döviz fiyatları. Cumhuriyet Cd., Eleşkirt." },
      { name: "twitter:description", content: "Sarı Gold Kuyumculuk — Eleşkirt / Ağrı kuyumcusu. 22 ayar ve 14 ayar altın, bilezik, yüzük, kolye, küpe ile canlı altın ve döviz fiyatları. Cumhuriyet Cd., Eleşkirt." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/voeu8TtRyQVMF66hVdwt71AeNLO2/social-images/social-1783097538070-WhatsApp_Image_2026-01-17_at_10.18.42.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/voeu8TtRyQVMF66hVdwt71AeNLO2/social-images/social-1783097538070-WhatsApp_Image_2026-01-17_at_10.18.42.webp" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Cormorant+Garamond:ital,wght@0,400;1,400&family=Montserrat:wght@300;500&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "shortcut icon", href: "/favicon.ico" },
      { rel: "apple-touch-icon", href: "/favicon.png" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "JewelryStore",
          name: BRAND_NAME,
          alternateName: BRAND_NAME_VARIANTS,
          url: SITE_URL,
          logo: LOGO_URL,
          image: LOGO_URL,
          telephone: "+90 533 814 46 51",
          sameAs: ["https://www.instagram.com/sarigold_kuyumculuk"],
          address: {
            "@type": "PostalAddress",
            streetAddress: "Cumhuriyet Cd.",
            addressLocality: "Eleşkirt",
            addressRegion: "Ağrı",
            postalCode: "04600",
            addressCountry: "TR",
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: BRAND_NAME,
          alternateName: BRAND_NAME_VARIANTS,
          url: SITE_URL,
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <NotificationWatcher />
      <Toaster richColors position="top-center" />
    </QueryClientProvider>

  );
}
