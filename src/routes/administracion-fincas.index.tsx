import React, { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { AnimatePresence, motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ThemeToggle } from "@/components/ThemeToggle";
import { submitContact } from "@/lib/contact.functions";
import { trackEvent } from "@/lib/analytics";
import { blogPosts } from "@/lib/blogPosts";
import { useDialogA11y } from "@/lib/useDialogA11y";

export const Route = createFileRoute("/administracion-fincas/")({
  head: () => ({
    meta: [
      { title: "Administración de Fincas en Altea y Marina Baixa | HiloLegal" },
      {
        name: "description",
        content:
          "Administración de comunidades de propietarios en Altea, Benidorm y Marina Baixa. Gestión económica y comunicación directa con la presidencia.",
      },
      { property: "og:title", content: "Administración de Fincas en Altea y Marina Baixa | HiloLegal" },
      {
        property: "og:description",
        content: "Gestión económica, incidencias, juntas y comunicación directa. Sin sorpresas al cierre del año.",
      },
      { property: "og:url", content: "https://www.hilolegal.es/administracion-fincas" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:site_name", content: "HiloLegal" },
      { property: "og:image", content: "https://www.hilolegal.es/fotoalteadespachohorizontal.webp" },
      { property: "og:image:width", content: "1536" },
      { property: "og:image:height", content: "1024" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Administración de Fincas en Altea y Marina Baixa | HiloLegal" },
      { name: "twitter:description", content: "Gestión económica, incidencias, juntas y comunicación directa con la presidencia." },
      { name: "twitter:image", content: "https://www.hilolegal.es/fotoalteadespachohorizontal.webp" },
    ],
    links: [
      { rel: "canonical", href: "https://www.hilolegal.es/administracion-fincas" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=apartment,groups,receipt_long,build,event,dashboard,call,mail,location_on,expand_more&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Service",
              serviceType: "Administración de fincas",
              name: "Administración de fincas — José Carlos Hidalgo",
              url: "https://www.hilolegal.es/administracion-fincas",
              provider: {
                "@type": "Person",
                name: "José Carlos Hidalgo Ortega",
                url: "https://www.hilolegal.es/josecarlos",
              },
              // Mismo criterio que index.tsx: sin perfiles corporativos
              // propios de "Administración de fincas" en el repo, se
              // enlaza solo la ficha de Google del despacho.
              sameAs: ["https://share.google/GlqwXv7lO958pDPDS"],
              areaServed: [
                { "@type": "City", name: "Altea" },
                { "@type": "City", name: "Benidorm" },
                { "@type": "City", name: "Alicante" },
                { "@type": "AdministrativeArea", name: "Marina Baixa" },
                { "@type": "AdministrativeArea", name: "Costa Blanca" },
              ],
              description:
                "Administración de comunidades de propietarios en Altea, Benidorm y Marina Baixa: gestión económica, incidencias, juntas y comunicación directa con la presidencia.",
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.hilolegal.es/" },
                { "@type": "ListItem", position: 2, name: "Administración de fincas", item: "https://www.hilolegal.es/administracion-fincas" },
              ],
            },
            {
              "@type": "FAQPage",
              mainEntity: [
                { "@type": "Question", name: "¿Cuánto cuesta la administración de fincas?", acceptedAnswer: { "@type": "Answer", text: "Depende del tamaño de la comunidad, el número de propietarios y los servicios que necesite. Tras una primera toma de contacto, se entrega una propuesta con honorarios claros y sin compromiso." } },
                { "@type": "Question", name: "¿Cómo se gestiona el cambio de administrador?", acceptedAnswer: { "@type": "Answer", text: "Se coordina con el administrador saliente el traspaso de documentación, cuentas y contratos en curso, para que la comunidad no note ninguna interrupción en el servicio." } },
                { "@type": "Question", name: "¿Qué pasa con los propietarios que no pagan sus cuotas?", acceptedAnswer: { "@type": "Answer", text: "Se aplica un protocolo de seguimiento y reclamación ordenada, con comunicación constante a la presidencia y, cuando es necesario, coordinación con asesoría legal." } },
                { "@type": "Question", name: "¿Ofrecéis un portal o app para los propietarios?", acceptedAnswer: { "@type": "Answer", text: "Sí. Los propietarios pueden consultar cuentas, actas y documentación de la comunidad, y seguir el estado de las incidencias abiertas." } },
                { "@type": "Question", name: "¿En qué zonas trabajáis?", acceptedAnswer: { "@type": "Answer", text: "Altea, Benidorm, Alicante, L'Alfàs del Pi, Calpe y el resto de la Marina Baixa y Costa Blanca." } },
                { "@type": "Question", name: "Ya tenemos administrador, ¿podemos cambiar en cualquier momento?", acceptedAnswer: { "@type": "Answer", text: "El cambio se acuerda en junta de propietarios. Se explica el procedimiento y los plazos concretos según la situación de cada comunidad antes de dar cualquier paso." } },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: AdministracionFincasPage,
});

const WHATSAPP = "https://wa.me/34647506040?text=Quiero%20informaci%C3%B3n%20sobre%20administraci%C3%B3n%20de%20fincas";
const PHONE_DISPLAY = "647 50 60 40";
const EMAIL = "josecarlos@hilolegal.es";
const LOGO = "/hilolegal-logo-stacked-black.webp";

const Icon = ({ name, className = "" }: { name: string; className?: string }) => (
  <span aria-hidden="true" className={`material-symbols-outlined ${className}`}>{name}</span>
);

// ----- Motion primitives (same as josecarlos.tsx / veronica.tsx) -----
const spring = { type: "spring" as const, stiffness: 90, damping: 20, mass: 0.9 };
const easeOutExpo = [0.16, 1, 0.3, 1] as const;

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

function AdministracionFincasPage() {
  useEffect(() => {
    trackEvent("property_management_view", { page: "administracion-fincas" });
  }, []);

  return (
    <div className="josecarlos-original bg-[var(--jch-bg)] text-[var(--jch-ink)] selection:bg-[#C5A566] selection:text-white">
      <SmoothScroll />
      <Header />

      <main>
        <Hero />
        <Problema />
        <BloquePresidente />
        <Metodo />
        <Tecnologia />
        <GestionEconomica />
        <Incidencias />
        <Juntas />
        <CuatroNecesidades />
        <Filosofia />
        <AmbitoGeografico />
        <CtaFinal />
        <ContenidoAutoridad />
        <FAQ />
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
    ["El problema", "#problema"],
    ["Cómo trabajamos", "#metodo"],
    ["Gestión económica", "#gestion-economica"],
    ["Juntas", "#juntas"],
    ["Preguntas", "#faq"],
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

  useDialogA11y(mobileOpen, () => setMobileOpen(false), drawerRef);

  return (
    <>
      <motion.header
        initial={reduce ? false : { y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ...spring, delay: 0.1 }}
        className="sticky top-0 z-50 w-full border-b border-[#E5E5E5] bg-white backdrop-blur-xl"
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
              Administración de Fincas
            </span>
          </Link>

          <div className="hidden items-center gap-9 md:flex">
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
            <Link to="/" className="header-back-link hidden md:inline-block">
              ← Volver al inicio
            </Link>
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
            <div className="flex h-full flex-col gap-4 overflow-y-auto p-8">
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="self-end text-3xl text-[var(--jch-accent-ink)]"
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

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  return (
    <section ref={ref} className="hero-bg-section">
      <motion.img
        style={{ scale: imgScale }}
        alt="Administración de fincas en Altea"
        className="hero-bg-image"
        src="/fotoalteadespachohorizontal.webp"
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
              ADMINISTRACIÓN DE FINCAS EN ALTEA Y MARINA BAIXA
            </div>
          </FadeUp>

          <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.08] tracking-tight text-balance">
            <WordReveal eager block delay={0.1} text="Una comunidad bien gestionada" />
            <WordReveal eager block delay={0.325} className="text-[var(--jch-accent-ink)]" text="se nota" />
            <WordReveal eager block delay={0.46} text="cuando deja de generar problemas." />
          </h1>

          <FadeUp delay={0.6}>
            <p className="hero-subtitle">
              Gestiono comunidades de propietarios en Altea y la Marina Baixa con cuentas claras,
              incidencias con seguimiento real y comunicación directa con la presidencia. Sin
              sorpresas en la junta anual.
            </p>
          </FadeUp>

          <FadeUp delay={0.75}>
            <div className="flex flex-wrap gap-6 pt-2">
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={spring}
                className="rounded-full bg-[#1f6f78] text-white px-10 py-5 font-bold uppercase text-xs tracking-widest hover:bg-[#17535a] transition-colors shadow-xl shadow-[#1f6f78]/20"
                href="#contact"
                onClick={() =>
                  trackEvent("property_management_proposal_start", { section: "hero", cta: "solicitar_propuesta" })
                }
              >
                Solicitar propuesta
              </motion.a>
              <a href="#metodo" className="btn-ghost">
                Ver cómo trabajamos
              </a>
            </div>
          </FadeUp>
        </motion.div>
      </div>
    </section>
  );
}

const problemas = [
  { n: "01", title: "Cuentas que nadie explica", text: "Gastos e ingresos que solo se ven una vez al año, en la junta, cuando ya no hay margen para preguntar ni corregir." },
  { n: "02", title: "Incidencias sin responsable", text: "Una avería se comunica y desaparece. Nadie sabe en qué punto está ni quién tiene que resolverla." },
  { n: "03", title: "Juntas mal preparadas", text: "Convocatorias tardías, sin documentación previa y actas que llegan semanas después, si llegan." },
];

function Problema() {
  return (
    <section id="problema" className="content-block py-[100px] border-t border-[var(--jch-line)]">
      <div className="content-block__inner">
        <div className="content-block__heading">
          <h2>
            <Curtain>Que la comunidad funcione. <span className="text-[var(--jch-accent-ink)]">Sin improvisar.</span></Curtain>
          </h2>
          <FadeUp delay={0.1}>
            <p>
              La mayoría de los problemas en una comunidad de propietarios no son grandes crisis.
              Son pequeñas cosas mal gestionadas que se acumulan hasta convertirse en desconfianza.
            </p>
          </FadeUp>
        </div>
        <div className="content-block__grid">
          {problemas.map((p, idx) => (
            <FadeUp key={p.n} delay={idx * 0.08}>
              <div className="content-card">
                <span className="content-card__category">{p.n}</span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

function BloquePresidente() {
  return (
    <section className="position-block py-[100px] border-t border-[var(--jch-line)] bg-[var(--jch-surface)]">
      <div className="position-block__inner">
        <h2>
          <Curtain>El presidente <span className="jch-accent jch-italic">representa</span>, no gestiona.</Curtain>
        </h2>
        <div className="position-block__body">
          <FadeUp delay={0.1}>
            <p>
              Tu papel es representar a los propietarios y tomar decisiones,
              no perseguir facturas ni redactar actas.
            </p>
            <p>
              Un buen administrador te facilita la información antes de que la pidas, prepara
              cada junta para que no dependa de improvisar sobre la marcha y se ocupa de que
              cada decisión que se toma se lleve realmente a cabo.
            </p>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="position-block__highlight">
              Si eres presidente y sientes que llevas más peso del que deberías, ese es exactamente
              el punto de partida de una conversación.
            </p>
          </FadeUp>
          <FadeUp delay={0.3} className="pt-8">
            <Link
              to="/administracion-fincas/presidentes"
              className="duo-block__cta"
              onClick={() =>
                trackEvent("property_president_click", {
                  section: "bloque_presidente",
                  cta: "soy_presidente_de_una_comunidad",
                  destination: "/administracion-fincas/presidentes",
                })
              }
            >
              Soy presidente de una comunidad <span aria-hidden="true">→</span>
            </Link>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

const method = [
  { n: "01.", title: "Revisamos", text: "Analizamos el estado actual de la comunidad: cuentas, contratos, incidencias abiertas y documentación disponible. Sin dar nada por hecho." },
  { n: "02.", title: "Organizamos", text: "Ponemos orden: un calendario claro de juntas, pagos y mantenimientos, y un canal directo de comunicación con la presidencia." },
  { n: "03.", title: "Gestionamos", text: "Nos encargamos de la gestión diaria: proveedores, incidencias, impagos y cuentas, con seguimiento hasta que cada asunto se cierra." },
  { n: "04.", title: "Informamos", text: "La comunidad tiene acceso a la información en todo momento, sin esperar a la siguiente junta para saber qué está pasando." },
];

function Metodo() {
  return (
    <section id="metodo" className="py-[100px] border-t border-[var(--jch-line)]">
      <div className="method-block__inner">
        <div className="method-block__intro">
          <h2>
            <Curtain>Nuestra forma de <span className="jch-accent jch-italic">trabajar.</span></Curtain>
          </h2>
          <FadeUp delay={0.1}>
            <p>Un proceso ordenado, pensado para que la comunidad sepa siempre en qué punto está cada cosa.</p>
          </FadeUp>
        </div>
        <div className="method-steps">
          {method.map((m, idx) => (
            <FadeUp key={m.n} delay={idx * 0.08}>
              <div className="method-step">
                <span className="method-step__number">{m.n}</span>
                <div>
                  <h3 className="method-step__title">{m.title}</h3>
                  <p className="method-step__text">{m.text}</p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

const tecnologia = [
  { icon: "dashboard", title: "Portal del propietario", text: "Cuentas, actas y documentación de la comunidad disponibles online, en cualquier momento." },
  { icon: "build", title: "Seguimiento de incidencias", text: "Cada aviso queda registrado con su estado y su responsable, sin depender de llamadas sueltas." },
  { icon: "event", title: "Convocatorias y actas digitales", text: "Recepción y consulta de convocatorias, orden del día y actas sin depender del papel." },
];

function Tecnologia() {
  return (
    <section className="content-block py-[100px] border-t border-[var(--jch-line)] bg-[var(--jch-surface)]">
      <div className="content-block__inner">
        <div className="content-block__heading">
          <span className="block mb-4 text-xs uppercase tracking-widest text-[var(--jch-dim)]">
            Tecnología al servicio de la comunidad
          </span>
          <h2>
            <Curtain>Menos papeles. Más información. <span className="jch-accent jch-italic">Más control.</span></Curtain>
          </h2>
          <FadeUp delay={0.1}>
            <p>
              La comunicación con la comunidad no depende únicamente de la junta anual. Cada
              propietario puede consultar lo que necesita cuando lo necesita.
            </p>
          </FadeUp>
        </div>
        <div className="content-block__grid">
          {tecnologia.map((t, idx) => (
            <FadeUp key={t.title} delay={idx * 0.08}>
              <div className="content-card">
                <Icon name={t.icon} className="text-[var(--jch-accent-ink)] text-3xl mb-4" />
                <h3>{t.title}</h3>
                <p>{t.text}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

const gestionEconomica = [
  { n: "01", title: "Cuentas claras cada mes", text: "Ingresos, gastos y saldo disponibles y explicados, sin sorpresas al llegar el cierre del año." },
  { n: "02", title: "Protocolo de impagos", text: "Seguimiento y reclamación ordenada de las cuotas pendientes, con comunicación constante a la presidencia." },
  { n: "03", title: "Presupuestos y cierre anual", text: "Presupuesto ordinario preparado con antelación y cierre de cuentas listo para la junta." },
];

function GestionEconomica() {
  return (
    <section id="gestion-economica" className="content-block py-[100px] border-t border-[var(--jch-line)]">
      <div className="content-block__inner">
        <div className="content-block__heading">
          <h2>
            <Curtain>Saber dónde está el dinero <span className="text-[var(--jch-accent-ink)]">y para qué se utiliza.</span></Curtain>
          </h2>
          <FadeUp delay={0.1}>
            <p>La transparencia económica no debería ser un informe anual. Debería ser algo que se puede consultar en cualquier momento.</p>
          </FadeUp>
        </div>
        <div className="content-block__grid">
          {gestionEconomica.map((g, idx) => (
            <FadeUp key={g.n} delay={idx * 0.08}>
              <div className="content-card">
                <span className="content-card__category">{g.n}</span>
                <h3>{g.title}</h3>
                <p>{g.text}</p>
              </div>
            </FadeUp>
          ))}
        </div>
        <FadeUp delay={0.2} className="content-block__footer">
          <Link
            to="/administracion-fincas/gestion-economica-impagos"
            className="fincas-block__cta"
            onClick={() =>
              trackEvent("property_financial_management_click", {
                section: "gestion_economica",
                cta: "ver_gestion_economica_e_impagos",
                destination: "/administracion-fincas/gestion-economica-impagos",
              })
            }
          >
            Ver gestión económica e impagos <span aria-hidden="true">→</span>
          </Link>
        </FadeUp>
      </div>
    </section>
  );
}

function Incidencias() {
  const items = [
    { v: "Cada aviso registrado", l: "Con responsable y seguimiento desde el primer momento" },
    { v: "Un responsable", l: "Asignado a cada incidencia abierta" },
    { v: "Hasta el cierre", l: "Seguimiento hasta la resolución" },
  ];
  return (
    <section className="authority-block border-t border-[var(--jch-line)]">
      <div className="authority-block__inner">
        <FadeUp>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-10 text-center md:text-left">
            Una incidencia abierta debe tener <span className="jch-accent jch-italic">responsable</span> y seguimiento.
          </h2>
        </FadeUp>
        <div className="authority-block__grid">
          {items.map((s, idx) => (
            <FadeUp key={s.l} delay={idx * 0.1}>
              <span className="authority-block__value">{s.v}</span>
              <span className="authority-block__label">{s.l}</span>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

const juntas = [
  { n: "01", title: "Convocatoria con antelación", text: "Orden del día claro y enviado con tiempo suficiente para prepararla." },
  { n: "02", title: "Documentación disponible antes", text: "Cuentas y propuestas accesibles para revisar con calma, no en el momento de la junta." },
  { n: "03", title: "Acta clara y a tiempo", text: "Redactada y enviada sin demoras, con los acuerdos reflejados con precisión." },
];

function Juntas() {
  return (
    <section id="juntas" className="content-block py-[100px] border-t border-[var(--jch-line)] bg-[var(--jch-surface)]">
      <div className="content-block__inner">
        <div className="content-block__heading">
          <h2>
            <Curtain><span className="jch-accent jch-italic">Una buena junta</span> empieza antes de sentarse alrededor de una mesa.</Curtain>
          </h2>
        </div>
        <div className="content-block__grid">
          {juntas.map((j, idx) => (
            <FadeUp key={j.n} delay={idx * 0.08}>
              <div className="content-card">
                <span className="content-card__category">{j.n}</span>
                <h3>{j.title}</h3>
                <p>{j.text}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

const necesidades = [
  {
    n: "01",
    title: "Cambio de administrador",
    kicker: "Un cambio ordenado, sin interrupciones innecesarias",
    text: "Si la comunidad no está contenta con el administrador actual, el cambio se puede hacer de forma ordenada y sin interrupciones en el servicio.",
    img: "/fincas.webp",
    href: "/administracion-fincas/cambio-administrador" as const,
    event: "property_change_admin_click" as const,
  },
  {
    n: "02",
    title: "Soy presidente",
    kicker: "El apoyo que necesitas",
    text: "Recién nombrado o con experiencia, cuenta con un administrador que te facilita el trabajo y te acompaña en cada decisión.",
    img: "/nosotros_cliente.webp",
    href: "/administracion-fincas/presidentes" as const,
    event: "property_president_click" as const,
  },
  {
    n: "03",
    title: "Nueva comunidad",
    kicker: "Desde la primera junta",
    text: "Comunidades de nueva construcción: constitución, primeros presupuestos y puesta en marcha con criterio desde el primer día.",
    img: "/jc-service-fincas.webp",
    href: "/administracion-fincas/nueva-comunidad" as const,
    event: "property_new_community_click" as const,
  },
  {
    n: "04",
    title: "Gestión económica e impagos",
    kicker: "Cuentas claras, cuotas al día",
    text: "Control económico mensual y un protocolo definido para actuar cuando hay cuotas pendientes.",
    img: "/patrimonial.webp",
    href: "/administracion-fincas/gestion-economica-impagos" as const,
    event: "property_financial_management_click" as const,
  },
];

function CuatroNecesidades() {
  return (
    <section className="portal-block py-[100px] border-t border-[var(--jch-line)]">
      <div className="portal-block__inner">
        <div className="portal-block__heading">
          <h2>
            <Curtain>¿Qué necesita <span className="jch-accent jch-italic">tu comunidad</span> ahora mismo?</Curtain>
          </h2>
          <FadeUp delay={0.1}>
            <p>Cuatro situaciones habituales. Cada una con su propia forma de empezar.</p>
          </FadeUp>
        </div>
        <div className="portal-grid">
          {necesidades.map((item, idx) => (
            <FadeUp key={item.n} delay={idx * 0.08} className="portal-card__wrap">
              <Link
                to={item.href}
                className="portal-card"
                onClick={() =>
                  trackEvent(item.event, {
                    section: "cuatro_necesidades",
                    cta: item.title,
                    destination: item.href,
                  })
                }
              >
                <div className="portal-card__art">
                  <img src={item.img} alt={item.title} loading="lazy" />
                </div>
                <div className="portal-card__body">
                  <span className="portal-card__number">{item.n}</span>
                  <h3>{item.title}</h3>
                  <p className="portal-card__kicker">{item.kicker}</p>
                  <p className="portal-card__text">{item.text}</p>
                  <span className="portal-card__cta">
                    Ver más <span aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

function Filosofia() {
  return (
    <section className="fincas-block border-t border-[var(--jch-line)]">
      <div className="fincas-block__inner">
        <span className="fincas-block__eyebrow">Filosofía de trabajo</span>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Una <span className="jch-accent jch-italic">gestión</span> que puedas seguir.</h2>
        <p className="fincas-block__lead">
          No se trata de prometer que no habrá problemas. Se trata de que, cuando los haya,
          la comunidad sepa exactamente qué está pasando y quién se está ocupando de resolverlo.
        </p>
        <ul className="fincas-block__list">
          <li>Cuentas siempre disponibles, no solo en la junta anual</li>
          <li>Comunicación directa con la presidencia, sin intermediarios</li>
          <li>Cada incidencia con responsable y fecha de seguimiento</li>
          <li>Ninguna decisión importante sin que la comunidad la entienda antes</li>
        </ul>
      </div>
    </section>
  );
}

function AmbitoGeografico() {
  return (
    <section className="position-block py-[100px] border-t border-[var(--jch-line)] bg-[var(--jch-surface)]">
      <div className="position-block__inner">
        <h2>
          <Curtain><span className="jch-accent jch-italic">Administración</span> de fincas en Altea y Marina Baixa.</Curtain>
        </h2>
        <div className="position-block__body">
          <FadeUp delay={0.1}>
            <p>
              Trabajo con comunidades de propietarios en Altea y su entorno más cercano, con
              atención presencial cuando la comunidad lo necesita y sin depender de gestiones
              a distancia para lo importante.
            </p>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="position-block__highlight">
              Altea · Benidorm · Alicante · L'Alfàs del Pi · Calpe · Marina Baixa · Costa Blanca
            </p>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

function CtaFinal() {
  return (
    <section id="contact" className="py-[100px] border-t border-[var(--jch-line)]">
      <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24">
        <div className="space-y-12">
          <h2 className="contact-editorial__title text-5xl md:text-6xl font-bold tracking-tight">
            <Curtain>Una propuesta <span className="text-[var(--jch-accent-ink)]">antes de tomar una decisión</span></Curtain>
          </h2>
          <FadeUp delay={0.1}>
            <p className="contact-editorial__description text-xl leading-relaxed">
              Cuéntame la situación de tu comunidad y te preparo una propuesta con honorarios
              claros, sin compromiso.
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
          <PropertyLeadForm />
        </FadeUp>
      </div>
    </section>
  );
}

function PropertyLeadForm() {
  const submit = useServerFn(submitContact);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    locality: "",
    units: "",
    topic: "Buscamos nuevo administrador",
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
        trackEvent("property_management_proposal_start", { section: "formulario" });
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
    const extraNote = [
      form.locality && `Localidad: ${form.locality}`,
      form.units && `Nº aproximado de propiedades: ${form.units}`,
    ]
      .filter(Boolean)
      .join(" · ");
    const payload = {
      name: form.name,
      phone: form.phone,
      email: form.email,
      topic: form.topic,
      message: extraNote ? `${extraNote}${form.message ? " · " + form.message : ""}` : form.message,
      website: honeypotRef.current?.value ?? "",
      formLoadedAt: formLoadedAtRef.current,
    };
    try {
      await submit({ data: payload });
      setStatus("ok");
      trackEvent("property_form_submit", { section: "formulario", topic: form.topic });
      trackEvent("property_management_proposal_submit", { section: "formulario", topic: form.topic });
      setForm({ name: "", phone: "", email: "", locality: "", units: "", topic: "Buscamos nuevo administrador", message: "" });
      setAccepted(false);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "No se ha podido enviar el formulario.");
    }
  }

  return (
    <form id="contact-form" className="contact-form-card space-y-10 scroll-mt-28" onSubmit={onSubmit}>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <Field label="Email (opcional)" type="email" placeholder="tu@email.com" value={form.email} onChange={onChange("email")} />
        <Field label="Localidad" type="text" placeholder="Ej. Altea" value={form.locality} onChange={onChange("locality")} />
      </div>
      <Field
        label="Número aproximado de propiedades (opcional)"
        type="text"
        placeholder="Ej. 24 viviendas"
        value={form.units}
        onChange={onChange("units")}
      />
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em]">Motivo de consulta</label>
        <select
          value={form.topic}
          onChange={onChange("topic")}
          className="w-full bg-transparent border-0 border-b border-[var(--jch-line)] px-0 py-4 focus:ring-0 focus:border-[#C5A566] transition-colors outline-none"
        >
          <option>Buscamos nuevo administrador</option>
          <option>Soy presidente</option>
          <option>Nueva comunidad</option>
          <option>Gestión económica-impagos</option>
          <option>Otro</option>
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em]">Mensaje (opcional)</label>
        <textarea
          rows={4}
          placeholder="Cuéntanos la situación de tu comunidad"
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
        {status === "sending" ? "Enviando…" : status === "ok" ? "¡Enviado!" : "Solicitar propuesta"}
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
        className="w-full bg-transparent border-0 border-b border-[var(--jch-line)] px-0 py-4 focus:ring-0 focus:border-[#C5A566] transition-colors outline-none placeholder:text-[var(--jch-dim)]"
      />
    </div>
  );
}

const faqs = [
  {
    q: "¿Cuánto cuesta la administración de fincas?",
    a: "Depende del tamaño de la comunidad, el número de propietarios y los servicios que necesite. Tras una primera toma de contacto, se entrega una propuesta con honorarios claros y sin compromiso.",
  },
  {
    q: "¿Cómo se gestiona el cambio de administrador?",
    a: "Se coordina con el administrador saliente el traspaso de documentación, cuentas y contratos en curso, para que la comunidad no note ninguna interrupción en el servicio.",
  },
  {
    q: "¿Qué pasa con los propietarios que no pagan sus cuotas?",
    a: "Se aplica un protocolo de seguimiento y reclamación ordenada, con comunicación constante a la presidencia y, cuando es necesario, coordinación con asesoría legal.",
  },
  {
    q: "¿Ofrecéis un portal o app para los propietarios?",
    a: "Sí. Los propietarios pueden consultar cuentas, actas y documentación de la comunidad, y seguir el estado de las incidencias abiertas.",
  },
  {
    q: "¿En qué zonas trabajáis?",
    a: "Altea, Benidorm, Alicante, L'Alfàs del Pi, Calpe y el resto de la Marina Baixa y Costa Blanca.",
  },
  {
    q: "Ya tenemos administrador, ¿podemos cambiar en cualquier momento?",
    a: "El cambio se acuerda en junta de propietarios. Se explica el procedimiento y los plazos concretos según la situación de cada comunidad antes de dar cualquier paso.",
  },
];

function ContenidoAutoridad() {
  const posts = blogPosts.filter((p) => p.service === "fincas");

  if (posts.length === 0) return null;

  return (
    <section className="content-block py-[100px] border-t border-[var(--jch-line)] bg-[var(--jch-surface)]">
      <div className="content-block__inner">
        <div className="content-block__heading">
          <h2>
            <Curtain>Artículos para <span className="jch-accent jch-italic">entender antes</span> de decidir</Curtain>
          </h2>
          <FadeUp delay={0.1}>
            <p>Contenido propio sobre convivencia, normativa y gestión de comunidades.</p>
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

function Footer() {
  return (
    <footer className="bg-[#1A1A1A] py-24 text-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-16">
          <div className="flex items-center gap-4 text-center md:text-left">
            <img src="/hilolegal-logo-white.webp" alt="Logo HiloLegal" loading="lazy" className="h-9 w-auto object-contain" />
            <div className="space-y-2">
              <div className="text-2xl font-black tracking-tighter uppercase">Administración de Fincas</div>
              <p className="text-gray-500 text-xs tracking-widest uppercase">José Carlos Hidalgo · HiloLegal</p>
            </div>
          </div>
          <motion.a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -2 }}
            transition={spring}
            className="rounded-full border border-white/20 px-8 py-4 text-xs font-medium uppercase tracking-[0.14em] text-white transition-colors hover:border-[#1f6f78] hover:text-[#1f6f78]"
          >
            Escríbenos por WhatsApp
          </motion.a>
        </div>
        <div className="mt-20 pt-10 border-t border-white/5 flex flex-col items-center gap-4">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[12px] text-gray-400">
            <Link to="/josecarlos" className="hover:text-[var(--jch-accent-ink)] transition-colors">Asesoría financiera e hipotecaria</Link>
            <span aria-hidden="true">·</span>
            <a href="/terminos.html" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--jch-accent-ink)] transition-colors">Términos y condiciones</a>
            <span aria-hidden="true">·</span>
            <a href="/privacidad.html" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--jch-accent-ink)] transition-colors">Política de privacidad</a>
            <span aria-hidden="true">·</span>
            <a href="https://share.google/GlqwXv7lO958pDPDS" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--jch-accent-ink)] transition-colors">Ver en Google Maps</a>
          </div>
          <div className="text-center text-[10px] text-gray-600 uppercase tracking-widest">
            © {new Date().getFullYear()} HILOLEGAL. TODOS LOS DERECHOS RESERVADOS.
          </div>
        </div>
      </div>
    </footer>
  );
}
