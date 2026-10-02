import { useEffect, useState } from "react";
import { Cookie } from "lucide-react";
import { loadAnalyticsConsent } from "./Analytics";
import { GA4_ID } from "../routes/__root";

type Choice = "true" | "necessary";

/** Borra las cookies de Google Analytics/Tag Manager (propias del dominio) para que
 *  retirar el consentimiento no deje rastro. GA las escribe en el dominio raíz y en
 *  el host, así que se intenta en los dos. */
function clearAnalyticsCookies() {
  const host = location.hostname;
  const root = host.replace(/^www\./, "");
  const names = document.cookie
    .split(";")
    .map((c) => c.split("=")[0].trim())
    .filter((n) => /^(_ga|_gid|_gat|_gcl_)/.test(n));
  for (const name of names) {
    for (const domain of [host, `.${root}`, undefined]) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain ? `; domain=${domain}` : ""}`;
    }
  }
}

export function CookieBanner() {
  const [show, setShow] = useState(false);
  // Hasta que el visitante elige, no hay botón de "Cookies" — el banner ya está en pantalla.
  const [hasChosen, setHasChosen] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem("cookies_ok");
      if (v === "true" || v === "necessary") setHasChosen(true);
      else setShow(true);
    } catch {
      // localStorage no disponible (navegación privada, etc.) — no se muestra el banner, sin romper la página.
    }
  }, []);

  const choose = (v: Choice) => {
    let previous: string | null = null;
    try {
      previous = localStorage.getItem("cookies_ok");
      localStorage.setItem("cookies_ok", v);
    } catch {
      // localStorage no disponible (navegación privada, etc.) — la preferencia no persiste, sin romper la página.
    }
    if (v === "true") {
      loadAnalyticsConsent();
    } else if (previous === "true" || window.__hilolegalAnalyticsLoaded) {
      // Retirada del consentimiento: los scripts de Google ya están en memoria y no se
      // pueden descargar, así que se frenan, se borran sus cookies y se recarga la página
      // (sin consentimiento guardado, al recargar no se vuelven a cargar).
      (window as unknown as Record<string, boolean>)[`ga-disable-${GA4_ID}`] = true;
      clearAnalyticsCookies();
      location.reload();
      return;
    }
    setHasChosen(true);
    setShow(false);
  };

  if (!show) {
    if (!hasChosen) return null;
    return (
      <button
        type="button"
        onClick={() => setShow(true)}
        aria-label="Configurar cookies"
        title="Configurar cookies"
        className="cookie-reopen fixed bottom-6 left-6 z-[9997] flex h-10 w-10 items-center justify-center rounded-full shadow-lg transition-colors"
      >
        <Cookie className="h-[18px] w-[18px]" aria-hidden="true" />
      </button>
    );
  }

  return (
    <div
      role="region"
      aria-label="Aviso de cookies"
      className="cookie-banner fixed bottom-0 inset-x-0 z-[9999] px-6 py-4 shadow-2xl"
    >
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center gap-4 md:gap-8">
        <p className="cookie-banner__text text-sm leading-relaxed text-center md:text-left flex-1">
          Utilizamos cookies propias y de terceros para analizar el tráfico y mejorar tu experiencia. Puedes aceptar todas las cookies o configurar tus preferencias.{" "}
          <a href="/privacidad.html" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--jch-accent-ink)]">Más información sobre cookies</a>
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
          <button
            onClick={() => choose("necessary")}
            className="cookie-banner__btn-secondary border bg-transparent px-6 py-3 text-xs font-bold uppercase tracking-widest transition-colors"
          >
            Solo necesarias
          </button>
          <button
            onClick={() => choose("true")}
            className="bg-[#C5A566] text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-[#1a1a2e] transition-colors"
          >
            Aceptar todas
          </button>
        </div>
      </div>
    </div>
  );
}
