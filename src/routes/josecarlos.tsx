import React, { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { AnimatePresence, motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ThemeToggle } from "@/components/ThemeToggle";
import { submitContact } from "@/lib/contact.functions";
import { trackEvent } from "@/lib/analytics";
import { blogPosts, findPost } from "@/lib/blogPosts";

export const Route = createFileRoute("/josecarlos")({
  head: () => ({
    meta: [
      { title: "José Carlos Hidalgo | Hipotecas y planificación patrimonial" },
      {
        name: "description",
        content:
          "Hipotecas y planificación patrimonial para familias y autónomos. Analiza financiación, protección, ahorro y jubilación con José Carlos Hidalgo en HiloLegal.",
      },
      { property: "og:title", content: "José Carlos Hidalgo | Hipotecas y planificación patrimonial" },
      {
        property: "og:description",
        content: "Analiza financiación, protección, ahorro y jubilación con José Carlos Hidalgo en HiloLegal.",
      },
      { property: "og:url", content: "https://www.hilolegal.es/josecarlos" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:site_name", content: "HiloLegal" },
      { property: "og:image", content: "https://www.hilolegal.es/yoderecha.webp" },
      { property: "og:image:width", content: "1672" },
      { property: "og:image:height", content: "941" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "José Carlos Hidalgo | Hipotecas y planificación patrimonial" },
      { name: "twitter:description", content: "Analiza financiación, protección, ahorro y jubilación con José Carlos Hidalgo." },
      { name: "twitter:image", content: "https://www.hilolegal.es/yoderecha.webp" },
    ],
    links: [
      { rel: "canonical", href: "https://www.hilolegal.es/josecarlos" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=call,mail,location_on,expand_more,arrow_forward,balance,travel_explore&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Person",
              name: "José Carlos Hidalgo Ortega",
              jobTitle: "Asesor de Hipotecas y Planificación Patrimonial",
              url: "https://www.hilolegal.es/josecarlos",
              telephone: "+34647506040",
              email: "josecarlos@hilolegal.es",
              image: "https://www.hilolegal.es/8.webp",
              sameAs: [
                "https://www.linkedin.com/in/jos%C3%A9carloshidalgo/",
                "https://www.instagram.com/jokhid/",
                "https://www.facebook.com/josecarlos.hidalgoortega/",
                "https://share.google/GlqwXv7lO958pDPDS",
              ],
              worksFor: {
                "@type": "Organization",
                name: "HiloLegal",
                url: "https://www.hilolegal.es",
              },
              knowsAbout: [
                "Hipotecas",
                "Planificación patrimonial",
                "Protección de ingresos",
                "Ahorro e inversión",
                "Jubilación",
                "Finanzas para autónomos",
                "Administración de fincas",
              ],
            },
            {
              "@type": "FinancialService",
              name: "José Carlos Hidalgo — Hipotecas y Planificación Patrimonial",
              url: "https://www.hilolegal.es/josecarlos",
              telephone: "+34647506040",
              email: "josecarlos@hilolegal.es",
              image: "https://www.hilolegal.es/8.webp",
              description:
                "Hipotecas y planificación patrimonial para familias y autónomos en Altea, Benidorm y Alicante. Financiación, protección, ahorro y jubilación con criterio, antes de elegir producto.",
              priceRange: "€€",
              openingHours: "Mo-Fr 09:00-19:00",
              hasMap: "https://share.google/GlqwXv7lO958pDPDS",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Calle Regata 3, 1º E",
                addressLocality: "Altea",
                postalCode: "03590",
                addressRegion: "Alicante",
                addressCountry: "ES",
              },
              currenciesAccepted: "EUR",
              areaServed: [
                { "@type": "City", name: "Altea" },
                { "@type": "City", name: "Benidorm" },
                { "@type": "City", name: "Alicante" },
                { "@type": "AdministrativeArea", name: "Marina Baixa" },
                { "@type": "AdministrativeArea", name: "Costa Blanca" },
              ],
              founder: { "@type": "Person", name: "José Carlos Hidalgo Ortega" },
              makesOffer: [
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "Hipotecas y financiación de vivienda" } },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "Protección de ingresos y patrimonio" } },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "Ahorro, inversión y jubilación" } },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "Administración de fincas" } },
              ],
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.hilolegal.es/" },
                { "@type": "ListItem", position: 2, name: "José Carlos Hidalgo", item: "https://www.hilolegal.es/josecarlos" },
              ],
            },
            {
              "@type": "FAQPage",
              mainEntity: faqs.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ],
        }),
      },
    ],
  }),
  component: Index,
});

const EMAIL = "josecarlos@hilolegal.es";
const PHONE_DISPLAY = "647 50 60 40";
const WHATSAPP = "https://wa.me/34647506040";

// Photos in /public
const IMG = (n: number) => `/${n}.webp`;
const LOGO = "/logo-black.svg";

const Icon = ({ name, className = "" }: { name: string; className?: string }) => (
  <span aria-hidden="true" className={`material-symbols-outlined ${className}`}>{name}</span>
);

// Sistema de intent reutilizable: cada CTA de la página fija un `intent`
// (en vez de un `topic` suelto) antes de saltar al formulario. El
// formulario deriva de aquí el motivo preseleccionado, el título de
// contexto y la etiqueta del botón — así el visitante no tiene que
// volver a explicar qué estaba consultando.
const INTENTS = {
  mortgage: { topic: "Nueva Hipoteca", title: "Cuéntame tu operación.", ctaLabel: "Solicitar estudio" },
  "mortgage-study": { topic: "Nueva Hipoteca", title: "Cuéntame tu operación.", ctaLabel: "Solicitar estudio" },
  planning: { topic: "Diagnóstico General", title: "Cuéntame qué quieres conseguir.", ctaLabel: "Analizar mi situación" },
  protection: { topic: "Protección", title: "Cuéntame qué quieres proteger.", ctaLabel: "Revisar mi situación" },
  retirement: { topic: "Plan de Jubilación", title: "Cuéntame cómo estás preparando tu jubilación.", ctaLabel: "Solicitar análisis" },
  "self-employed": { topic: "Autónomo", title: "Cuéntame tu situación como autónomo.", ctaLabel: "Analizar mi situación" },
} as const;
type IntentKey = keyof typeof INTENTS;

const pilares = [
  {
    n: "01",
    title: "Financiar",
    kicker: "Antes de elegir una hipoteca, hacemos números.",
    text: "Viabilidad, aportación y cuota, antes de mirar ninguna oferta.",
    img: 2,
    href: "#financiar",
    intent: "mortgage" as IntentKey,
    section: "tres-pilares",
    cta: "financiar",
    event: "josecarlos_finance_click" as const,
  },
  {
    n: "02",
    title: "Proteger",
    kicker: "Antes de protegerte, calculamos qué ocurriría si tus ingresos se reducen.",
    text: "Ingresos, familia, vivienda y salud, sin catálogo de seguros de por medio.",
    img: 3,
    href: "#proteger",
    intent: "protection" as IntentKey,
    section: "tres-pilares",
    cta: "proteger",
    event: "josecarlos_protection_click" as const,
  },
  {
    n: "03",
    title: "Planificar",
    kicker: "Tu dinero necesita un propósito antes que un producto.",
    text: "Liquidez, deuda, ahorro, inversión y jubilación, en el orden correcto.",
    img: 4,
    href: "#planificar",
    intent: "planning" as IntentKey,
    section: "tres-pilares",
    cta: "planificar",
    event: "josecarlos_planning_click" as const,
  },
];

