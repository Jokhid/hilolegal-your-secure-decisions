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
import { CookieBanner } from "../components/CookieBanner";
import { ChatWidget } from "../components/ChatWidget";
import { Analytics } from "../components/Analytics";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--jch-bg)]">
      {/* React 19 saca este <title> al <head> automáticamente, sustituyendo
          al de la ruta raíz — sin esto, la pestaña y el título compartido
          al enlazar esta página mostraban "HiloLegal | Boutique legal y
          patrimonial en Altea", el título de la home, no uno propio. */}
      <title>Página no encontrada | HiloLegal</title>
      <meta name="robots" content="noindex" />

      {/* Antes esta página no tenía ni logo ni navegación — quien llegaba
          aquí desde un enlace roto solo podía volver al inicio, sin forma
          de llegar directamente al blog o a un área de servicio. */}
      <header className="w-full px-6 py-5">
        <Link to="/" className="inline-flex items-center gap-3">
          <img
            src="/hilolegal-logo-black.webp"
            alt="Logo HiloLegal"
            className="notfound-logo notfound-logo--dark h-10 w-auto object-contain"
          />
          <img
            src="/hilolegal-logo-white.webp"
            alt="Logo HiloLegal"
            className="notfound-logo notfound-logo--light h-10 w-auto object-contain"
          />
        </Link>
      </header>

      <div className="flex flex-1 items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h1 className="text-7xl font-bold text-[var(--jch-ink)]">404</h1>
          <h2 className="mt-4 text-xl font-semibold text-[var(--jch-ink)]">Página no encontrada</h2>
          <p className="mt-2 text-sm text-[var(--jch-muted)]">
            La página que buscas no existe o se ha movido.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-full bg-[var(--jch-accent-ink)] px-5 py-2.5 text-sm font-medium text-black transition-opacity hover:opacity-90"
            >
              Volver al inicio
            </Link>
            <Link
              to="/blog"
              className="inline-flex items-center justify-center rounded-full border border-[var(--jch-line-strong)] px-5 py-2.5 text-sm font-medium text-[var(--jch-ink)] transition-colors hover:bg-[var(--jch-line)]"
            >
              Ir al blog
            </Link>
          </div>
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
    <div className="flex min-h-screen items-center justify-center bg-[var(--jch-bg)] px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-[var(--jch-ink)]">
          Esta página no se ha podido cargar
        </h1>
        <p className="mt-2 text-sm text-[var(--jch-muted)]">
          Algo ha fallado. Puedes actualizar la página o volver al inicio.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-full bg-[var(--jch-accent-ink)] px-5 py-2.5 text-sm font-medium text-black transition-opacity hover:opacity-90"
          >
            Intentarlo de nuevo
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-[var(--jch-line-strong)] px-5 py-2.5 text-sm font-medium text-[var(--jch-ink)] transition-colors hover:bg-[var(--jch-line)]"
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
      { title: "HiloLegal | Boutique legal y patrimonial en Altea" },
      { name: "description", content: "Abogacía, planificación financiera, hipotecas, seguros y administración de fincas en Altea. Diagnóstico con criterio legal y financiero." },
      { property: "og:title", content: "HiloLegal | Boutique legal y patrimonial en Altea" },
      { property: "og:description", content: "Abogacía, planificación financiera, hipotecas, seguros y administración de fincas para decisiones patrimoniales importantes." },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:site_name", content: "HiloLegal" },
      { property: "og:url", content: "https://www.hilolegal.es/" },
      { property: "og:image", content: "https://www.hilolegal.es/fotoalteadespachohorizontal.webp" },
      { property: "og:image:width", content: "1536" },
      { property: "og:image:height", content: "1024" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "HiloLegal | Boutique legal y patrimonial en Altea" },
      { name: "twitter:description", content: "Criterio jurídico, visión patrimonial y experiencia financiera para proteger tu patrimonio." },
      { name: "twitter:image", content: "https://www.hilolegal.es/fotoalteadespachohorizontal.webp" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      // Las fuentes van alojadas en /fonts (declaradas en styles.css), sin pasar
      // por Google. Se precargan solo las dos de uso en casi todas las páginas:
      // el cuerpo (Inter) y los titulares (Familjen Grotesk).
      { rel: "preload", as: "font", type: "font/woff2", href: "/fonts/inter-latin.woff2", crossOrigin: "anonymous" },
      { rel: "preload", as: "font", type: "font/woff2", href: "/fonts/familjen-grotesk-latin.woff2", crossOrigin: "anonymous" },
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
  var wantsDark = t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches);
  if (wantsDark) document.documentElement.removeAttribute('data-theme');
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
