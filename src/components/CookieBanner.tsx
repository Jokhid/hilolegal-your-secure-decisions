import { useEffect, useState } from "react";
import { loadAnalyticsConsent } from "./Analytics";

export function CookieBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    try {
      if (localStorage.getItem("cookies_ok") !== "true" && localStorage.getItem("cookies_ok") !== "necessary") setShow(true);
    } catch {
      // localStorage no disponible (navegación privada, etc.) — no se muestra el banner, sin romper la página.
    }
  }, []);
  if (!show) return null;
  const choose = (v: "true" | "necessary") => {
    try {
      localStorage.setItem("cookies_ok", v);
    } catch {
      // localStorage no disponible (navegación privada, etc.) — la preferencia no persiste, sin romper la página.
    }
    if (v === "true") loadAnalyticsConsent();
    setShow(false);
  };
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
