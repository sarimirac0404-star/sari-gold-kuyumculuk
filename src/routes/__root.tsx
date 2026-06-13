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
      { title: "Sarı Gold Kuyumculuk — Eleşkirt / Ağrı Kuyumcu | Altın, Bilezik, Yüzük" },
      { name: "description", content: "Sarı Gold Kuyumculuk — Eleşkirt Ağrı'nın güvenilir kuyumcusu. 22 ayar & 14 ayar altın, bilezik, yüzük, kolye, küpe ve anlık altın & döviz fiyatları. Cumhuriyet Cd., Eleşkirt / Ağrı." },
      { name: "keywords", content: "sarı gold kuyumculuk, sarıgold, eleşkirt kuyumcu, ağrı kuyumcu, eleşkirt altın, ağrı altın fiyatları, eleşkirt bilezik, 22 ayar altın eleşkirt, 14 ayar altın, kuyumcu eleşkirt, ağrı kuyumculuk" },
      { name: "author", content: "Sarı Gold Kuyumculuk" },
      { name: "robots", content: "index, follow" },
      { name: "googlebot", content: "index, follow" },
      { name: "geo.region", content: "TR-04" },
      { name: "geo.placename", content: "Eleşkirt, Ağrı" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Sarı Gold Kuyumculuk" },
      { property: "og:locale", content: "tr_TR" },
      { property: "og:url", content: "https://sari-gold-kuyumculuk.lovable.app/" },
      { property: "og:title", content: "Sarı Gold Kuyumculuk — Eleşkirt / Ağrı" },
      { property: "og:description", content: "Altının İhtişamı, Güvenin Adresi — Eleşkirt / Ağrı. 22 ayar & 14 ayar altın, bilezik, yüzük, kolye, küpe." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/voeu8TtRyQVMF66hVdwt71AeNLO2/social-images/social-1781365211357-1000001200.webp" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Sarı Gold Kuyumculuk — Eleşkirt / Ağrı" },
      { name: "twitter:description", content: "Altının İhtişamı, Güvenin Adresi — Eleşkirt / Ağrı" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/voeu8TtRyQVMF66hVdwt71AeNLO2/social-images/social-1781365211357-1000001200.webp" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Montserrat:wght@300;400;500&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Jeweler",
          name: "Sarı Gold Kuyumculuk",
          image: "https://storage.googleapis.com/gpt-engineer-file-uploads/voeu8TtRyQVMF66hVdwt71AeNLO2/social-images/social-1781365211357-1000001200.webp",
          url: "https://sari-gold-kuyumculuk.lovable.app/",
          telephone: "+90 533 814 46 51",
          priceRange: "₺₺",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Cumhuriyet, Cumhuriyet Cd.",
            addressLocality: "Eleşkirt",
            addressRegion: "Ağrı",
            postalCode: "04600",
            addressCountry: "TR",
          },
          areaServed: ["Eleşkirt", "Ağrı"],
          description: "Eleşkirt Ağrı'nın güvenilir kuyumcusu. 22 ayar ve 14 ayar altın, bilezik, yüzük, kolye, küpe ve anlık altın & döviz fiyatları.",
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
    <html lang="en">
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
      <Toaster richColors position="top-center" />
    </QueryClientProvider>
  );
}