const proteger = [
  { t: "Ingresos", d: "Qué pasa con tus gastos fijos si dejas de facturar o de recibir tu nómina." },
  { t: "Familia", d: "Que un imprevisto no comprometa el nivel de vida de quienes dependen de ti." },
  { t: "Vivienda", d: "Que la hipoteca siga pagándose aunque cambien tus circunstancias." },
  { t: "Salud", d: "Acceso a atención médica sin que la espera agrave un problema." },
  { t: "Autónomos", d: "Cobertura pública limitada si dejas de trabajar por enfermedad o accidente." },
];

const journey = [
  { n: "01", t: "Liquidez", d: "Tener margen para imprevistos antes de comprometer el dinero en otra cosa." },
  { n: "02", t: "Protección", d: "Que un imprevisto no dependa de la suerte." },
  { n: "03", t: "Deuda", d: "Que las cuotas actuales no limiten las decisiones futuras." },
  { n: "04", t: "Objetivos", d: "Saber para qué ahorras, no solo cuánto." },
  { n: "05", t: "Ahorro", d: "Un colchón que crece con constancia, no con urgencia." },
  { n: "06", t: "Inversión", d: "Que el dinero parado trabaje, con el riesgo que puedas asumir." },
  { n: "07", t: "Jubilación", d: "Preparar con tiempo una parte de los ingresos que necesitarás cuando dejes de trabajar." },
];

const autonomosConexiones = ["Ingresos", "Protección", "Hipoteca", "Ahorro", "Jubilación", "Patrimonio"];

const method = [
  { n: "01.", title: "Analizo tu punto de partida", text: "Sin juicios. Recopilamos datos reales de tu economía actual para tener una base sólida sobre la que construir." },
  { n: "02.", title: "Detecto riesgos y oportunidades", text: "Puntos ciegos donde estás asumiendo un riesgo que no conocías, y margen de mejora que no habías visto." },
  { n: "03.", title: "Ordenamos prioridades", text: "No todo se decide a la vez. Definimos qué conviene resolver primero y qué puede esperar." },
  { n: "04.", title: "Elegimos las soluciones", text: "Con las prioridades claras, vemos qué opciones concretas encajan con tu caso." },
  { n: "05.", title: "Hacemos seguimiento", text: "Revisamos el plan cuando tu vida cambia y ajustamos los siguientes pasos." },
];

const faqs = [
  {
    q: "¿Cómo trabajas?",
    a: "Primero analizamos tu situación completa: ingresos, gastos, ahorro, deuda, patrimonio y objetivos. Después vemos qué decisiones tienen sentido y en qué orden, antes de hablar de ningún producto.",
  },
  {
    q: "¿Con qué entidades trabajas para hipotecas?",
    a: "Trabajo la financiación hipotecaria con ING y ABANCA. No cubro la totalidad del mercado bancario. Analizo tu operación y estudio qué alternativa puede encajar dentro de las opciones con las que trabajo.",
  },
  {
    q: "¿Puedes ayudarme a conseguir una hipoteca?",
    a: "Sí. Analizo tu perfil financiero, ingresos, ahorro disponible, estabilidad laboral, nivel de endeudamiento y viabilidad de la operación. Después vemos qué opciones hipotecarias pueden encajar mejor con tu caso.",
  },
  {
    q: "¿Trabajas con autónomos?",
    a: "Sí. En un autónomo conviene analizar de forma conjunta ingresos, protección, financiación, capacidad de ahorro y jubilación, porque muchas de estas decisiones están conectadas. Si quieres comprar una vivienda, también podemos estudiar específicamente cómo plantear la operación hipotecaria según tu situación.",
  },
  {
    q: "¿Qué analizas antes de recomendar una solución?",
    a: "Ingresos, gastos, ahorro, deuda, patrimonio, riesgos y objetivos. Una solución financiera solo tiene sentido si encaja dentro de tu situación completa, no de forma aislada.",
  },
  {
    q: "¿Tengo que contratar algún producto para hacer un análisis?",
    a: "No. El primer análisis es gratuito y no implica ningún compromiso de contratación.",
  },
];

// ----- Motion primitives -----
const spring = { type: "spring" as const, stiffness: 90, damping: 20, mass: 0.9 };
const easeOutExpo = [0.16, 1, 0.3, 1] as const;

