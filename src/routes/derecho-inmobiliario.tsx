import React, { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ThemeToggle } from "@/components/ThemeToggle";
import { submitContact } from "@/lib/contact.functions";
import { trackEvent } from "@/lib/analytics";
import { useDialogA11y } from "@/lib/useDialogA11y";

export const Route = createFileRoute("/derecho-inmobiliario")({
  head: () => ({
    meta: [
      { title: "Abogada de Inmobiliario, Urbanismo y Comunidades en Altea | HiloLegal" },
      {
        name: "description",
        content: "Compraventa, alquiler, licencias urbanísticas y conflictos en comunidades de propietarios, con la misma auditoría legal. Verónica López, abogada en Altea.",
      },
      { property: "og:title", content: "Abogada de Inmobiliario, Urbanismo y Comunidades en Altea | HiloLegal" },
      { property: "og:description", content: "Certezas jurídicas antes de comprar, vender, construir o alquilar, y en la relación con tu comunidad de propietarios." },
      { property: "og:url", content: "https://www.hilolegal.es/derecho-inmobiliario" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:site_name", content: "HiloLegal" },
      { property: "og:image", content: "https://www.hilolegal.es/VERODERECHA.webp" },
      { property: "og:image:width", content: "1672" },
      { property: "og:image:height", content: "941" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Abogada de Inmobiliario, Urbanismo y Comunidades en Altea | HiloLegal" },
      { name: "twitter:description", content: "Certezas jurídicas antes de comprar, vender, construir o alquilar, y en la relación con tu comunidad de propietarios." },
      { name: "twitter:image", content: "https://www.hilolegal.es/VERODERECHA.webp" },
    ],
    links: [{ rel: "canonical", href: "https://www.hilolegal.es/derecho-inmobiliario" }],
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
                { "@type": "ListItem", position: 3, name: "Inmobiliario, urbanismo y comunidades", item: "https://www.hilolegal.es/derecho-inmobiliario" },
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
  component: DerechoInmobiliarioPage,
});

const WHATSAPP = "https://wa.me/34647506040?text=Quiero%20informaci%C3%B3n%20sobre%20un%20tema%20inmobiliario%2C%20de%20urbanismo%20o%20de%20mi%20comunidad";
const PHONE_DISPLAY = "647 50 60 40";
const EMAIL = "veronicalopez@hilolegal.es";

const Icon = ({ name, className = "" }: { name: string; className?: string }) => (
  <span aria-hidden="true" className={`material-symbols-outlined ${className}`}>{name}</span>
);

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

function DerechoInmobiliarioPage() {
  useEffect(() => {
    trackEvent("legal_area_view", { page: "derecho-inmobiliario" });
  }, []);

  return (
    <div className="veronica-original bg-[#0a0a0a] text-[#F3F0EA] selection:bg-[#C5A566] selection:text-black">
      <SmoothScroll />
      <Header />
      <main>
        <Hero />
        <QueDeberiasSaber />
        <ComoTrabajamos />
        <FAQ />
        <CtaFinal />
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
    ["Verónica López", "/veronica"],
    ["Qué deberías saber", "#que-deberias-saber"],
    ["Cómo trabajamos tu caso", "#como-trabajamos"],
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
        className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0a0a0a]/90 backdrop-blur-xl"
      >
        <nav className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-6 py-5">
          <Link to="/" className="group flex items-center gap-3">
            <motion.img src="/hilolegal-logo-white.webp" alt="Logo HiloLegal" className="h-12 w-auto object-contain" whileHover={{ rotate: -2, scale: 1.05 }} transition={spring} />
            <span className="text-base font-bold tracking-tight text-[#C5A566] md:text-lg">Verónica López</span>
          </Link>
          <div className="hidden items-center gap-9 md:flex">
            {navLinks.map(([label, href]) => (
              <a key={href} className="group relative text-sm font-medium text-[#F3F0EA]" href={href}>
                <span className="transition-colors group-hover:text-[#C5A566]">{label}</span>
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
            <button type="button" aria-label="Abrir menú" onClick={() => setMobileOpen((v) => !v)} className="-mr-2 p-2 text-2xl text-[#C5A566] md:hidden">
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
            className="fixed right-0 top-0 z-[9999] h-[100dvh] w-[min(88vw,420px)] border-l border-white/10 bg-[#0a0a0a]/95 backdrop-blur-xl outline-none md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
          >
            <div className="flex h-full flex-col gap-4 overflow-y-auto p-8">
              <button type="button" onClick={() => setMobileOpen(false)} className="self-end text-3xl text-[#C5A566]" aria-label="Cerrar menú">×</button>
              <div className="mt-8 flex flex-col gap-2">
                {navLinks.map(([label, href]) => (
                  <a key={href} href={href} onClick={() => setMobileOpen(false)} className="block py-3 text-lg font-medium text-[#F3F0EA] transition-colors hover:text-[#C5A566]">
                    {label}
                  </a>
                ))}
                <a href={WHATSAPP} onClick={() => setMobileOpen(false)} className="mt-2 inline-block self-start rounded-full bg-[#C5A566] px-8 py-[1.1rem] text-center text-xs font-medium uppercase tracking-[0.14em] text-black transition-colors hover:bg-[#A78C57]">
                  WhatsApp
                </a>
                <div className="flex items-center gap-2 border-t border-white/10 pt-4 text-lg font-medium text-[#F3F0EA]">
                  <ThemeToggle />
                  <span>Tema</span>
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
  return (
    <section className="hero-bg-section">
      <img alt="Verónica López, abogada" className="hero-bg-image" src="/VERODERECHA.webp" width={1672} height={941} loading="eager" decoding="async" fetchPriority="high" />
      <div className="hero-bg-overlay" aria-hidden="true" />
      <div className="mx-auto px-6">
        <div className="space-y-10">
          <FadeUp>
            <div className="hero-eyebrow inline-flex items-center gap-3">
              <motion.span initial={{ width: 0 }} animate={{ width: 32 }} transition={{ duration: 0.9, ease: easeOutExpo, delay: 0.4 }} className="h-[2px] bg-[#C5A566] block" />
              INMOBILIARIO, URBANISMO Y COMUNIDADES
            </div>
          </FadeUp>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.08] tracking-tight text-balance">
            <WordReveal eager block delay={0.1} text="Comprar, construir o alquilar" />
            <WordReveal eager block delay={0.325} className="text-[#C5A566]" text="exige certezas jurídicas" />
            <WordReveal eager block delay={0.46} text="antes de firmar." />
          </h1>
          <FadeUp delay={0.6}>
            <p className="hero-subtitle">
              Revisamos la operación —también licencias y expedientes urbanísticos— con la misma auditoría
              legal que usamos para proteger comunidades de propietarios, en coordinación directa con el
              área de administración de fincas de HiloLegal.
            </p>
          </FadeUp>
          <FadeUp delay={0.75}>
            <div className="flex flex-wrap gap-6 pt-2">
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={spring}
                className="rounded-full bg-[#C5A566] text-black px-10 py-5 font-bold uppercase text-xs tracking-widest hover:bg-[#A78C57] transition-colors shadow-xl shadow-[#C5A566]/20"
                href="#contact"
                onClick={() => trackEvent("cta_legal", { section: "hero", cta: "cuentanos_tu_caso" })}
              >
                Cuéntanos tu caso
              </motion.a>
              <a href="#que-deberias-saber" className="btn-ghost">Ver cómo trabajamos tu caso</a>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

const puntos = [
  { n: "01", title: "Una compraventa se audita antes de firmar", text: "Cargas, deudas de comunidad, situación registral — todo lo que no se ve a simple vista puede acabar siendo tu problema." },
  { n: "02", title: "Un alquiler mal redactado genera conflicto", text: "Las cláusulas de un contrato de arrendamiento definen qué pasa cuando algo no va según lo previsto." },
  { n: "03", title: "Una licencia urbanística no es un trámite menor", text: "Construir, reformar o legalizar sin la licencia correcta puede acabar en un expediente de disciplina urbanística, con orden de demolición incluida." },
];

function QueDeberiasSaber() {
  return (
    <section id="que-deberias-saber" className="content-block py-[100px]">
      <div className="content-block__inner">
        <div className="content-block__heading">
          <h2><Curtain>Cargas, cláusulas y licencias.</Curtain></h2>
          <FadeUp delay={0.1}>
            <p>La compra, venta, alquiler o construcción de un inmueble exige certezas jurídicas para proteger el capital invertido.</p>
          </FadeUp>
        </div>
        <div className="content-block__grid">
          {puntos.map((p, idx) => (
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

const pasos = [
  { n: "01.", title: "Auditamos la propiedad", text: "Revisión legal previa antes de comprar, vender, alquilar o construir — cargas, deudas, situación registral y urbanística incluidas." },
  { n: "02.", title: "Redactamos o revisamos el contrato", text: "Cada cláusula pensada para lo que puede pasar, no solo para lo que se espera que pase." },
  { n: "03.", title: "Coordinamos con administración de fincas", text: "Un único interlocutor si el caso tiene también una vertiente de comunidad de propietarios." },
  { n: "04.", title: "Reclamamos si hace falta", text: "Desde la auditoría legal previa hasta la reclamación judicial por impagos, sin cambiar de interlocutor." },
];

function ComoTrabajamos() {
  return (
    <section id="como-trabajamos" className="py-[100px] bg-[var(--jch-surface)]">
      <div className="method-block__inner">
        <div className="method-block__intro">
          <h2><Curtain>Cómo trabajamos tu caso.</Curtain></h2>
          <FadeUp delay={0.1}><p>Desde la auditoría legal previa hasta la reclamación judicial, con un único interlocutor.</p></FadeUp>
        </div>
        <div className="method-steps">
          {pasos.map((m, idx) => (
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

const faqs = [
  { q: "¿La primera consulta es gratuita?", a: "Sí. Se revisa la operación o la situación de la comunidad, y te digo con claridad qué riesgos hay y cómo abordarlos." },
  { q: "¿Revisáis el contrato antes de que lo firme?", a: "Sí, esa es precisamente la parte más importante: revisar antes de firmar es siempre más barato que litigar después de haber firmado." },
  { q: "Mi comunidad tiene un propietario que no paga, ¿es esto legal o de fincas?", a: "Ambas cosas a la vez. Trabajamos en coordinación directa con el área de administración de fincas de HiloLegal para que no tengas que repetir la situación a dos interlocutores distintos." },
  { q: "¿También lleváis alquileres, no solo compraventas?", a: "Sí, tanto la redacción y revisión de contratos de arrendamiento como la resolución de conflictos entre propietario e inquilino." },
  { q: "¿Me ayudáis con una licencia de obra o un expediente de disciplina urbanística?", a: "Sí. Desde la solicitud de la licencia hasta la defensa ante un expediente sancionador o de legalización, con el mismo criterio institucional que se aplica en derecho administrativo." },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="py-[100px]">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-4xl font-bold tracking-tight text-center mb-20 uppercase"><Curtain>Dudas normales antes de decidir</Curtain></h2>
        <div className="space-y-px bg-[var(--jch-line)]">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <FadeUp key={f.q} delay={i * 0.05}>
                <div className="bg-[var(--jch-bg)]">
                  <button onClick={() => setOpen(isOpen ? null : i)} className="w-full flex justify-between items-center text-left p-8 text-lg font-bold uppercase tracking-tight" aria-expanded={isOpen}>
                    <span>{f.q}</span>
                    <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={spring} className="material-symbols-outlined text-[#C5A566]">expand_more</motion.span>
                  </button>
                  <motion.div initial={false} animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }} transition={{ duration: 0.5, ease: easeOutExpo }} style={{ overflow: "hidden" }}>
                    <div className="px-8 pb-8 text-[var(--jch-muted)] leading-relaxed">{f.a}</div>
                  </motion.div>
                </div>
              </FadeUp>
            );
          })}
        </div>
        <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm">
          <Link
            to="/blog/$slug"
            params={{ slug: "desahucios-cuanto-tarda-y-errores" }}
            className="text-[var(--jch-muted)] underline decoration-white/20 hover:text-[#C5A566] hover:decoration-[#C5A566] transition-colors"
          >
            Desahucios: cuánto tarda de verdad y los errores que lo alargan
          </Link>
          <Link
            to="/antes-de-firmar-arras"
            className="text-[var(--jch-muted)] underline decoration-white/20 hover:text-[#C5A566] hover:decoration-[#C5A566] transition-colors"
          >
            Checklist gratuita: antes de firmar las arras
          </Link>
        </div>
      </div>
    </section>
  );
}

function CtaFinal() {
  return (
    <section id="contact" className="py-[100px] bg-[var(--jch-surface)]">
      <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24">
        <div className="space-y-12">
          <h2 className="contact-editorial__title text-5xl md:text-6xl font-bold tracking-tight">
            <Curtain>Hablemos de <span className="text-[#C5A566]">tu operación</span></Curtain>
          </h2>
          <FadeUp delay={0.1}>
            <p className="contact-editorial__description text-xl leading-relaxed">
              Cuéntame la operación o la situación de tu comunidad y te digo con claridad cómo abordarla.
            </p>
          </FadeUp>
          <div className="space-y-10 pt-10 border-t border-[var(--jch-line)]">
            {[
              { i: "call", label: "Llámanos", v: PHONE_DISPLAY, href: `tel:+34647506040` },
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
              <Link to="/administracion-fincas" className="duo-block__cta">
                Ver administración de fincas <span aria-hidden="true">→</span>
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
          topic: "Inmobiliario, urbanismo y comunidades",
          website: honeypotRef.current?.value ?? "",
          formLoadedAt: formLoadedAtRef.current,
        },
      });
      setStatus("ok");
      trackEvent("contact_submit");
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
          placeholder="Cuéntame brevemente tu situación"
          value={form.message}
          onChange={onChange("message")}
          className="w-full bg-transparent border-0 border-b border-[var(--jch-line)] px-0 py-4 focus:ring-0 focus:border-[#C5A566] transition-colors outline-none placeholder:text-[var(--jch-dim)]"
        />
      </div>
      <label className="flex items-start gap-3 text-sm text-[var(--jch-muted)] leading-relaxed cursor-pointer">
        <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} required className="mt-1 w-4 h-4 accent-[#C5A566] shrink-0" />
        <span>
          He leído y acepto la{" "}
          <a href="/privacidad.html" target="_blank" rel="noopener noreferrer" className="text-[#C5A566] underline hover:no-underline">política de privacidad</a>.
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
        {status === "sending" ? "Enviando…" : status === "ok" ? "¡Enviado!" : "Cuéntanos tu caso"}
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

function Footer() {
  return (
    <footer className="bg-[#1A1A1A] py-24 text-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-16">
          <div className="flex items-center gap-4 text-center md:text-left">
            <img src="/hilolegal-logo-white.webp" alt="Logo HiloLegal" loading="lazy" className="h-9 w-auto object-contain" />
            <div className="space-y-2">
              <div className="text-2xl font-black tracking-tighter uppercase">Verónica López</div>
              <p className="text-gray-500 text-xs tracking-widest uppercase">Abogada · HiloLegal</p>
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
          <p className="text-[10px] text-gray-600 uppercase tracking-widest">Todas las áreas de HiloLegal</p>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[12px] text-gray-400">
            <Link to="/derecho-familia" className="hover:text-[#C5A566] transition-colors">Familia</Link>
            <span aria-hidden="true">·</span>
            <Link to="/derecho-penal" className="hover:text-[#C5A566] transition-colors">Penal</Link>
            <span aria-hidden="true">·</span>
            <Link to="/derecho-administrativo" className="hover:text-[#C5A566] transition-colors">Administrativo</Link>
            <span aria-hidden="true">·</span>
            <Link to="/derecho-inmobiliario" className="hover:text-[#C5A566] transition-colors">Inmobiliario</Link>
            <span aria-hidden="true">·</span>
            <Link to="/josecarlos" className="hover:text-[#C5A566] transition-colors">Hipotecas y patrimonio</Link>
            <span aria-hidden="true">·</span>
            <Link to="/administracion-fincas" className="hover:text-[#C5A566] transition-colors">Administración de fincas</Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[12px] text-gray-400">
            <Link to="/veronica" className="hover:text-[#C5A566] transition-colors">Verónica López</Link>
            <span aria-hidden="true">·</span>
            <a href="/terminos.html" target="_blank" rel="noopener noreferrer" className="hover:text-[#C5A566] transition-colors">Términos y condiciones</a>
            <span aria-hidden="true">·</span>
            <a href="/privacidad.html" target="_blank" rel="noopener noreferrer" className="hover:text-[#C5A566] transition-colors">Política de privacidad</a>
          </div>
          <div className="text-center text-[10px] text-gray-600 uppercase tracking-widest">
            © {new Date().getFullYear()} HILOLEGAL. TODOS LOS DERECHOS RESERVADOS.
          </div>
        </div>
      </div>
    </footer>
  );
}
