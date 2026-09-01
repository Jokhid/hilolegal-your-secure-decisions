import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

import { SmoothScroll } from "@/components/SmoothScroll";
import { ThemeToggle } from "@/components/ThemeToggle";
import { submitContact } from "@/lib/contact.functions";
import { blogPosts, topicOf } from "@/lib/blogPosts";
import { trackEvent } from "@/lib/analytics";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HiloLegal | Boutique legal y patrimonial en Altea - Costa Blanca" },
      {
        name: "description",
        content:
          "Abogacía, planificación financiera, hipotecas, seguros y administración de fincas en Altea - Costa Blanca. Diagnóstico patrimonial con criterio legal y financiero.",
      },
      { property: "og:title", content: "HiloLegal | Boutique legal y patrimonial en Altea - Costa Blanca" },
      {
        property: "og:description",
        content:
          "Criterio jurídico, visión patrimonial y experiencia financiera para proteger tu patrimonio y anticipar riesgos.",
      },
      { property: "og:url", content: "https://www.hilolegal.es/" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:site_name", content: "HiloLegal" },
      { property: "og:image", content: "https://www.hilolegal.es/fotoalteadespachohorizontal.webp" },
      { property: "og:image:width", content: "1536" },
      { property: "og:image:height", content: "1024" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "HiloLegal | Boutique legal y patrimonial en Altea - Costa Blanca" },
      {
        name: "twitter:description",
        content: "Criterio jurídico, visión patrimonial y experiencia financiera para proteger tu patrimonio.",
      },
      { name: "twitter:image", content: "https://www.hilolegal.es/fotoalteadespachohorizontal.webp" },
    ],
    links: [{ rel: "canonical", href: "https://www.hilolegal.es/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LegalService",
          name: "HiloLegal",
          description:
            "Boutique legal y patrimonial en Altea - Costa Blanca. Abogacía, planificación financiera, hipotecas, seguros y administración de fincas.",
          url: "https://www.hilolegal.es",
          telephone: "+34647506040",
          email: "info@hilolegal.es",
          // No hay perfiles sociales corporativos de "HiloLegal" en el
          // footer ni en ningún otro punto del repo (los de LinkedIn/
          // Instagram/Facebook que existen son personales de José Carlos,
          // en josecarlos.tsx) — solo se enlaza la ficha de Google del
          // despacho, ya usada en otras páginas, en vez de reutilizar
          // perfiles personales como si fueran corporativos.
          sameAs: ["https://share.google/GlqwXv7lO958pDPDS"],
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
          founder: [
            { "@type": "Person", name: "Verónica López" },
            { "@type": "Person", name: "José Carlos Hidalgo" },
          ],
          makesOffer: [
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Asesoramiento jurídico civil, familiar, penal y administrativo" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Planificación financiera y patrimonial" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Hipotecas y financiación de vivienda" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Administración de fincas y comunidades de propietarios" } },
          ],
        }),
      },
    ],
  }),
  component: Index,
});

const PHONE_DISPLAY = "647 50 60 40";
const PHONE_TEL = "+34647506040";
const EMAIL = "info@hilolegal.es";
const WHATSAPP = "https://wa.me/34647506040";

const easeOutExpo = [0.16, 1, 0.3, 1] as const;
const spring = { type: "spring" as const, stiffness: 90, damping: 20, mass: 0.9 };

