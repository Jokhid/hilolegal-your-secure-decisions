import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { AnimatePresence, motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ThemeToggle } from "@/components/ThemeToggle";
import { submitContact } from "@/lib/contact.functions";
import { trackEvent } from "@/lib/analytics";
import { blogPosts } from "@/lib/blogPosts";
import { useDialogA11y } from "@/lib/useDialogA11y";
const banner3Asset = { url: "/9.webp" };

export const Route = createFileRoute("/veronica")({
  head: () => {
    const VERONICA_DESCRIPTION = "Abogada con experiencia en alta dirección pública, docencia universitaria y ejercicio privado. Derecho civil, administrativo, familia y comunidades.";
    const VERONICA_TELEPHONE = "+34" + PHONE_DISPLAY.replace(/\s/g, "");
    return {
    meta: [
      { title: "Verónica López Ramón | Abogada en Altea, Alicante" },
      { name: "description", content: VERONICA_DESCRIPTION },
      { property: "og:title", content: "Verónica López Ramón | Abogada en Altea, Alicante" },
      { property: "og:description", content: VERONICA_DESCRIPTION },
      { property: "og:url", content: "https://www.hilolegal.es/veronica" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:site_name", content: "HiloLegal" },
      { property: "og:image", content: "https://www.hilolegal.es/VERODERECHA.webp" },
      { property: "og:image:width", content: "1672" },
      { property: "og:image:height", content: "941" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Verónica López Ramón | Abogada en Altea, Alicante" },
      { name: "twitter:description", content: VERONICA_DESCRIPTION },
      { name: "twitter:image", content: "https://www.hilolegal.es/VERODERECHA.webp" },
    ],
    links: [
      { rel: "canonical", href: "https://www.hilolegal.es/veronica" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=account_balance,arrow_forward,balance,call,expand_more,gavel,home,location_on,mail,psychology,school,shield,workspace_premium&display=swap",
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
              name: "Verónica López Ramón",
              jobTitle: "Abogada",
              url: "https://www.hilolegal.es/veronica",
              telephone: VERONICA_TELEPHONE,
              email: EMAIL,
              // No se ha encontrado ningún perfil de LinkedIn/Instagram/Facebook
              // propio de Verónica en el repositorio — solo se enlaza la ficha
              // de Google del despacho (mismo enlace que ya usa José Carlos)
              // en vez de inventar perfiles.
              sameAs: ["https://share.google/GlqwXv7lO958pDPDS"],
              worksFor: {
                "@type": "Organization",
                name: "HiloLegal",
                url: "https://www.hilolegal.es",
              },
              knowsAbout: services.map((s) => s.title),
            },
            {
              "@type": "LegalService",
              name: "Verónica López — Abogada",
              url: "https://www.hilolegal.es/veronica",
              telephone: VERONICA_TELEPHONE,
              email: EMAIL,
              description: VERONICA_DESCRIPTION,
              address: {
                "@type": "PostalAddress",
                streetAddress: "Calle Regata 3, 1º E",
                addressLocality: "Altea",
                postalCode: "03590",
                addressRegion: "Alicante",
                addressCountry: "ES",
              },
              areaServed: [
                { "@type": "City", name: "Altea" },
                { "@type": "City", name: "Benidorm" },
                { "@type": "City", name: "Alicante" },
                { "@type": "AdministrativeArea", name: "Marina Baixa" },
                { "@type": "AdministrativeArea", name: "Costa Blanca" },
              ],
              makesOffer: services.map((s) => ({
                "@type": "Offer",
                itemOffered: { "@type": "Service", name: s.title },
              })),
              review: testimonials.map((t) => ({
                "@type": "Review",
                author: { "@type": "Person", name: t.name },
                reviewRating: { "@type": "Rating", ratingValue: t.rating, bestRating: 5 },
                reviewBody: t.text,
              })),
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length,
                reviewCount: testimonials.length,
                bestRating: 5,
              },
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.hilolegal.es/" },
                { "@type": "ListItem", position: 2, name: "Verónica López", item: "https://www.hilolegal.es/veronica" },
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
    };
  },
  component: Index,
});

const EMAIL = "veronicalopez@hilolegal.es";
const PHONE_DISPLAY = "647 50 60 40";
const WHATSAPP = "https://wa.me/34647506040";

// Photos in /public — use the optimized .webp versions (the .png originals
// are 1-3MB each; the .webp copies are already generated and 10-20x lighter)
const IMG = (n: number) => `/veronica-assets/${n}.webp`;

const Icon = ({ name, className = "" }: { name: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

const services = [
  { icon: "account_balance", title: "Derecho administrativo y relaciones con la Administración", text: "¿Te enfrentas a una sanción, un recurso o un expediente con la Administración? Lo analizamos con el mismo criterio con el que se instruyen los expedientes desde dentro.\n\n\nLa Administración Pública se rige por tiempos, lógicas internas y criterios normativos específicos. Limitarse a leer el boletín oficial es insuficiente cuando afrontas una sanción, un recurso o una relación contractual con un organismo público.\n\n\nHe trabajado desde dentro de la Administración y conozco cómo se instruyen los expedientes y cómo interpretan los técnicos la normativa. Esa experiencia institucional permite entender aspectos prácticos del procedimiento que difícilmente se adquieren únicamente desde el estudio teórico." },
  { icon: "gavel", title: "Derecho civil y de familia", text: "¿Necesitas resolver una herencia, un divorcio o un contrato con seguridad jurídica? Analizamos tu caso con honestidad sobre qué es realmente viable.\n\n\nLas decisiones personales más relevantes conllevan una dimensión jurídica inevitable. Una herencia sin planificar, un proceso de divorcio carente de estrategia o un contrato redactado con premura generan conflictos que se arrastran durante años.\n\n\nTrabajo con rigor técnico y honestidad sobre las opciones reales de éxito. Recibirás un análisis claro de tu situación y, si decides seguir adelante, representación completa en el proceso." },
  { icon: "home", title: "Inmobiliario y comunidades", text: "¿Vas a comprar, vender o alquilar un inmueble? Revisamos la operación con la misma auditoría legal que usamos para proteger comunidades de propietarios.\n\n\nLa compra, venta o arrendamiento de un inmueble exige certezas jurídicas para proteger el capital invertido.\n\n\nTrabajamos en coordinación directa con el área de administración de fincas de HiloLegal, ofreciendo una solución que cubre desde la auditoría legal previa de la propiedad hasta la reclamación judicial por impagos, manteniendo un único interlocutor estratégico." },
  { icon: "balance", title: "Derecho penal", text: "¿Te enfrentas a un procedimiento penal? Ofrecemos defensa técnica desde la primera declaración, con transparencia sobre las expectativas reales del caso.\n\n\nUn procedimiento penal es el escenario más exigente para la reputación y viabilidad de una empresa o un particular: exige una defensa técnica sin fisuras, una estrategia clara desde la primera declaración y un acompañamiento que anticipe los movimientos de la acusación.\n\n\nOfrezco asistencia letrada sin promesas que no se puedan cumplir." },
  { icon: "psychology", title: "Consultoría jurídica especializada", text: "¿Tu empresa licita con el sector público o actúa en un mercado regulado? Detectamos el riesgo antes de que se convierta en sanción o litigio.\n\n\nLas empresas que licitan con el sector público o actúan en mercados regulados necesitan identificar las contingencias jurídicas antes de que se consoliden. El riesgo en el entorno público rara vez reside en el texto estricto de la ley: se encuentra en los criterios de aplicación de la propia Administración.\n\n\nHaber ocupado puestos de alta dirección en la Administración autonómica me permite detectar las vulnerabilidades que pasan desapercibidas desde el exterior de la institución. Informes, dictámenes y orientación estratégica en asuntos que requieren experiencia técnica, criterio jurídico y visión institucional." },
  { icon: "shield", title: "Estrategia jurídica preventiva", text: "¿Quieres anticiparte a un conflicto antes de que ocurra? Análisis previo de riesgos, revisión documental, preparación de actuaciones y diseño de estrategias antes de tomar decisiones relevantes." },
];

const method = [
  { n: "01.", title: "Diagnóstico inicial", text: "Se estudian los hechos, la documentación, los antecedentes, los plazos y los objetivos reales del cliente." },
  { n: "02.", title: "Valoración jurídica", text: "Se analizan las alternativas posibles, los puntos fuertes, los riesgos y las consecuencias prácticas de cada vía." },
  { n: "03.", title: "Hoja de ruta", text: "Se define una estrategia clara, con actuaciones concretas, prioridades y seguimiento profesional del asunto." },
];

const faqs = [
  { q: "¿Qué tipo de asuntos lleva Verónica López?", a: "Asuntos jurídicos que requieren análisis, estrategia y criterio profesional, especialmente en el ámbito administrativo, civil, institucional y de asesoramiento preventivo." },
  { q: "¿Trabaja con particulares, empresas e instituciones?", a: "Sí. El asesoramiento puede dirigirse a particulares, profesionales, empresas, entidades e instituciones que necesiten orientación jurídica especializada." },
  { q: "¿La primera consulta es gratuita?", a: "Sí, es gratuita. En esa primera consulta revisamos los hechos, los plazos y tus objetivos, y te decimos con claridad si podemos ayudarte y cómo." },
  { q: "¿Atiende en Alicante?", a: "Atiende en Alicante y también puede realizar consultas online cuando el asunto lo permita." },
  { q: "¿Qué diferencia este despacho?", a: "La combinación de experiencia jurídica, trayectoria institucional y visión académica. Esa perspectiva permite analizar cada asunto con profundidad y diseñar estrategias realistas." },
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

function Index() {
  return (
    <div className="veronica-original bg-[#0a0a0a] text-[#F3F0EA] selection:bg-[#C5A566] selection:text-black">
      <SmoothScroll />
      <Header />

      <main>
        <Hero />
        <TrustStats />
        <Diagnosis />
        <Differentiation />
        <Services />
        <Method />
        <About />
        <HiloLegal />
        <Testimonials />
        <ContenidoAutoridad />
        <FAQ />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const reduce = useReducedMotion();
  const drawerRef = useRef<HTMLElement>(null);
  const navLinks: [string, string][] = [
    ["Áreas", "#services"],
    ["Método", "#method"],
    ["Sobre mí", "#about"],
    ["FAQ", "#faq"],
    ["Contacto", "#contact"],
  ];

  useDialogA11y(mobileOpen, () => setMobileOpen(false), drawerRef);

  return (
    <>
      <motion.header
        initial={reduce ? false : { y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ...spring, delay: 0.1 }}
        className="sticky top-0 w-full z-50 bg-white backdrop-blur-xl border-b border-[#E5E5E5]"
      >
        <nav className="flex justify-between items-center w-full px-6 py-5 max-w-[1200px] mx-auto">
          <Link className="flex items-center gap-3 group" to="/">
            <motion.img
              src="/hilolegal-logo-stacked-black.webp"
              alt="Logo HiloLegal"
              className="h-12 w-auto object-contain"
              whileHover={{ rotate: -2, scale: 1.05 }}
              transition={spring}
            />
            <span className="text-base md:text-lg font-bold tracking-tight text-[#C5A566]">
              Verónica López
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map(([l, h]) => (
              <a
                key={h}
                className="relative text-sm font-medium text-[#1A1A1A] group"
                href={h}
              >
                <span className="transition-colors group-hover:text-[var(--jch-accent-ink)]">{l}</span>
                <span className="absolute left-0 -bottom-1 h-[1px] w-full origin-left scale-x-0 bg-[#C5A566] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle className="hidden sm:inline-flex" />
            <Link to="/" className="header-back-link hidden md:inline-block">
              ← Volver al inicio
            </Link>
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={spring}
              className="header-whatsapp-btn hidden sm:inline-block rounded-full bg-[#1f6f78] text-white px-8 py-[1.1rem] text-xs font-medium uppercase tracking-[0.14em] hover:bg-[#17535a] transition-colors"
              href={WHATSAPP}
            >
              WhatsApp
            </motion.a>
            <button
              type="button"
              aria-label="Abrir menú"
              onClick={() => setMobileOpen((v) => !v)}
              className="-mr-2 p-2 text-2xl text-[var(--jch-accent-ink)] md:hidden"
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
            className="fixed right-0 top-0 z-[9999] h-[100dvh] w-[min(88vw,420px)] border-l border-[#E5E5E5] bg-white/95 backdrop-blur-xl outline-none md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
          >
            <div className="flex h-full flex-col gap-4 p-8">
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="self-end text-3xl text-[var(--jch-accent-ink)]"
                aria-label="Cerrar menú"
              >
                ×
              </button>
              <div className="mt-8 flex flex-col gap-2">
                {navLinks.map(([l, h]) => (
                  <a
                    key={h}
                    href={h}
                    onClick={() => setMobileOpen(false)}
                    className="block py-3 text-lg font-medium text-[#1A1A1A] transition-colors hover:text-[var(--jch-accent-ink)]"
                  >
                    {l}
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

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  return (
    <section ref={ref} className="hero-bg-section">
      <motion.img
        style={{ scale: imgScale }}
        alt="Verónica López, abogada"
        className="hero-bg-image veronica-hero-image"
        src="/VERODERECHA.webp"
        loading="eager"
        decoding="async"
        fetchPriority="high"
      />
      <div className="hero-bg-overlay" aria-hidden="true" />
      <div className="mx-auto px-6">
        <motion.div style={{ y: textY }} className="space-y-10">
          <FadeUp>
            <div className="inline-flex items-center gap-3 text-[var(--jch-accent-ink)] font-bold text-xs uppercase tracking-widest">
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: 32 }}
                transition={{ duration: 0.9, ease: easeOutExpo, delay: 0.4 }}
                className="h-[2px] bg-[#C5A566] block"
              />
              ABOGADA EN ALTEA · BENIDORM · COSTABLANCA
            </div>
          </FadeUp>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.02] tracking-tight text-balance">
            <WordReveal eager block delay={0.1} className="veronica-hero-ochre" text="Derecho con criterio." />
            <span className="block">
              <WordReveal eager delay={0.235} className="veronica-hero-ochre jch-italic" text="La experiencia" />{" "}
              <WordReveal eager delay={0.235} text="desde dentro." />
            </span>
          </h1>

          <FadeUp delay={0.6}>
            <p className="text-xl text-white/70 max-w-xl leading-relaxed">
              Abogada en ejercicio con trayectoria en puestos de alta dirección en la Administración Pública de la Comunidad Valenciana y profesora asociada de Derecho en la Universidad de Alicante.{"\u00a0"}Conozco la ley porque la enseño, la aplico y he ayudado a redactarla desde la propia institución.
            </p>
          </FadeUp>

          <FadeUp delay={0.75}>
            <div className="flex flex-wrap justify-center gap-6 pt-2">
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={spring}
                className="rounded-full bg-[#1f6f78] text-white px-10 py-5 font-bold uppercase text-xs tracking-widest hover:bg-[#17535a] transition-colors shadow-xl shadow-[#1f6f78]/20"
                href="#contact"
              >
                Primera consulta
              </motion.a>
            </div>
          </FadeUp>
        </motion.div>
      </div>
    </section>
  );
}

function TrustStats() {
  const items = [
    { i: "workspace_premium", t: "20 AÑOS DE EJERCICIO PROFESIONAL" },
    { i: "account_balance", t: "Alta dirección pública" },
    { i: "school", t: "Docencia en la Facultad de Derecho" },
  ];
  return (
    <section className="py-16 border-b border-[var(--jch-line)]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:divide-x divide-[var(--jch-line)]">
          {items.map((s, idx) => (
            <FadeUp key={s.i} delay={idx * 0.1} className={idx === 0 ? "" : "md:pl-12"}>
              <div className="flex flex-col items-center md:items-start gap-4">
                <Icon name={s.i} className="text-[var(--jch-accent-ink)] text-4xl" />
                <p className="text-sm font-bold uppercase tracking-wider text-center md:text-left">{s.t}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

function Diagnosis() {
  const items = [
    { n: "01", t: "Trayectoria consolidada", d: "20 años de ejercicio profesional en asesoramiento jurídico, defensa de intereses y análisis de asuntos complejos.", img: 3 },
    { n: "02", t: "Criterio institucional", d: "Experiencia en alta dirección dentro de la administración local y autonómica, con conocimiento real del funcionamiento institucional.", img: 2 },
    { n: "03", t: "Visión académica", d: "Profesora en la Facultad de Derecho de Alicante, con una visión técnica, académica y práctica del Derecho.", img: 4 },
  ];
  return (
    <section className="py-[100px]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="mb-24 space-y-6 max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-balance">
            <Curtain>Experiencia jurídica, criterio institucional y <span className="jch-accent jch-italic">visión práctica</span></Curtain>
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: easeOutExpo }}
            className="w-20 h-2 bg-[#C5A566] origin-left"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {items.map((x, idx) => (
            <FadeUp key={x.n} delay={idx * 0.1}>
              <article className="space-y-6 group">
                <div className="relative overflow-hidden aspect-square">
                  <motion.img
                    src={IMG(x.img)}
                    alt={x.t}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover"
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.06 }}
                    transition={{ duration: 1.2, ease: easeOutExpo }}
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <div className="text-[var(--jch-accent-ink)] font-black text-2xl">{x.n}</div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold">{x.t}</h3>
                <p className="text-[var(--jch-muted)] leading-relaxed">{x.d}</p>
              </article>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

function Differentiation() {
  return (
    <section className="py-[100px] bg-[#1A1A1A] text-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          <div className="lg:sticky lg:top-32 space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-balance">
              <Curtain>La experiencia de haber aplicado la ley desde ambos lados{"\u00a0"}cambia la forma de ejercerla.</Curtain>
            </h2>
          </div>
          <FadeUp delay={0.1}>
            <div className="space-y-8 text-xl text-gray-300 leading-relaxed">
              <p>
                Mi trayectoria combina ejercicio jurídico, docencia universitaria y
                responsabilidades de alta dirección en la Administración Pública. Esa experiencia
                me ha permitido conocer el Derecho desde perspectivas distintas: la defensa
                profesional, la gestión pública, la elaboración y aplicación normativa y el
                funcionamiento interno de las instituciones.
              </p>
              <p>
                Conozco cómo se tramitan los procedimientos, cómo se construyen las decisiones
                administrativas y qué aspectos pueden resultar determinantes cuando un asunto
                entra en contacto con la Administración o llega a los tribunales. Ese conocimiento
                institucional forma parte hoy de mi manera de ejercer: analizar el contexto
                completo, anticipar escenarios y definir la estrategia jurídica más adecuada para
                cada caso.
              </p>
              <p className="border-l-4 border-[#C5A566] pl-6 text-2xl font-bold text-white">
                La experiencia desde dentro cambia la forma de ejercer el Derecho.
              </p>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

function Services() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="services" className="py-[100px]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="mb-24 space-y-6 max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            <Curtain>Áreas de <span className="jch-accent jch-italic">asesoramiento</span> jurídico</Curtain>
          </h2>
          <FadeUp delay={0.15}>
            <p className="text-xl text-[var(--jch-muted)] max-w-2xl">Un enfoque integral que combina derecho administrativo, civil, familia, penal e institucional con una visión estratégica y preventiva.</p>
          </FadeUp>
        </div>
        <div className="divide-y divide-[var(--jch-line)] border-t border-b border-[var(--jch-line)]">
          {services.map((s, idx) => {
            const paragraphs = s.text.split(/\n\s*\n\s*\n/).map((p) => p.trim()).filter(Boolean);
            const [intro, ...rest] = paragraphs;
            const isOpen = open === idx;
            const panelId = `service-panel-${idx}`;
            const buttonId = `service-button-${idx}`;
            return (
              <FadeUp key={s.title} delay={(idx % 2) * 0.05}>
                <div className="py-10 md:py-12">
                  <div className="flex items-start gap-6">
                    <Icon name={s.icon} className="text-[var(--jch-accent-ink)] text-3xl shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                      <p className="text-[var(--jch-muted)] leading-relaxed">{intro}</p>
                      {rest.length > 0 && (
                        <>
                          <button
                            type="button"
                            id={buttonId}
                            aria-expanded={isOpen}
                            aria-controls={panelId}
                            onClick={() => setOpen(isOpen ? null : idx)}
                            className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[var(--jch-cta)] hover:text-[var(--jch-ink)] transition-colors"
                          >
                            {isOpen ? "Leer menos" : "Leer más"}
                            <Icon name="expand_more" className={`text-base transition-transform ${isOpen ? "rotate-180" : ""}`} />
                          </button>
                          <div
                            id={panelId}
                            role="region"
                            aria-labelledby={buttonId}
                            hidden={!isOpen}
                            className="mt-4 space-y-4 text-[var(--jch-muted)] leading-relaxed"
                          >
                            {rest.map((p, i) => (
                              <p key={i}>{p}</p>
                            ))}
                          </div>
                        </>
                      )}
                      <a
                        className="mt-6 inline-flex items-center gap-2 text-[15px] font-black uppercase tracking-widest text-[var(--jch-cta)] hover:text-[var(--jch-ink)] transition-colors"
                        href="#contact"
                        onClick={() => trackEvent("cta_legal", { section: "services", cta: s.title })}
                      >
                        Cuéntanos tu caso <Icon name="arrow_forward" className="text-base" />
                      </a>
                    </div>
                  </div>
                </div>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Method() {
  return (
    <section id="method" className="py-[100px]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-12">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
              <Curtain>Una forma de trabajar basada en <span className="jch-accent jch-italic">análisis, claridad y estrategia</span></Curtain>
            </h2>
            <div className="space-y-12">
              {method.map((m, idx) => (
                <FadeUp key={m.n} delay={idx * 0.1}>
                  <div className="flex gap-8">
                    <span className="text-3xl font-black text-[var(--jch-accent-ink)]">{m.n}</span>
                    <div>
                      <h3 className="text-xl font-bold mb-2 uppercase tracking-tight">{m.title}</h3>
                      <p className="text-[var(--jch-muted)] leading-relaxed">{m.text}</p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
          <FadeUp delay={0.1}>
            <div className="relative overflow-hidden aspect-square">
              <motion.img
                src={IMG(5)}
                alt="Método de trabajo jurídico"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ scale: 1.1 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, ease: easeOutExpo }}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white space-y-2">
                <Icon name="balance" className="text-white text-5xl" />
                <span className="block font-bold uppercase tracking-widest text-xs text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.55)]">Rigor y Estrategia</span>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="py-[100px]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
          <FadeUp className="lg:col-span-5">
            <div className="relative group">
              <motion.div
                initial={{ x: 16, y: 16 }}
                whileInView={{ x: 16, y: 16 }}
                whileHover={{ x: 0, y: 0 }}
                transition={spring}
                className="absolute inset-0 border border-[#C5A566] -z-10"
              />
              <div className="relative overflow-hidden">
                <motion.img
                  alt="Verónica López"
                  className="w-full h-[320px] sm:h-[420px] lg:h-[600px] object-cover"
                  src={IMG(6)}
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
                <h2 className="text-5xl font-bold tracking-tight jch-accent jch-italic">Verónica López</h2>
                <p className="text-2xl font-medium text-[var(--jch-accent-ink)] italic">Conocer la norma importa. Saber aplicarla con estrategia marca la diferencia.</p>
              </div>
            </FadeUp>
            <FadeUp delay={0.1}>
              <div className="space-y-6 text-xl text-[var(--jch-muted)] leading-relaxed">
                <p>Abogada con más de 20 años de experiencia y una trayectoria marcada por el rigor jurídico, la responsabilidad institucional y la vocación docente.</p>
                <p>He ocupado puestos de alta dirección en la administración local y autonómica, lo que me permite conocer desde dentro el funcionamiento de las instituciones públicas y los procedimientos administrativos.</p>
                <p>Mi experiencia como profesora en la Facultad de Derecho de Alicante aporta una visión técnica y académica: análisis profundo, explicación clara y estrategia bien fundamentada.</p>
              </div>
            </FadeUp>
            <FadeUp delay={0.2}>
              <div className="flex flex-wrap gap-3 pt-2">
                {["Administrativo", "Civil", "Penal", "Institucional", "Empresas"].map((t) => (
                  <motion.span
                    key={t}
                    whileHover={{ y: -2, backgroundColor: "#C5A566", color: "#0a0a0a" }}
                    transition={spring}
                    className="border border-[var(--jch-line-strong)] px-6 py-2 text-xs font-bold uppercase tracking-widest cursor-default"
                  >
                    {t}
                  </motion.span>
                ))}
              </div>
            </FadeUp>
            <FadeUp delay={0.3}>
              <div className="flex items-center gap-4 text-[var(--jch-ink)] font-bold">
                <Icon name="location_on" className="text-[var(--jch-accent-ink)]" />
                <span className="text-sm uppercase tracking-widest">Altea · Costa Blanca · Alicante</span>
              </div>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}

function HiloLegal() {
  return (
    <section className="py-[100px]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <FadeUp>
            <div className="space-y-8">
              <span className="text-[var(--jch-accent-ink)] font-bold text-xs uppercase tracking-widest">PARTE DE HILOLEGAL</span>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                <Curtain>Una firma, dos especialistas</Curtain>
              </h2>
              <div className="space-y-6 text-xl text-[var(--jch-muted)] leading-relaxed">
                <p>Soy cofundadora de HiloLegal junto a José Carlos Hidalgo, consultor patrimonial e hipotecario. Unificamos el criterio jurídico y el financiero. Si un caso presenta ambas vertientes, trabajamos de forma coordinada bajo una sola firma, evitando que tengas que duplicar explicaciones con distintos profesionales.</p>
                <p>Una firma, dos especialistas, sin que tengas que empezar desde cero con cada uno.</p>
              </div>
              <motion.a
                href="/josecarlos"
                whileHover={{ x: 4 }}
                transition={spring}
                className="inline-flex items-center gap-2 text-[15px] font-black uppercase tracking-widest text-[var(--jch-cta)] hover:text-[var(--jch-ink)] transition-colors"
              >
                Conocer a José Carlos <Icon name="arrow_forward" className="text-base" />
              </motion.a>
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <div className="relative overflow-hidden aspect-[4/3]">
              <motion.img
                src={banner3Asset.url}
                alt="HiloLegal"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ scale: 1.1 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, ease: easeOutExpo }}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white space-y-2">
                <Link to="/" className="font-bold uppercase tracking-widest text-xs hover:text-[var(--jch-accent-ink)] transition-colors">HiloLegal</Link>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

// Reseñas reales de Google (My Business), pasadas directamente por el
// cliente — no generadas ni parafraseadas. La primera está en valenciano,
// tal como la dejó quien la escribió.
const testimonials = [
  {
    name: "Cristian Llopis",
    rating: 5,
    text: "Vaig contactar amb ella arran d'un accident de trànsit amb un vehicle d'empresa. Des del primer moment, el tracte va ser molt proper. Ens va atendre ràpidament i de seguida ens va explicar com havíem de procedir davant la situació plantejada. Verònica ha estat molt professional, sempre atenta i disposada a explicar tot el procés, tant per telèfon com en persona, així com a gestionar el tràmit i la resolució del cas.",
  },
  {
    name: "SRG",
    rating: 5,
    text: "Muy contenta con el trato recibido y del resultado de su trabajo. La defensa que hizo Verónica en mi caso fue increíble. Gracias por todo.",
  },
];

function Testimonials() {
  return (
    <section id="testimonios" className="py-[100px] border-t border-[var(--jch-line)]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="mb-20 max-w-3xl space-y-4">
          <span className="text-[var(--jch-accent-ink)] font-bold text-xs uppercase tracking-widest">Reseñas verificadas en Google</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            <Curtain><span className="jch-accent jch-italic">Lo que dicen</span> quienes ya han <span className="whitespace-nowrap">trabajado conmigo</span></Curtain>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t, i) => (
            <FadeUp key={t.name} delay={i * 0.1}>
              <article className="relative h-full border border-[var(--jch-line)] p-10 hover:border-[#C5A566] transition-colors">
                <div className="flex gap-1 mb-6" aria-label={`${t.rating} de 5 estrellas`}>
                  {Array.from({ length: t.rating }).map((_, idx) => (
                    <span key={idx} aria-hidden="true" className="text-[var(--jch-accent-ink)]">★</span>
                  ))}
                </div>
                <p className="text-[var(--jch-muted)] leading-relaxed">{t.text}</p>
                <div className="mt-8 pt-6 border-t border-[var(--jch-line)]">
                  <p className="font-bold text-[var(--jch-ink)]">{t.name}</p>
                  <p className="text-xs text-[var(--jch-dim)] mt-1">Reseña de Google</p>
                </div>
              </article>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

const articulosDestacados = [
  "separacion-o-divorcio-diferencias",
  "custodia-compartida-que-valora-un-juez",
  "herencia-entre-hermanos-sin-acuerdo",
  "desahucios-cuanto-tarda-y-errores",
  "cancelacion-antecedentes-penales",
  "reclamar-indemnizacion-por-danos",
];

function ContenidoAutoridad() {
  const posts = articulosDestacados
    .map((slug) => blogPosts.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  if (posts.length === 0) return null;

  return (
    <section className="content-block py-[100px] border-t border-[var(--jch-line)]">
      <div className="content-block__inner">
        <div className="content-block__heading">
          <h2>
            <Curtain>Artículos para <span className="jch-accent jch-italic">entender antes</span> de decidir</Curtain>
          </h2>
          <FadeUp delay={0.1}>
            <p>Contenido propio sobre familia, herencias, arrendamientos, penal y civil.</p>
          </FadeUp>
        </div>
        <div className="content-block__grid">
          {posts.map((post, idx) => (
            <FadeUp key={post.slug} delay={idx * 0.06}>
              <Link
                to="/blog/$slug"
                params={{ slug: post.slug }}
                className="content-card"
                onClick={() => trackEvent("blog_article_click", { slug: post.slug })}
              >
                <span className="content-card__category">{post.category}</span>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
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
    <section id="faq" className="py-[100px]">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-4xl font-bold tracking-tight text-center mb-20 uppercase">
          <Curtain>Preguntas Frecuentes</Curtain>
        </h2>
        <div className="space-y-px jch-divider">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <FadeUp key={f.q} delay={i * 0.05}>
                <div className="jch-surface-block">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex justify-between items-center text-left p-8 text-lg font-bold uppercase tracking-tight"
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

function Contact() {
  const submit = useServerFn(submitContact);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    topic: "Consulta jurídica general",
    message: "",
  });

  const startedRef = useRef(false);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const formLoadedAtRef = useRef(Date.now());
  const onChange = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
          website: honeypotRef.current?.value ?? "",
          formLoadedAt: formLoadedAtRef.current,
        },
      });
      setStatus("ok");
      trackEvent("contact_submit");
      setForm({ name: "", phone: "", email: "", topic: "Consulta jurídica general", message: "" });
      setAccepted(false);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "No se ha podido enviar el formulario.");
    }
  }

  return (
    <section id="contact" className="py-[100px]">
      <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24">
        <div className="space-y-12">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight">
            <Curtain><span className="jch-accent jch-italic">Hablemos</span> de tu asunto</Curtain>
          </h2>
          <FadeUp delay={0.1}>
            <p className="text-xl text-[var(--jch-muted)] leading-relaxed">
              Si necesitas asesoramiento jurídico, rellena el formulario y explica brevemente tu situación. Revisaremos la información inicial y contactaremos contigo para valorar los siguientes pasos.
            </p>
          </FadeUp>
          <div className="space-y-10 pt-10 border-t border-[var(--jch-line)]">
            {[
              { i: "call", label: "Teléfono", v: PHONE_DISPLAY, href: `tel:+34${PHONE_DISPLAY.replace(/\s/g, "")}` },
              { i: "mail", label: "Email", v: EMAIL, href: `mailto:${EMAIL}` },
            ].map((c, idx) => (
              <FadeUp key={c.i} delay={idx * 0.1}>
                <motion.a
                  href={c.href}
                  whileHover={{ x: 4 }}
                  transition={spring}
                  className="flex items-center gap-8 group"
                >
                  <div className="w-16 h-16 jch-surface-block flex items-center justify-center text-[var(--jch-ink)] group-hover:bg-[#C5A566] transition-colors">
                    <Icon name={c.i} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest opacity-50 mb-1">{c.label}</p>
                    <p className="text-2xl font-bold break-all">{c.v}</p>
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
          <form className="space-y-10" onSubmit={onSubmit}>
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
              <label className="text-[10px] font-black uppercase tracking-[0.2em]">Tipo de asunto</label>
              <select
                value={form.topic}
                onChange={onChange("topic")}
                className="w-full bg-transparent border-0 border-b border-[var(--jch-line-strong)] px-0 py-4 focus:ring-0 focus:border-[#C5A566] transition-colors outline-none"
              >
                <option>Consulta jurídica general</option>
                <option>Derecho administrativo</option>
                <option>Derecho civil</option>
                <option>Asesoramiento a empresas</option>
                <option>Consultoría jurídica institucional</option>
                <option>Otro asunto</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em]">Mensaje (opcional)</label>
              <textarea
                rows={4}
                placeholder="Explica brevemente tu situación"
                value={form.message}
                onChange={onChange("message")}
                className="w-full bg-transparent border-0 border-b border-[var(--jch-line-strong)] px-0 py-4 focus:ring-0 focus:border-[#C5A566] transition-colors outline-none placeholder:text-[var(--jch-dim)]"
              />
            </div>

            <label className="flex items-start gap-3 text-sm text-[var(--jch-muted)] cursor-pointer">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                required
                className="mt-1 w-4 h-4 shrink-0"
                style={{ accentColor: "#C5A566" }}
              />
              <span>
                He leído y acepto la{" "}
                <a
                  href="/privacidad.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-[var(--jch-ink)]"
                >
                  política de privacidad
                </a>
                .
              </span>
            </label>

            <motion.button
              type="submit"
              disabled={status === "sending"}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={spring}
              style={{ color: "#ffffff" }}
              className="rounded-full inline-block text-center w-full bg-[#1f6f78] py-6 font-black uppercase text-xs tracking-[0.3em] hover:bg-[#17535a] transition-colors shadow-2xl shadow-[#1f6f78]/20 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === "sending" ? "Enviando…" : "Enviar consulta"}
            </motion.button>


            {status === "ok" && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-[var(--jch-ink)] font-bold uppercase tracking-widest"
              >
                Gracias. Hemos recibido tu consulta y contactaremos contigo a la mayor brevedad.
              </motion.p>
            )}
            {status === "error" && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-400"
              >
                {errorMsg || "Algo ha ido mal. Inténtalo de nuevo en unos minutos."}
              </motion.p>
            )}
          </form>
        </FadeUp>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#1A1A1A] py-24 text-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-16">
          <div className="flex items-center gap-4 text-center md:text-left">
            <img src="/hilolegal-logo-white.webp" alt="Logo HiloLegal" loading="lazy" className="h-9 w-auto object-contain" />
            <div className="space-y-2">
              <div className="text-2xl font-black tracking-tighter uppercase">Verónica López</div>
              <p className="text-gray-500 text-xs tracking-widest uppercase">Abogada · Administrativo · Civil · Institucional</p>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-10">
            {[
              { l: "Privacidad", href: "/privacidad.html" },
              { l: "Términos", href: "/terminos.html" },
            ].map(({ l, href }) => (
              <a key={l} className="relative text-[10px] font-bold uppercase tracking-[0.2em] group" href={href} target="_blank" rel="noopener noreferrer">
                <span className="transition-colors group-hover:text-[var(--jch-accent-ink)]">{l}</span>
                <span className="absolute left-0 -bottom-1 h-[1px] w-full origin-left scale-x-0 bg-[#C5A566] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
              </a>
            ))}
          </div>
        </div>
        <div className="mt-20 pt-10 border-t border-white/5 text-center text-[10px] text-gray-600 uppercase tracking-widest">
          © {new Date().getFullYear()} VERÓNICA LÓPEZ. TODOS LOS DERECHOS RESERVADOS.
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
        className="w-full bg-transparent border-0 border-b border-[var(--jch-line-strong)] px-0 py-4 focus:ring-0 focus:border-[#C5A566] transition-colors outline-none placeholder:text-[var(--jch-dim)]"
      />
    </div>
  );
}