// Curtain reveal: a mask wipes upward to expose content
function Curtain({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.div
        variants={{
          hidden: { y: "100%" },
          visible: { y: "0%", transition: { duration: 1.05, ease: easeOutExpo, delay } },
        }}
      >
        {children}
      </motion.div>
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-[#C5A566] origin-bottom"
        variants={{
          hidden: { scaleY: 1 },
          visible: { scaleY: 0, transition: { duration: 1.05, ease: easeOutExpo, delay } },
        }}
        style={{ transformOrigin: "top" }}
      />
    </motion.div>
  );
}

function WordReveal({
  text,
  className = "",
  delay = 0,
  stagger = 0.045,
  eager = false,
  block = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  eager?: boolean;
  block?: boolean;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  const trigger = eager
    ? { animate: "visible" as const }
    : { whileInView: "visible" as const, viewport: { once: true, amount: 0.3 } };

  if (reduce) {
    return <span className={`${block ? "block " : ""}${className}`}>{text}</span>;
  }

  const wordSpans = words.map((word, i) => (
    <span
      key={i}
      className={`word-reveal-mask relative inline-block overflow-hidden align-baseline ${className}`}
    >
      <motion.span
        className="inline-block"
        initial="hidden"
        {...trigger}
        variants={{
          hidden: { y: "110%" },
          visible: { y: "0%", transition: { duration: 0.85, ease: easeOutExpo, delay: delay + i * stagger } },
        }}
      >
        {word}
      </motion.span>
    </span>
  ));

  return (
    <span className={block ? "block" : undefined}>
      {wordSpans.flatMap((el, i) => (i > 0 ? [" ", el] : [el]))}
    </span>
  );
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

type SetIntent = (intent: IntentKey) => void;

function Index() {
  const [intent, setIntent] = useState<IntentKey>("planning");

  return (
    <div className="josecarlos-original bg-[var(--jch-bg)] text-[var(--jch-ink)] selection:bg-[#C5A566] selection:text-white">
      <SmoothScroll />
      <Header />

      <main>
        <Hero onSelectIntent={setIntent} />
        <TresPilares onSelectIntent={setIntent} />
        <Financiar onSelectIntent={setIntent} />
        <Proteger onSelectIntent={setIntent} />
        <Planificar onSelectIntent={setIntent} />
        <Autonomos onSelectIntent={setIntent} />
        <Metodo />
        <Herramientas />
        <PerfilProfesional onSelectIntent={setIntent} />
        <Entidades onSelectIntent={setIntent} />
        <SociosHiloLegal />
        <AdminFincasTeaser />
        <ContenidoAutoridad />
        <FAQ />
        <CtaFinal intent={intent} onSelectIntent={setIntent} />
      </main>

      <Footer />
    </div>
  );
}

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks: [string, string][] = [
    ["Financiar", "#financiar"],
    ["Proteger", "#proteger"],
    ["Planificar", "#planificar"],
    ["Método", "#metodo"],
    ["Sobre mí", "#about"],
    ["Blog", "/blog"],
    ["Contacto", "#contact"],
  ];

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ...spring, delay: 0.1 }}
        className="sticky top-0 z-50 w-full border-b border-[#E5E5E5] bg-white backdrop-blur-xl"
      >
        <nav className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-6 py-5">
          <Link to="/" className="group flex items-center gap-3">
            <motion.img
              src={LOGO}
              alt="Logo José Carlos Hidalgo"
              className="h-9 w-9 object-contain"
              whileHover={{ rotate: -6, scale: 1.05 }}
              transition={spring}
            />
            <span className="text-base font-bold uppercase tracking-tight text-[#1A1A1A] md:text-lg">
              José Carlos Hidalgo
            </span>
          </Link>

          <div className="hidden items-center gap-6 lg:flex">
            {navLinks.map(([label, href]) => (
              <a
                key={href}
                className="group relative text-sm font-medium text-[#1A1A1A]"
                href={href}
              >
                <span className="transition-colors group-hover:text-[var(--jch-accent-ink)]">
                  {label}
                </span>
                <span className="absolute -bottom-1 left-0 h-[1px] w-full origin-left scale-x-0 bg-[#C5A566] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle className="hidden sm:inline-flex" />
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={spring}
              className="header-whatsapp-btn hidden rounded-full bg-[#1f6f78] px-8 py-[1.1rem] text-xs font-medium uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#17535a] sm:inline-block"
              href={WHATSAPP}
            >
              WhatsApp
            </motion.a>

            <button
              type="button"
              aria-label="Abrir menú"
              onClick={() => setMobileOpen((v) => !v)}
              className="-mr-2 p-2 text-2xl text-[#C5A566] lg:hidden"
            >
              {mobileOpen ? "×" : "☰"}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: easeOutExpo }}
            className="fixed right-0 top-0 z-[9999] h-[100dvh] w-[min(88vw,420px)] border-l border-[#E5E5E5] bg-white/95 backdrop-blur-xl lg:hidden"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex h-full flex-col gap-4 overflow-y-auto p-8">
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="self-end text-3xl text-[#C5A566]"
                aria-label="Cerrar menú"
              >
                ×
              </button>
              <div className="mt-8 flex flex-col gap-2">
                {navLinks.map(([label, href]) => (
                  <a
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-3 text-lg font-medium text-[#1A1A1A] transition-colors hover:text-[var(--jch-accent-ink)]"
                  >
                    {label}
                  </a>
                ))}
                <a
                  href={WHATSAPP}
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 inline-block self-start rounded-full bg-[#1f6f78] px-8 py-[1.1rem] text-center text-xs font-medium uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#17535a]"
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

function Hero({ onSelectIntent }: { onSelectIntent: SetIntent }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  return (
    <section ref={ref} className="hero-bg-section">
      <motion.img
        style={{ scale: imgScale }}
        alt="José Carlos Hidalgo"
        className="hero-bg-image jc-hero-image"
        src="/yoderecha.webp"
        loading="eager"
        decoding="async"
        fetchPriority="high"
      />
      <div className="hero-bg-overlay" aria-hidden="true" />
      <div className="mx-auto px-6">
        <motion.div style={{ y: textY }} className="space-y-10">
          <FadeUp>
            <div className="hero-eyebrow inline-flex items-center gap-3">
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: 32 }}
                transition={{ duration: 0.9, ease: easeOutExpo, delay: 0.4 }}
                className="h-[2px] bg-[#C5A566] block"
              />
              JOSÉ CARLOS HIDALGO
            </div>
          </FadeUp>

          <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.08] tracking-tight text-balance">
            <WordReveal eager block delay={0.1} text="Hipotecas y planificación" />
            <WordReveal eager block delay={0.325} className="text-[var(--jch-accent-ink)]" text="patrimonial" />
            <WordReveal eager block delay={0.46} text="para familias y autónomos." />
          </h1>

          <FadeUp delay={0.6}>
            <div className="space-y-4 max-w-xl">
              <p className="hero-subtitle">
                Antes de contratar, invertir o financiar, conviene entender qué necesitas, qué puedes asumir y qué quieres conseguir.
              </p>
              <p className="hero-subtitle">
                Analizo contigo las cifras, los riesgos y los objetivos para ordenar las decisiones antes de elegir las soluciones.
              </p>
            </div>
          </FadeUp>

          <FadeUp delay={0.75}>
            <div className="flex flex-wrap gap-6 pt-2">
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={spring}
                className="rounded-full bg-[#1f6f78] text-white px-10 py-5 font-bold uppercase text-xs tracking-widest hover:bg-[#17535a] transition-colors shadow-xl shadow-[#1f6f78]/20"
                href="#contact"
                onClick={() => {
                  onSelectIntent("planning");
                  trackEvent("josecarlos_planning_click", { intent: "planning", source: "josecarlos", section: "hero", cta: "analizar_mi_situacion" });
                }}
              >
                Analizar mi situación
              </motion.a>
              <a
                href="#contact"
                className="btn-ghost"
                onClick={() => {
                  onSelectIntent("mortgage");
                  trackEvent("josecarlos_mortgage_start", { intent: "mortgage", source: "josecarlos", section: "hero", cta: "estudiar_mi_hipoteca" });
                }}
              >
                Estudiar mi hipoteca
              </a>
            </div>
          </FadeUp>
        </motion.div>
      </div>
    </section>
  );
}

function TresPilares({ onSelectIntent }: { onSelectIntent: SetIntent }) {
  return (
    <section className="portal-block py-[100px] border-t border-[var(--jch-line)]">
      <div className="portal-block__inner">
        <div className="portal-block__heading">
          <h2>
            <Curtain>
              <span className="hidden md:inline">Financiar · Proteger · Planificar</span>
              <span className="flex md:hidden flex-col items-center text-center gap-1 w-full">
                <span>· Financiar</span>
                <span>· Proteger</span>
                <span>· Planificar</span>
              </span>
            </Curtain>
          </h2>
          <FadeUp delay={0.1}>
            <p>Tres decisiones que están más relacionadas de lo que parecen.</p>
          </FadeUp>
        </div>
        <div className="portal-grid">
          {pilares.map((p, idx) => (
            <FadeUp key={p.n} delay={idx * 0.08} className="portal-card__wrap">
              <a
                href={p.href}
                className="portal-card"
                onClick={() => {
                  onSelectIntent(p.intent);
                  trackEvent(p.event, { intent: p.intent, source: "josecarlos", section: p.section, cta: p.cta });
                }}
              >
                <div className="portal-card__art">
                  <img src={IMG(p.img)} alt="" loading="lazy" />
                </div>
                <div className="portal-card__body">
                  <span className="portal-card__number">{p.n}</span>
                  <h3>{p.title}</h3>
                  <p className="portal-card__kicker">{p.kicker}</p>
                  <p className="portal-card__text">{p.text}</p>
                  <span className="portal-card__cta">
                    Ver más <span aria-hidden="true" />
                  </span>
                </div>
              </a>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

function Financiar({ onSelectIntent }: { onSelectIntent: SetIntent }) {
  return (
    <section id="financiar" className="py-[100px] border-t border-[var(--jch-line)]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            <Curtain>Antes de elegir una hipoteca, <span className="text-[var(--jch-accent-ink)]">hacemos números.</span></Curtain>
          </h2>
          <FadeUp delay={0.1}>
            <p className="text-xl text-[var(--jch-muted)] mt-6 leading-relaxed">
              Antes de firmar, conviene saber si la operación es viable, cuánto tendrás que aportar
              y qué cuota puedes asumir sin ahogar tu economía. Eso es lo que hacemos antes de mirar
              ninguna oferta.
            </p>
          </FadeUp>
          <FadeUp delay={0.15}>
            <div className="term-row">
              {["Precio", "Ahorro", "Financiación", "Ingresos", "Deudas", "Cuota", "Gastos"].map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </FadeUp>
        </div>

        <FadeUp delay={0.2} className="mt-16">
          <div className="three-questions">
            {[
              { q: "¿La operación parece viable?", a: "Cruzamos precio, ahorro disponible y financiación necesaria antes de dar ningún paso." },
              { q: "¿Cuánto necesitas aportar?", a: "Calculamos con qué ahorro cuentas realmente y qué parte tendrás que aportar tú." },
              { q: "¿Qué cuota puedes asumir razonablemente?", a: "Analizamos tus ingresos y deudas actuales para que la cuota no comprometa tu día a día." },
            ].map((item, idx) => (
              <div key={item.q} className="three-questions__item">
                <span className="three-questions__number">{String(idx + 1).padStart(2, "0")}</span>
                <h3 className="three-questions__q">{item.q}</h3>
                <p className="three-questions__a">{item.a}</p>
              </div>
            ))}
          </div>
        </FadeUp>

        <FadeUp delay={0.25} className="mt-16 max-w-2xl">
          <p className="text-[var(--jch-muted)] leading-relaxed">
            Trabajo la financiación hipotecaria con ING y ABANCA. Analizo primero tu perfil y la
            operación para estudiar qué alternativa puede encajar dentro de las opciones con las
            que trabajo. La concesión y las condiciones finales dependen siempre del análisis y
            aprobación de la entidad financiera.
          </p>
        </FadeUp>

        <FadeUp delay={0.3} className="mt-10">
          <a
            href="#contact"
            className="rounded-full bg-[#1f6f78] text-white px-10 py-5 font-bold uppercase text-xs tracking-widest hover:bg-[#17535a] transition-colors inline-block shadow-xl shadow-[#1f6f78]/20"
            onClick={() => {
              onSelectIntent("mortgage-study");
              trackEvent("josecarlos_mortgage_start", { intent: "mortgage-study", source: "josecarlos", section: "financiar", cta: "solicitar_estudio_hipotecario" });
            }}
          >
            Solicitar estudio hipotecario
          </a>
        </FadeUp>
      </div>
    </section>
  );
}

function Proteger({ onSelectIntent }: { onSelectIntent: SetIntent }) {
  return (
    <section id="proteger" className="content-block py-[100px] border-t border-[var(--jch-line)] bg-[var(--jch-surface)]">
      <div className="content-block__inner">
        <div className="content-block__heading">
          <h2>
            <Curtain>¿Qué ocurriría si mañana uno de los ingresos de casa desapareciera durante varios meses?</Curtain>
          </h2>
        </div>
        <div className="content-block__grid">
          {proteger.map((p, idx) => (
            <FadeUp key={p.t} delay={idx * 0.06}>
              <div className="content-card">
                <h3>{p.t}</h3>
                <p>{p.d}</p>
              </div>
            </FadeUp>
          ))}
        </div>
        <FadeUp delay={0.2} className="content-block__footer">
          <a
            href="#contact"
            className="rounded-full bg-[#1f6f78] text-white px-10 py-5 font-bold uppercase text-xs tracking-widest hover:bg-[#17535a] transition-colors inline-block shadow-xl shadow-[#1f6f78]/20"
            onClick={() => {
              onSelectIntent("protection");
              trackEvent("josecarlos_protection_click", { intent: "protection", source: "josecarlos", section: "proteger", cta: "revisar_mi_proteccion" });
            }}
          >
            Revisar mi protección
          </a>
        </FadeUp>
      </div>
    </section>
  );
}

function Planificar({ onSelectIntent }: { onSelectIntent: SetIntent }) {
  return (
    <section id="planificar" className="py-[100px] border-t border-[var(--jch-line)]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-28 self-start">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              <Curtain>Tu dinero necesita un <span className="text-[var(--jch-accent-ink)]">propósito</span> antes que un producto.</Curtain>
            </h2>
            <FadeUp delay={0.1}>
              <p className="position-block__highlight">
                No se trata de contratar todo. Se trata de decidir qué necesitas y en qué orden.
              </p>
            </FadeUp>
            <FadeUp delay={0.2}>
              <a
                href="#contact"
                className="rounded-full bg-[#1f6f78] text-white px-10 py-5 font-bold uppercase text-xs tracking-widest hover:bg-[#17535a] transition-colors inline-block shadow-xl shadow-[#1f6f78]/20"
                onClick={() => {
                  onSelectIntent("planning");
                  trackEvent("josecarlos_wealth_start", { intent: "planning", source: "josecarlos", section: "planificar", cta: "analizar_mi_situacion" });
                }}
              >
                Analizar mi situación
              </a>
            </FadeUp>
          </div>
          <div className="lg:col-span-7 priority-journey">
            <div className="priority-journey__list">
              {journey.map((j, idx) => (
                <FadeUp key={j.n} delay={idx * 0.05}>
                  <div className="priority-journey__item">
                    <span className="priority-journey__marker">{j.n}</span>
                    <div>
                      <h3 className="priority-journey__title">{j.t}</h3>
                      <p className="priority-journey__text">{j.d}</p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>

        <div id="jubilacion" className="mt-24 pt-16 border-t border-[var(--jch-line)] max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            <Curtain>La pregunta no es solo cuándo quieres jubilarte. Es cómo quieres vivir cuando lo hagas.</Curtain>
          </h2>
          <FadeUp delay={0.1} className="mt-12">
            <div className="three-questions">
              {[
                { q: "¿Cuánto podrías necesitar?", a: "Para mantener tu nivel de vida cuando dejes de trabajar." },
                { q: "¿Qué ingresos puedes esperar tener?", a: "Contando pensión pública, ahorro propio y otras fuentes." },
                { q: "¿Qué patrimonio necesitas construir?", a: "El patrimonio que tendría que generar esos ingresos." },
              ].map((item, idx) => (
                <div key={item.q} className="three-questions__item">
                  <span className="three-questions__number">{String(idx + 1).padStart(2, "0")}</span>
                  <h3 className="three-questions__q">{item.q}</h3>
                  <p className="three-questions__a">{item.a}</p>
                </div>
              ))}
            </div>
          </FadeUp>
          <FadeUp delay={0.15} className="mt-10">
            <a
              href="#contact"
              className="rounded-full bg-[#1f6f78] text-white px-10 py-5 font-bold uppercase text-xs tracking-widest hover:bg-[#17535a] transition-colors inline-block shadow-xl shadow-[#1f6f78]/20"
              onClick={() => {
                onSelectIntent("retirement");
                trackEvent("josecarlos_retirement_click", { intent: "retirement", source: "josecarlos", section: "jubilacion", cta: "estudiar_mi_jubilacion" });
              }}
            >
              Estudiar mi jubilación
            </a>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

function Autonomos({ onSelectIntent }: { onSelectIntent: SetIntent }) {
  return (
    <section id="autonomos" className="py-[100px] border-t border-[var(--jch-line)] bg-[var(--jch-surface)]">
      <div className="max-w-[1200px] mx-auto px-6 max-w-3xl">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
          <Curtain>Si tus ingresos dependen de ti, conviene saber qué ocurre cuando tú paras.</Curtain>
        </h2>
        <FadeUp delay={0.1} className="mt-10 flex flex-wrap gap-3">
          {autonomosConexiones.map((t) => (
            <span
              key={t}
              className="border border-[var(--jch-line-strong)] px-6 py-2 text-xs font-bold uppercase tracking-widest"
            >
              {t}
            </span>
          ))}
        </FadeUp>
        <FadeUp delay={0.2} className="mt-10">
          <a
            href="#contact"
            className="rounded-full bg-[#1f6f78] text-white px-10 py-5 font-bold uppercase text-xs tracking-widest hover:bg-[#17535a] transition-colors inline-block shadow-xl shadow-[#1f6f78]/20"
            onClick={() => {
              onSelectIntent("self-employed");
              trackEvent("josecarlos_autonomos_click", { intent: "self-employed", source: "josecarlos", section: "autonomos", cta: "analizar_mi_situacion_como_autonomo" });
            }}
          >
            Analizar mi situación como autónomo
          </a>
        </FadeUp>
      </div>
    </section>
  );
}

function Metodo() {
  const reduce = useReducedMotion();

  return (
    <section id="metodo" className="py-[100px] border-t border-[var(--jch-line)]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="max-w-2xl mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            <Curtain>Primero ordenamos la decisión. <span className="text-[var(--jch-accent-ink)]">Después elegimos la solución.</span></Curtain>
          </h2>
        </div>
        <div className="method-steps">
          {method.map((m) => (
            <motion.article
              key={m.n}
              className="method-step"
              initial={reduce ? false : { opacity: 0, y: 64 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.65 }}
              transition={{ duration: 0.85, ease: easeOutExpo }}
            >
              <span className="method-step__number">{m.n}</span>
              <div>
                <h3 className="method-step__title">{m.title}</h3>
                <p className="method-step__text">{m.text}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Herramientas() {
  const items = [
    { title: "Calculadora hipotecaria", text: "Estima cuota, plazo e intereses de tu futura hipoteca.", soon: true },
    { title: "Estudio hipotecario", text: "Análisis completo de viabilidad, aportación y cuota.", soon: true },
    { title: "Test de salud financiera", text: "Evalúa tu nivel de protección, ahorro y endeudamiento.", href: "/test-salud-financiera.html", event: "tool_financial_health" as const },
    { title: "Diagnóstico patrimonial", text: "Visión completa de tu situación antes de decidir.", soon: true },
    { title: "Calculadora de ahorro potencial", text: "Calcula cuánto dinero se te escapa en pequeños gastos recurrentes.", href: "/herramientas/ahorro-potencial/index.html", event: "tool_wealth_audit" as const },
  ];
  return (
    <section id="herramientas-jc" className="py-[100px] border-t border-[var(--jch-line)] bg-[var(--jch-surface)]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="mb-16 max-w-2xl space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Menos intuición. Más información.</h2>
          <p className="text-[var(--jch-muted)]">Antes de tomar una decisión financiera importante, conviene hacer números.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((t) =>
            t.soon ? (
              <FadeUp key={t.title}>
                <div className="block border border-[var(--jch-line)] p-8 tool-card--soon">
                  <h3 className="text-xl font-bold mb-2">{t.title}</h3>
                  <p className="text-[var(--jch-muted)] mb-2">{t.text}</p>
                  <span className="tool-card--soon__badge">Próximamente</span>
                </div>
              </FadeUp>
            ) : (
              <FadeUp key={t.title}>
                <a href={t.href} className="block border border-[var(--jch-line)] p-8 hover:border-[#C5A566] transition-colors" onClick={() => trackEvent(t.event!)}>
                  <h3 className="text-xl font-bold mb-2">{t.title}</h3>
                  <p className="text-[var(--jch-muted)] mb-6">{t.text}</p>
                  <span className="text-[var(--jch-cta)] text-xs font-bold uppercase tracking-widest">Abrir →</span>
                </a>
              </FadeUp>
            ),
          )}
        </div>
      </div>
    </section>
  );
}

function PerfilProfesional({ onSelectIntent }: { onSelectIntent: SetIntent }) {
  return (
    <section id="about" className="py-[100px]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
          <FadeUp className="lg:col-span-5">
            <div className="relative group">
              <motion.div
                initial={{ x: 24, y: 24 }}
                whileInView={{ x: 16, y: 16 }}
                whileHover={{ x: 0, y: 0 }}
                transition={spring}
                className="absolute inset-0 border border-[#C5A566] -z-10"
              />
              <div className="relative overflow-hidden">
                <motion.img
                  alt="José Carlos Hidalgo"
                  className="w-full h-[320px] sm:h-[420px] lg:h-[600px] object-cover"
                  src={IMG(8)}
                  loading="lazy"
                  initial={{ scale: 1.08 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.6, ease: easeOutExpo }}
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            </div>
          </FadeUp>
          <div className="lg:col-span-7 space-y-10">
            <FadeUp>
              <div className="space-y-4">
                <span className="text-[var(--jch-accent-ink)] font-bold text-xs uppercase tracking-widest">SOBRE MÍ</span>
                <h2 className="text-5xl font-bold tracking-tight">José Carlos Hidalgo</h2>
                <p className="text-2xl font-medium text-[var(--jch-accent-ink)] italic">Analizar primero. Decidir después.</p>
              </div>
            </FadeUp>
            <FadeUp delay={0.1}>
              <div className="space-y-6 text-xl text-[var(--jch-muted)] leading-relaxed">
                <p>Trabajo con familias y autónomos en decisiones relacionadas con financiación hipotecaria, protección, ahorro y planificación patrimonial.</p>
                <p>Mi forma de trabajar parte de una idea sencilla: una solución financiera solo tiene sentido cuando encaja dentro de la situación completa de la persona.</p>
                <p>Por eso, antes de hablar de productos, analizamos ingresos, gastos, ahorro, deuda, patrimonio, riesgos y objetivos.</p>
                <p>Una hipoteca afecta a tu capacidad de ahorro. Una caída de ingresos puede afectar al pago de la vivienda. Y preparar la jubilación requiere entender cuánto puedes ahorrar hoy sin comprometer otros objetivos.</p>
                <p>Trabajo la financiación hipotecaria con ING y ABANCA y desarrollo las áreas de protección y planificación patrimonial con las entidades con las que mantengo relación profesional.</p>
                <p>También soy cofundador de HiloLegal junto a Verónica López. Esto nos permite abordar de forma coordinada situaciones en las que una decisión jurídica tiene consecuencias económicas o patrimoniales.</p>
                <p>Mi trabajo empieza por entender tus números y conseguir que tú entiendas la decisión.</p>
              </div>
            </FadeUp>
            <FadeUp delay={0.2}>
              <div className="flex items-center gap-4 text-[var(--jch-ink)] font-bold">
                <Icon name="location_on" className="text-[var(--jch-accent-ink)]" />
                <span className="text-sm uppercase tracking-widest text-[var(--jch-accent-ink)]">Altea · Benidorm · Costa Blanca · Alicante · Online</span>
              </div>
            </FadeUp>
            <FadeUp delay={0.3}>
              <div className="flex flex-wrap items-center gap-8">
                <a
                  href="#contact"
                  className="rounded-full bg-[#1f6f78] text-white px-10 py-5 font-bold uppercase text-xs tracking-widest hover:bg-[#17535a] transition-colors inline-block shadow-xl shadow-[#1f6f78]/20"
                  onClick={() => {
                    onSelectIntent("planning");
                    trackEvent("josecarlos_planning_click", { intent: "planning", source: "josecarlos", section: "perfil", cta: "analizar_mi_situacion" });
                  }}
                >
                  Analizar mi situación
                </a>
                <a
                  href="https://share.google/GlqwXv7lO958pDPDS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[var(--jch-accent-ink)] hover:text-[var(--jch-ink)] transition-colors"
                >
                  <Icon name="travel_explore" className="text-base" />
                  Ver mi perfil en Google
                </a>
              </div>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}

// Dos grupos deliberadamente separados (brief "AJUSTES FINALES", punto 2):
// financiación hipotecaria (ING, ABANCA) y protección/planificación
// (Nationale-Nederlanden, Sanitas, Caser) no son intercambiables — mezclarlas
// sugería que cualquier entidad servía para cualquier necesidad.
const entidadesHipoteca = [
  { name: "ING", className: "font-extrabold tracking-tight" },
  { name: "ABANCA", className: "font-bold tracking-[0.15em]" },
];
const entidadesProteccion = [
  { name: "Nationale-Nederlanden", className: "font-serif italic" },
  { name: "Sanitas", className: "font-semibold" },
  { name: "Caser", className: "font-bold tracking-wide" },
];

function Entidades({ onSelectIntent }: { onSelectIntent: SetIntent }) {
  return (
    <section aria-label="Entidades con las que trabajo" className="partners-editorial">
      <div className="partners-editorial__inner space-y-16">
        <div>
          <FadeUp>
            <p className="partners-editorial__label">Financiación hipotecaria</p>
          </FadeUp>
          <div className="partners-editorial__list">
            {entidadesHipoteca.map((p, idx) => (
              <FadeUp key={p.name} delay={idx * 0.06}>
                <span className={`partners-editorial__name ${p.className}`}>
                  {p.name}
                </span>
              </FadeUp>
            ))}
          </div>
          <FadeUp delay={0.15}>
            <p className="text-sm text-[var(--jch-muted)] max-w-xl mt-8">
              Trabajo la financiación hipotecaria con ING y ABANCA. Analizo primero tu perfil y la
              operación para estudiar qué alternativa puede encajar dentro de las opciones con las
              que trabajo. La concesión y las condiciones finales dependen siempre del análisis y
              aprobación de la entidad financiera.
            </p>
          </FadeUp>
          <FadeUp delay={0.2} className="mt-6">
            <a
              href="#contact"
              className="duo-block__cta"
              onClick={() => {
                onSelectIntent("mortgage");
                trackEvent("josecarlos_mortgage_start", { intent: "mortgage", source: "josecarlos", section: "entidades", cta: "estudiar_mi_hipoteca" });
              }}
            >
              Estudiar mi hipoteca <span aria-hidden="true">→</span>
            </a>
          </FadeUp>
        </div>

        <div>
          <FadeUp>
            <p className="partners-editorial__label">Protección y planificación</p>
          </FadeUp>
          <div className="partners-editorial__list">
            {entidadesProteccion.map((p, idx) => (
              <FadeUp key={p.name} delay={idx * 0.06}>
                <span className={`partners-editorial__name ${p.className}`}>
                  {p.name}
                </span>
              </FadeUp>
            ))}
          </div>
          <FadeUp delay={0.15}>
            <p className="text-sm text-[var(--jch-muted)] max-w-xl mt-8">
              Trabajo con distintas entidades dentro de las áreas de protección y planificación. La
              elección de una solución debe partir de la situación, los objetivos y las
              necesidades que previamente hemos analizado.
            </p>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

function SociosHiloLegal() {
  return (
    <section className="py-[100px] border-t border-[var(--jch-line)]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <FadeUp>
            <div className="space-y-8">
              <span className="text-[var(--jch-accent-ink)] font-bold text-xs uppercase tracking-widest">PARTE DE HILOLEGAL</span>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                <Curtain>Un mismo equipo, dos especialistas</Curtain>
              </h2>
              <div className="space-y-6 text-xl text-[var(--jch-muted)] leading-relaxed">
                <p>Soy cofundador de HiloLegal junto a Verónica López, abogada especializada en derecho civil, administrativo y de familia. Cuando un caso tiene una vertiente legal además de financiera, trabajamos coordinados bajo una sola firma, para que no tengas que repetir tu situación a nadie.</p>
                <p>Un mismo equipo, dos especialistas, sin que tengas que empezar de cero con cada uno.</p>
              </div>
              <motion.a
                href="/veronica"
                whileHover={{ x: 4 }}
                transition={spring}
                className="inline-flex items-center gap-2 text-[15px] font-black uppercase tracking-widest text-[var(--jch-cta)] hover:text-[var(--jch-ink)] transition-colors"
              >
                Conocer a Verónica López <Icon name="arrow_forward" className="text-base" />
              </motion.a>
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <div className="relative overflow-hidden aspect-[4/3]">
              <motion.img
                src="/VERODERECHA.webp"
                alt="Verónica López — HiloLegal"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ scale: 1.1 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, ease: easeOutExpo }}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white space-y-2">
                <span className="font-bold uppercase tracking-widest text-xs">HiloLegal</span>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

function AdminFincasTeaser() {
  return (
    <section id="fincas" className="fincas-block">
      <div className="fincas-block__inner">
        <span className="fincas-block__eyebrow">Además</span>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">También administro comunidades.</h2>
        <p className="fincas-block__lead">
          Gestión económica de comunidades de propietarios, con seguimiento real de cada incidencia.
        </p>
        <ul className="fincas-block__list">
          <li>Gestión económica e incidencias con seguimiento real</li>
          <li>Coordinación de proveedores y juntas de propietarios</li>
          <li>Portal y app para consultar todo desde el móvil</li>
        </ul>
        <Link
          to="/administracion-fincas"
          className="fincas-block__cta"
          onClick={() => trackEvent("josecarlos_property_management_click")}
        >
          Ir a administración de fincas <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}

const articulosDestacados = [
  { slug: "preparar-perfil-financiero-hipoteca-2026", label: "Hipotecas" },
  { slug: "flujo-caja-vs-riqueza-real-autonomo", label: "Autónomos" },
  { slug: "sialp-2026-ahorro-sin-impuestos", label: "Ahorro" },
  { slug: "que-pasaria-con-tu-familia-si-no-pudieras-trabajar", label: "Protección" },
  { slug: "jubilacion-en-espana", label: "Jubilación" },
  { slug: "prevision-financiera-vision", label: "Planificación" },
];

function ContenidoAutoridad() {
  const posts = articulosDestacados
    .map((a) => ({ ...a, post: findPost(a.slug) }))
    .filter((a) => a.post);

  if (posts.length === 0) return null;

  return (
    <section className="content-block py-[100px] border-t border-[var(--jch-line)] bg-[var(--jch-surface)]">
      <div className="content-block__inner">
        <div className="content-block__heading">
          <h2>
            <Curtain>Artículos para entender antes de decidir</Curtain>
          </h2>
          <FadeUp delay={0.1}>
            <p>Contenido propio sobre hipotecas, autónomos, ahorro, protección, jubilación y planificación.</p>
          </FadeUp>
        </div>
        <div className="content-block__grid">
          {posts.map(({ slug, label, post }, idx) => (
            <FadeUp key={slug} delay={idx * 0.06}>
              <Link
                to="/blog/$slug"
                params={{ slug }}
                className="content-card"
                onClick={() => trackEvent("blog_article_click", { slug })}
              >
                <span className="content-card__category">{label}</span>
                <h3>{post!.title}</h3>
                <p>{post!.excerpt}</p>
                <span className="content-card__cta">
                  Leer artículo <span aria-hidden="true" />
                </span>
              </Link>
            </FadeUp>
          ))}
        </div>
        <FadeUp delay={0.2} className="content-block__footer">
          <Link to="/blog" className="duo-block__cta">
            Ver todos los artículos <span aria-hidden="true">→</span>
          </Link>
        </FadeUp>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="py-[100px] bg-[var(--jch-surface)]">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-4xl font-bold tracking-tight text-center mb-20 uppercase">
          <Curtain>Dudas normales antes de decidir</Curtain>
        </h2>
        <div className="space-y-px bg-[var(--jch-line)]">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <FadeUp key={f.q} delay={i * 0.05}>
                <div className="bg-[var(--jch-bg)]">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex justify-between items-center text-left p-8 text-lg font-bold uppercase tracking-tight"
                    aria-expanded={isOpen}
                  >
                    <span>{f.q}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={spring}
                      className="material-symbols-outlined text-[var(--jch-accent-ink)]"
                    >
                      expand_more
                    </motion.span>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                    transition={{ duration: 0.5, ease: easeOutExpo }}
                    style={{ overflow: "hidden" }}
                  >
                    <div className="px-8 pb-8 text-[var(--jch-muted)] leading-relaxed">{f.a}</div>
                  </motion.div>
                </div>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CtaFinal({ intent, onSelectIntent }: { intent: IntentKey; onSelectIntent: SetIntent }) {
  const caminos = [
    {
      q: "Quiero comprar una vivienda.",
      d: "Analizamos precio, ahorro, ingresos, financiación y cuota antes de estudiar la hipoteca.",
      cta: "Estudiar mi hipoteca",
      intent: "mortgage" as IntentKey,
      ctaSlug: "estudiar_mi_hipoteca",
      event: "josecarlos_mortgage_start" as const,
    },
    {
      q: "Quiero ordenar mis finanzas.",
      d: "Revisamos ingresos, gastos, ahorro, deuda, protección y objetivos para establecer prioridades.",
      cta: "Analizar mi situación",
      intent: "planning" as IntentKey,
      ctaSlug: "analizar_mi_situacion",
      event: "josecarlos_planning_click" as const,
    },
    {
      q: "Quiero preparar mi jubilación.",
      d: "Analizamos qué ingresos puedes necesitar, qué recursos puedes esperar y qué patrimonio necesitas construir.",
      cta: "Estudiar mi jubilación",
      intent: "retirement" as IntentKey,
      ctaSlug: "estudiar_mi_jubilacion",
      event: "josecarlos_retirement_click" as const,
    },
    {
      q: "Soy autónomo.",
      d: "Analizamos conjuntamente protección de ingresos, financiación, ahorro, jubilación y patrimonio.",
      cta: "Analizar mi situación como autónomo",
      intent: "self-employed" as IntentKey,
      ctaSlug: "analizar_mi_situacion_como_autonomo",
      event: "josecarlos_autonomos_click" as const,
    },
  ];

  return (
    <section id="contact" className="py-[100px] border-t border-[var(--jch-line)]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="max-w-3xl mb-20">
          <span className="text-[var(--jch-accent-ink)] font-bold text-xs uppercase tracking-widest">¿Por dónde empezamos?</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {caminos.map((c, idx) => (
              <FadeUp key={c.q} delay={idx * 0.05}>
                <a
                  href="#contact-form"
                  className="block border border-[var(--jch-line)] p-8 hover:border-[#C5A566] transition-colors"
                  onClick={() => {
                    onSelectIntent(c.intent);
                    trackEvent(c.event, { intent: c.intent, source: "josecarlos", section: "cta-final", cta: c.ctaSlug });
                  }}
                >
                  <p className="text-lg font-bold mb-3">{c.q}</p>
                  <p className="text-sm text-[var(--jch-muted)] mb-4">{c.d}</p>
                  <span className="text-[var(--jch-cta)] text-xs font-bold uppercase tracking-widest">{c.cta} →</span>
                </a>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24">
        <div className="space-y-12">
          <h2 className="contact-editorial__title text-5xl md:text-6xl font-bold tracking-tight">
            <Curtain>No necesitas saber qué <span className="text-[var(--jch-accent-ink)]">producto necesitas</span></Curtain>
          </h2>
          <FadeUp delay={0.1}>
            <p className="contact-editorial__description text-xl leading-relaxed">
              Necesitas saber qué quieres resolver. Cuéntame tu situación. Empezaremos por entender
              dónde estás, qué quieres conseguir y qué decisiones tienen sentido analizar.
            </p>
          </FadeUp>
          <div className="space-y-10 pt-10 border-t border-[var(--jch-line)]">
            {[
              { i: "call", label: "Llámanos", v: PHONE_DISPLAY, href: `tel:+34647506040` },
              { i: "mail", label: "Email", v: EMAIL, href: `mailto:${EMAIL}` },
            ].map((c, idx) => (
              <FadeUp key={c.i} delay={idx * 0.1}>
                <motion.a
                  href={c.href}
                  whileHover={{ x: 4 }}
                  transition={spring}
                  className="flex items-center gap-8 group"
                >
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
          <FadeUp>
            <div className="pt-10 border-t border-[var(--jch-line)] space-y-4">
              <div className="flex items-center gap-3">
                <Icon name="location_on" className="text-[var(--jch-accent-ink)] text-xl" />
                <p className="text-sm font-bold uppercase tracking-widest">Calle Regata 3, 1º E, 03590 Altea</p>
              </div>
              <div className="w-full aspect-[4/3] overflow-hidden border border-[var(--jch-line)]">
                <iframe
                  title="Mapa Calle Regata 3, Altea"
                  src="https://www.google.com/maps?q=Calle+Regata+3,+03590+Altea,+Alicante&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full border-0"
                />
              </div>
            </div>
          </FadeUp>
        </div>
        <FadeUp>
          <ContactForm intent={intent} />
        </FadeUp>
      </div>
    </section>
  );
}

// Mapa inverso topic → intent, para cuando el visitante cambia el <select>
// a mano en vez de llegar desde un CTA: el título/CTA del formulario se
// mantienen sincronizados igualmente.
const TOPIC_TO_INTENT = Object.fromEntries(
  Object.entries(INTENTS).map(([key, cfg]) => [cfg.topic, key as IntentKey]),
) as Record<string, IntentKey>;

function ContactForm({ intent }: { intent: IntentKey }) {
  const submit = useServerFn(submitContact);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [currentIntent, setCurrentIntent] = useState<IntentKey>(intent);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    topic: INTENTS[intent].topic,
    message: "",
  });

  useEffect(() => {
    setCurrentIntent(intent);
    setForm((f) => ({ ...f, topic: INTENTS[intent].topic }));
  }, [intent]);

  const config = INTENTS[currentIntent];

  // Campos extra solo para hipoteca y autónomo (progressive disclosure).
  // Se pliegan dentro de `message` en vez de añadirse como claves nuevas —
  // el webhook (contact.functions.ts) posta a un Apps Script cuyo mapeo de
  // columnas no está verificado, y `message` es el campo que la hoja ya
  // captura de forma fiable.
  const [mortgage, setMortgage] = useState({
    housePrice: "",
    financing: "",
    income: "",
    employment: "",
  });
  const [autonomo, setAutonomo] = useState({ interestArea: "" });
  const isMortgage = form.topic === "Nueva Hipoteca";
  const isAutonomo = form.topic === "Autónomo";

  const startedRef = useRef(false);
  const onChange = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!startedRef.current) {
      startedRef.current = true;
      trackEvent("contact_start", { intent: currentIntent, source: "josecarlos" });
    }
    if (k === "topic") {
      setCurrentIntent(TOPIC_TO_INTENT[e.target.value] ?? currentIntent);
    }
    setForm((f) => ({ ...f, [k]: e.target.value }));
  };
  const onMortgageChange = (k: keyof typeof mortgage) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setMortgage((m) => ({ ...m, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!accepted) {
      setStatus("error");
      setErrorMsg("Debes aceptar la política de privacidad para continuar.");
      return;
    }
    setStatus("sending");
    setErrorMsg("");
    const extraNote = isMortgage
      ? [
          mortgage.housePrice && `Precio vivienda: ${mortgage.housePrice}`,
          mortgage.financing && `Financiación aproximada: ${mortgage.financing}`,
          mortgage.income && `Ingresos: ${mortgage.income}`,
          mortgage.employment && `Situación laboral: ${mortgage.employment}`,
        ]
          .filter(Boolean)
          .join(" · ")
      : isAutonomo
        ? autonomo.interestArea && `Área de interés: ${autonomo.interestArea}`
        : "";
    const payload = {
      ...form,
      message: extraNote ? `${extraNote}${form.message ? " · " + form.message : ""}` : form.message,
    };
    try {
      await submit({ data: payload });
      setStatus("ok");
      trackEvent("contact_submit", { intent: currentIntent, source: "josecarlos" });
      trackEvent("josecarlos_contact_submit", { intent: currentIntent, source: "josecarlos" });
      setForm({ name: "", phone: "", email: "", topic: INTENTS[intent].topic, message: "" });
      setMortgage({ housePrice: "", financing: "", income: "", employment: "" });
      setAutonomo({ interestArea: "" });
      setAccepted(false);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "No se ha podido enviar el formulario.");
    }
  }

  return (
    <form id="contact-form" className="contact-form-card space-y-10 scroll-mt-28" onSubmit={onSubmit}>
      <p className="text-xl font-bold">{config.title}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <Field label="Nombre" type="text" placeholder="Tu nombre" value={form.name} onChange={onChange("name")} required />
        <Field label="Teléfono" type="tel" placeholder="Tu número" value={form.phone} onChange={onChange("phone")} required />
      </div>
      <Field label="Email (opcional)" type="email" placeholder="tu@email.com" value={form.email} onChange={onChange("email")} />
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em]">¿Qué quieres resolver?</label>
        <select
          value={form.topic}
          onChange={onChange("topic")}
          className="w-full bg-transparent border-0 border-b border-[var(--jch-line)] px-0 py-4 focus:ring-0 focus:border-[#C5A566] transition-colors outline-none"
        >
          <option>Diagnóstico General</option>
          <option>Nueva Hipoteca</option>
          <option>Protección</option>
          <option>Plan de Jubilación</option>
          <option>Autónomo</option>
        </select>
      </div>
      {isMortgage && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-[var(--jch-line)] pt-10">
          <Field label="Precio vivienda (opcional)" type="text" placeholder="Ej. 220.000 €" value={mortgage.housePrice} onChange={onMortgageChange("housePrice")} />
          <Field label="Financiación aproximada (opcional)" type="text" placeholder="Ej. 80%" value={mortgage.financing} onChange={onMortgageChange("financing")} />
          <Field label="Ingresos (opcional)" type="text" placeholder="Ej. 2.400 €/mes" value={mortgage.income} onChange={onMortgageChange("income")} />
          <Field label="Situación laboral (opcional)" type="text" placeholder="Ej. asalariado, autónomo..." value={mortgage.employment} onChange={onMortgageChange("employment")} />
        </div>
      )}
      {isAutonomo && (
        <div className="border-t border-[var(--jch-line)] pt-10">
          <Field
            label="Área de interés (opcional)"
            type="text"
            placeholder="Ej. protección, ahorro, hipoteca..."
            value={autonomo.interestArea}
            onChange={(e) => setAutonomo({ interestArea: e.target.value })}
          />
        </div>
      )}
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em]">Mensaje (opcional)</label>
        <textarea
          rows={4}
          placeholder="Cuéntanos tu situación"
          value={form.message}
          onChange={onChange("message")}
          className="w-full bg-transparent border-0 border-b border-[var(--jch-line)] px-0 py-4 focus:ring-0 focus:border-[#C5A566] transition-colors outline-none placeholder:text-[var(--jch-dim)]"
        />
      </div>

      <label className="flex items-start gap-3 text-sm text-[var(--jch-muted)] leading-relaxed cursor-pointer">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
          required
          className="mt-1 w-4 h-4 accent-[#C5A566] shrink-0"
        />
        <span>
          He leído y acepto la{" "}
          <a href="/privacidad.html" target="_blank" rel="noopener noreferrer" className="text-[var(--jch-accent-ink)] underline hover:no-underline">
            política de privacidad
          </a>
          .
        </span>
      </label>

      <motion.button
        whileHover={{ scale: status === "sending" ? 1 : 1.02 }}
        whileTap={{ scale: status === "sending" ? 1 : 0.98 }}
        transition={spring}
        type="submit"
        disabled={status === "sending"}
        style={{ color: "#ffffff" }}
        className="rounded-full w-full bg-[#1f6f78] py-6 font-black uppercase text-xs tracking-[0.3em] hover:bg-[#17535a] transition-colors shadow-2xl shadow-[#1f6f78]/20 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "sending" ? "Enviando…" : status === "ok" ? "¡Enviado!" : config.ctaLabel}
      </motion.button>

      {status === "ok" && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-[var(--jch-ink)] font-bold uppercase tracking-widest"
        >
          Gracias. Te contactaré en menos de 24h.
        </motion.p>
      )}
      {status === "error" && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600"
        >
          {errorMsg || "Algo ha ido mal. Inténtalo de nuevo en unos minutos."}
        </motion.p>
      )}
    </form>
  );
}

const socialLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/jos%C3%A9carloshidalgo/", icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.14 0-2.063.924-2.063 2.065 0 1.14.923 2.065 2.063 2.065 1.14 0 2.063-.924 2.063-2.065 0-1.14-.923-2.065-2.063-2.065zM6.119 20.452H3.555V9h2.564v11.452zM22.225 0H1.771C.791 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
  )},
  { label: "Instagram", href: "https://www.instagram.com/jokhid/", icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
  )},
  { label: "Facebook", href: "https://www.facebook.com/josecarlos.hidalgoortega/", icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
  )},
  { label: "WhatsApp", href: "https://wa.me/34647506040?text=Quiero%20el%20diagn%C3%B3stico", icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
  )},
];

function Footer() {
  return (
    <footer className="bg-[#1A1A1A] py-24 text-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-16">
          <div className="flex items-center gap-4 text-center md:text-left">
            <img src="/logo-white.png" alt="Logo" loading="lazy" className="h-10 w-10 object-contain" />
            <div className="space-y-2">
              <div className="text-2xl font-black tracking-tighter uppercase">José Carlos Hidalgo</div>
              <p className="text-gray-500 text-xs tracking-widest uppercase">Hipotecas y planificación patrimonial</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            {socialLinks.map((s) => (
              <motion.a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -2 }}
                transition={spring}
                className="text-white/70 hover:text-[var(--jch-accent-ink)] transition-colors"
                aria-label={s.label}
              >
                {s.icon}
              </motion.a>
            ))}
          </div>
        </div>
        <div className="mt-20 pt-10 border-t border-white/5 flex flex-col items-center gap-4">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[12px] text-gray-400">
            <a href="/terminos.html" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--jch-accent-ink)] transition-colors">Términos y condiciones</a>
            <span aria-hidden="true">·</span>
            <a href="/privacidad.html" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--jch-accent-ink)] transition-colors">Política de privacidad</a>
            <span aria-hidden="true">·</span>
            <a href="https://share.google/GlqwXv7lO958pDPDS" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--jch-accent-ink)] transition-colors">Ver en Google Maps</a>
          </div>
          <div className="text-center text-[10px] text-gray-600 uppercase tracking-widest">
            © {new Date().getFullYear()} JOSÉ CARLOS HIDALGO. TODOS LOS DERECHOS RESERVADOS.
          </div>
        </div>
      </div>
    </footer>
  );
}

function Field({
  label,
  type,
  placeholder,
  value,
  onChange,
  required,
}: {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</label>
      <input
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
