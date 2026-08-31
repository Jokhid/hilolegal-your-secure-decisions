import React, { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ThemeToggle } from "@/components/ThemeToggle";
import { submitContact } from "@/lib/contact.functions";
import { trackEvent } from "@/lib/analytics";

export const Route = createFileRoute("/administracion-fincas/gestion-economica-impagos")({
  head: () => ({
    meta: [
      { title: "Gestión Económica e Impagos en Comunidades | HiloLegal" },
      {
        name: "description",
        content:
          "Control económico mensual y protocolo de reclamación de impagos para comunidades de propietarios en Altea y la Marina Baixa. Cuentas claras, cuotas al día.",
      },
      { property: "og:title", content: "Gestión Económica e Impagos en Comunidades | HiloLegal" },
      { property: "og:description", content: "Cuentas claras cada mes y un protocolo definido para los impagos." },
      { property: "og:url", content: "https://www.hilolegal.es/administracion-fincas/gestion-economica-impagos" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:site_name", content: "HiloLegal" },
      { property: "og:image", content: "https://www.hilolegal.es/patrimonial.webp" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Gestión Económica e Impagos en Comunidades | HiloLegal" },
      { name: "twitter:description", content: "Cuentas claras cada mes y un protocolo definido para los impagos." },
      { name: "twitter:image", content: "https://www.hilolegal.es/patrimonial.webp" },
    ],
    links: [{ rel: "canonical", href: "https://www.hilolegal.es/administracion-fincas/gestion-economica-impagos" }],
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
                { "@type": "ListItem", position: 2, name: "Administración de fincas", item: "https://www.hilolegal.es/administracion-fincas" },
                { "@type": "ListItem", position: 3, name: "Gestión económica e impagos", item: "https://www.hilolegal.es/administracion-fincas/gestion-economica-impagos" },
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
  component: GestionEconomicaPage,
});

const WHATSAPP = "https://wa.me/34647506040?text=Quiero%20informaci%C3%B3n%20sobre%20administraci%C3%B3n%20de%20fincas";
const PHONE_DISPLAY = "647 50 60 40";
const EMAIL = "josecarlos@hilolegal.es";
const LOGO = "/logo-black.svg";

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

function GestionEconomicaPage() {
  useEffect(() => {
    trackEvent("property_financial_management_click", { section: "page_view", page: "gestion-economica-impagos" });
  }, []);

  return (
    <div className="josecarlos-original bg-[var(--jch-bg)] text-[var(--jch-ink)] selection:bg-[#C5A566] selection:text-white">
      <SmoothScroll />
      <Header />
      <main>
        <Hero />
        <ComoGestionamos />
        <ProtocoloImpagos />
        <FAQ />
        <CtaFinal />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navLinks: [string, string][] = [
    ["Administración de fincas", "/administracion-fincas"],
    ["Gestión de cuentas", "#cuentas"],
    ["Protocolo de impagos", "#impagos"],
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
            <motion.img src={LOGO} alt="Logo HiloLegal" className="h-9 w-9 object-contain" whileHover={{ rotate: -6, scale: 1.05 }} transition={spring} />
            <span className="text-base font-bold uppercase tracking-tight text-[#1A1A1A] md:text-lg">Administración de Fincas</span>
          </Link>
          <div className="hidden items-center gap-9 md:flex">
            {navLinks.map(([label, href]) => (
              <a key={href} className="group relative text-sm font-medium text-[#1A1A1A]" href={href}>
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
              className="header-whatsapp-btn hidden rounded-full bg-[#1f6f78] px-8 py-[1.1rem] text-xs font-medium uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#17535a] sm:inline-block"
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
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: easeOutExpo }}
            className="fixed right-0 top-0 z-[9999] h-[100dvh] w-[min(88vw,420px)] border-l border-[#E5E5E5] bg-white/95 backdrop-blur-xl md:hidden"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex h-full flex-col gap-4 overflow-y-auto p-8">
              <button type="button" onClick={() => setMobileOpen(false)} className="self-end text-3xl text-[#C5A566]" aria-label="Cerrar menú">×</button>
              <div className="mt-8 flex flex-col gap-2">
                {navLinks.map(([label, href]) => (
                  <a key={href} href={href} onClick={() => setMobileOpen(false)} className="block py-3 text-lg font-medium text-[#1A1A1A] transition-colors hover:text-[var(--jch-accent-ink)]">
                    {label}
                  </a>
                ))}
                <a href={WHATSAPP} onClick={() => setMobileOpen(false)} className="mt-2 inline-block self-start rounded-full bg-[#1f6f78] px-8 py-[1.1rem] text-center text-xs font-medium uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#17535a]">
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
  return (
    <section className="hero-bg-section">
      <img alt="Gestión económica de la comunidad" className="hero-bg-image" src="/patrimonial.webp" loading="eager" decoding="async" fetchPriority="high" />
      <div className="hero-bg-overlay" aria-hidden="true" />
      <div className="mx-auto px-6">
        <div className="space-y-10">
          <FadeUp>
            <div className="hero-eyebrow inline-flex items-center gap-3">
              <motion.span initial={{ width: 0 }} animate={{ width: 32 }} transition={{ duration: 0.9, ease: easeOutExpo, delay: 0.4 }} className="h-[2px] bg-[#C5A566] block" />
              GESTIÓN ECONÓMICA Y PROTOCOLO DE IMPAGOS
            </div>
          </FadeUp>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.08] tracking-tight text-balance">
            <WordReveal eager block delay={0.1} text="Cuentas claras." />
            <WordReveal eager block delay={0.325} className="text-[var(--jch-accent-ink)]" text="Cuotas al día." />
          </h1>
          <FadeUp delay={0.6}>
            <p className="hero-subtitle">
              Control económico mensual y un protocolo definido para actuar cuando hay cuotas
              pendientes, sin dejarlo pasar hasta la junta anual.
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
              <a href="#impagos" className="btn-ghost">Ver protocolo de impagos</a>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

const cuentas = [
  { n: "01", title: "Cuentas claras cada mes", text: "Ingresos, gastos y saldo disponibles y explicados, sin sorpresas al llegar el cierre del año." },
  { n: "02", title: "Presupuesto con antelación", text: "El presupuesto ordinario se prepara con tiempo suficiente para que la junta lo revise con calma." },
  { n: "03", title: "Cierre anual ordenado", text: "Cuentas cerradas y documentadas, listas para la junta de aprobación sin prisas de última hora." },
];

function ComoGestionamos() {
  return (
    <section id="cuentas" className="content-block py-[100px] border-t border-[var(--jch-line)]">
      <div className="content-block__inner">
        <div className="content-block__heading">
          <h2><Curtain>Saber dónde está el dinero y para qué se utiliza.</Curtain></h2>
          <FadeUp delay={0.1}><p>La transparencia económica no debería ser un informe anual.</p></FadeUp>
        </div>
        <div className="content-block__grid">
          {cuentas.map((s, idx) => (
            <FadeUp key={s.n} delay={idx * 0.08}>
              <div className="content-card">
                <span className="content-card__category">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

const pasos = [
  { n: "01.", title: "Aviso al propietario", text: "En cuanto una cuota vence sin pagar, se notifica directamente al propietario, sin esperar semanas." },
  { n: "02.", title: "Seguimiento activo", text: "Se hace seguimiento del caso y se mantiene informada a la presidencia de cada paso que se da." },
  { n: "03.", title: "Reclamación ordenada", text: "Si el impago continúa, se inicia la reclamación formal siguiendo el procedimiento correspondiente." },
  { n: "04.", title: "Coordinación legal si es necesario", text: "En los casos que lo requieren, se coordina con asesoría legal para la vía judicial." },
];

function ProtocoloImpagos() {
  return (
    <section id="impagos" className="py-[100px] border-t border-[var(--jch-line)] bg-[var(--jch-surface)]">
      <div className="method-block__inner">
        <div className="method-block__intro">
          <h2><Curtain>Protocolo de impagos.</Curtain></h2>
          <FadeUp delay={0.1}><p>Un procedimiento claro, no una gestión caso a caso improvisada.</p></FadeUp>
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
  { q: "¿Qué pasa con los propietarios que no pagan sus cuotas?", a: "Se aplica un protocolo de seguimiento y reclamación ordenada, con comunicación constante a la presidencia y, cuando es necesario, coordinación con asesoría legal." },
  { q: "¿Puedo consultar las cuentas cuando quiera?", a: "Sí. Las cuentas están disponibles en el portal del propietario, no solo en la junta anual." },
  { q: "¿Cómo se prepara el presupuesto anual?", a: "Se prepara con antelación suficiente para que la junta pueda revisarlo con calma antes de aprobarlo, no el mismo día de la reunión." },
  { q: "¿La presidencia tiene que gestionar personalmente los impagos?", a: "No. El seguimiento y la reclamación los lleva la administración; la presidencia recibe información del estado de cada caso." },
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
                    <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={spring} className="material-symbols-outlined text-[var(--jch-accent-ink)]">expand_more</motion.span>
                  </button>
                  <motion.div initial={false} animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }} transition={{ duration: 0.5, ease: easeOutExpo }} style={{ overflow: "hidden" }}>
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

function CtaFinal() {
  return (
    <section id="contact" className="py-[100px] border-t border-[var(--jch-line)] bg-[var(--jch-surface)]">
      <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24">
        <div className="space-y-12">
          <h2 className="contact-editorial__title text-5xl md:text-6xl font-bold tracking-tight">
            <Curtain>Pongamos <span className="text-[var(--jch-accent-ink)]">las cuentas en orden</span></Curtain>
          </h2>
          <FadeUp delay={0.1}>
            <p className="contact-editorial__description text-xl leading-relaxed">
              Cuéntame la situación económica de tu comunidad, incluidos los impagos si los hay, y te propongo un plan.
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
          <FadeUp>
            <Link to="/administracion-fincas" className="duo-block__cta">
              Ver administración de fincas <span aria-hidden="true">→</span>
            </Link>
          </FadeUp>
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
  const onChange = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    try {
      await submit({ data: { ...form, topic: "Gestión económica-impagos" } });
      setStatus("ok");
      trackEvent("property_form_submit", { section: "formulario", topic: "Gestión económica-impagos" });
      trackEvent("property_management_proposal_submit", { section: "formulario", topic: "Gestión económica-impagos" });
      setForm({ name: "", phone: "", email: "", message: "" });
      setAccepted(false);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "No se ha podido enviar el formulario.");
    }
  }

  return (
    <form className="contact-form-card space-y-10" onSubmit={onSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <Field label="Nombre" type="text" placeholder="Tu nombre" value={form.name} onChange={onChange("name")} required />
        <Field label="Teléfono" type="tel" placeholder="Tu número" value={form.phone} onChange={onChange("phone")} required />
      </div>
      <Field label="Email (opcional)" type="email" placeholder="tu@email.com" value={form.email} onChange={onChange("email")} />
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em]">Mensaje (opcional)</label>
        <textarea
          rows={4}
          placeholder="Cuéntanos la situación económica de tu comunidad"
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
        style={{ color: "#ffffff" }}
        className="rounded-full w-full bg-[#1f6f78] py-6 font-black uppercase text-xs tracking-[0.3em] hover:bg-[#17535a] transition-colors shadow-2xl shadow-[#1f6f78]/20 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "sending" ? "Enviando…" : status === "ok" ? "¡Enviado!" : "Solicitar propuesta"}
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

function Footer() {
  return (
    <footer className="bg-[#1A1A1A] py-24 text-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-16">
          <div className="flex items-center gap-4 text-center md:text-left">
            <img src="/logo-white.png" alt="Logo" loading="lazy" className="h-10 w-10 object-contain" />
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
            <Link to="/administracion-fincas" className="hover:text-[var(--jch-accent-ink)] transition-colors">Administración de fincas</Link>
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
