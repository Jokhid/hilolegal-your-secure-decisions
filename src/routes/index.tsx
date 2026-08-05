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
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.span
      className={`relative inline-block overflow-hidden align-baseline ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
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
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
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

/* ---------- Data ---------- */
const areas = [
  {
    tag: "Área 01",
    title: "Legal",
    text:
      "Asesoramiento jurídico para asuntos civiles, familiares, penales, inmobiliarios, administrativos y patrimoniales. Cuando un problema legal tiene impacto personal o económico, necesitas estrategia, experiencia y claridad.",
    cta: "Ver servicios legales",
    href: "#contact",
  },
  {
    tag: "Área 02",
    title: "Patrimonial y financiero",
    text:
      "Planificación financiera, ahorro, inversión, pensiones, seguros de vida, salud y protección de autónomos. Te ayudamos a ordenar tu economía, proteger tus ingresos y preparar decisiones importantes con una visión realista.",
    cta: "Ver asesoramiento patrimonial",
    href: "#contact",
  },
  {
    tag: "Área 03",
    title: "Hipotecas",
    text:
      "Estudio hipotecario, viabilidad financiera, comparación de opciones y acompañamiento en la compra de vivienda. No se trata solo de conseguir una hipoteca. Se trata de comprar con seguridad.",
    cta: "Ver hipotecas",
    href: "#contact",
  },
  {
    tag: "Área 04",
    title: "Administración de fincas",
    text:
      "Gestión profesional de comunidades de propietarios con control económico, transparencia y respuesta. Una comunidad bien administrada protege el valor de cada inmueble.",
    cta: "Ver administración de fincas",
    href: "#contact",
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
    title: "Propietarios",
    text:
      "Para quienes necesitan resolver problemas inmobiliarios, gestionar patrimonio, afrontar conflictos legales o tomar decisiones sobre vivienda, alquiler o comunidad.",
  },
  {
    title: "Comunidades de propietarios",
    text:
      "Para presidentes y propietarios que quieren una administración clara, ordenada y profesional.",
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
    eyebrow: "Socia · Jurista",
    name: "Verónica López",
    role: "Jurista senior y abogada",
    bio: [
      "Más de 20 años de experiencia jurídica, trayectoria en puestos de alta responsabilidad en la Administración de Justicia y actividad docente como profesora asociada en la Facultad de Derecho de Alicante.",
      "Su perfil aporta visión estratégica, rigor técnico y experiencia institucional en asuntos legales complejos.",
    ],
    cta: "Conocer a Verónica",
  },
  {
    img: "/9.webp",
    eyebrow: "Socio · Financiero",
    name: "José Carlos Hidalgo",
    role: "Asesor financiero, hipotecario y patrimonial",
    bio: [
      "Especialista en planificación financiera, hipotecas, seguros, protección de autónomos, ahorro y previsión patrimonial.",
      "Su trabajo se centra en ayudar a familias, autónomos y propietarios a ordenar sus decisiones económicas y proteger su futuro.",
    ],
    cta: "Conocer a José Carlos",
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
    href: "#contact",
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
        className="sticky top-0 z-50 w-full"
      >
        <nav className="mx-auto flex w-full items-center justify-between">
          <a href="/" className="flex items-center gap-3"> 
            <img src="/logo.png" alt="Logo HiloLegal" 
              className="h-9 w-9 object-contain" /> 
            <span>HiloLegal</span> 
          </a>

          <div className="hidden md:flex items-center">
            {navLinks.map(([label, href]) => (
              <a key={href} href={href} className="transition-opacity hover:opacity-70">
                {label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex uppercase text-[0.65rem] tracking-[0.18em] px-4 py-2 border border-white/20 rounded-full hover:border-white/60 transition-colors"
            >
              WhatsApp
            </a>
            <button
              type="button"
              aria-label="Abrir menú"
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden text-2xl"
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
            className="fixed right-0 top-0 z-[9999] h-[100dvh] w-[min(88vw,420px)] md:hidden"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex h-full flex-col gap-4 p-8">
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="self-end text-3xl"
                aria-label="Cerrar menú"
              >
                ×
              </button>
              <div className="flex flex-col gap-2 mt-8">
                {navLinks.map(([label, href]) => (
                  <a
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-3"
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
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  return (
    <section ref={ref}>
      <div>
        <motion.div style={{ y: textY }} className="space-y-10">
          <FadeUp>
            <span className="hero-eyebrow">
              HiloLegal · Boutique legal y patrimonial en Altea - Costa Blanca
            </span>
          </FadeUp>

          <h1 className="text-balance">
            <Curtain>Abogacía, patrimonio y </Curtain>
            <Curtain delay={0.1}>
              <span className="jch-accent jch-italic">decisiones importantes</span>
            </Curtain>
            <Curtain delay={0.2}> con criterio.</Curtain>
          </h1>

          <FadeUp delay={0.55}>
            <p>
              Planificación financiera, hipotecas, seguros y administración de fincas para personas
              que necesitan tomar decisiones importantes con seguridad. En HiloLegal unimos criterio
              jurídico, visión patrimonial y experiencia financiera para ayudarte a proteger lo que
              has construido, anticipar riesgos y tomar mejores decisiones.
            </p>
          </FadeUp>

          <FadeUp delay={0.7}>
            <div className="flex flex-wrap gap-3 pt-4">
              <a href="#contact" className="btn-primary">
                Solicitar diagnóstico
              </a>
              <a href="#areas" className="btn-ghost">
                Ver áreas de trabajo
              </a>
            </div>
          </FadeUp>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...spring, delay: 0.4 }}
          className="group relative"
        >
          <motion.img
            style={{ y: imgY, scale: imgScale }}
            src="/josecarlos_veronica.webp"
            alt="HiloLegal — boutique legal y patrimonial en Altea - Costa Blanca"
            loading="eager"
            fetchPriority="high"
          />
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
              <Curtain>Decisiones importantes </Curtain>
              <Curtain delay={0.1}>
                <span className="jch-accent jch-italic">necesitan más</span>
              </Curtain>
              <Curtain delay={0.2}> que una respuesta rápida.</Curtain>
            </h2>
          </div>
        </FadeUp>

        <FadeUp delay={0.2} className="trust-block__body">
          <p>
            Comprar una vivienda, proteger a tu familia, resolver un conflicto legal, planificar
            tu jubilación, asegurar tus ingresos o gestionar una comunidad no son trámites aislados.
          </p>
          <p>Son decisiones que afectan a tu patrimonio, tu tranquilidad y tu futuro.</p>
          <p>
            En HiloLegal trabajamos con una visión integral: analizamos tu situación, identificamos
            riesgos y te ayudamos a decidir con información clara.
          </p>
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
            <Curtain>Áreas </Curtain>
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
              <a href={a.href} className="services-editorial__card">
                <div className="services-editorial__meta">
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <span>{a.tag}</span>
                </div>
                <h3>{a.title}</h3>
                <p>{a.text}</p>
                <span className="services-editorial__cta">
                  <span aria-hidden="true" />
                  {a.cta}
                </span>
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
          <Curtain>Una firma para </Curtain>
          <Curtain delay={0.1}>
            <span className="jch-accent jch-italic">proteger decisiones</span>
          </Curtain>
          <Curtain delay={0.2}> patrimoniales.</Curtain>
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
          <Curtain>Para quién </Curtain>
          <Curtain delay={0.1}>
            <span className="jch-accent jch-italic">trabajamos</span>
          </Curtain>
        </h2>

        <div className="audience__grid">
          {audiences.map((a, i) => (
            <FadeUp key={a.title} delay={(i % 4) * 0.08}>
              <article className="audience__card">
                <span className="audience__number">{String(i + 1).padStart(2, "0")} · Perfil</span>
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
            <Curtain>Nuestro </Curtain>
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
            <Curtain>Dirección experta, </Curtain>
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
                  <a href="#contact" className="pros__cta">
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
            <Curtain>Herramientas para </Curtain>
            <Curtain delay={0.1}>
              <span className="jch-accent jch-italic">decidir mejor</span>
            </Curtain>
          </h2>
          <FadeUp delay={0.15}>
            <p>
              Una web premium no debe limitarse a explicar servicios. Debe ayudarte a tomar
              conciencia de tu situación. Ponemos a tu disposición herramientas prácticas para
              analizar tu economía, tu hipoteca y tus riesgos principales.
            </p>
          </FadeUp>
        </div>

        <div className="tools__grid">
          {tools.map((t, i) => (
            <FadeUp key={t.title} delay={i * 0.08}>
              <a href={t.href} className="tool-card">
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
            <Curtain>Si una decisión puede afectar a tu </Curtain>
            <Curtain delay={0.1}>
              <span className="jch-accent jch-italic">patrimonio</span>
            </Curtain>
            <Curtain delay={0.2}>, merece ser analizada con criterio.</Curtain>
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
    email: "",
    topic: "Diagnóstico patrimonial",
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
      setForm({ name: "", phone: "", email: "", topic: "Diagnóstico patrimonial", message: "" });
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
            <Curtain>Solicita tu </Curtain>
            <Curtain delay={0.1}>
              <span className="jch-accent jch-italic">diagnóstico</span>
            </Curtain>
          </h2>
          <FadeUp delay={0.1}>
            <p>
              Rellena el formulario y te contactaremos en menos de 24 horas para agendar tu
              diagnóstico patrimonial inicial.
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
              <p className="text-[10px] uppercase tracking-[0.2em] opacity-60 mb-1">Altea - Costa Blanca</p>
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
            <Field
              label="Email"
              type="email"
              placeholder="tu@email.com"
              value={form.email}
              onChange={onChange("email")}
              required
            />
            <div className="space-y-2">
              <label className="text-[10px] font-medium uppercase tracking-[0.2em]">
                ¿Qué necesitas revisar?
              </label>
              <select
                value={form.topic}
                onChange={onChange("topic")}
                className="w-full bg-transparent border-0 border-b border-white/20 px-0 py-3 focus:outline-none focus:border-[color:var(--jch-accent)] transition-colors"
              >
                <option>Diagnóstico patrimonial</option>
                <option>Asesoramiento legal</option>
                <option>Hipoteca</option>
                <option>Seguros y protección</option>
                <option>Ahorro y jubilación</option>
                <option>Administración de fincas</option>
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
            <p className="brand">HiloLegal</p>
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
