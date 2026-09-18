import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { SmoothScroll } from "@/components/SmoothScroll";
import { ThemeToggle } from "@/components/ThemeToggle";
import { submitContact } from "@/lib/contact.functions";
import { blogPosts, topicOf } from "@/lib/blogPosts";
import { trackEvent } from "@/lib/analytics";
import { useDialogA11y } from "@/lib/useDialogA11y";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HiloLegal | Boutique legal y patrimonial en Altea" },
      {
        name: "description",
        content:
          "Abogacía, planificación financiera, hipotecas, seguros y administración de fincas en Altea. Diagnóstico con criterio legal y financiero.",
      },
      { property: "og:title", content: "HiloLegal | Boutique legal y patrimonial en Altea" },
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
      { name: "twitter:title", content: "HiloLegal | Boutique legal y patrimonial en Altea" },
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
          // Perfiles corporativos reales de HiloLegal (no personales de
          // José Carlos ni de Verónica). El antiguo enlace de Google aquí
          // usado ("GlqwXv7lO958pDPDS") resultó ser, verificado navegando
          // el redirect, la ficha personal de José Carlos, no la del
          // despacho — se sustituye por la ficha de Google Business real
          // de HiloLegal.
          sameAs: ["https://www.facebook.com/HiloLegal", "https://share.google/t4jmqHWMM9suL0v2a"],
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
      {
        type: "application/ld+json",
        // Coincide con el acordeón visible de la sección FAQHome más abajo —
        // Google exige que el FAQPage schema refleje contenido realmente
        // visible en la página, no preguntas añadidas solo para el schema.
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: homeFaqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
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
    subLinks: [
      { label: "Familia", href: "/derecho-familia" },
      { label: "Penal", href: "/derecho-penal" },
      { label: "Administrativo", href: "/derecho-administrativo" },
      { label: "Inmobiliario", href: "/derecho-inmobiliario" },
    ],
    cta: "Cuéntanos tu caso",
    href: "/veronica",
    art: "/legal.webp",
    artAlt: "Ilustración del área legal de HiloLegal",
    event: "nav_service_legal" as const,
  },
  {
    n: "02",
    title: "Hipotecas",
    kicker: "Comprar con seguridad.",
    text: "Estudiamos tu situación, analizamos la viabilidad y te acompañamos durante el proceso hipotecario.",
    tags: "ING · ABANCA",
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
    href: "/ahorro-potencial",
    event: "tool_wealth_audit" as const,
  },
  {
    title: "Test de salud financiera",
    text: "Evalúa tu nivel de protección, ahorro, endeudamiento y previsión.",
    cta: "Hacer test",
    href: "/test-salud-financiera",
    event: "tool_financial_health" as const,
  },
  {
    title: "Simulador de hipoteca",
    text: "Calcula la cuota, el LTV, los gastos y el precio máximo de vivienda que puedes permitirte.",
    cta: "Abrir simulador",
    href: "/simulador-hipoteca",
    event: "tool_mortgage" as const,
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
        <Method />
        <Tools />
        <Content />
        <FAQHome />
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
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();
  const drawerRef = useRef<HTMLElement>(null);

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

  // Transparente sobre la foto del hero, sólido en cuanto se abandona esa
  // sección — el umbral se mide contra la altura real de .hero-photo (que
  // cambia con el viewport, aspect-ratio) en vez de un nº de píxeles fijo,
  // para que el cambio ocurra justo al salir de la foto y no a medio hero.
  // Solo aplica a partir de 1024px: en móvil el header se queda blanco
  // sólido siempre (ver .home-header en CSS), así que si "scrolled" se
  // activase igualmente ahí, el logo pasaría a la variante blanca sobre
  // ese mismo fondo blanco y se volvería invisible.
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>(".hero-photo");
    const getThreshold = () => (hero ? hero.offsetHeight - 80 : 40);
    const onScroll = () => setScrolled(window.innerWidth >= 1024 && window.scrollY > getThreshold());
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useDialogA11y(mobileOpen, () => setMobileOpen(false), drawerRef);

  return (
    <>
      <motion.header
        initial={reduce ? false : { y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ...spring, delay: 0.1 }}
        className={`home-header left-0 right-0 z-50 w-full${scrolled ? " home-header--scrolled" : ""}`}
      >
        <nav className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-6 py-5">
          <a href="/" className="group flex items-center gap-3">
            <motion.img
              src={scrolled ? "/hilolegal-logo-white.webp" : "/hilolegal-logo-stacked-black.webp"}
              alt="Logo HiloLegal"
              className={`home-header__logo w-auto object-contain ${scrolled ? "h-[43.2px]" : "h-[57.6px]"}`}
              whileHover={{ rotate: -2, scale: 1.05 }}
              transition={spring}
            />
          </a>

          <div className="hidden items-center gap-10 md:flex">
            {navLinks.map(([label, href]) => (
              <a key={href} href={href} className="home-header__link group relative text-sm font-medium">
                <span className="transition-colors group-hover:text-[var(--jch-accent-ink)]">{label}</span>
                <span className="absolute -bottom-1 left-0 h-[1px] w-full origin-left scale-x-0 bg-[#C5A566] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="home-header__toggle-wrap hidden sm:inline-flex">
              <ThemeToggle />
            </span>
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={spring}
              href="#contact"
              className="home-header__cta hidden rounded-full bg-[#C5A566] px-8 py-[1.1rem] text-xs font-medium uppercase tracking-[0.14em] text-black transition-colors hover:bg-[#A78C57] sm:inline-block"
            >
              Cuéntanos qué necesitas
            </motion.a>
            <button
              type="button"
              aria-label="Abrir menú"
              onClick={() => setMobileOpen((v) => !v)}
              className="home-header__burger -mr-2 p-2 text-2xl md:hidden"
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

const heroTrust = [
  { label: "Un equipo, dos especialidades", text: "Derecho y finanzas, bajo un mismo criterio." },
  { label: "Visión jurídica y patrimonial", text: "Soluciones hoy, tranquilidad mañana." },
  { label: "Altea · Costa Blanca", text: "Trato directo, en cada paso." },
];

const heroBrandWords = ["Abogados", "Hipotecas", "Patrimonio", "Administración", "de", "fincas", "Altea"];

/* ---------- Hero ---------- */
// A partir de 1024px: foto a sección completa con el texto colocado a mano
// sobre los huecos reales de ESTA foto (pared vacía arriba, hueco entre
// las dos personas, mesa abajo) — coordenadas ajustadas directamente sobre
// la imagen para no tapar ninguna cara. Por debajo de 1024px no hay sitio
// para ese "collage": la foto pasa arriba a ancho completo y el texto
// vuelve a flujo normal debajo, en el mismo orden de lectura.
function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="hero-photo">
      <div className="hero-photo__media">
        <img
          src="/josecarlos_veronica.webp"
          alt="Verónica López y José Carlos Hidalgo, en el despacho de HiloLegal en Altea"
          width={1184}
          height={596}
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
      </div>

      <ul className="hero-photo__brandwords" aria-label="Abogados · Hipotecas · Patrimonio · Administración de fincas · Altea">
        {heroBrandWords.map((word, i) =>
          reduce ? (
            <li key={i} aria-hidden="true">{word}</li>
          ) : (
            <motion.li
              key={i}
              aria-hidden="true"
              initial={{ opacity: 0, x: -28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...spring, delay: 0.15 + i * 0.09 }}
            >
              {word}
            </motion.li>
          )
        )}
      </ul>

      <h1 className="hero-photo__h1 text-balance font-bold tracking-tight">
        <WordReveal eager block delay={0.1} text="Tu situación merece" />
        <WordReveal eager block delay={0.45} className="jch-accent jch-italic" text="una respuesta clara." />
      </h1>

      <FadeUp eager delay={0.5} className="hero-photo__subtitle">
        <p className="hero-photo__subtitle-text">
          Te ayudamos a resolver asuntos legales, conseguir tu hipoteca y organizar tu patrimonio.
        </p>
      </FadeUp>

      <div className="hero-photo__ctas">
        <FadeUp eager delay={0.65} className="hero-photo__cta hero-photo__cta--left">
          <a href="#contact" className="btn-primary">
            Cuéntanos tu situación
          </a>
        </FadeUp>

        <FadeUp eager delay={0.72} className="hero-photo__cta hero-photo__cta--right">
          <a href="#areas" className="btn-ghost">
            Encuentra tu servicio
          </a>
        </FadeUp>
      </div>

      <FadeUp eager delay={0.85} className="hero-photo__trust-wrap">
        <ul className="hero-photo__trust">
          {heroTrust.map((t) => (
            <li key={t.label}>
              <span className="hero-photo__trust-label">{t.label}</span>
              <span className="hero-photo__trust-text">{t.text}</span>
            </li>
          ))}
        </ul>
      </FadeUp>
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
              <div className="portal-card">
                <a
                  href={a.href}
                  className="portal-card__stretched-link"
                  aria-label={a.title}
                  onClick={() => trackEvent(a.event)}
                />
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
                  {"subLinks" in a && a.subLinks ? (
                    <p className="portal-card__tags">
                      {a.subLinks.map((s, si) => (
                        <span key={s.href}>
                          {si > 0 && " · "}
                          <Link to={s.href} className="portal-card__taglink">
                            {s.label}
                          </Link>
                        </span>
                      ))}
                    </p>
                  ) : (
                    a.tags && <p className="portal-card__tags">{a.tags}</p>
                  )}
                  <span className="portal-card__cta">
                    <span aria-hidden="true" />
                    {a.cta}
                  </span>
                </div>
              </div>
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
            <span className="jch-accent jch-italic whitespace-nowrap">legal o financiera.</span>
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
            <Curtain className="md:whitespace-nowrap">Dos especialistas.</Curtain>{" "}
            <Curtain delay={0.1}>
              <span className="jch-accent jch-italic md:whitespace-nowrap">Una misma visión.</span>
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

/* ---------- FAQ ---------- */
const homeFaqs = [
  {
    q: "¿Qué es HiloLegal?",
    a: "Un equipo formado por Verónica López, abogada, y José Carlos Hidalgo, asesor patrimonial, que trabajan bajo un mismo criterio cuando un caso tiene a la vez una dimensión legal y financiera — sin que tengas que repetir tu situación a dos interlocutores distintos.",
  },
  {
    q: "¿La primera consulta es gratuita?",
    a: "Sí. En el área legal y en el primer análisis financiero, la consulta inicial no tiene coste ni compromiso.",
  },
  {
    q: "¿Qué áreas de derecho cubrís?",
    a: "Derecho civil y de familia, penal, administrativo, e inmobiliario, urbanismo y comunidades — todas con Verónica López como interlocutora.",
  },
  {
    q: "¿Dónde trabajáis?",
    a: "En Altea y en toda la Costa Blanca: Benidorm, Alicante y la comarca de la Marina Baixa.",
  },
  {
    q: "¿Cómo coordináis lo legal y lo financiero?",
    a: "Cuando un caso tiene las dos caras —por ejemplo, un divorcio con hipoteca compartida o una herencia con implicaciones patrimoniales— Verónica y José Carlos trabajan coordinados, bajo un mismo criterio.",
  },
];

function FAQHome() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="py-[100px]">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-4xl font-bold tracking-tight text-center mb-20">
          <Curtain>Preguntas</Curtain>{" "}
          <Curtain delay={0.1}>
            <span className="jch-accent jch-italic">frecuentes.</span>
          </Curtain>
        </h2>
        <div className="space-y-px bg-[var(--jch-line)]">
          {homeFaqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <FadeUp key={f.q} delay={i * 0.05}>
                <div className="bg-[var(--jch-bg)]">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex justify-between items-center gap-6 text-left p-8 text-lg font-bold tracking-tight"
                    aria-expanded={isOpen}
                  >
                    <span>{f.q}</span>
                    <span aria-hidden="true" className="jch-accent text-2xl leading-none shrink-0">
                      {isOpen ? "−" : "+"}
                    </span>
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
  const honeypotRef = useRef<HTMLInputElement>(null);
  const formLoadedAtRef = useRef(Date.now());

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
      await submit({
        data: {
          ...form,
          website: honeypotRef.current?.value ?? "",
          formLoadedAt: formLoadedAtRef.current,
        },
      });
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
            <input
              ref={honeypotRef}
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute left-[-9999px] top-0 h-px w-px overflow-hidden"
            />
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
              className="w-full py-5 rounded-full uppercase text-xs tracking-[0.2em] transition-colors disabled:opacity-60 disabled:cursor-not-allowed bg-[#C5A566] hover:bg-[#A78C57]"
              style={{
                color: "#1a1a1a",
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
    title: "Legal",
    links: [
      ["Derecho de familia", "/derecho-familia"],
      ["Derecho penal", "/derecho-penal"],
      ["Derecho administrativo", "/derecho-administrativo"],
      ["Inmobiliario y comunidades", "/derecho-inmobiliario"],
    ] as [string, string][],
  },
  {
    title: "Servicios",
    links: [
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
      ["Antes de firmar las arras", "/antes-de-firmar-arras"],
      ["Blog", "/blog"],
      ["Diagnóstico patrimonial", "/josecarlos#contact"],
    ] as [string, string][],
  },
];

const footerSocialLinks = [
  {
    label: "Facebook de HiloLegal",
    href: "https://www.facebook.com/HiloLegal",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
    ),
  },
  {
    label: "Ficha de Google Business de HiloLegal",
    href: "https://share.google/t4jmqHWMM9suL0v2a",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.344-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/></svg>
    ),
  },
];

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer__inner">
        <div className="footer__grid">
          <div className="footer__brand">
            {/* El footer sigue el tema (var(--jch-bg): blanco en modo claro,
                negro en modo oscuro) — se muestran las dos variantes del
                logo y se conmutan por CSS según [data-theme], igual que ya
                hace el resto del sitio con el toggle de tema, para que no
                haya parpadeo al hidratar (el atributo data-theme ya está
                fijado en el <html> antes del primer pintado). */}
            <img
              src="/hilolegal-logo-black.webp"
              alt="Logo HiloLegal"
              className="footer-logo footer-logo--dark h-8 w-auto object-contain"
              loading="lazy"
              decoding="async"
            />
            <img
              src="/hilolegal-logo-white.webp"
              alt="Logo HiloLegal"
              className="footer-logo footer-logo--light h-8 w-auto object-contain"
              loading="lazy"
              decoding="async"
            />
            <p className="footer__tagline">
              Boutique legal y patrimonial · Altea - Costa Blanca
            </p>
            <div className="flex items-center gap-5 mt-6">
              {footerSocialLinks.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -2 }}
                  transition={spring}
                  className="opacity-70 hover:opacity-100 hover:text-[var(--jch-accent-ink)] transition-colors"
                  aria-label={s.label}
                >
                  {s.icon}
                </motion.a>
              ))}
            </div>
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

        <div className="mt-16 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
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
