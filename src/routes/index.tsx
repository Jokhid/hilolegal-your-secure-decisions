import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

import { SmoothScroll } from "@/components/SmoothScroll";
import { submitContact } from "@/lib/contact.functions";

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
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LegalService",
          name: "HiloLegal",
          description:
            "Boutique legal y patrimonial en Altea - Costa Blanca. Abogacía, planificación financiera, hipotecas, seguros y administración de fincas.",
          url: "https://hilolegal.es",
          telephone: "+34647506040",
          email: "info@hilolegal.es",
          areaServed: [{ "@type": "City", name: "Altea" }],
          founder: [
            { "@type": "Person", name: "Verónica López" },
            { "@type": "Person", name: "José Carlos Hidalgo" },
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
const trustStats = [
  { value: "20+", label: "Años de experiencia jurídica y financiera" },
  { value: "2", label: "Especialidades, un mismo criterio" },
  { value: "24h", label: "Tiempo de respuesta" },
];

const areas = [
  {
    title: "Legal",
    text:
      "Asesoramiento jurídico para asuntos civiles, familiares, penales, inmobiliarios, administrativos y patrimoniales. Cuando un problema legal tiene impacto personal o económico, necesitas estrategia, experiencia y claridad.",
    cta: "Ver servicios legales",
    href: "/veronica#services",
    art: "/legal.webp",
    artAlt: "Ilustración del área legal de HiloLegal",
  },
  {
    title: "Patrimonial y financiero",
    text:
      "Planificación financiera, ahorro, inversión, pensiones, seguros de vida, salud y protección de autónomos. Te ayudamos a ordenar tu economía, proteger tus ingresos y preparar decisiones importantes con una visión realista.",
    cta: "Ver asesoramiento patrimonial",
    href: "/josecarlos",
    art: "/patrimonial.webp",
    artAlt: "Ilustración del área patrimonial y financiera de HiloLegal",
  },
  {
    title: "Hipotecas",
    text:
      "Estudio hipotecario, viabilidad financiera, comparación de opciones y acompañamiento en la compra de vivienda. No se trata solo de conseguir una hipoteca. Se trata de comprar con seguridad.",
    cta: "Ver hipotecas",
    href: "/josecarlos",
    art: "/hipotecas.webp",
    artAlt: "Ilustración del área de hipotecas de HiloLegal",
  },
  {
    title: "Administración de fincas",
    text:
      "Gestión profesional de comunidades de propietarios con control económico, transparencia y respuesta. Una comunidad bien administrada protege el valor de cada inmueble.",
    cta: "Ver administración de fincas",
    href: "/josecarlos",
    art: "/fincas.webp",
    artAlt: "Ilustración del área de administración de fincas de HiloLegal",
  },
];

const audiences = [
  {
    title: "Familias",
    text:
      "Para quienes quieren resolver sus asuntos legales con seguridad, comprar vivienda, proteger a sus hijos, organizar su economía o planificar ahorro.",
  },
  {
    title: "Autónomos",
    text:
      "Para profesionales que necesitan proteger sus ingresos, planificar su jubilación, cubrir riesgos personales y tomar decisiones financieras con criterio.",
  },
  {
    title: "Empresas",
    text:
      "Para empresas que licitan con el sector público y necesitan preparar decisiones jurídicas, económicas y documentales con orden, solvencia y seguridad.",
  },
  {
    title: "Propietarios",
    text:
      "Para quienes necesitan resolver problemas inmobiliarios, gestionar patrimonio, afrontar conflictos legales o tomar decisiones sobre vivienda, alquiler o comunidad.",
  },
];

const methodSteps = [
  {
    n: "01.",
    title: "Escuchamos tu situación",
    text:
      "Antes de recomendar nada, entendemos tu punto de partida, tus objetivos y los riesgos que te preocupan.",
  },
  {
    n: "02.",
    title: "Analizamos el problema completo",
    text:
      "No miramos solo el trámite. Revisamos el impacto jurídico, económico y patrimonial de cada decisión.",
  },
  {
    n: "03.",
    title: "Diseñamos una estrategia clara",
    text:
      "Te explicamos opciones, riesgos, costes y siguientes pasos de forma comprensible.",
  },
  {
    n: "04.",
    title: "Te acompañamos en la ejecución",
    text:
      "Coordinamos el proceso para que no tengas que tomar decisiones importantes a ciegas.",
  },
];

const professionals = [
  {
    img: "/vero_jurista.webp",
    eyebrow: "Socia",
    name: "Verónica López",
    role: "Abogada",
    bio: [
      "Más de 20 años de experiencia jurídica, trayectoria en puestos de alta responsabilidad en la Administración de Justicia y actividad docente como profesora asociada en la Facultad de Derecho de Alicante.",
      "Su perfil aporta visión estratégica, rigor técnico y experiencia institucional en asuntos legales complejos.",
    ],
    cta: "Conocer a Verónica",
    href: "/veronica",
  },
  {
    img: "/9.webp",
    eyebrow: "Socio",
    name: "José Carlos Hidalgo",
    role: "Gestor patrimonial e hipotecario.",
    bio: [
      "Más de 25 años de experiencia en asesoría y administración. Administrador de fincas y gestor de Nationale Nederlanden, ING y Abanca. Especialista en planificación financiera, hipotecas, seguros y ahorro.",
      "Su trabajo se centra en ayudar a familias, autónomos y propietarios a ordenar sus decisiones económicas y proteger su futuro.",
    ],
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
  },
  {
    title: "Test de salud financiera",
    text: "Evalúa tu nivel de protección, ahorro, endeudamiento y previsión.",
    cta: "Hacer test",
    href: "/test-salud-financiera.html",
  },
  {
    title: "Blog financiero",
    text: "Lee artículos prácticos sobre hipotecas, ahorro, protección, pensiones y planificación financiera.",
    cta: "Leer blog",
    href: "/blog",
  },
  {
    title: "Diagnóstico patrimonial",
    text: "Solicita una revisión inicial de tu situación legal, financiera o hipotecaria.",
    cta: "Solicitar diagnóstico",
    href: "https://calendly.com/jchidalgo/plan",
  },
];

/* ---------- Page ---------- */
function Index() {
  return (
    <div>
      <SmoothScroll />
      <Header />

      <main>
        <Hero />
        <TrustBlock />
        <Areas />
        <Positioning />
        <Audience />
        <Method />
        <Professionals />
        <Tools />
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
    ["Áreas", "#areas"],
    ["Método", "#method"],
    ["Equipo", "#equipo"],
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
        className="sticky top-0 z-50 w-full border-b border-[#E5E5E5] bg-white/85 backdrop-blur-xl"
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
                <span className="transition-colors group-hover:text-[#C5A566]">{label}</span>
                <span className="absolute -bottom-1 left-0 h-[1px] w-full origin-left scale-x-0 bg-[#C5A566] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={spring}
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden bg-[#1A1A1A] px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#C5A566] sm:inline-block"
            >
              WhatsApp
            </motion.a>
            <button
              type="button"
              aria-label="Abrir menú"
              onClick={() => setMobileOpen((v) => !v)}
              className="-mr-2 p-2 text-2xl text-[#1A1A1A] md:hidden"
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
                className="self-end text-3xl text-[#1A1A1A]"
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
                    className="block py-3 text-lg font-medium text-[#1A1A1A] transition-colors hover:text-[#C5A566]"
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

/* ---------- Hero ---------- */
function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  return (
    <section ref={ref} className="hero-bg-section">
      <motion.img
        style={{ scale: imgScale }}
        src="/fotoalteadespacho.webp"
        alt="HiloLegal — boutique legal y patrimonial en Altea - Costa Blanca"
        className="hero-bg-image"
        width={1024}
        height={1024}
        loading="eager"
        decoding="async"
        fetchPriority="high"
      />
      <div className="hero-bg-overlay" aria-hidden="true" />
      <div>
        <motion.div style={{ y: textY }} className="space-y-10">
          <FadeUp eager>
            <span className="hero-eyebrow">
              HiloLegal · Boutique legal y patrimonial en Altea - Costa Blanca
            </span>
          </FadeUp>

          <h1 className="text-balance">
            <Curtain eager>Defendemos tus derechos</Curtain>{" "}
            <Curtain eager delay={0.1}>
              <span className="jch-accent jch-italic">y protegemos tu patrimonio financiero.</span>
            </Curtain>
          </h1>

          <FadeUp eager delay={0.55}>
            <p>
              Unimos la visión de la planificación financiera estratégica con la defensa jurídica
              integral en derecho civil, familia, penal y administrativo. Respaldamos a particulares,
              autónomos y comunidades de propietarios para asegurar sus activos y resolver cualquier
              conflicto legal.
            </p>
          </FadeUp>

          <FadeUp eager delay={0.7}>
            <div className="flex flex-wrap gap-3 pt-4">
              <a href="#contact" className="btn-primary">
                Solicitar consulta previa
              </a>
              <a href="#areas" className="btn-ghost">
                Conocer áreas de servicios
              </a>
            </div>
          </FadeUp>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- Trust block ---------- */
function TrustBlock() {
  return (
    <section id="trust">
      <div className="trust-block__inner">
        <FadeUp>
          <div>
            <span className="trust-block__eyebrow">Nuestra visión</span>
            <h2 className="text-balance">
              <Curtain>Decisiones importantes</Curtain>{" "}
              <Curtain delay={0.1}>
                <span className="jch-accent jch-italic">necesitan más</span>
              </Curtain>{" "}
              <Curtain delay={0.2}>que una respuesta rápida.</Curtain>
            </h2>
          </div>
        </FadeUp>

        <FadeUp delay={0.2} className="trust-block__body">
          <p>
            Resolver un conflicto legal, comprar una vivienda, proteger a tu familia, planificar
            tu jubilación, asegurar tus ingresos o gestionar una comunidad no son trámites aislados.
          </p>
          <p>Son decisiones que afectan a tu patrimonio, tu tranquilidad y tu futuro.</p>
          <p>
            HiloLegal coordina la respuesta a tus necesidades legales y financieras desde una única
            estructura. Preservar el patrimonio y la tranquilidad personal exige controlar los
            riesgos jurídicos, afrontar procesos judiciales con garantías y planificar los recursos
            económicos con criterio técnico.
          </p>
          <p>
            Tratamos cada asunto con visión global, garantizando atención directa, rigor analítico
            y acompañamiento continuo en todas las áreas del derecho y las finanzas.
          </p>
        </FadeUp>

        <FadeUp delay={0.3} className="trust-block__stats">
          {trustStats.map((s) => (
            <div key={s.label} className="trust-block__stat">
              <span className="trust-block__stat-value">{s.value}</span>
              <span className="trust-block__stat-label">{s.label}</span>
            </div>
          ))}
        </FadeUp>
      </div>
    </section>
  );
}

/* ---------- Áreas principales ---------- */
function Areas() {
  return (
    <section id="areas" className="services-editorial">
      <div className="services-editorial__inner">
        <div className="services-editorial__heading">
          <h2>
            <Curtain>Áreas</Curtain>{" "}
            <Curtain delay={0.1}>
              <span className="jch-accent jch-italic">principales</span>
            </Curtain>
          </h2>
          <FadeUp delay={0.2}>
            <p>
              Cuatro disciplinas conectadas para acompañarte antes, durante y después de cada
              decisión patrimonial.
            </p>
          </FadeUp>
        </div>

        <div className="services-editorial__grid">
          {areas.map((a, i) => (
            <FadeUp key={a.title} delay={(i % 2) * 0.08}>
              <a href={a.href} className="services-editorial__card services-editorial__card--with-art">
                <div className="service-card__art">
                  <img
                    src={a.art}
                    alt={a.artAlt}
                    width={900}
                    height={540}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="services-editorial__body">
                  <h3>{a.title}</h3>
                  <p>{a.text}</p>
                  <span className="services-editorial__cta">
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

/* ---------- Posicionamiento ---------- */
function Positioning() {
  return (
    <section id="posicionamiento" className="position-block">
      <div className="position-block__inner">
        <h2>
          <Curtain>Una firma para</Curtain>{" "}
          <Curtain delay={0.1}>
            <span className="jch-accent jch-italic">proteger decisiones</span>
          </Curtain>{" "}
          <Curtain delay={0.2}>patrimoniales.</Curtain>
        </h2>
        <FadeUp delay={0.2} className="position-block__body">
          <p>
            HiloLegal nace para acompañar a personas, familias, autónomos, propietarios y
            comunidades en decisiones con impacto real.
          </p>
          <p>
            No trabajamos desde compartimentos separados. Un problema jurídico puede tener
            consecuencias económicas. Una mala hipoteca puede condicionar a una familia durante
            décadas. Una falta de protección puede dejar expuesto a un autónomo. Una comunidad mal
            gestionada puede deteriorar el valor de una propiedad.
          </p>
          <p>Por eso abordamos cada caso con una mirada legal, financiera y patrimonial.</p>
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

/* ---------- Para quién trabajamos ---------- */
function Audience() {
  return (
    <section id="audiencia">
      <div className="audience__inner">
        <h2>
          <Curtain>Para quién</Curtain>{" "}
          <Curtain delay={0.1}>
            <span className="jch-accent jch-italic">trabajamos</span>
          </Curtain>
        </h2>

        <div className="audience__grid">
          {audiences.map((a, i) => (
            <FadeUp key={a.title} delay={(i % 4) * 0.08}>
              <article className="audience__card">
                <span className="audience__number">{String(i + 1).padStart(2, "0")}</span>
                <h3>{a.title}</h3>
                <p>{a.text}</p>
              </article>
            </FadeUp>
          ))}
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
            <Curtain>Nuestro</Curtain>{" "}
            <Curtain delay={0.1}>
              <span className="jch-accent jch-italic">método</span>
            </Curtain>
          </h2>
          <FadeUp delay={0.15}>
            <p>
              Cuatro pasos para pasar de una situación difusa a una decisión con criterio, sin
              perder tiempo ni tranquilidad por el camino.
            </p>
          </FadeUp>
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
                <h4 className="method-step__title">{m.title}</h4>
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
    <section id="equipo">
      <div className="pros__inner">
        <div className="pros__intro">
          <h2>
            <Curtain>Dirección experta,</Curtain>{" "}
            <Curtain delay={0.1}>
              <span className="jch-accent jch-italic">trato cercano</span>
            </Curtain>
          </h2>
          <FadeUp delay={0.15}>
            <p>
              HiloLegal combina experiencia jurídica, financiera y patrimonial a través de perfiles
              profesionales complementarios.
            </p>
          </FadeUp>
        </div>

        <div className="pros__grid">
          {professionals.map((p, i) => (
            <FadeUp key={p.name} delay={i * 0.1}>
              <article className="pros__card">
                <div className="pros__image">
                  <img src={p.img} alt={p.name} loading="lazy" />
                </div>
                <div>
                  <span className="pros__eyebrow">{p.eyebrow}</span>
                  <h3>{p.name}</h3>
                  <p className="pros__role">{p.role}</p>
                  <div className="pros__bio">
                    {p.bio.map((b, idx) => (
                      <p key={idx}>{b}</p>
                    ))}
                  </div>
                  <a href={p.href} className="pros__cta">
                    <span aria-hidden="true">→</span> {p.cta}
                  </a>
                </div>
              </article>
            </FadeUp>
          ))}
        </div>
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
            <Curtain>Herramientas para</Curtain>{" "}
            <Curtain delay={0.1}>
              <span className="jch-accent jch-italic">decidir mejor</span>
            </Curtain>
          </h2>
          <FadeUp delay={0.15}>
            <p>
              Ponemos a tu disposición herramientas prácticas para analizar tu economía, tu
              hipoteca y tus riesgos principales.
            </p>
          </FadeUp>
        </div>

        <div className="tools__grid">
          {tools.map((t, i) => (
            <FadeUp key={t.title} delay={i * 0.08}>
              <a
                href={t.href}
                className="tool-card"
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

/* ---------- Cierre ---------- */
function Closing() {
  return (
    <section id="cierre">
      <div className="closing__inner">
        <FadeUp>
          <h2 className="text-balance">
            <Curtain>Si una decisión puede afectar a tu</Curtain>{" "}
            <Curtain delay={0.1}>
              <span className="jch-accent jch-italic">patrimonio,</span>
            </Curtain>{" "}
            <Curtain delay={0.2}>merece ser analizada con criterio.</Curtain>
          </h2>
        </FadeUp>
        <FadeUp delay={0.2}>
          <p>Cuéntanos tu situación y te ayudaremos a identificar el mejor camino.</p>
        </FadeUp>
        <FadeUp delay={0.3}>
          <a href="#contact" className="closing__cta">
            Solicitar diagnóstico <span aria-hidden="true">→</span>
          </a>
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
    topic: "Defensa Jurídica",
    message: "",
  });

  const onChange =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
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
      setForm({ name: "", phone: "", topic: "Defensa Jurídica", message: "" });
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
            <Curtain>Hablemos sobre tu</Curtain>{" "}
            <Curtain delay={0.1}>
              <span className="jch-accent jch-italic">situación legal o financiera</span>
            </Curtain>
          </h2>
          <FadeUp delay={0.1}>
            <p>
              Cuéntanos tu caso. Analizaremos tu situación para ofrecerte una hoja de ruta clara,
              directa y adaptada a tus necesidades.
            </p>
          </FadeUp>

          <div className="space-y-6 pt-6 border-t border-white/10">
            <a href={`tel:${PHONE_TEL}`} className="block group">
              <p className="text-[10px] uppercase tracking-[0.2em] opacity-60 mb-1">Teléfono</p>
              <p className="text-2xl font-medium group-hover:text-[color:var(--jch-accent)] transition-colors">
                {PHONE_DISPLAY}
              </p>
            </a>
            <a href={`mailto:${EMAIL}`} className="block group">
              <p className="text-[10px] uppercase tracking-[0.2em] opacity-60 mb-1">Email</p>
              <p className="text-2xl font-medium group-hover:text-[color:var(--jch-accent)] transition-colors">
                {EMAIL}
              </p>
            </a>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] opacity-60 mb-1">Altea, Alicante</p>
              <p className="text-base opacity-80">
                HiloLegal — Boutique legal y patrimonial
              </p>
            </div>
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
              <label className="text-[10px] font-medium uppercase tracking-[0.2em]">
                Especialidad requerida
              </label>
              <select
                value={form.topic}
                onChange={onChange("topic")}
                className="w-full bg-transparent border-0 border-b border-white/20 px-0 py-3 focus:outline-none focus:border-[color:var(--jch-accent)] transition-colors"
              >
                <option>Defensa Jurídica</option>
                <option>Asesoramiento Financiero</option>
                <option>Hipotecas</option>
                <option>Administración de Fincas</option>
                <option>Otra consulta</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-medium uppercase tracking-[0.2em]">Mensaje</label>
              <textarea
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
              className="w-full py-5 rounded-full uppercase text-xs tracking-[0.2em] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: "var(--jch-accent)",
                color: "var(--jch-bg)",
              }}
            >
              {status === "sending"
                ? "Enviando…"
                : status === "ok"
                  ? "¡Enviado!"
                  : "Solicitar diagnóstico"}
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
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-medium uppercase tracking-[0.2em]">{label}</label>
      <input
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
function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer__inner">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10">
          <div>
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
            <p className="mt-2 text-xs uppercase tracking-[0.2em] opacity-60">
              Boutique legal y patrimonial · Altea - Costa Blanca
            </p>
          </div>
          <div className="flex flex-col md:items-end gap-2 text-sm">
            <a href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY}</a>
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
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
