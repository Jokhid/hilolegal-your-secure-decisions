import React, { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ReportDownload } from "@/components/ReportDownload";
import { submitContact } from "@/lib/contact.functions";
import { trackEvent } from "@/lib/analytics";
import { useDialogA11y } from "@/lib/useDialogA11y";

export const Route = createFileRoute("/antes-de-firmar-arras")({
  head: () => ({
    meta: [
      { title: "Antes de Firmar las Arras: Checklist Gratuita | HiloLegal" },
      {
        name: "description",
        content: "Checklist gratuita para comprar vivienda con las preguntas resueltas antes de firmar arras: titularidad, cargas, tipo de arras, financiación y plazos. Verónica López, abogada en Altea.",
      },
      { property: "og:title", content: "Antes de Firmar las Arras: Checklist Gratuita | HiloLegal" },
      { property: "og:description", content: "La checklist para comprar tu vivienda con las preguntas resueltas antes de entregar dinero." },
      { property: "og:url", content: "https://www.hilolegal.es/antes-de-firmar-arras" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:site_name", content: "HiloLegal" },
      { property: "og:image", content: "https://www.hilolegal.es/VERODERECHA.webp" },
      { property: "og:image:width", content: "1672" },
      { property: "og:image:height", content: "941" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Antes de Firmar las Arras: Checklist Gratuita | HiloLegal" },
      { name: "twitter:description", content: "La checklist para comprar tu vivienda con las preguntas resueltas antes de entregar dinero." },
      { name: "twitter:image", content: "https://www.hilolegal.es/VERODERECHA.webp" },
    ],
    links: [{ rel: "canonical", href: "https://www.hilolegal.es/antes-de-firmar-arras" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.hilolegal.es/" },
                { "@type": "ListItem", position: 2, name: "Verónica López", item: "https://www.hilolegal.es/veronica" },
                { "@type": "ListItem", position: 3, name: "Antes de firmar las arras", item: "https://www.hilolegal.es/antes-de-firmar-arras" },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: AntesDeFirmarArrasPage,
});

const WHATSAPP = "https://wa.me/34647506040?text=Quiero%20revisar%20mi%20contrato%20de%20arras%20antes%20de%20firmar";
const PHONE_DISPLAY = "647 50 60 40";
const EMAIL = "veronicalopez@hilolegal.es";
const LOGO = "/hilolegal-logo-stacked-black.webp";

const Icon = ({ name, className = "" }: { name: string; className?: string }) => (
  <span aria-hidden="true" className={`material-symbols-outlined ${className}`}>{name}</span>
);

// ----- Motion primitives (idénticos al resto del sitio) -----
const spring = { type: "spring" as const, stiffness: 90, damping: 20, mass: 0.9 };
const easeOutExpo = [0.16, 1, 0.3, 1] as const;

function Curtain({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div className={`relative overflow-hidden ${className}`} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
      <motion.div variants={{ hidden: { y: "100%" }, visible: { y: "0%", transition: { duration: 1.05, ease: easeOutExpo, delay } } }}>
        {children}
      </motion.div>
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-[#C5A566] origin-bottom"
        variants={{ hidden: { scaleY: 1 }, visible: { scaleY: 0, transition: { duration: 1.05, ease: easeOutExpo, delay } } }}
        style={{ transformOrigin: "top" }}
      />
    </motion.div>
  );
}

function WordReveal({ text, className = "", delay = 0, stagger = 0.045, eager = false, block = false }: { text: string; className?: string; delay?: number; stagger?: number; eager?: boolean; block?: boolean }) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  const trigger = eager ? { animate: "visible" as const } : { whileInView: "visible" as const, viewport: { once: true, amount: 0.3 } };
  if (reduce) return <span className={`${block ? "block " : ""}${className}`}>{text}</span>;
  const wordSpans = words.map((word, i) => (
    <span key={i} className={`word-reveal-mask relative inline-block overflow-hidden align-baseline ${className}`}>
      <motion.span
        className="inline-block"
        initial="hidden"
        {...trigger}
        variants={{ hidden: { y: "110%" }, visible: { y: "0%", transition: { duration: 0.85, ease: easeOutExpo, delay: delay + i * stagger } } }}
      >
        {word}
      </motion.span>
    </span>
  ));
  return <span className={block ? "block" : undefined}>{wordSpans.flatMap((el, i) => (i > 0 ? [" ", el] : [el]))}</span>;
}

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ ...spring, delay }}
    >
      {children}
    </motion.div>
  );
}

function AntesDeFirmarArrasPage() {
  useEffect(() => {
    trackEvent("legal_area_view", { page: "antes-de-firmar-arras" });
  }, []);

  return (
    <div className="josecarlos-original bg-[var(--jch-bg)] text-[var(--jch-ink)] selection:bg-[#C5A566] selection:text-black">
      <SmoothScroll />
      <Header />
      <main>
        <Hero />
        <Checklist />
        <CtaFinal />
      </main>
      <Footer />
    </div>
  );
}

// ---------- Header ----------
function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const reduce = useReducedMotion();
  const drawerRef = useRef<HTMLElement>(null);

  const navLinks: [string, string][] = [
    ["La checklist", "#checklist"],
    ["Solicitar revisión", "#contact"],
  ];

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  useDialogA11y(mobileOpen, () => setMobileOpen(false), drawerRef);

  return (
    <>
      <motion.header
        initial={reduce ? false : { y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ...spring, delay: 0.1 }}
        className="no-print sticky top-0 z-50 w-full border-b border-[#E5E5E5] bg-white backdrop-blur-xl"
      >
        <nav className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-6 py-5">
          <Link to="/" className="group flex items-center gap-3">
            <motion.img
              src={LOGO}
              alt="Logo HiloLegal"
              className="h-12 w-auto object-contain"
              whileHover={{ rotate: -2, scale: 1.05 }}
              transition={spring}
            />
            <span className="text-base font-bold tracking-tight text-[#C5A566] md:text-lg">
              Verónica López
            </span>
          </Link>

          <div className="hidden items-center gap-9 lg:flex">
            {navLinks.map(([label, href]) => (
              <a key={href} className="group relative text-sm font-medium text-[#1A1A1A]" href={href}>
                <span className="transition-colors group-hover:text-[var(--jch-accent-ink)]">{label}</span>
                <span className="absolute -bottom-1 left-0 h-[1px] w-full origin-left scale-x-0 bg-[#C5A566] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle className="hidden sm:inline-flex" />
            <Link to="/veronica" className="header-back-link hidden md:inline-block">
              ← Verónica López
            </Link>
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={spring}
              className="header-whatsapp-btn hidden rounded-full bg-[#C5A566] px-8 py-[1.1rem] text-xs font-medium uppercase tracking-[0.14em] text-black transition-colors hover:bg-[#A78C57] sm:inline-block"
              href={WHATSAPP}
            >
              WhatsApp
            </motion.a>

            <button
              type="button"
              aria-label="Abrir menú"
              onClick={() => setMobileOpen((v) => !v)}
              className="-mr-2 p-2 text-2xl text-[var(--jch-accent-ink)] lg:hidden"
            >
              {mobileOpen ? "×" : "☰"}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            ref={drawerRef}
            tabIndex={-1}
            initial={reduce ? { x: 0 } : { x: "100%" }}
            animate={{ x: 0 }}
            exit={reduce ? { x: 0 } : { x: "100%" }}
            transition={{ duration: reduce ? 0 : 0.5, ease: easeOutExpo }}
            className="fixed right-0 top-0 z-[9999] h-[100dvh] w-[min(88vw,420px)] border-l border-[#E5E5E5] bg-white/95 backdrop-blur-xl outline-none lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
          >
            <div className="flex h-full flex-col gap-4 overflow-y-auto p-8">
              <button type="button" onClick={() => setMobileOpen(false)} className="self-end text-3xl text-[var(--jch-accent-ink)]" aria-label="Cerrar menú">
                ×
              </button>
              <div className="mt-8 flex flex-col gap-2">
                {navLinks.map(([label, href]) => (
                  <a key={href} href={href} onClick={() => setMobileOpen(false)} className="block py-3 text-lg font-medium text-[#1A1A1A] transition-colors hover:text-[var(--jch-accent-ink)]">
                    {label}
                  </a>
                ))}
                <a
                  href={WHATSAPP}
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 inline-block self-start rounded-full bg-[#C5A566] px-8 py-[1.1rem] text-center text-xs font-medium uppercase tracking-[0.14em] text-black transition-colors hover:bg-[#A78C57]"
                >
                  WhatsApp
                </a>
                <div className="flex items-center gap-2 border-t border-[#E5E5E5] pt-4 text-lg font-medium text-[#1A1A1A]">
                  <ThemeToggle />
                  <span>Modo claro</span>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

// ---------- Hero ----------
function Hero() {
  return (
    <section className="no-print pt-24 pb-16 md:pt-32 md:pb-20">
      <div className="max-w-[900px] mx-auto px-6 space-y-8">
        <FadeUp>
          <div className="hero-eyebrow inline-flex items-center gap-3">
            <motion.span initial={{ width: 0 }} animate={{ width: 32 }} transition={{ duration: 0.9, ease: easeOutExpo, delay: 0.4 }} className="h-[2px] bg-[#C5A566] block" />
            HILOLEGAL · ABOGACÍA, HIPOTECAS Y PATRIMONIO · ALTEA
          </div>
        </FadeUp>
        <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.08] tracking-tight text-balance">
          <WordReveal eager block delay={0.1} text="Antes de firmar" />
          <WordReveal eager block delay={0.325} className="text-[var(--jch-accent-ink)]" text="las arras." />
        </h1>
        <FadeUp delay={0.5}>
          <p className="hero-subtitle max-w-2xl">
            La checklist para comprar tu vivienda con las preguntas resueltas. Has encontrado una
            vivienda que te gusta. Antes de entregar dinero, conviene comprobar qué compras, con
            quién te comprometes y qué ocurrirá si la operación no sale como esperas.
          </p>
        </FadeUp>
        <FadeUp delay={0.6}>
          <div className="border border-[var(--jch-line)] bg-[var(--jch-surface)] p-6 text-sm text-[var(--jch-muted)] leading-relaxed">
            <strong className="text-[var(--jch-ink)]">Cómo utilizar esta checklist:</strong> marca cada
            casilla cuando hayas comprobado la información. Anota las dudas pendientes y resuélvelas
            antes de firmar.
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ---------- Datos de la operación ----------
function DatosOperacion() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
      <TextField label="Vivienda" />
      <TextField label="Fecha prevista de firma de arras" />
      <TextField label="Importe que voy a entregar" />
    </div>
  );
}

function TextField({ label }: { label: string }) {
  const id = `campo-${label.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--jch-dim)]">{label}</label>
      <input
        id={id}
        type="text"
        className="w-full bg-transparent border-0 border-b border-[var(--jch-line)] px-0 py-3 focus:ring-0 focus:border-[#C5A566] transition-colors outline-none"
      />
    </div>
  );
}

// ---------- Checklist (item interactivo) ----------
function ChecklistItem({ children }: { children: React.ReactNode }) {
  const id = React.useId();
  return (
    <label htmlFor={id} className="flex items-start gap-3 py-2.5 text-[var(--jch-ink)] leading-relaxed cursor-pointer">
      <input id={id} type="checkbox" className="mt-1 w-4 h-4 accent-[#C5A566] shrink-0" />
      <span>{children}</span>
    </label>
  );
}

function SourceNote({ text, sources }: { text: React.ReactNode; sources: { label: string; href: string }[] }) {
  return (
    <p className="mt-4 text-sm text-[var(--jch-muted)] leading-relaxed border-t border-[var(--jch-line)] pt-4">
      {text}{" "}
      {sources.map((s, i) => (
        <React.Fragment key={s.href}>
          {i > 0 && " y "}
          <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-[var(--jch-accent-ink)] underline hover:no-underline">
            {s.label}
          </a>
        </React.Fragment>
      ))}
      .
    </p>
  );
}

function SectionCard({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <FadeUp className="border border-[var(--jch-line)] bg-[var(--jch-bg)] p-8 md:p-10">
      <div className="flex items-baseline gap-4 mb-6">
        <span className="text-2xl font-black text-[var(--jch-accent-ink)]">{n}</span>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight">{title}</h2>
      </div>
      {children}
    </FadeUp>
  );
}

// ---------- Checklist (contenido) ----------
function Checklist() {
  return (
    <section id="checklist" className="pb-[100px]">
      <div className="max-w-[900px] mx-auto px-6 no-print">
        <DatosOperacion />

        <div className="space-y-10">
          <SectionCard n="1" title="Sé quién vende y qué estoy comprando">
            <ChecklistItem>He comprobado la identidad de los propietarios y quién debe intervenir en la firma.</ChecklistItem>
            <ChecklistItem>Si alguien firma en representación del vendedor, se ha comprobado que tiene facultades suficientes.</ChecklistItem>
            <ChecklistItem>He solicitado una nota simple reciente y revisado titularidad, cargas y limitaciones.</ChecklistItem>
            <ChecklistItem>El contrato identifica correctamente la vivienda y los anexos incluidos: garaje, trastero u otros.</ChecklistItem>
            <ChecklistItem>Las diferencias entre la vivienda que he visitado, su descripción registral y los datos catastrales están aclaradas.</ChecklistItem>
            <SourceNote
              text="Recuerda: la nota simple informa sobre la situación registral; no sustituye una comprobación del estado físico o de la situación urbanística."
              sources={[{ label: "Información del Colegio de Registradores", href: "https://sede.registradores.org/site/propiedad?lang=es" }]}
            />
          </SectionCard>

          <SectionCard n="2" title="Conozco las cargas y el estado de la vivienda">
            <ChecklistItem>Si existe una hipoteca, embargo u otra carga, está definido cómo se resolverá, quién asumirá los costes y cuándo.</ChecklistItem>
            <ChecklistItem>Sé si hay inquilinos u otros ocupantes y en qué condiciones se entregará la posesión.</ChecklistItem>
            <ChecklistItem>He pedido información sobre cuotas de comunidad pendientes y derramas aprobadas.</ChecklistItem>
            <ChecklistItem>He revisado el último recibo del IBI y solicitado información sobre posibles deudas.</ChecklistItem>
            <ChecklistItem>He consultado las actas recientes de la comunidad para conocer obras, incidencias o gastos relevantes.</ChecklistItem>
            <ChecklistItem>He solicitado la documentación energética y de ocupación o habitabilidad que corresponda.</ChecklistItem>
            <ChecklistItem>Si hay reformas, ampliaciones, cerramientos o un uso especial previsto, he comprobado su situación y viabilidad con el profesional o la Administración competente.</ChecklistItem>
            <SourceNote
              text="Una visita enseña cómo es la vivienda. La documentación ayuda a entender qué obligaciones pueden acompañarla."
              sources={[{ label: "Orientación del Consejo General del Notariado", href: "https://www.notariado.org/portal/viviendas-e-inmuebles" }]}
            />
          </SectionCard>

          <SectionCard n="3" title="Entiendo qué tipo de arras voy a firmar">
            <ChecklistItem>Me han explicado qué función tiene la cantidad entregada y cómo se descuenta del precio.</ChecklistItem>
            <ChecklistItem>Sé si el contrato permite desistir y con qué consecuencias.</ChecklistItem>
            <ChecklistItem>Entiendo qué sucede si incumplo yo y qué sucede si incumple el vendedor.</ChecklistItem>
            <ChecklistItem>No estoy suponiendo que cualquier contrato llamado «arras» permite abandonar la compra perdiendo únicamente la señal.</ChecklistItem>

            <div className="mt-6 border border-[var(--jch-line)] bg-[var(--jch-surface)] p-6">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--jch-dim)] mb-4">No todas las arras funcionan igual</p>
              <div className="space-y-3 text-sm leading-relaxed">
                <p><strong className="text-[var(--jch-ink)]">Confirmatorias:</strong> refuerzan el compromiso de compraventa y suelen ser un anticipo del precio. No conceden por sí solas una salida libre pagando la señal.</p>
                <p><strong className="text-[var(--jch-ink)]">Penitenciales:</strong> cuando se pactan claramente, permiten desistir en los términos acordados. Conforme al artículo 1454 del Código Civil, el comprador pierde lo entregado o el vendedor devuelve el doble.</p>
                <p><strong className="text-[var(--jch-ink)]">Penales:</strong> establecen una consecuencia económica para el incumplimiento. Su relación con la obligación de cumplir depende del pacto y de la normativa aplicable.</p>
              </div>
            </div>

            <SourceNote
              text="Lo decisivo es el contenido del contrato, no solo su título."
              sources={[
                { label: "Código Civil", href: "https://www.boe.es/buscar/act.php?id=BOE-A-1889-4763#a1454" },
                { label: "criterios jurisprudenciales sobre las modalidades de arras", href: "https://www.boe.es/biblioteca_juridica/anuarios_derecho/abrir_pdf.php?id=ANU-C-2012-10045900524" },
              ]}
            />
          </SectionCard>

          <SectionCard n="4" title="Si necesito hipoteca, he previsto qué ocurre si no llega">
            <ChecklistItem>He calculado el ahorro necesario para la entrada, los impuestos y los demás gastos de la compra.</ChecklistItem>
            <ChecklistItem>Distingo una simulación o estudio inicial de una financiación aprobada.</ChecklistItem>
            <ChecklistItem>He valorado qué ocurriría si la tasación fuese inferior a la prevista o el banco ofreciera menos financiación.</ChecklistItem>
            <ChecklistItem>He negociado, si la compra depende de una hipoteca, una condición expresa que regule esa situación.</ChecklistItem>
            <ChecklistItem>Esa condición concreta la financiación necesaria, el plazo, cómo acreditar una denegación y cuándo se devolvería el dinero si corresponde.</ChecklistItem>
            <ChecklistItem>La fecha prevista para escriturar permite tramitar la financiación y cumplir los plazos legales aplicables.</ChecklistItem>
            <SourceNote
              text="No des por hecho que una denegación bancaria te permite recuperar las arras. Deben revisarse el contrato y la legislación aplicable a la operación. El Banco de España recomienda prever expresamente esta situación."
              sources={[{ label: "Orientación sobre arras y financiación", href: "https://clientebancario.bde.es/pcb/es/blog/compra-de-una-vivienda--no-pierdas-las-arras.html" }]}
            />
            <div className="mt-6">
              <Link to="/josecarlos" hash="financiar" className="duo-block__cta">
                Estudiar mi hipoteca antes de firmar <span aria-hidden="true">→</span>
              </Link>
            </div>
          </SectionCard>

          <SectionCard n="5" title="Precio, pagos y fechas están claros">
            <ChecklistItem>El precio total, las cantidades ya entregadas y el saldo pendiente aparecen por escrito.</ChecklistItem>
            <ChecklistItem>Sé quién recibe el dinero y en qué concepto. Si lo recibe una agencia, entiendo su autorización y las condiciones de custodia o entrega.</ChecklistItem>
            <ChecklistItem>He verificado el destinatario del pago y conservaré un justificante.</ChecklistItem>
            <ChecklistItem>El contrato establece una fecha límite para la escritura y cómo acordar una prórroga.</ChecklistItem>
            <ChecklistItem>Está claro qué ocurre si una parte se retrasa o no aporta la documentación necesaria.</ChecklistItem>
            <ChecklistItem>El reparto de gastos y los honorarios de intermediación están identificados y revisados conforme a la normativa aplicable.</ChecklistItem>
            <ChecklistItem>Se han acordado la entrega de llaves, la posesión y, si procede, el inventario de muebles y equipamiento.</ChecklistItem>
          </SectionCard>

          <SectionCard n="6" title="Tengo una versión completa antes de firmar">
            <ChecklistItem>He recibido el contrato y sus anexos con tiempo para revisarlos.</ChecklistItem>
            <ChecklistItem>Las promesas importantes están recogidas por escrito.</ChecklistItem>
            <ChecklistItem>No quedan importes, fechas, anexos o condiciones esenciales en blanco.</ChecklistItem>
            <ChecklistItem>Conservaré una copia firmada por todas las partes.</ChecklistItem>
            <ChecklistItem>He aclarado cualquier cláusula que no entienda antes de entregar el dinero.</ChecklistItem>
          </SectionCard>
        </div>

        <FadeUp className="mt-10 border border-[var(--jch-line)] bg-[var(--jch-surface)] p-8 md:p-10">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--jch-dim)] mb-6">Mis tres preguntas pendientes</p>
          <div className="space-y-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex items-center gap-4 border-b border-[var(--jch-line)] pb-3">
                <span className="text-sm font-bold text-[var(--jch-dim)]">{n}.</span>
                <input type="text" className="flex-1 bg-transparent border-0 px-0 py-1 focus:ring-0 outline-none" />
              </div>
            ))}
          </div>
        </FadeUp>

        <FadeUp delay={0.1} className="mt-10">
          <div className="border border-[var(--jch-line)] bg-[var(--jch-surface)] p-8 md:p-10">
            <h3 className="text-lg font-bold mb-2">Antes de dar el siguiente paso</h3>
            <p className="text-[var(--jch-muted)] leading-relaxed mb-2">
              Si todavía no sabes qué ocurrirá con tu dinero, cómo se resolverán las cargas o qué
              pasa si no consigues financiación, esos puntos necesitan aclaración.
            </p>
            <p className="text-sm text-[var(--jch-dim)] leading-relaxed">
              Marcar todas las casillas ayuda a preparar la operación; no garantiza por sí solo que
              el contrato proteja tus intereses.
            </p>
          </div>
        </FadeUp>
      </div>

      {/* Fuera del contenedor .no-print: es el único bloque que debe seguir
          presente al imprimir (ver ReportDownload — su botón vive aquí, y
          su children solo se muestra en @media print). */}
      <div className="max-w-[900px] mx-auto px-6 mt-10">
        <FadeUp>
          <ReportDownload topic="Checklist antes de firmar las arras">
            <div style={{ fontFamily: "Inter, ui-sans-serif, sans-serif", padding: "2rem", maxWidth: "800px", color: "#1a1a1a" }}>
              <h1 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: ".25rem" }}>Antes de firmar las arras</h1>
              <p style={{ color: "#4A4A4A", marginBottom: "2rem" }}>HiloLegal · Abogacía, hipotecas y patrimonio · Altea · {new Date().toLocaleDateString("es-ES")}</p>

              <p style={{ marginBottom: "1.5rem" }}>
                Vivienda: ____________________________________<br />
                Fecha prevista de firma de arras: ______________<br />
                Importe que voy a entregar: ___________________
              </p>

              {printSections.map((s) => (
                <div key={s.n} style={{ marginBottom: "1.5rem" }}>
                  <h2 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: ".5rem" }}>{s.n}. {s.title}</h2>
                  {s.items.map((it) => (
                    <p key={it} style={{ margin: "0.3rem 0" }}>☐ {it}</p>
                  ))}
                </div>
              ))}

              <h2 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: ".5rem" }}>Mis tres preguntas pendientes</h2>
              <p style={{ margin: "0.3rem 0" }}>1. ____________________________________________________</p>
              <p style={{ margin: "0.3rem 0" }}>2. ____________________________________________________</p>
              <p style={{ margin: "0.3rem 0" }}>3. ____________________________________________________</p>

              <p style={{ marginTop: "2rem", fontSize: ".85rem", color: "#4A4A4A" }}>
                Guía informativa para compradores de vivienda en España. La normativa territorial, el
                tipo de inmueble y las cláusulas pactadas pueden cambiar las comprobaciones y sus
                efectos. No sustituye la revisión individual del contrato. HiloLegal — {PHONE_DISPLAY} — {EMAIL}
              </p>
            </div>
          </ReportDownload>
        </FadeUp>
      </div>
    </section>
  );
}

// ---------- Contenido del informe imprimible ----------
const printSections: { n: string; title: string; items: string[] }[] = [
  {
    n: "1",
    title: "Sé quién vende y qué estoy comprando",
    items: [
      "He comprobado la identidad de los propietarios y quién debe intervenir en la firma.",
      "Si alguien firma en representación del vendedor, se ha comprobado que tiene facultades suficientes.",
      "He solicitado una nota simple reciente y revisado titularidad, cargas y limitaciones.",
      "El contrato identifica correctamente la vivienda y los anexos incluidos: garaje, trastero u otros.",
      "Las diferencias entre la vivienda que he visitado, su descripción registral y los datos catastrales están aclaradas.",
    ],
  },
  {
    n: "2",
    title: "Conozco las cargas y el estado de la vivienda",
    items: [
      "Si existe una hipoteca, embargo u otra carga, está definido cómo se resolverá, quién asumirá los costes y cuándo.",
      "Sé si hay inquilinos u otros ocupantes y en qué condiciones se entregará la posesión.",
      "He pedido información sobre cuotas de comunidad pendientes y derramas aprobadas.",
      "He revisado el último recibo del IBI y solicitado información sobre posibles deudas.",
      "He consultado las actas recientes de la comunidad para conocer obras, incidencias o gastos relevantes.",
      "He solicitado la documentación energética y de ocupación o habitabilidad que corresponda.",
      "Si hay reformas, ampliaciones, cerramientos o un uso especial previsto, he comprobado su situación y viabilidad con el profesional o la Administración competente.",
    ],
  },
  {
    n: "3",
    title: "Entiendo qué tipo de arras voy a firmar",
    items: [
      "Me han explicado qué función tiene la cantidad entregada y cómo se descuenta del precio.",
      "Sé si el contrato permite desistir y con qué consecuencias.",
      "Entiendo qué sucede si incumplo yo y qué sucede si incumple el vendedor.",
      "No estoy suponiendo que cualquier contrato llamado «arras» permite abandonar la compra perdiendo únicamente la señal.",
    ],
  },
  {
    n: "4",
    title: "Si necesito hipoteca, he previsto qué ocurre si no llega",
    items: [
      "He calculado el ahorro necesario para la entrada, los impuestos y los demás gastos de la compra.",
      "Distingo una simulación o estudio inicial de una financiación aprobada.",
      "He valorado qué ocurriría si la tasación fuese inferior a la prevista o el banco ofreciera menos financiación.",
      "He negociado, si la compra depende de una hipoteca, una condición expresa que regule esa situación.",
      "Esa condición concreta la financiación necesaria, el plazo, cómo acreditar una denegación y cuándo se devolvería el dinero si corresponde.",
      "La fecha prevista para escriturar permite tramitar la financiación y cumplir los plazos legales aplicables.",
    ],
  },
  {
    n: "5",
    title: "Precio, pagos y fechas están claros",
    items: [
      "El precio total, las cantidades ya entregadas y el saldo pendiente aparecen por escrito.",
      "Sé quién recibe el dinero y en qué concepto. Si lo recibe una agencia, entiendo su autorización y las condiciones de custodia o entrega.",
      "He verificado el destinatario del pago y conservaré un justificante.",
      "El contrato establece una fecha límite para la escritura y cómo acordar una prórroga.",
      "Está claro qué ocurre si una parte se retrasa o no aporta la documentación necesaria.",
      "El reparto de gastos y los honorarios de intermediación están identificados y revisados conforme a la normativa aplicable.",
      "Se han acordado la entrega de llaves, la posesión y, si procede, el inventario de muebles y equipamiento.",
    ],
  },
  {
    n: "6",
    title: "Tengo una versión completa antes de firmar",
    items: [
      "He recibido el contrato y sus anexos con tiempo para revisarlos.",
      "Las promesas importantes están recogidas por escrito.",
      "No quedan importes, fechas, anexos o condiciones esenciales en blanco.",
      "Conservaré una copia firmada por todas las partes.",
      "He aclarado cualquier cláusula que no entienda antes de entregar el dinero.",
    ],
  },
];

// ---------- CTA final + formulario ----------
function CtaFinal() {
  return (
    <section id="contact" className="no-print py-[100px] bg-[var(--jch-surface)]">
      <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24">
        <div className="space-y-12">
          <h2 className="contact-editorial__title text-5xl md:text-6xl font-bold tracking-tight">
            <Curtain>¿Tienes un <span className="text-[var(--jch-accent-ink)]">contrato de arras</span> sobre la mesa?</Curtain>
          </h2>
          <FadeUp delay={0.1}>
            <p className="contact-editorial__description text-xl leading-relaxed">
              Solicita una revisión antes de firmar. Te ayudamos a entender el compromiso que vas
              a asumir, detectar cuestiones pendientes y valorar qué conviene aclarar o negociar.
              Cuando la compra también necesita financiación, coordinamos la perspectiva jurídica
              e hipotecaria.
            </p>
          </FadeUp>
          <div className="space-y-10 pt-10 border-t border-[var(--jch-line)]">
            {[
              { i: "call", label: "Llámanos", v: PHONE_DISPLAY, href: "tel:+34647506040" },
              { i: "mail", label: "Email", v: EMAIL, href: `mailto:${EMAIL}` },
            ].map((c, idx) => (
              <FadeUp key={c.i} delay={idx * 0.1}>
                <motion.a href={c.href} whileHover={{ x: 4 }} transition={spring} className="flex items-center gap-8 group">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-[var(--jch-ink)] flex items-center justify-center text-[var(--jch-bg)] group-hover:bg-[#C5A566] transition-colors shrink-0">
                    <Icon name={c.i} className="text-lg md:text-2xl" />
                  </div>
                  <div>
                    <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-50 mb-1">{c.label}</p>
                    <p className="text-lg md:text-2xl font-bold">{c.v}</p>
                  </div>
                </motion.a>
              </FadeUp>
            ))}
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            <FadeUp>
              <Link to="/veronica" className="duo-block__cta">
                Conocer a Verónica López <span aria-hidden="true">→</span>
              </Link>
            </FadeUp>
            <FadeUp delay={0.05}>
              <Link to="/josecarlos" hash="financiar" className="duo-block__cta">
                Estudiar mi hipoteca <span aria-hidden="true">→</span>
              </Link>
            </FadeUp>
          </div>
        </div>
        <FadeUp>
          <LeadForm />
        </FadeUp>
      </div>
    </section>
  );
}

function LeadForm() {
  const submit = useServerFn(submitContact);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });

  const startedRef = useRef(false);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const formLoadedAtRef = useRef(Date.now());
  const onChange = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!startedRef.current) {
      startedRef.current = true;
      trackEvent("contact_start");
    }
    setForm((f) => ({ ...f, [k]: e.target.value }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!accepted) {
      setStatus("error");
      setErrorMsg("Debes aceptar la política de privacidad para continuar.");
      return;
    }
    setStatus("sending");
    setErrorMsg("");
    try {
      await submit({
        data: {
          ...form,
          topic: "Revisión de contrato de arras",
          website: honeypotRef.current?.value ?? "",
          formLoadedAt: formLoadedAtRef.current,
        },
      });
      setStatus("ok");
      trackEvent("contact_submit", { section: "formulario", topic: "Revisión de contrato de arras" });
      setForm({ name: "", phone: "", email: "", message: "" });
      setAccepted(false);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "No se ha podido enviar el formulario.");
    }
  }

  return (
    <form className="contact-form-card space-y-10" onSubmit={onSubmit}>
      <input
        ref={honeypotRef}
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] top-0 h-px w-px overflow-hidden"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <Field label="Nombre" type="text" placeholder="Tu nombre" value={form.name} onChange={onChange("name")} required />
        <Field label="Teléfono" type="tel" placeholder="Tu número" value={form.phone} onChange={onChange("phone")} required />
      </div>
      <Field label="Email (opcional)" type="email" placeholder="tu@email.com" value={form.email} onChange={onChange("email")} />
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em]">Mensaje (opcional)</label>
        <textarea
          rows={4}
          placeholder="Cuéntanos cuándo está prevista la firma y qué necesitas revisar"
          value={form.message}
          onChange={onChange("message")}
          className="w-full bg-transparent border-0 border-b border-[var(--jch-line)] px-0 py-4 focus:ring-0 focus:border-[#C5A566] transition-colors outline-none placeholder:text-[var(--jch-dim)]"
        />
      </div>
      <label className="flex items-start gap-3 text-sm text-[var(--jch-muted)] leading-relaxed cursor-pointer">
        <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} required className="mt-1 w-4 h-4 accent-[#C5A566] shrink-0" />
        <span>
          He leído y acepto la{" "}
          <a href="/privacidad.html" target="_blank" rel="noopener noreferrer" className="text-[var(--jch-accent-ink)] underline hover:no-underline">política de privacidad</a>.
        </span>
      </label>
      <motion.button
        whileHover={{ scale: status === "sending" ? 1 : 1.02 }}
        whileTap={{ scale: status === "sending" ? 1 : 0.98 }}
        transition={spring}
        type="submit"
        disabled={status === "sending"}
        style={{ color: "#1a1a1a" }}
        className="rounded-full w-full bg-[#C5A566] py-6 font-black uppercase text-xs tracking-[0.3em] hover:bg-[#A78C57] transition-colors shadow-2xl shadow-[#C5A566]/20 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "sending" ? "Enviando…" : status === "ok" ? "¡Enviado!" : "Solicitar revisión"}
      </motion.button>
      {status === "ok" && (
        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-[var(--jch-ink)] font-bold uppercase tracking-widest">
          Gracias. Te contactaré en menos de 24h.
        </motion.p>
      )}
      {status === "error" && (
        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-red-600">
          {errorMsg || "Algo ha ido mal. Inténtalo de nuevo en unos minutos."}
        </motion.p>
      )}
    </form>
  );
}

function Field({ label, type, placeholder, value, onChange, required }: { label: string; type: string; placeholder: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean }) {
  const id = `field-${label.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full bg-transparent border-0 border-b border-[var(--jch-line)] px-0 py-4 focus:ring-0 focus:border-[#C5A566] transition-colors outline-none placeholder:text-[var(--jch-dim)]"
      />
    </div>
  );
}

// ---------- Footer ----------
function Footer() {
  return (
    <footer className="bg-[#1A1A1A] py-24 text-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-16">
          <div className="flex items-center gap-4 text-center md:text-left">
            <img src="/hilolegal-logo-white.webp" alt="Logo HiloLegal" loading="lazy" className="h-9 w-auto object-contain" />
            <div className="space-y-2">
              <div className="text-2xl font-black tracking-tighter uppercase">Antes de firmar las arras</div>
              <p className="text-gray-500 text-xs tracking-widest uppercase">Verónica López · HiloLegal</p>
            </div>
          </div>
          <motion.a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -2 }}
            transition={spring}
            className="rounded-full border border-white/20 px-8 py-4 text-xs font-medium uppercase tracking-[0.14em] text-white transition-colors hover:border-[#C5A566] hover:text-[#C5A566]"
          >
            Escríbenos por WhatsApp
          </motion.a>
        </div>
        <div className="mt-20 pt-10 border-t border-white/5 flex flex-col items-center gap-4">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[12px] text-gray-400">
            <Link to="/veronica" className="hover:text-[var(--jch-accent-ink)] transition-colors">Verónica López</Link>
            <span aria-hidden="true">·</span>
            <Link to="/derecho-inmobiliario" className="hover:text-[var(--jch-accent-ink)] transition-colors">Inmobiliario, urbanismo y comunidades</Link>
            <span aria-hidden="true">·</span>
            <a href="/terminos.html" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--jch-accent-ink)] transition-colors">Términos y condiciones</a>
            <span aria-hidden="true">·</span>
            <a href="/privacidad.html" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--jch-accent-ink)] transition-colors">Política de privacidad</a>
          </div>
          <div className="text-center text-[10px] text-gray-600 uppercase tracking-widest">
            © {new Date().getFullYear()} HILOLEGAL. TODOS LOS DERECHOS RESERVADOS.
          </div>
        </div>
      </div>
    </footer>
  );
}
