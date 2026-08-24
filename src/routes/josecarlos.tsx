import React, { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { AnimatePresence, motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ThemeToggle } from "@/components/ThemeToggle";
import { submitContact } from "@/lib/contact.functions";

export const Route = createFileRoute("/josecarlos")({
  head: () => ({
    title: "José Carlos Hidalgo | Asesoramiento Financiero e Hipotecario",
    meta: [
      {
        name: "description",
        content:
          "Asesoramiento financiero e hipotecario para autónomos y familias. Protege tus ingresos, tu familia y tu futuro financiero. Diagnóstico gratuito en Altea, Benidorm y Alicante.",
      },
      { property: "og:title", content: "José Carlos Hidalgo | Asesor Financiero" },
      {
        property: "og:description",
        content: "Protege tus ingresos, tu familia y tu futuro financiero.",
      },
    ],
    links: [
      { rel: "canonical", href: "https://hilolegal.es/josecarlos/" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=analytics,assured_workload,balance,call,close,domain,expand_more,family_restroom,location_on,mail,map,medical_services,menu,real_estate_agent,travel_explore,trending_up,visibility&display=swap",
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
              jobTitle: "Asesor Financiero e Hipotecario",
              url: "https://hilolegal.es/josecarlos",
              telephone: "+34647506040",
              email: "josecarlos@hilolegal.es",
              image: "https://hilolegal.es/8.webp",
              sameAs: [
                "https://www.linkedin.com/in/jos%C3%A9carloshidalgo/",
                "https://www.instagram.com/jokhid/",
                "https://www.facebook.com/josecarlos.hidalgoortega/",
                "https://share.google/GlqwXv7lO958pDPDS",
              ],
              worksFor: {
                "@type": "Organization",
                name: "HiloLegal",
                url: "https://hilolegal.es",
              },
              knowsAbout: [
                "Hipotecas",
                "Seguros de vida",
                "Seguros de salud",
                "Planificación financiera",
                "Ahorro e inversión",
                "Administración de fincas",
                "Protección patrimonial",
              ],
            },
            {
              "@type": "FinancialService",
              name: "José Carlos Hidalgo — Asesoría Financiera e Hipotecaria",
              url: "https://hilolegal.es/josecarlos",
              telephone: "+34647506040",
              email: "josecarlos@hilolegal.es",
              image: "https://hilolegal.es/8.webp",
              description:
                "Asesoramiento financiero e hipotecario para autónomos y familias en Altea, Benidorm y Alicante. Hipotecas hasta el 100%, seguros, pensiones y administración de fincas en la Costa Blanca.",
              priceRange: "€€",
              openingHours: "Mo-Fr 09:00-19:00",
              hasMap: "https://share.google/GlqwXv7lO958pDPDS",
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
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "Hipotecas hasta el 100% de financiación" } },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "Seguros de vida y salud" } },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "Planificación financiera personal" } },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "Ahorro, pensión e inversión" } },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "Administración de fincas" } },
              ],
            },
            {
              "@type": "FAQPage",
              mainEntity: [
                { "@type": "Question", name: "¿Realmente es gratuito el primer diagnóstico?", acceptedAnswer: { "@type": "Answer", text: "Sí, totalmente. Mi objetivo en esta primera toma de contacto es entender si puedo ayudarte. Tú obtienes claridad sobre tu situación y yo entiendo el reto. Sin compromisos." } },
                { "@type": "Question", name: "¿Trabajas con todos los bancos para las hipotecas?", acceptedAnswer: { "@type": "Answer", text: "Trabajo con ING y ABANCA, dos bancos muy competitivos con los que puedes llegar a conseguir hasta el 100% de financiación." } },
                { "@type": "Question", name: "¿Puedes ayudarme a conseguir una hipoteca?", acceptedAnswer: { "@type": "Answer", text: "Sí. Analizo tu perfil financiero, ingresos, ahorro disponible, estabilidad laboral, nivel de endeudamiento y viabilidad de la operación. Después vemos qué opciones hipotecarias pueden encajar mejor con tu caso." } },
                { "@type": "Question", name: "¿Atiendes presencialmente en Alicante?", acceptedAnswer: { "@type": "Answer", text: "Atiendo presencialmente en toda la zona de Alicante, Marina Baixa, Benidorm y Altea. Si estás fuera, realizo consultas por videollamada con la misma eficacia." } },
                { "@type": "Question", name: "¿Por qué es importante para un autónomo revisar su protección financiera?", acceptedAnswer: { "@type": "Answer", text: "Porque muchos autónomos tienen ingresos variables y una cobertura pública limitada si dejan de trabajar por enfermedad, accidente o incapacidad. Una mala planificación puede afectar directamente a su familia, su negocio y su patrimonio." } },
                { "@type": "Question", name: "¿También trabajas ahorro e inversión?", acceptedAnswer: { "@type": "Answer", text: "Sí. Analizo tu capacidad de ahorro, horizonte temporal, tolerancia al riesgo y objetivos. A partir de ahí, podemos valorar soluciones de ahorro, inversión, previsión social o jubilación adaptadas a tu perfil." } },
              ],
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

const services = [
  { icon: "analytics", title: "Planificación financiera personal", text: "Análisis completo de objetivos vitales para diseñar una hoja de ruta a medida.", cta: "Planificación financiera" },
  { icon: "real_estate_agent", title: "Hipotecas en Altea, Benidorm y Alicante", text: "Consigue hasta el 100% de financiación para tu vivienda en la zona.", cta: "Estudiar mi hipoteca" },
  { icon: "assured_workload", title: "Servicios de protección inteligente", text: "Especializado en blindar tu patrimonio y asegurar que el futuro de tu familia esté siempre bajo control.", cta: "Proteger mis ingresos" },
  { icon: "trending_up", title: "Pensión, ahorro e inversión", text: "Vehículos eficientes para que tus ahorros batan a la inflación con el riesgo bajo control. Rentabilidad con garantías y beneficios fiscales.", cta: "Planificar mi jubilación" },
  { icon: "family_restroom", title: "Salud Premium", text: "Acceso preferente a la mejor medicina privada sin esperas ni colas. Seguro médico total. Adaptado a ti. Especialistas top.", cta: "Ver opciones de salud" },
  { icon: "domain", title: "Administración de fincas", text: "Gestión profesional de comunidades, optimizando costes, con claridad y transparencia, utilizando herramientas innovadoras.", cta: "Administración de comunidades" },
];

const errors = [
  { n: "01", title: "Piden la hipoteca sin preparar su perfil", text: "Llegan al banco con prisas y sin saber que una preparación previa ahorra miles de euros en intereses." },
  { n: "02", title: "Confían todo a sus ingresos actuales", text: "Especialmente autónomos. El bienestar de hoy no garantiza la seguridad de mañana sin un plan B real." },
  { n: "03", title: "Preparan la jubilación demasiado tarde", text: "El interés compuesto necesita tiempo. Cada año que esperas, el coste de oportunidad es mayor." },
];

const method = [
  { n: "01.", title: "Analizo tu punto de partida", text: "Sin juicios. Recopilamos datos reales de tu economía actual para tener una base sólida sobre la que construir." },
  { n: "02.", title: "Detecto riesgos y debilidades", text: "Puntos ciegos donde estás asumiendo un riesgo que no conocías." },
  { n: "03.", title: "Diseño un plan accionable", text: "Recibirás recomendaciones claras y pasos a seguir que tú decides si ejecutar o no." },
  { n: "04.", title: "Estoy a tu lado en el camino", text: "No te dejo solo con un informe. Te acompaño en cada decisión importante, revisamos el plan cuando tu vida cambia y ajustamos los siguientes pasos para que avances con seguridad." },
];

const faqs = [
  {
    q: "¿Realmente es gratuito el primer diagnóstico?",
    a: "Sí, totalmente. Mi objetivo en esta primera toma de contacto es entender si puedo ayudarte. Tú obtienes claridad sobre tu situación y yo entiendo el reto. Sin compromisos.",
  },
  {
    q: "¿Trabajas con todos los bancos para las hipotecas?",
    a: "Trabajo con ING y ABANCA, dos bancos muy competitivos con los que puedes llegar a conseguir hasta el 100% de financiación.",
  },
  {
    q: "¿Puedes ayudarme a conseguir una hipoteca?",
    a: "Sí. Analizo tu perfil financiero, ingresos, ahorro disponible, estabilidad laboral, nivel de endeudamiento y viabilidad de la operación. Después vemos qué opciones hipotecarias pueden encajar mejor con tu caso.",
  },
  {
    q: "¿Atiendes presencialmente en Alicante?",
    a: "Atiendo presencialmente en toda la zona de Alicante, Marina Baixa, Benidorm y Altea. Si estás fuera, realizo consultas por videollamada con la misma eficacia.",
  },
  {
    q: "¿Puedo mejorar mi hipoteca actual?",
    a: "Sí. Podemos revisar tu hipoteca actual, tipo de interés, cuota, vinculaciones, seguros asociados y condiciones. En algunos casos puede ser interesante estudiar una novación, subrogación o cambio de estrategia financiera.",
  },
  {
    q: "¿Por qué es importante para un autónomo revisar su protección financiera?",
    a: "Porque muchos autónomos tienen ingresos variables y una cobertura pública limitada si dejan de trabajar por enfermedad, accidente o incapacidad. Una mala planificación puede afectar directamente a su familia, su negocio y su patrimonio.",
  },
  {
    q: "¿También trabajas ahorro e inversión?",
    a: "Sí. Analizo tu capacidad de ahorro, horizonte temporal, tolerancia al riesgo y objetivos. A partir de ahí, podemos valorar soluciones de ahorro, inversión, previsión social o jubilación adaptadas a tu perfil.",
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
    <div className="josecarlos-original bg-white text-[#1A1A1A] selection:bg-[#C5A566] selection:text-white">
      <SmoothScroll />
      <Header />

      <main>
        <Hero />
        <TrustStats />
        <Diagnosis />
        <Problem />
        <Services />
        <Method />
        <Partners />
        <About />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks: [string, string][] = [
    ["Servicios", "#services"],
    ["Método", "#method"],
    ["Sobre mí", "#about"],
    ["Blog", "/blog"],
    ["FAQ", "#faq"],
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

          <div className="hidden items-center gap-10 md:flex">
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
              className="hidden bg-[#1f6f78] px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#C5A566] sm:inline-block"
              href={WHATSAPP}
            >
              WhatsApp
            </motion.a>

            <button
              type="button"
              aria-label="Abrir menú"
              onClick={() => setMobileOpen((v) => !v)}
              className="-mr-2 p-2 text-2xl text-[#1f6f78] md:hidden"
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
                className="self-end text-3xl text-[#1f6f78]"
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
                  className="mt-2 inline-block bg-[#1f6f78] px-6 py-3 text-center text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#C5A566]"
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
        alt="Asesoramiento financiero e hipotecario"
        className="hero-bg-image"
        src="/yoderecha.webp"
        loading="eager"
        decoding="async"
        fetchPriority="high"
      />
      <div className="hero-bg-overlay" aria-hidden="true" />
      <div className="mx-auto px-6">
        <motion.div style={{ y: textY }} className="space-y-10">
          <FadeUp>
            <div className="inline-flex items-center gap-3 text-[#1f6f78] font-bold text-xs uppercase tracking-widest">
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: 32 }}
                transition={{ duration: 0.9, ease: easeOutExpo, delay: 0.4 }}
                className="h-[2px] bg-[#C5A566] block"
              />
              HIPOTECAS, AHORRO, PENSIONES, SEGUROS Y ADMINISTRACIÓN DE FINCAS EN ALTEA
            </div>
          </FadeUp>

          <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.08] tracking-tight text-balance">
            {["Tu hipoteca, tus seguros y", <span className="text-[var(--jch-accent-ink)]">tu futuro financiero</span>, "no deberían decidirse por intuición."].map((line, i) => (
              <Curtain key={i} delay={0.15 + i * 0.1} className="block">
                <span className="block">{line}</span>
              </Curtain>
            ))}
          </h1>

          <FadeUp delay={0.6}>
            <p className="text-xl text-white/70 max-w-xl leading-relaxed">
              Analizo tu situación, detecto riesgos y te propongo un plan claro para proteger tus ingresos, financiar tu vivienda o preparar tu futuro con criterio.
            </p>
          </FadeUp>

          <FadeUp delay={0.75}>
            <div className="flex flex-wrap gap-6 pt-2">
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={spring}
                className="bg-[#C5A566] text-black px-10 py-5 font-bold uppercase text-xs tracking-widest hover:bg-white transition-colors shadow-xl shadow-[#C5A566]/20"
                href="#contact"
              >
                Quiero mi diagnóstico gratuito
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
    { i: "visibility", t: "360º visión financiera y patrimonial" },
    { i: "map", t: "1 plan claro antes de contratar" },
    { i: "medical_services", t: "0€ diagnóstico inicial" },
  ];
  return (
    <section className="py-16 border-b border-[#E5E5E5]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:divide-x divide-[#E5E5E5]">
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
    { n: "01", t: "Ingresos y estabilidad", d: "¿Qué pasaría si mañana no pudieras facturar? Aseguramos tu motor financiero principal. No se trata de miedo, se trata de amor y responsabilidad.", img: 3 },
    { n: "02", t: "Hipoteca y endeudamiento", d: "Analizo las ofertas disponibles, tu capacidad de endeudamiento y la viabilidad real de la operación antes de que firmes. El objetivo es que tu vivienda sea una decisión segura y sostenible, no una carga para tu economía.", img: 2 },
    { n: "03", t: "Ahorro, pensión y protección", d: "Estrategias de medio y largo plazo para que tu nivel de vida no dependa solo de tu trabajo actual.", img: 4 },
  ];
  return (
    <section className="py-[100px]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="mb-24 space-y-6 max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-balance">
            <Curtain>
              <span className="block">No vendo productos.</span>
              <span className="block text-[var(--jch-accent-ink)]">Ordeno decisiones</span>
            </Curtain>
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
                <div className="relative overflow-hidden aspect-[4/5]">
                  <motion.img
                    src={IMG(x.img)}
                    loading="lazy"
                    alt={x.t}
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
                <p className="text-[#4A4A4A] leading-relaxed">{x.d}</p>
              </article>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

function Problem() {
  return (
    <section className="py-[100px] bg-[#1A1A1A] text-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          <div className="lg:sticky lg:top-32 space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
              <Curtain>La mayoría toma <span className="text-[var(--jch-accent-ink)]">decisiones financieras</span> demasiado tarde</Curtain>
            </h2>
            <FadeUp delay={0.2}>
              <p className="text-xl text-gray-400">Evitar los errores comunes es el primer paso para una economía sana. Mi trabajo es anticiparme a ellos.</p>
            </FadeUp>
          </div>
          <div className="space-y-12">
            {errors.map((e, idx) => (
              <FadeUp key={e.n} delay={idx * 0.1}>
                <motion.div
                  whileHover={{ x: 8 }}
                  transition={spring}
                  className="p-10 border border-white/10 hover:border-[#C5A566] transition-colors"
                >
                  <span className="text-[var(--jch-accent-ink)] font-bold text-xs uppercase tracking-[0.2em] mb-6 block">Error Común {e.n}</span>
                  <h4 className="text-2xl font-bold mb-4">{e.title}</h4>
                  <p className="text-gray-400 leading-relaxed">{e.text}</p>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}



function Services() {
  return (
    <section id="services" className="services-editorial">
      <div className="services-editorial__inner">
        <div className="services-editorial__heading">
          <h2>
            <Curtain><span className="text-[var(--jch-accent-ink)]">Soluciones</span> para proteger tu economía</Curtain>
          </h2>
          <FadeUp delay={0.15}>
            <p>Un enfoque integral para que todas las piezas de tu puzzle financiero encajen a la perfección.</p>
          </FadeUp>
        </div>

        <div className="services-editorial__grid">
          {services.map((service, index) => (
            <FadeUp key={service.title} delay={(index % 3) * 0.08} className="services-editorial__item">
              <article className="services-editorial__card">
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                <a href="#contact" className="services-editorial__cta">
                  <span aria-hidden="true" />
                  {service.cta}
                </a>
              </article>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

function Method() {
  const reduce = useReducedMotion();

  return (
    <section id="method" className="py-[100px] border-y border-[#E5E5E5]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          <div className="space-y-12">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
              <Curtain>No se trata de contratar más. Se trata de <span className="text-[var(--jch-accent-ink)]">decidir mejor</span></Curtain>
            </h2>
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
                    <h4 className="method-step__title">{m.title}</h4>
                    <p className="method-step__text">{m.text}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
          <FadeUp delay={0.1}>
            <div className="relative overflow-hidden aspect-square lg:sticky lg:top-28">
              <motion.img
                src={IMG(9)}
                loading="lazy"
                alt="Método de asesoramiento"
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ scale: 1.1 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, ease: easeOutExpo }}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white space-y-2">
                <Icon name="balance" className="text-white text-5xl" />
                <p className="font-bold uppercase tracking-widest text-xs">Equilibrio Financiero</p>
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
          <FadeUp className="lg:col-span-5 lg:-mt-130">
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
                <h2 className="text-5xl font-bold tracking-tight">José Carlos Hidalgo Ortega</h2>
                <p className="text-2xl font-medium text-[var(--jch-accent-ink)] italic">Especialista en protección patrimonial e hipotecas en Altea · Costa Blanca · Alicante</p>
              </div>
            </FadeUp>
            <FadeUp delay={0.1}>
              <div className="space-y-6 text-xl text-[#4A4A4A] leading-relaxed">
                <p>Hay una frase que escucho con frecuencia en mi trabajo: «Ojalá hubiera hablado con alguien antes de firmar esto.»</p>
                <p>Mi objetivo es que tú nunca tengas que decirla.</p>
                <p>Llevo años acompañando a familias y autónomos de la Costa Blanca en las decisiones financieras que más pesan: conseguir una hipoteca en las mejores condiciones posibles, proteger los ingresos ante lo inesperado, planificar el ahorro o su jubilación con cabeza o gestionar la comunidad de vecinos sin dramas.</p>
                <p>No soy el asesor que te recomienda el producto del mes. Soy el que se sienta contigo, revisa tu situación real y te dice lo que necesitas escuchar, aunque no siempre sea lo más fácil.</p>
                <p>Trabajo como gestor en Nationale-Nederlanden, ING y ABANCA. Eso me permite comparar y negociar en tu nombre, no defender los intereses de un banco concreto.</p>
                <p>Además, soy cofundador de HiloLegal, una firma legal y de administración de fincas que nació de la misma convicción: que la gente merece profesionales que hablen claro y cumplan lo que dicen.</p>
                <p>Si estás en Altea, Benidorm, la Marina Baixa o la provincia de Alicante y quieres un diagnóstico honesto de tu situación financiera, el primer paso no cuesta nada.</p>
              </div>
            </FadeUp>
            <FadeUp delay={0.2}>
              <div className="flex flex-wrap gap-3 pt-2">
                {["Autónomos", "Familias", "Hipotecas", "Protección", "Ahorrar", "Administración de fincas"].map((t) => (
                  <motion.span
                    key={t}
                    whileHover={{ y: -2, backgroundColor: "#1A1A1A", color: "#FFFFFF" }}
                    transition={spring}
                    className="border border-[#E5E5E5] px-6 py-2 text-xs font-bold uppercase tracking-widest cursor-default"
                  >
                    {t}
                  </motion.span>
                ))}
              </div>
            </FadeUp>
            <FadeUp delay={0.3}>
              <div className="flex items-center gap-4 text-[#1A1A1A] font-bold">
                <Icon name="location_on" className="text-[var(--jch-accent-ink)]" />
                <span className="text-sm uppercase tracking-widest text-[var(--jch-accent-ink)]">Altea · Benidorm · Costa Blanca · Alicante · Online</span>
              </div>
            </FadeUp>
            <FadeUp delay={0.4}>
              <a
                href="https://share.google/GlqwXv7lO958pDPDS"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-bold text-[var(--jch-accent-ink)] hover:text-[#1A1A1A] transition-colors"
              >
                <Icon name="travel_explore" className="text-base" />
                Ver mi perfil en Google
              </a>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="py-[100px] bg-[#F5F5F5]">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-4xl font-bold tracking-tight text-center mb-20 uppercase">
          <Curtain>Dudas normales antes de decidir</Curtain>
        </h2>
        <div className="space-y-px bg-[#E5E5E5]">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <FadeUp key={f.q} delay={i * 0.05}>
                <div className="bg-white">
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
                    <div className="px-8 pb-8 text-[#4A4A4A] leading-relaxed">{f.a}</div>
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
    topic: "Diagnóstico General",
    message: "",
  });

  const onChange = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

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
      setForm({ name: "", phone: "", email: "", topic: "Diagnóstico General", message: "" });
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
          <h2 className="contact-editorial__title text-5xl md:text-6xl font-bold tracking-tight">
            <Curtain>Hablemos de tu <span className="text-[var(--jch-accent-ink)]">tranquilidad financiera</span></Curtain>
          </h2>
          <FadeUp delay={0.1}>
            <p className="contact-editorial__description text-xl leading-relaxed">
              Rellena el formulario y me pondré en contacto contigo en menos de 24 horas para agendar tu diagnóstico gratuito.
            </p>
          </FadeUp>
          <div className="space-y-10 pt-10 border-t border-[#E5E5E5]">
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
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-[#1A1A1A] flex items-center justify-center text-white group-hover:bg-[#C5A566] transition-colors shrink-0">
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
            <div className="pt-10 border-t border-[#E5E5E5] space-y-4">
              <div className="flex items-center gap-3">
                <Icon name="location_on" className="text-[var(--jch-accent-ink)] text-xl" />
                <p className="text-sm font-bold uppercase tracking-widest">Calle Calitx 9, 03590 Altea</p>
              </div>
              <div className="w-full aspect-[4/3] overflow-hidden border border-[#E5E5E5]">
                <iframe
                  title="Mapa Calle Calitx 9, Altea"
                  src="https://www.google.com/maps?q=Calle+Calitx+9,+03590+Altea,+Alicante&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full border-0"
                />
              </div>
            </div>
          </FadeUp>
        </div>
        <FadeUp>
          <form id="contact-form" className="contact-form-card space-y-10 scroll-mt-28" onSubmit={onSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <Field label="Nombre" type="text" placeholder="Tu nombre" value={form.name} onChange={onChange("name")} required />
              <Field label="Teléfono" type="tel" placeholder="Tu número" value={form.phone} onChange={onChange("phone")} required />
            </div>
            <Field label="Email" type="email" placeholder="tu@email.com" value={form.email} onChange={onChange("email")} required />
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em]">¿Qué necesitas revisar?</label>
              <select
                value={form.topic}
                onChange={onChange("topic")}
                className="w-full bg-transparent border-0 border-b border-[#E5E5E5] px-0 py-4 focus:ring-0 focus:border-[#C5A566] transition-colors outline-none"
              >
                <option>Diagnóstico General</option>
                <option>Nueva Hipoteca</option>
                <option>Protección (Autónomos)</option>
                <option>Plan de Jubilación</option>
                <option>Administración de Fincas</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em]">Mensaje</label>
              <textarea
                rows={4}
                placeholder="Cuéntanos tu situación"
                value={form.message}
                onChange={onChange("message")}
                className="w-full bg-transparent border-0 border-b border-[#E5E5E5] px-0 py-4 focus:ring-0 focus:border-[#C5A566] transition-colors outline-none placeholder:text-gray-300"
              />
            </div>

            <label className="flex items-start gap-3 text-sm text-[#4A4A4A] leading-relaxed cursor-pointer">
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
              whileHover={{ scale: status === "sending" ? 1 : 1.02, color: "#ffffff" }}
              whileTap={{ scale: status === "sending" ? 1 : 0.98 }}
              transition={spring}
              type="submit"
              disabled={status === "sending"}
              style={{ color: "#000000" }}
              className="w-full bg-[#C5A566] py-6 font-black uppercase text-xs tracking-[0.3em] hover:bg-[#1A1A1A] transition-colors shadow-2xl shadow-[#C5A566]/20 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === "sending" ? "Enviando…" : status === "ok" ? "¡Enviado!" : "Enviar Solicitud"}
            </motion.button>


            {status === "ok" && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-[#1A1A1A] font-bold uppercase tracking-widest"
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
        </FadeUp>
      </div>
    </section>
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
              <p className="text-gray-500 text-xs tracking-widest uppercase">Gestión patrimonial e hipotecaria</p>
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
        className="w-full bg-transparent border-0 border-b border-[#E5E5E5] px-0 py-4 focus:ring-0 focus:border-[#C5A566] transition-colors outline-none placeholder:text-gray-300"
      />
    </div>
  );
              }

const partners = [
  { name: "Nationale-Nederlanden", className: "font-serif italic" },
  { name: "ING", className: "font-extrabold tracking-tight" },
  { name: "ABANCA", className: "font-bold tracking-[0.15em]" },
  { name: "Sanitas", className: "font-semibold" },
  { name: "Caser", className: "font-bold tracking-wide" },
];

function Partners() {
  return (
    <section aria-label="Entidades colaboradoras" className="partners-editorial">
      <div className="partners-editorial__inner">
        <FadeUp>
          <p className="partners-editorial__label">
            Colaboro con entidades líderes del sector
          </p>
        </FadeUp>
        <div className="partners-editorial__list">
          {partners.map((p, idx) => (
            <FadeUp key={p.name} delay={idx * 0.06}>
              <span className={`partners-editorial__name ${p.className}`}>
                {p.name}
              </span>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

const testimonials = [
  {
    name: "Ana M.",
    text: "Gracias a José Carlos conseguimos financiación al 100% para nuestra primera vivienda. El proceso fue mucho más sencillo de lo que esperábamos.",
    detail: "Primera vivienda, Benidorm",
  },
  {
    name: "Marcos R.",
    text: "Como autónomo nunca había pensado en lo expuesto que estaba. Me ayudó a ver riesgos que no veía y a poner solución sin complicarme la vida.",
    detail: "Autónomo, Altea",
  },
  {
    name: "Familia López",
    text: "La administración de nuestra comunidad ha mejorado radicalmente. Transparente, puntual y siempre disponible.",
    detail: "Comunidad de propietarios, Alicante",
  },
];

function Testimonials() {
  return (
    <section id="testimonios" className="py-[100px] bg-white border-t border-[#E5E5E5]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="mb-20 max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            <Curtain>Lo que dicen quienes ya trabajan conmigo</Curtain>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <FadeUp key={t.name} delay={i * 0.1}>
              <article className="relative h-full bg-white border border-[#E5E5E5] p-10 hover:border-[#C5A566] transition-colors">
                <span aria-hidden="true" className="absolute top-2 left-6 text-7xl leading-none font-black text-[var(--jch-accent-ink)] select-none">
                  “
                </span>
                <p className="relative text-[#4A4A4A] leading-relaxed pt-8">{t.text}</p>
                <div className="mt-8 pt-6 border-t border-[#EEEEEE]">
                  <p className="font-bold text-[#1A1A1A]">{t.name}</p>
                  <p className="text-xs text-[#9A9A9A] mt-1">{t.detail}</p>
                </div>
              </article>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

