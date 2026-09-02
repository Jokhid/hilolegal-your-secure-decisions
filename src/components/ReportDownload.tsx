import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { submitDownloadLead } from "@/lib/contact.functions";
import { trackEvent } from "@/lib/analytics";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Botón "Descargar informe" que solo se activa con un email válido.
 *  Captura el lead (solo email) y lanza el diálogo de impresión del
 *  navegador — el informe visible en PDF es el contenido de `children`,
 *  que solo se muestra en @media print (ver .print-report en styles.css). */
export function ReportDownload({ topic, children }: { topic: string; children: React.ReactNode }) {
  const submit = useServerFn(submitDownloadLead);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const honeypotRef = useRef<HTMLInputElement>(null);
  const formLoadedAtRef = useRef(Date.now());
  const isValid = EMAIL_RE.test(email);

  async function handleDownload() {
    if (!isValid || status === "sending") return;
    setStatus("sending");
    try {
      await submit({ data: { email, topic, website: honeypotRef.current?.value ?? "", formLoadedAt: formLoadedAtRef.current } });
      trackEvent("report_download", { topic });
      setStatus("idle");
      window.print();
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <div className="no-print border border-[var(--jch-line)] bg-[var(--jch-surface)] p-8 md:p-10">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--jch-dim)] mb-2">Descargar informe</p>
        <p className="text-sm text-[var(--jch-muted)] mb-6">
          Recibe estos resultados en PDF. Solo necesitamos tu email.
        </p>
        <input
          ref={honeypotRef}
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute left-[-9999px] top-0 h-px w-px overflow-hidden"
        />
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleDownload()}
            placeholder="tu@email.com"
            aria-label="Email"
            className="flex-1 bg-transparent border-0 border-b border-[var(--jch-line)] px-0 py-3 focus:ring-0 focus:border-[#C5A566] transition-colors outline-none placeholder:text-[var(--jch-dim)]"
          />
          <button
            type="button"
            onClick={handleDownload}
            disabled={!isValid || status === "sending"}
            className="rounded-full bg-[#1f6f78] px-8 py-4 text-xs font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#17535a] disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {status === "sending" ? "Un momento…" : "Descargar informe"}
          </button>
        </div>
        {status === "error" && (
          <p className="mt-3 text-sm text-[#9b2c2c]">No se ha podido registrar tu email. Puedes intentarlo de nuevo.</p>
        )}
      </div>
      <div className="print-report">{children}</div>
    </>
  );
}
