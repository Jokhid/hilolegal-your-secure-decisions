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
import servicesArtCss from "../services-art.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { CookieBanner } from "../components/CookieBanner";
import { ChatWidget } from "../components/ChatWidget";
import { Analytics } from "../components/Analytics";

const FONT_PRIMARY = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&family=Familjen+Grotesk:wght@400;500;600;700&family=Poppins:wght@500;600;700&display=swap";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Página no encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          La página que buscas no existe o se ha movido.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Volver al inicio
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
          Esta página no se ha podido cargar
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Algo ha fallado. Puedes actualizar la página o volver al inicio.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Intentarlo de nuevo
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Volver al inicio
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
      { title: "HiloLegal | Boutique legal y patrimonial en Altea - Costa Blanca" },
      { name: "description", content: "Abogacía, planificación financiera, hipotecas, seguros y administración de fincas en Altea - Costa Blanca. Diagnóstico patrimonial con criterio legal y financiero." },
      { property: "og:title", content: "HiloLegal | Boutique legal y patrimonial en Altea - Costa Blanca" },
      { property: "og:description", content: "Abogacía, planificación financiera, hipotecas, seguros y administración de fincas para decisiones patrimoniales importantes." },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:site_name", content: "HiloLegal" },
      { property: "og:url", content: "https://www.hilolegal.es/" },
      { property: "og:image", content: "https://www.hilolegal.es/fotoalteadespachohorizontal.webp" },
      { property: "og:image:width", content: "1536" },
      { property: "og:image:height", content: "1024" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "HiloLegal | Boutique legal y patrimonial en Altea - Costa Blanca" },
      { name: "twitter:description", content: "Criterio jurídico, visión patrimonial y experiencia financiera para proteger tu patrimonio." },
      { name: "twitter:image", content: "https://www.hilolegal.es/fotoalteadespachohorizontal.webp" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: servicesArtCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "preload", as: "style", href: FONT_PRIMARY },
      { rel: "stylesheet", href: FONT_PRIMARY },
      {
        rel: "preload",
        as: "image",
        href: "/fotoalteadespachovertical.webp",
        type: "image/webp",
        fetchpriority: "high",
        media: "(max-width: 767px)",
      },
      {
        rel: "preload",
        as: "image",
        href: "/fotoalteadespachohorizontal.webp",
        type: "image/webp",
        fetchpriority: "high",
        media: "(min-width: 768px)",
      },
    ],
    scripts: [
      { src: "/ochre-windows.js", defer: true },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

const THEME_INIT_SCRIPT = `
try {
  var t = localStorage.getItem('hilolegal-theme');
  if (t === 'dark') document.documentElement.removeAttribute('data-theme');
} catch (e) {}
`;

// GTM_ID/GA4_ID/GTM_SCRIPT/GA4_INLINE_SCRIPT viven aquí pero ya NO se
// renderizan en RootShell (SSR incondicional) — se cargan solo en cliente,
// solo tras consentimiento de cookies, vía src/components/Analytics.tsx.
export const GTM_ID = "GTM-NVXKNWS2";
export const GTM_SCRIPT = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`;

export const GA4_ID = "G-PEFQ1L13G2";
export const GA4_INLINE_SCRIPT = `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA4_ID}');`;

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning data-theme="light">
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
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
      <CookieBanner />
      <ChatWidget />
      <Analytics />
    </QueryClientProvider>
  );
}