/* ---------- Motion primitives ---------- */
function Curtain({
  children,
  className = "",
  delay = 0,
  eager = false,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  eager?: boolean;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  const trigger = eager ? { animate: "visible" as const } : { whileInView: "visible" as const, viewport: { once: true, amount: 0.3 } };
  return (
    <motion.span
      className={`relative inline-block overflow-hidden align-baseline ${className}`}
      initial="hidden"
      {...trigger}
    >
      <motion.span
        className="inline-block"
        variants={{
          hidden: { y: "100%" },
          visible: { y: "0%", transition: { duration: 1.05, ease: easeOutExpo, delay } },
        }}
      >
        {children}
      </motion.span>
    </motion.span>
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

function FadeUp({
  children,
  delay = 0,
  className = "",
  eager = false,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  eager?: boolean;
}) {
  const reduce = useReducedMotion();
  const trigger = eager
    ? { animate: { opacity: 1, y: 0 } }
    : { whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.25 } };
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      {...trigger}
      transition={{ ...spring, delay }}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Data ---------- */
const areas = [
  {
    n: "01",
    title: "Legal",
    kicker: "Defender lo que importa.",
    text: "Asesoramiento y defensa jurídica para particulares, familias y empresas.",
    tags: "Civil · Familia · Penal · Administrativo · Inmobiliario",
    cta: "Cuéntanos tu caso",
    href: "/veronica#services",
    art: "/legal.webp",
    artAlt: "Ilustración del área legal de HiloLegal",
    event: "nav_service_legal" as const,
  },
  {
    n: "02",
    title: "Hipotecas",
    kicker: "Comprar con seguridad.",
    text: "Estudiamos tu situación, analizamos la viabilidad y te acompañamos durante el proceso hipotecario.",
    tags: "Hipotecas ING y ABANCA",
    cta: "Estudiar mi hipoteca",
    href: "/josecarlos#financiar",
    art: "/hipotecas.webp",
    artAlt: "Ilustración del área de hipotecas de HiloLegal",
    event: "nav_service_mortgage" as const,
  },
  {
    n: "03",
    title: "Patrimonio",
    kicker: "Proteger hoy. Planificar mañana.",
    text: "Analizamos ingresos, ahorro, protección y objetivos para construir una estrategia financiera adaptada a tu vida.",
    tags: "Nationale-Nederlanden · Ahorro · Inversión · Pensiones",
    cta: "Analizar mi situación",
    href: "/josecarlos#planificar",
    art: "/patrimonial.webp",
    artAlt: "Ilustración del área patrimonial y financiera de HiloLegal",
    event: "nav_service_wealth" as const,
  },
  {
    n: "04",
    title: "Administración de fincas",
    kicker: "Tu comunidad, bien gestionada.",
    text: "Administración cercana, transparente y profesional.",
    tags: "Actas · Cuotas · Morosidad · Juntas de propietarios",
    cta: "Solicitar una propuesta",
    href: "/administracion-fincas",
    art: "/fincas.webp",
    artAlt: "Ilustración del área de administración de fincas de HiloLegal",
    event: "nav_service_property" as const,
  },
];

const methodSteps = [
  {
    n: "01",
    title: "Analizamos tu punto de partida",
    text: "Qué tienes, qué necesitas y qué te preocupa.",
  },
  {
    n: "02",
    title: "Detectamos riesgos y oportunidades",
    text: "Identificamos aquello que puede perjudicarte y aquello que puedes mejorar.",
  },
  {
    n: "03",
    title: "Diseñamos una estrategia",
    text: "Convertimos el análisis en decisiones concretas y comprensibles.",
  },
  {
    n: "04",
    title: "Te acompañamos",
    text: "Porque muchas decisiones importantes no terminan el día que firmas.",
  },
];

const professionals = [
  {
    img: "/vero_jurista.webp",
    name: "Verónica López",
    area: "Área jurídica",
    bio: "Más de 20 años combinando ejercicio jurídico, experiencia institucional y docencia universitaria. Derecho administrativo, civil, familia y estrategia jurídica preventiva.",
    cta: "Conocer a Verónica",
    href: "/veronica",
  },
  {
    img: "/9.webp",
    name: "José Carlos Hidalgo",
    area: "Área patrimonial e hipotecaria",
    bio: "Analiza financiación, protección y planificación patrimonial antes de hablar de productos. Hipotecas con ING y ABANCA; protección y ahorro con Nationale-Nederlanden.",
    cta: "Conocer a José Carlos",
    href: "/josecarlos",
  },
];

const tools = [
  {
    title: "Calculadora de ahorro potencial",
    text: "Calcula cuánto dinero se escapa en pequeños gastos recurrentes y visualiza tu ahorro anual recuperable.",
    cta: "Abrir calculadora",
    href: "/herramientas/ahorro-potencial/index.html",
    event: "tool_wealth_audit" as const,
  },
  {
    title: "Test de salud financiera",
    text: "Evalúa tu nivel de protección, ahorro, endeudamiento y previsión.",
    cta: "Hacer test",
    href: "/test-salud-financiera.html",
    event: "tool_financial_health" as const,
  },
];

/* ---------- Page ---------- */
function Index() {
  return (
    <div className="hilolegal-original">
      <SmoothScroll />
      <Header />

      <main>
        <Hero />
        <Areas />
        <Positioning />
        <Professionals />
        <Authority />
        <Method />
        <Tools />
        <Content />
        <Closing />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}

/* ---------- Header ---------- */
function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks: [string, string][] = [
    ["Servicios", "#areas"],
    ["Profesionales", "#equipo"],
    ["Herramientas", "#herramientas"],
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
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ...spring, delay: 0.1 }}
        className="sticky top-0 z-50 w-full border-b border-[#E5E5E5] bg-white backdrop-blur-xl"
      >
        <nav className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-6 py-5">
          <a href="/" className="group flex items-center gap-3">
            <motion.img
              src="/logo-black.svg"
              alt="Logo HiloLegal"
              className="h-9 w-9 object-contain"
              whileHover={{ rotate: -6, scale: 1.05 }}
              transition={spring}
            />
            <span className="text-base font-bold uppercase tracking-tight text-[#1A1A1A] md:text-lg">
              HiloLegal
            </span>
          </a>

          <div className="hidden items-center gap-10 md:flex">
            {navLinks.map(([label, href]) => (
              <a key={href} href={href} className="group relative text-sm font-medium text-[#1A1A1A]">
                <span className="transition-colors group-hover:text-[var(--jch-accent-ink)]">{label}</span>
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
              href="#contact"
              className="hidden rounded-full bg-[#1f6f78] px-8 py-[1.1rem] text-xs font-medium uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#17535a] sm:inline-block"
            >
              Cuéntanos qué necesitas
            </motion.a>
            <button
              type="button"
              aria-label="Abrir menú"
              onClick={() => setMobileOpen((v) => !v)}
              className="-mr-2 p-2 text-2xl text-[#C5A566] md:hidden"
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
            className="fixed right-0 top-0 z-[9999] h-[100dvh] w-[min(88vw,420px)] border-l border-[#E5E5E5] bg-white/95 backdrop-blur-xl md:hidden"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex h-full flex-col gap-4 p-8">
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

const THREAD_VB_W = 1600;
const THREAD_VB_H = 300;
// Every half-wave below is an identical 400-unit-wide S-curve (control
// points sit at the same y as their own endpoint, so the tangent is
// exactly flat at each anchor) — this guarantees the anchors ARE the
// curve's true crest/trough, and that every hump is geometrically
// identical. Two extra half-waves run off-screen (-250 and 1750) purely
// so the visible portion always looks like a continuous strand instead
// of starting/ending on a stunted quarter-wave.
const THREAD_X_START = -250;
const THREAD_X_END = 1750;
const threadPoints = [
  { label: "Abogados", x: 150, y: 40, crest: true },
  { label: "Hipotecas", x: 550, y: 260, crest: false },
  { label: "Patrimonio", x: 950, y: 40, crest: true },
  { label: "Comunidades", x: 1350, y: 260, crest: false },
];
const THREAD_D =
  "M-250,260 C-116.67,260 16.67,40 150,40 C283.33,40 416.67,260 550,260 C683.33,260 816.67,40 950,40 C1083.33,40 1216.67,260 1350,260 C1483.33,260 1616.67,40 1750,40";
const THREAD_D_VIBRATE =
  "M-250,260 C-116.67,248 16.67,52 150,40 C283.33,28 416.67,272 550,260 C683.33,248 816.67,52 950,40 C1083.33,28 1216.67,272 1350,260 C1483.33,248 1616.67,52 1750,40";
const THREAD_DRAW_DELAY = 1.1;
const THREAD_DRAW_DURATION = 9.6;

/* ---------- Hero ---------- */
function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [threadTop, setThreadTop] = useState<number | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  useEffect(() => {
    function measure() {
      if (!ref.current || !ctaRef.current) return;
      const sectionTop = ref.current.getBoundingClientRect().top;
      const ctaBottom = ctaRef.current.getBoundingClientRect().bottom;
      setThreadTop(ctaBottom - sectionTop + 28);
    }
    measure();
    window.addEventListener("resize", measure);
    const id = window.setTimeout(measure, 400); // re-check after webfonts settle
    return () => {
      window.removeEventListener("resize", measure);
      window.clearTimeout(id);
    };
  }, []);

  return (
    <section ref={ref} className="hero-bg-section">
      <picture>
        <source media="(max-width: 767px)" srcSet="/fotoalteadespachovertical.webp" />
        <motion.img
          style={{ scale: imgScale }}
          src="/fotoalteadespachohorizontal.webp"
          alt="HiloLegal — boutique legal y patrimonial en Altea - Costa Blanca"
          className="hero-bg-image"
          width={1536}
          height={1024}
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
      </picture>
      <div className="hero-bg-overlay" aria-hidden="true" />

      <div>
        <motion.div style={{ y: textY }} className="space-y-10">
          <FadeUp eager>
            <span className="hero-eyebrow">
              Legal · Hipotecas · Patrimonio · Fincas
            </span>
          </FadeUp>

          <h1 className="text-balance">
            <WordReveal eager delay={0.1} text="El rigor que mereces," />
            <br />
            <WordReveal eager delay={0.45} className="jch-accent jch-italic" text="la cercanía que necesitas." />
          </h1>

          <FadeUp eager delay={0.5}>
            <p className="hero-subtitle">
              Un problema legal puede afectar a tu patrimonio. Una hipoteca condiciona tus finanzas
              durante años. Una mala planificación puede comprometer el futuro de tu familia. En
              HiloLegal analizamos tu situación con el rigor que merece, y te acompañamos con la
              cercanía que necesitas para proteger lo que has construido.
            </p>
          </FadeUp>

          <FadeUp eager delay={0.65}>
            <div ref={ctaRef} className="flex flex-wrap justify-center gap-3 pt-4">
              <a href="#contact" className="btn-primary">
                Cuéntanos qué necesitas
              </a>
              <a href="#areas" className="btn-ghost">
                Ver servicios
              </a>
            </div>
          </FadeUp>

          <div className="hero-thread-reserve" aria-hidden="true" />
        </motion.div>
      </div>

      {threadTop !== null && (
      <div className="hero-thread" style={{ top: threadTop }} aria-hidden="true">
        <motion.svg
          viewBox={`0 0 ${THREAD_VB_W} ${THREAD_VB_H}`}
          className="hero-thread__svg"
          preserveAspectRatio="none"
          initial={{ filter: "brightness(1)" }}
          animate={{ filter: ["brightness(1)", "brightness(1)", "brightness(2.2)", "brightness(1)"] }}
          transition={{ duration: THREAD_DRAW_DELAY + THREAD_DRAW_DURATION + 0.5, times: [0, 0.94, 0.97, 1], ease: "easeOut" }}
        >
          <defs>
            <linearGradient id="hero-thread-gradient" x1="0" y1="0" x2="1" y2="0.3">
              <stop offset="0%" className="hero-thread__stop-a" />
              <stop offset="45%" className="hero-thread__stop-b" />
              <stop offset="100%" className="hero-thread__stop-c" />
            </linearGradient>
          </defs>
          <motion.path
            className="hero-thread__line-glow"
            initial={{ pathLength: 0, d: THREAD_D }}
            animate={{ pathLength: 1, d: [THREAD_D, THREAD_D_VIBRATE, THREAD_D] }}
            transition={{
              pathLength: { duration: THREAD_DRAW_DURATION, ease: easeOutExpo, delay: THREAD_DRAW_DELAY },
              d: { duration: 10.4, repeat: Infinity, ease: "easeInOut", delay: THREAD_DRAW_DELAY + THREAD_DRAW_DURATION },
            }}
          />
          <motion.path
            className="hero-thread__line"
            initial={{ pathLength: 0, d: THREAD_D }}
            animate={{ pathLength: 1, d: [THREAD_D, THREAD_D_VIBRATE, THREAD_D] }}
            transition={{
              pathLength: { duration: THREAD_DRAW_DURATION, ease: easeOutExpo, delay: THREAD_DRAW_DELAY },
              d: { duration: 10.4, repeat: Infinity, ease: "easeInOut", delay: THREAD_DRAW_DELAY + THREAD_DRAW_DURATION },
            }}
          />
        </motion.svg>
        {threadPoints.map((p) => {
          const delay = THREAD_DRAW_DELAY + ((p.x - THREAD_X_START) / (THREAD_X_END - THREAD_X_START)) * THREAD_DRAW_DURATION;
          return (
            <motion.span
              key={`${p.label}-ping`}
              className="hero-thread__ping"
              style={{ left: `${(p.x / THREAD_VB_W) * 100}%`, top: `${(p.y / THREAD_VB_H) * 100}%` }}
              initial={{ scale: 0.4, opacity: 0.9 }}
              animate={{ scale: 2.6, opacity: 0 }}
              transition={{ duration: 0.9, delay, ease: "easeOut" }}
            />
          );
        })}
        {threadPoints.map((p) => {
          const delay = THREAD_DRAW_DELAY + ((p.x - THREAD_X_START) / (THREAD_X_END - THREAD_X_START)) * THREAD_DRAW_DURATION;
          return (
            <motion.span
              key={p.label}
              className="hero-thread__dot"
              style={{ left: `${(p.x / THREAD_VB_W) * 100}%`, top: `${(p.y / THREAD_VB_H) * 100}%` }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 320, damping: 14, delay }}
            />
          );
        })}
        {threadPoints.map((p) => {
          const delay = THREAD_DRAW_DELAY + ((p.x - THREAD_X_START) / (THREAD_X_END - THREAD_X_START)) * THREAD_DRAW_DURATION + 0.15;
          return (
            <span
              key={`${p.label}-label`}
              className={`hero-thread__label-anchor hero-thread__label-anchor--${p.crest ? "up" : "down"}`}
              style={{ left: `${(p.x / THREAD_VB_W) * 100}%`, top: `${(p.y / THREAD_VB_H) * 100}%` }}
            >
              <motion.span
                className="hero-thread__label"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 16, delay }}
              >
                {p.label}
              </motion.span>
            </span>
          );
        })}
      </div>
      )}
    </section>
  );
}

/* ---------- Áreas principales ---------- */
function Areas() {
  return (
    <section id="areas" className="portal-block">
      <div className="portal-block__inner">
        <div className="portal-block__heading">
          <h2>
            <Curtain>¿Qué necesitas</Curtain>{" "}
            <Curtain delay={0.1}>
              <span className="jch-accent jch-italic">resolver?</span>
            </Curtain>
          </h2>
          <FadeUp delay={0.2}>
            <p>
              Cuatro áreas. Un mismo criterio: entender tu situación antes de recomendarte una
              solución.
            </p>
          </FadeUp>
        </div>

        <div className="portal-grid">
          {areas.map((a, i) => (
            <FadeUp key={a.title} delay={(i % 2) * 0.08} className="portal-card__wrap">
              <a href={a.href} className="portal-card" onClick={() => trackEvent(a.event)}>
                <div className="portal-card__art">
                  <img
                    src={a.art}
                    alt={a.artAlt}
                    width={900}
                    height={540}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="portal-card__body">
                  <span className="portal-card__number">{a.n}</span>
                  <h3>{a.title}</h3>
                  <p className="portal-card__kicker">{a.kicker}</p>
                  <p className="portal-card__text">{a.text}</p>
                  {a.tags && <p className="portal-card__tags">{a.tags}</p>}
                  <span className="portal-card__cta">
                    <span aria-hidden="true" />
                    {a.cta}
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

/* ---------- Concepto ---------- */
function Positioning() {
  return (
    <section id="posicionamiento" className="position-block">
      <div className="position-block__inner">
        <h2>
          <Curtain>Una decisión rara vez es solo</Curtain>{" "}
          <Curtain delay={0.1}>
            <span className="jch-accent jch-italic">legal o financiera.</span>
          </Curtain>
        </h2>
        <FadeUp delay={0.2} className="position-block__body">
          <p>
            Una herencia tiene consecuencias patrimoniales. Una separación afecta a la economía
            familiar. Comprar vivienda implica financiación, impuestos y planificación. Preparar
            la jubilación exige analizar todo el patrimonio.
          </p>
          <p>Por eso creamos HiloLegal.</p>
        </FadeUp>
        <FadeUp delay={0.3} className="position-block__highlight">
          Miramos el problema completo antes de buscar la solución.
        </FadeUp>
        <div className="position-block__media">
          <img
            src="/nosotros_cliente.webp"
            alt="Equipo de HiloLegal asesorando a un cliente"
            width={1254}
            height={1254}
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </section>
  );
}


/* ---------- Método ---------- */
function Method() {
  const reduce = useReducedMotion();
  return (
    <section id="method">
      <div className="method-block__inner">
        <div className="method-block__intro">
          <h2>
            <Curtain>Antes de decidir,</Curtain>{" "}
            <Curtain delay={0.1}>
              <span className="jch-accent jch-italic">entendemos.</span>
            </Curtain>
          </h2>
        </div>

        <div className="method-steps">
          {methodSteps.map((m) => (
            <motion.article
              key={m.n}
              className="method-step"
              initial={reduce ? false : { opacity: 0, y: 48 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.75, ease: easeOutExpo }}
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

/* ---------- Profesionales ---------- */
function Professionals() {
  return (
    <section id="equipo" className="duo-block">
      <div className="duo-block__inner">
        <div className="duo-block__intro">
          <h2>
            <Curtain>Dos especialistas.</Curtain>{" "}
            <Curtain delay={0.1}>
              <span className="jch-accent jch-italic">Una misma visión.</span>
            </Curtain>
          </h2>
          <span className="duo-block__mark" aria-hidden="true">Jurídico × Patrimonial</span>
        </div>

        <div className="duo-block__split">
          {professionals.map((p, i) => (
            <FadeUp key={p.name} delay={i * 0.1} className="duo-block__col">
              <div className="duo-block__image">
                <img src={p.img} alt={p.name} loading="lazy" />
              </div>
              <h3>{p.name}</h3>
              <p className="duo-block__area">{p.area}</p>
              <p className="duo-block__bio">{p.bio}</p>
              <a href={p.href} className="duo-block__cta">
                <span aria-hidden="true">→</span> {p.cta}
              </a>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Prueba y autoridad ---------- */
function Authority() {
  return (
    <section id="autoridad" className="authority-block">
      <div className="authority-block__inner">
        <FadeUp className="authority-block__grid">
          {/* Cifras verificables únicamente. "1200+ personas ayudadas" se retiró
              del hero histórico de esta sección por no poder confirmarse — no
              mostrar sin validar con el cliente primero. */}
          <div className="authority-block__stat">
            <span className="authority-block__value">45+</span>
            <span className="authority-block__label">Años de experiencia profesional combinada</span>
          </div>
          <div className="authority-block__stat">
            <span className="authority-block__value">4</span>
            <span className="authority-block__label">Áreas de asesoramiento bajo un mismo criterio</span>
          </div>
          <div className="authority-block__stat">
            <span className="authority-block__value">Altea</span>
            <span className="authority-block__label">Costa Blanca · Marina Baixa · Alicante</span>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ---------- Herramientas ---------- */
function Tools() {
  return (
    <section id="herramientas">
      <div className="tools__inner">
        <div className="tools__heading">
          <h2>
            <Curtain>Menos intuición.</Curtain>{" "}
            <Curtain delay={0.1}>
              <span className="jch-accent jch-italic">Más información.</span>
            </Curtain>
          </h2>
          <FadeUp delay={0.15}>
            <p>
              Antes de tomar una decisión financiera importante, conviene hacer números.
            </p>
          </FadeUp>
        </div>

        <div className="tools__grid">
          {tools.map((t, i) => (
            <FadeUp key={t.title} delay={i * 0.08}>
              <a
                href={t.href}
                className="tool-card"
                onClick={() => trackEvent(t.event)}
                {...(t.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                <span className="audience__number">
                  Herramienta {String(i + 1).padStart(2, "0")}
                </span>
                <h3>{t.title}</h3>
                <p>{t.text}</p>
                <span className="tools__cta">
                  <span aria-hidden="true">→</span> {t.cta}
                </span>
              </a>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Contenido ---------- */
function Content() {
  // Un artículo destacado por bloque (legal, hipotecas/patrimonio, comunidades) en vez de
  // los 3 primeros del array — evita que la home se lea como un blog casi exclusivamente
  // financiero. Si algún bloque aún no tiene artículo propio, se omite sin inventar contenido.
  const legal = blogPosts.find((p) => topicOf(p) === "legal");
  const patrimonial = blogPosts.find(
    (p) => topicOf(p) === "hipotecas" || topicOf(p) === "patrimonio",
  );
  const comunidades = blogPosts.find((p) => topicOf(p) === "comunidades");
  const recent = [legal, patrimonial, comunidades].filter(
    (p): p is NonNullable<typeof p> => Boolean(p),
  );
  return (
    <section id="contenido" className="content-block">
      <div className="content-block__inner">
        <div className="content-block__heading">
          <h2>
            <Curtain>Ideas para</Curtain>{" "}
            <Curtain delay={0.1}>
              <span className="jch-accent jch-italic">decidir mejor.</span>
            </Curtain>
          </h2>
          <FadeUp delay={0.15}>
            <p>
              Información jurídica y financiera explicada para personas que quieren entender antes
              de decidir.
            </p>
          </FadeUp>
        </div>

        <div className="content-block__grid">
          {recent.map((post, i) => (
            <FadeUp key={post.slug} delay={i * 0.08}>
              <a
                href={`/blog/${post.slug}`}
                className="content-card"
                onClick={() => trackEvent("blog_article_click", { slug: post.slug })}
              >
                <span className="content-card__category">{post.category}</span>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <span className="content-card__cta">
                  <span aria-hidden="true" />
                  Leer artículo
                </span>
              </a>
            </FadeUp>
          ))}
        </div>

        <FadeUp delay={0.2} className="content-block__footer">
          <a href="/blog" className="btn-ghost">
            Ver todos los artículos
          </a>
        </FadeUp>
      </div>
    </section>
  );
}

/* ---------- Cierre ---------- */
function Closing() {
  return (
    <section id="cierre">
      <div className="closing__inner">
        <FadeUp>
          <h2 className="text-balance">
            <Curtain>Hay decisiones que merecen ser</Curtain>{" "}
            <Curtain delay={0.1}>
              <span className="jch-accent jch-italic">estudiadas con calma.</span>
            </Curtain>
          </h2>
        </FadeUp>
        <FadeUp delay={0.2}>
          <p>
            Cuéntanos qué necesitas. Analizaremos tu situación y te indicaremos cómo podemos
            ayudarte.
          </p>
        </FadeUp>
        <FadeUp delay={0.3}>
          <a href="#contact" className="closing__cta">
            Hablar con HiloLegal <span aria-hidden="true">→</span>
          </a>
        </FadeUp>
        <FadeUp delay={0.4}>
          <span className="closing__location">Altea · Marina Baixa · Alicante</span>
        </FadeUp>
      </div>
    </section>
  );
}

/* ---------- Contact ---------- */
function Contact() {
  const submit = useServerFn(submitContact);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    topic: "Consulta jurídica general",
    message: "",
  });
  const startedRef = useRef(false);

  const onChange =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      await submit({ data: form });
      setStatus("ok");
      trackEvent("contact_submit");
      setForm({ name: "", phone: "", topic: "Consulta jurídica general", message: "" });
      setAccepted(false);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "No se ha podido enviar el formulario.");
    }
  }

  return (
    <section id="contact">
      <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-16 lg:grid-cols-2">
        <div className="space-y-8">
          <h2>
            <Curtain>Hablemos sobre</Curtain>{" "}
            <Curtain delay={0.1}>
              <span className="jch-accent jch-italic">lo que necesitas resolver</span>
            </Curtain>
          </h2>
          <FadeUp delay={0.1}>
            <p>
              Cuéntanos brevemente tu situación y te indicaremos qué área de HiloLegal puede ayudarte.
            </p>
          </FadeUp>

          <div className="space-y-6 pt-6 border-t border-white/10">
            <a href={`tel:${PHONE_TEL}`} className="block group">
              <p className="text-[10px] uppercase tracking-[0.2em] opacity-60 mb-1">Teléfono</p>
              <p className="text-2xl font-medium group-hover:text-[color:var(--jch-accent)] transition-colors">
                {PHONE_DISPLAY}
              </p>
            </a>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="block group">
              <p className="text-[10px] uppercase tracking-[0.2em] opacity-60 mb-1">WhatsApp</p>
              <p className="text-2xl font-medium group-hover:text-[color:var(--jch-accent)] transition-colors">
                Escríbenos directamente
              </p>
            </a>
            <a href={`mailto:${EMAIL}`} className="block group">
              <p className="text-[10px] uppercase tracking-[0.2em] opacity-60 mb-1">Email</p>
              <p className="text-2xl font-medium group-hover:text-[color:var(--jch-accent)] transition-colors">
                {EMAIL}
              </p>
            </a>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] opacity-60 mb-1">Dirección</p>
              <p className="text-base opacity-80">
                Calle Regata 3, 1º E, 03590 Altea, Alicante
              </p>
            </div>
          </div>

          <div className="border border-white/10 aspect-[4/3] md:aspect-[16/10]">
            <iframe
              title="Ubicación de HiloLegal en Altea"
              src="https://www.google.com/maps?q=Calle+Regata+3,+03590+Altea,+Alicante,+Espa%C3%B1a&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, filter: "grayscale(1) invert(0.9) contrast(0.9)" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <FadeUp>
          <form id="contact-form" onSubmit={onSubmit} className="space-y-8 scroll-mt-28">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Field
                label="Nombre"
                type="text"
                placeholder="Tu nombre"
                value={form.name}
                onChange={onChange("name")}
                required
              />
              <Field
                label="Teléfono"
                type="tel"
                placeholder="Tu número"
                value={form.phone}
                onChange={onChange("phone")}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="field-topic" className="text-[10px] font-medium uppercase tracking-[0.2em]">
                Especialidad requerida
              </label>
              <select
                id="field-topic"
                value={form.topic}
                onChange={onChange("topic")}
                className="w-full bg-transparent border-0 border-b border-white/20 px-0 py-3 focus:outline-none focus:border-[color:var(--jch-accent)] transition-colors"
              >
                <option>Consulta jurídica general</option>
                <option>Asesoramiento Financiero</option>
                <option>Hipotecas</option>
                <option>Administración de Fincas</option>
                <option>Otra consulta</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="field-mensaje" className="text-[10px] font-medium uppercase tracking-[0.2em]">Mensaje (opcional)</label>
              <textarea
                id="field-mensaje"
                rows={4}
                placeholder="Cuéntanos tu situación"
                value={form.message}
                onChange={onChange("message")}
                className="w-full bg-transparent border-0 border-b border-white/20 px-0 py-3 focus:outline-none focus:border-[color:var(--jch-accent)] transition-colors"
              />
            </div>

            <label className="flex items-start gap-3 text-sm opacity-80 cursor-pointer">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                required
                className="mt-1 w-4 h-4 shrink-0"
                style={{ accentColor: "var(--jch-accent)" }}
              />
              <span>
                He leído y acepto la{" "}
                <a
                  href="/privacidad.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-[color:var(--jch-accent)]"
                >
                  política de privacidad
                </a>
                .
              </span>
            </label>

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full py-5 rounded-full uppercase text-xs tracking-[0.2em] transition-colors disabled:opacity-60 disabled:cursor-not-allowed bg-[#1f6f78] hover:bg-[#17535a]"
              style={{
                color: "#ffffff",
              }}
            >
              {status === "sending"
                ? "Enviando…"
                : status === "ok"
                  ? "¡Enviado!"
                  : "Enviar consulta"}
            </button>

            {status === "ok" && (
              <p className="text-sm uppercase tracking-widest opacity-80">
                Gracias. Te contactaremos en menos de 24h.
              </p>
            )}
            {status === "error" && (
              <p className="text-sm text-red-400">
                {errorMsg || "Algo ha ido mal. Inténtalo de nuevo en unos minutos."}
              </p>
            )}
          </form>
        </FadeUp>
      </div>
    </section>
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
      <label htmlFor={id} className="text-[10px] font-medium uppercase tracking-[0.2em]">{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full bg-transparent border-0 border-b border-white/20 px-0 py-3 focus:outline-none focus:border-[color:var(--jch-accent)] transition-colors placeholder:opacity-40"
      />
    </div>
  );
}

/* ---------- Footer ---------- */
const footerColumns = [
  {
    title: "Servicios",
    links: [
      ["Legal", "/veronica#services"],
      ["Hipotecas", "/josecarlos"],
      ["Patrimonio", "/josecarlos"],
      ["Administración de fincas", "/administracion-fincas"],
    ] as [string, string][],
  },
  {
    title: "Profesionales",
    links: [
      ["Verónica López", "/veronica"],
      ["José Carlos Hidalgo", "/josecarlos"],
    ] as [string, string][],
  },
  {
    title: "Recursos",
    links: [
      ["Herramientas", "#herramientas"],
      ["Blog", "/blog"],
      ["Diagnóstico patrimonial", "#contact"],
    ] as [string, string][],
  },
];

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer__inner">
        <div className="footer__grid">
          <div className="footer__brand">
            <p className="brand">
              <img
                src="/hilolegal-logo-mark.svg"
                alt=""
                className="footer-logo-mark"
                width={34}
                height={37}
                loading="lazy"
                decoding="async"
              />
              HiloLegal
            </p>
            <p className="footer__tagline">
              Boutique legal y patrimonial · Altea - Costa Blanca
            </p>
          </div>

          {footerColumns.map((col) => (
            <div key={col.title} className="footer__col">
              <span className="footer__col-title">{col.title}</span>
              <ul>
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <a href={href}>{label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="footer__col">
            <span className="footer__col-title">Contacto</span>
            <ul>
              <li className="footer__col-static">Calle Regata 3, 1º E, Altea</li>
              <li><a href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY}</a></li>
              <li><a href={`mailto:${EMAIL}`}>{EMAIL}</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-70">
          <span className="uppercase tracking-[0.18em]">
            © {new Date().getFullYear()} HiloLegal. Todos los derechos reservados.
          </span>
          <div className="flex gap-4">
            <a href="/privacidad.html" target="_blank" rel="noopener noreferrer">
              Privacidad
            </a>
            <a href="/terminos.html" target="_blank" rel="noopener noreferrer">
              Términos
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
