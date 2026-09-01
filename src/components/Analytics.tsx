import { useEffect } from "react";
import { GTM_SCRIPT, GA4_ID, GA4_INLINE_SCRIPT } from "../routes/__root";

declare global {
  interface Window {
    __hilolegalAnalyticsLoaded?: boolean;
  }
}

// Antes estos 3 scripts se inyectaban incondicionalmente en el <head> del
// HTML servido por el servidor (RootShell), cargando GTM/GA4 sin esperar
// consentimiento — incumple la normativa de cookies. Ahora solo se
// inyectan aquí, en cliente, tras comprobar "cookies_ok" === "true".
export function loadAnalyticsConsent() {
  if (typeof window === "undefined") return;
  if (window.__hilolegalAnalyticsLoaded) return;
  window.__hilolegalAnalyticsLoaded = true;

  const gtagSrcScript = document.createElement("script");
  gtagSrcScript.async = true;
  gtagSrcScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
  document.head.appendChild(gtagSrcScript);

  const ga4Script = document.createElement("script");
  ga4Script.textContent = GA4_INLINE_SCRIPT;
  document.head.appendChild(ga4Script);

  const gtmScript = document.createElement("script");
  gtmScript.textContent = GTM_SCRIPT;
  document.head.appendChild(gtmScript);
}

export function Analytics() {
  useEffect(() => {
    try {
      if (localStorage.getItem("cookies_ok") === "true") {
        loadAnalyticsConsent();
      }
    } catch {
      // localStorage no disponible (navegación privada, etc.) — sin analítica, sin romper la página.
    }
  }, []);

  return null;
}
