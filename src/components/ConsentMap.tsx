import { useState, type CSSProperties } from "react";

const MAP_SRC = "https://www.google.com/maps?q=Calle+Regata+3,+03590+Altea,+Alicante&output=embed";
const MAP_LINK = "https://www.google.com/maps/search/?api=1&query=Calle+Regata+3,+03590+Altea,+Alicante";

/** Mapa de Google que NO se carga al abrir la página: hasta que el visitante
 *  pulsa "Ver mapa" no se contacta con Google (ni IP ni cookies). Antes el
 *  iframe se pedía en cuanto el visitante se acercaba a la sección, sin
 *  haber decidido nada sobre las cookies. El texto hereda el color del
 *  contenedor para valer igual en las secciones claras y en las oscuras. */
export function ConsentMap({
  title,
  iframeStyle,
}: {
  title: string;
  iframeStyle?: CSSProperties;
}) {
  const [loaded, setLoaded] = useState(false);

  if (loaded) {
    return (
      <iframe
        title={title}
        src={MAP_SRC}
        width="100%"
        height="100%"
        style={{ border: 0, display: "block", width: "100%", height: "100%", ...iframeStyle }}
        referrerPolicy="no-referrer-when-downgrade"
      />
    );
  }

  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-3 p-4 text-center"
      style={{ background: "color-mix(in srgb, currentColor 5%, transparent)" }}
    >
      <p className="max-w-[34ch] text-xs leading-relaxed opacity-75">
        El mapa lo ofrece Google. Al cargarlo, Google recibirá tu dirección IP y podrá usar cookies.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
        <button
          type="button"
          onClick={() => setLoaded(true)}
          className="rounded-full bg-[#C5A566] px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-black transition-colors hover:bg-[#A78C57]"
        >
          Ver mapa
        </button>
        <a
          href={MAP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs underline underline-offset-4 opacity-80 hover:opacity-100"
        >
          Abrir en Google Maps
        </a>
      </div>
    </div>
  );
}
