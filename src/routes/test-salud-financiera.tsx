import React, { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ThemeToggle } from "@/components/ThemeToggle";
import { submitContact } from "@/lib/contact.functions";
import { trackEvent } from "@/lib/analytics";
import { useDialogA11y } from "@/lib/useDialogA11y";
import { ReportDownload } from "@/components/ReportDownload";

export const Route = createFileRoute("/test-salud-financiera")({
  head: () => ({
    meta: [
      { title: "Test de Salud Financiera 360º | HiloLegal" },
      {
        name: "description",
        content: "Test de salud financiera 360º: protección, crecimiento, cimientos legales y deuda, en 12 preguntas.",
      },
      { property: "og:title", content: "Test de Salud Financiera 360º | HiloLegal" },
      { property: "og:description", content: "Descubre en 12 preguntas la vulnerabilidad de tu familia ante cualquier imprevisto." },
      { property: "og:url", content: "https://www.hilolegal.es/test-salud-financiera" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:site_name", content: "HiloLegal" },
      { property: "og:image", content: "https://www.hilolegal.es/yoderecha.webp" },
      { property: "og:image:width", content: "1672" },
      { property: "og:image:height", content: "941" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Test de Salud Financiera 360º | HiloLegal" },
      { name: "twitter:description", content: "Descubre en 12 preguntas la vulnerabilidad de tu familia ante cualquier imprevisto." },
      { name: "twitter:image", content: "https://www.hilolegal.es/yoderecha.webp" },
    ],
    links: [{ rel: "canonical", href: "https://www.hilolegal.es/test-salud-financiera" }],
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
                { "@type": "ListItem", position: 2, name: "Test de salud financiera", item: "https://www.hilolegal.es/test-salud-financiera" },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: TestSaludFinancieraPage,
});

const WHATSAPP = "https://wa.me/34647506040?text=Quiero%20informaci%C3%B3n%20sobre%20mi%20salud%20financiera";
const PHONE_DISPLAY = "647 50 60 40";
const EMAIL = "josecarlos@hilolegal.es";
const LOGO = "/hilolegal-logo-stacked-black.webp";

const Icon = ({ name, className = "" }: { name: string; className?: string }) => (
  <span aria-hidden="true" className={`material-symbols-outlined ${className}`}>{name}</span>
);

// ----- Motion primitives (idénticos al resto del sitio) -----
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

// ============================================================
// Datos del diagnóstico (mismo contenido que la herramienta original)
// ============================================================

interface Block {
  id: string;
  name: string;
  description: string;
  tips: string[];
}

const BLOCKS: Block[] = [
  { id: "A", name: "Escudo de Protección", description: "Seguridad ante imprevistos vitales", tips: ["Crea un fondo de emergencia de 3 a 6 meses de gastos.", "Asegura un capital de vida que cubra deudas e hijos.", "Contrata un seguro de salud para evitar listas de espera."] },
  { id: "B", name: "Futuro y Crecimiento", description: "Planificación a largo plazo e inflación", tips: ["Automatiza el ahorro mensual (págate a ti mismo primero).", "Invierte para batir a la inflación con interés compuesto.", "Aprovecha las deducciones fiscales de planes de previsión."] },
  { id: "C", name: "Cimientos Legales", description: "Seguridad jurídica y patrimonial", tips: ["Firma un testamento ante notario (es barato y vital).", "Otorga poderes preventivos para casos de incapacidad.", "Designa tutores legales si tienes hijos menores."] },
  { id: "D", name: "Deuda", description: "Eficiencia en pasivos e hipotecas", tips: ["Elimina primero las deudas de tarjetas y consumo.", "Negocia tu hipoteca si el interés es superior al mercado.", "No superes nunca el 35% de ingresos en cuotas de deuda."] },
];

interface Option {
  val: number;
  label: string;
}

interface Question {
  id: number;
  block: string;
  title: string;
  text: string;
  why: string;
  risk: string;
  options?: Option[];
}

const QUESTIONS: Question[] = [
  { id: 1, block: "A", title: "Baja Laboral", text: "Si mañana sufrieras una enfermedad o accidente que te impidiera trabajar durante 6 meses, ¿tienes un fondo de emergencia o un seguro que complemente lo que necesitas para vivir?", why: "La Seguridad Social rara vez cubre el 100% de tus ingresos reales (especialmente si eres autónomo o tienes bonus variables).", risk: "Sin este complemento, te verás obligado a gastar tus ahorros de toda la vida o a endeudarte solo para pagar la hipoteca, facturas y demás gastos mientras te recuperas." },
  { id: 2, block: "A", title: "Desgracia Familiar", text: "En caso de fallecimiento repentino, ¿tu familia tendría más de 50.000 € disponibles de inmediato para afrontar impuestos, gastos vitales y adaptarse a la nueva situación familiar?", why: "Al fallecer, las cuentas bancarias del titular se bloquean automáticamente hasta resolver la herencia (meses).", risk: "Tu familia puede recibir bienes, pero carecer de liquidez inmediata, mientras los activos siguen inmovilizados en el peor momento emocional." },
  { id: 3, block: "A", title: "Acceso Sanitario", text: "¿Tienes acceso directo a medicina privada y hospitalización sin pasar por las listas de espera de la Seguridad Social?", why: "En salud, el tiempo no es oro, es vida. La rapidez de diagnóstico marca la diferencia entre un susto y una tragedia.", risk: "Depender exclusivamente de las listas de espera públicas puede convertir una dolencia tratable en un problema crónico irreversible." },
  { id: 4, block: "B", title: "Jubilación", text: "¿Sabes cuál será tu pensión pública y tienes un plan para cubrir el resto?", why: "La pirámide poblacional se ha invertido. La pensión pública tiene un tope máximo que probablemente no cubra tu nivel de vida actual.", risk: "Si no calculas la diferencia a tiempo, llegarás a los 67 con ingresos mucho menores y sin margen para corregirlo." },
  { id: 5, block: "B", title: "Guerra contra la Inflación", text: "El dinero que tienes ahorrado en el banco \"por si acaso\", ¿te está generando al menos un 2,5% de rentabilidad anual?", why: "La inflación es un \"impuesto silencioso\" que se come tus ahorros si están parados.", risk: "Tener 50.000€ quietos en el banco durante 10 años con una inflación media del 3% significa perder casi 13.000€ de poder adquisitivo." },
  { id: 6, block: "B", title: "Eficiencia Fiscal", text: "¿Aprovechaste en tu última declaración de la Renta los 1.500 € (5.750 € si eres autónomo) de reducción por aportaciones a sistemas de previsión social?", why: "Es el único vehículo que te permite deducir directamente de tu base imponible general.", risk: "Ese ahorro fiscal no aprovechado, si se reinvirtiera, podría suponer una diferencia de más de 60.000€ en tu patrimonio final." },
  { id: 7, block: "C", title: "El Testamento Antibloqueo", text: "¿Tienes hecho testamento ante notario y revisado en los últimos 5 años para adaptarlo a tu situación actual?", why: "Un testamento actualizado garantiza que tu voluntad se cumpla y ahorra a tu familia procesos judiciales lentos y costosos.", risk: "Sin testamento (\"ab intestato\"), el proceso es 3 veces más caro y lento." },
  { id: 8, block: "C", title: "Poderes Preventivos", text: "¿Has firmado un poder preventivo para que alguien gestione tu patrimonio si sufres una incapacidad sobrevenida?", why: "Una incapacidad (ictus, accidente, demencia) bloquea legalmente tu capacidad de firma.", risk: "Sin este poder, tu familia no podrá tocar tu dinero ni para pagar tus propios cuidados médicos, y tendrá que iniciar un proceso judicial." },
  { id: 9, block: "C", title: "Tutela de menores", text: "Si tenéis hijos menores, ¿habéis designado en testamento quién sería su tutor legal si ambos padres faltaseis?", why: "Si no lo dejáis por escrito, un juez decidirá por vosotros basándose en la ley y testimonios.", risk: "Tus hijos podrían acabar educados por un familiar con el que no compartéis valores, o separados de sus hermanos." },
  { id: 10, block: "D", title: "Salud Hipotecaria", text: "¿Has revisado tu hipoteca en los últimos 24 meses para adaptarla a la bajada de tipos, mejorar el diferencial o eliminar vinculaciones innecesarias?", why: "La hipoteca suele ser el mayor gasto de las familias. La fidelidad al banco no paga, se cobra.", risk: "Una diferencia de apenas un 1% en una hipoteca media supone regalar al banco más de 30.000 € en intereses.", options: [{ val: 0, label: "No" }, { val: 5, label: "No tengo hipoteca" }, { val: 10, label: "Sí / Totalmente" }] },
  { id: 11, block: "D", title: "Ratio de Solvencia", text: "¿El total de tus préstamos e hipotecas superan el 35% de tus ingresos?", why: "Es el ratio de solvencia técnica.", risk: "Superar este límite te coloca en una situación de estrés financiero permanente ante subidas de tipos.", options: [{ val: 0, label: "Sí, lo superan" }, { val: 5, label: "Están justo en el límite" }, { val: 10, label: "No, están por debajo" }] },
  { id: 12, block: "D", title: "Otras Deudas", text: "¿Tienes otras deudas (tarjetas, préstamos consumo)?", why: "La deuda de consumo es un destructor de patrimonio silencioso por sus altos intereses.", risk: "Debe ser la primera prioridad de eliminación para evitar que los intereses devoren tu capacidad de ahorro.", options: [{ val: 10, label: "No" }, { val: 5, label: "Sí, poco relevantes" }, { val: 0, label: "Sí, relevantes" }] },
];

const DEFAULT_OPTIONS: Option[] = [{ val: 0, label: "No" }, { val: 5, label: "Parcialmente" }, { val: 10, label: "Sí / Totalmente" }];

function scoreColor(score: number): string {
  return score >= 8 ? "#1f6f78" : score >= 5 ? "#C5A566" : "#9b2c2c";
}

function calculateBlockScore(blockId: string, answers: Map<number, number>): number {
  const blockQuestions = QUESTIONS.filter((q) => q.block === blockId);
  const filtered = blockQuestions.filter((q) => q.id !== 10 || answers.get(10) !== 5);
  if (!filtered.length) return 0;
  const total = filtered.reduce((sum, q) => sum + (answers.get(q.id) ?? 0), 0);
  return total / filtered.length;
}

function overallScore(answers: Map<number, number>): number {
  return BLOCKS.reduce((sum, b) => sum + calculateBlockScore(b.id, answers), 0) / BLOCKS.length;
}

function resultText(score: number): { title: string; body: string } {
  if (score < 5) return { title: "Atención: tu patrimonio necesita cuidados urgentes", body: "Tu diagnóstico revela que tu salud financiera está en una zona de fragilidad. Ahora mismo, imprevistos legales o económicos podrían desestabilizar todo lo que has construido. Tienes margen de maniobra, pero es urgente blindar los cimientos antes de seguir construyendo." };
  if (score < 8) return { title: "Vas por buen camino, pero hay grietas invisibles", body: "Estás haciendo muchas cosas bien, pero tu estructura financiera tiene puntos ciegos. La inflación, la falta de optimización fiscal o ciertos riesgos legales no cubiertos están frenando tu verdadero potencial de crecimiento." };
  return { title: "Excelente salud. Ahora el resto es la excelencia", body: "Tienes una situación financiera envidiable. En esta cima, el mayor riesgo es el estancamiento o el exceso de confianza. Los grandes patrimonios requieren precisión para mantenerse, crecer y legarse eficientemente." };
}

const eur0 = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

// ============================================================
// Página
// ============================================================

function TestSaludFinancieraPage() {
  useEffect(() => {
    trackEvent("tool_financial_health", { section: "page_view", page: "test-salud-financiera" });
  }, []);

  return (
    <div className="josecarlos-original bg-[var(--jch-bg)] text-[var(--jch-ink)] selection:bg-[#C5A566] selection:text-white">
      <SmoothScroll />
      <Header />
      <main>
        <Hero />
        <Test />
        <FAQ />
        <CtaFinal />
      </main>
      <Footer />
    </div>
  );
}

// ---------- Header ----------
function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const reduce = useReducedMotion();
  const drawerRef = useRef<HTMLElement>(null);

  const navLinks: [string, string][] = [
    ["Diagnóstico", "#test"],
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
            <span className="text-base font-bold tracking-tight text-[#8a6d3a] md:text-lg">
              Test de Salud Financiera
            </span>
          </Link>

          <div className="hidden items-center gap-9 lg:flex">
            {navLinks.map(([label, href]) => (
              <a key={href} className="group relative text-sm font-medium text-[#1A1A1A]" href={href}>
                <span className="transition-colors group-hover:text-[var(--jch-accent-ink)]">{label}</span>
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
              className="-mr-2 p-2 text-2xl text-[var(--jch-accent-ink)] lg:hidden"
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
            className="fixed right-0 top-0 z-[9999] h-[100dvh] w-[min(88vw,420px)] border-l border-[#E5E5E5] bg-white/95 backdrop-blur-xl outline-none lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
          >
            <div className="flex h-full flex-col gap-4 overflow-y-auto p-8">
              <button type="button" onClick={() => setMobileOpen(false)} className="self-end text-3xl text-[var(--jch-accent-ink)]" aria-label="Cerrar menú">
                ×
              </button>
              <div className="mt-8 flex flex-col gap-2">
                {navLinks.map(([label, href]) => (
                  <a key={href} href={href} onClick={() => setMobileOpen(false)} className="block py-3 text-lg font-medium text-[#1A1A1A] transition-colors hover:text-[var(--jch-accent-ink)]">
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

// ---------- Hero ----------
function Hero() {
  return (
    <section className="pt-24 pb-20 md:pt-32 md:pb-28 border-b border-[var(--jch-line)]">
      <div className="max-w-[1200px] mx-auto px-6 space-y-10">
        <FadeUp>
          <div className="hero-eyebrow inline-flex items-center gap-3">
            <motion.span initial={{ width: 0 }} animate={{ width: 32 }} transition={{ duration: 0.9, ease: easeOutExpo, delay: 0.4 }} className="h-[2px] bg-[#C5A566] block" />
            PROTECCIÓN · CRECIMIENTO · LEGALIDAD · DEUDA
          </div>
        </FadeUp>
        <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.08] tracking-tight text-balance max-w-4xl">
          <WordReveal eager block delay={0.1} text="Tu salud" />
          <WordReveal eager block delay={0.325} className="text-[var(--jch-accent-ink)]" text="financiera." />
        </h1>
        <FadeUp delay={0.6}>
          <p className="hero-subtitle max-w-2xl">
            Descubre en 12 preguntas la vulnerabilidad de tu familia ante cualquier imprevisto,
            y cómo protegerla.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}

// ---------- Test ----------
type Screen = "welcome" | "quiz" | "results";

function Test() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [block, setBlock] = useState(0);
  const [answers, setAnswers] = useState<Map<number, number>>(new Map());

  const progress = Math.round((answers.size / QUESTIONS.length) * 100);
  const currentQuestions = QUESTIONS.filter((q) => q.block === BLOCKS[block].id);
  const currentComplete = currentQuestions.every((q) => answers.has(q.id));
  const score = useMemo(() => overallScore(answers), [answers]);

  function answer(id: number, val: number) {
    setAnswers((prev) => {
      const next = new Map(prev);
      next.set(id, val);
      return next;
    });
  }

  function goPrev() {
    if (block > 0) setBlock((b) => b - 1);
    else setScreen("welcome");
  }

  function goNext() {
    if (block < BLOCKS.length - 1) setBlock((b) => b + 1);
    else setScreen("results");
  }

  return (
    <section id="test" className="py-[100px] border-t border-[var(--jch-line)]">
      <div className="max-w-[900px] mx-auto px-6">
        {screen !== "welcome" && (
          <div className="mb-16">
            <div className="flex justify-between text-xs uppercase tracking-widest text-[var(--jch-dim)] mb-2">
              <span>Estado del diagnóstico</span>
              <span>{screen === "results" ? "Evaluación completada" : `${progress}% completado`}</span>
            </div>
            <div className="h-1 bg-[var(--jch-line)] overflow-hidden">
              <div className="h-full bg-[#C5A566] transition-all duration-500" style={{ width: `${screen === "results" ? 100 : progress}%` }} />
            </div>
          </div>
        )}

        {screen === "welcome" && (
          <FadeUp className="text-center space-y-10 py-10">
            <div>
              <span className="block text-xs uppercase tracking-widest text-[var(--jch-dim)] mb-4">
                Análisis de protección · crecimiento · legalidad · deuda
              </span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                <Curtain>Descubre tu salud financiera</Curtain>
              </h2>
              <p className="mt-6 text-lg text-[var(--jch-muted)] max-w-xl mx-auto">
                12 preguntas para ver la vulnerabilidad de tu familia ante cualquier imprevisto y cómo protegerla.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={spring}
              onClick={() => { setScreen("quiz"); setBlock(0); setAnswers(new Map()); }}
              className="rounded-full bg-[#1f6f78] text-white px-10 py-5 font-bold uppercase text-xs tracking-widest hover:bg-[#17535a] transition-colors shadow-xl shadow-[#1f6f78]/20"
            >
              Iniciar diagnóstico
            </motion.button>
          </FadeUp>
        )}

        {screen === "quiz" && (
          <div>
            <FadeUp className="mb-12">
              <span className="text-xs uppercase tracking-widest text-[var(--jch-dim)]">Bloque {block + 1} de {BLOCKS.length}</span>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mt-2">{BLOCKS[block].name}</h2>
              <p className="mt-2 text-[var(--jch-muted)]">{BLOCKS[block].description}</p>
            </FadeUp>

            <div className="space-y-6">
              {currentQuestions.map((q, i) => {
                const options = q.options ?? DEFAULT_OPTIONS;
                const selected = answers.get(q.id);
                const number = String(QUESTIONS.findIndex((item) => item.id === q.id) + 1).padStart(2, "0");
                return (
                  <FadeUp key={q.id} delay={i * 0.05} className="border border-[var(--jch-line)] p-6 md:p-8">
                    <h3 className="font-bold text-lg">
                      <span className="text-[var(--jch-accent-ink)] mr-2">{number}.</span>{q.title}
                    </h3>
                    <p className="mt-3 text-[var(--jch-muted)]">{q.text}</p>
                    <div className="mt-5 flex flex-wrap gap-3">
                      {options.map((opt) => (
                        <button
                          key={opt.label}
                          type="button"
                          onClick={() => answer(q.id, opt.val)}
                          className={`px-5 py-3 text-sm font-medium border transition-colors ${
                            selected === opt.val
                              ? "border-[#C5A566] bg-[#C5A566] text-[#1A1A1A]"
                              : "border-[var(--jch-line)] hover:border-[var(--jch-accent)]"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    {selected !== undefined && (
                      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-5 pt-5 border-t border-[var(--jch-line)]">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--jch-dim)] mb-1">Por qué importa</p>
                          <p className="text-sm text-[var(--jch-muted)]">{q.why}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--jch-dim)] mb-1">Riesgo latente</p>
                          <p className="text-sm text-[var(--jch-muted)]">{q.risk}</p>
                        </div>
                      </div>
                    )}
                  </FadeUp>
                );
              })}
            </div>

            <div className="mt-10 flex justify-between gap-4">
              <button type="button" onClick={goPrev} className="btn-ghost">Anterior</button>
              <motion.button
                whileHover={{ scale: currentComplete ? 1.03 : 1 }}
                whileTap={{ scale: currentComplete ? 0.97 : 1 }}
                transition={spring}
                type="button"
                onClick={goNext}
                disabled={!currentComplete}
                className="rounded-full bg-[#1f6f78] text-white px-8 py-4 font-bold uppercase text-xs tracking-widest hover:bg-[#17535a] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {block < BLOCKS.length - 1 ? "Siguiente bloque" : "Ver resultados"}
              </motion.button>
            </div>
          </div>
        )}

        {screen === "results" && (
          <Resultados score={score} answers={answers} onEdit={() => { setScreen("quiz"); setBlock(BLOCKS.length - 1); }} onRestart={() => { setScreen("welcome"); setBlock(0); setAnswers(new Map()); }} />
        )}
      </div>
    </section>
  );
}

function Resultados({ score, answers, onEdit, onRestart }: { score: number; answers: Map<number, number>; onEdit: () => void; onRestart: () => void }) {
  const message = resultText(score);
  const color = scoreColor(score);
  const stateLabel = score >= 8 ? "Estado: blindado" : score >= 5 ? "Estado: vulnerable" : "Estado: riesgo alto";

  return (
    <div>
      <FadeUp className="text-center mb-16">
        <p className="text-xs uppercase tracking-widest text-[var(--jch-dim)] mb-4">Resultado global</p>
        <p className="text-6xl md:text-7xl font-black" style={{ color }}>
          {score.toFixed(1)}<span className="text-2xl text-[var(--jch-dim)]">/10</span>
        </p>
        <p className="mt-3 font-bold uppercase tracking-widest" style={{ color }}>{stateLabel}</p>
      </FadeUp>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
        {BLOCKS.map((b, i) => {
          const s = calculateBlockScore(b.id, answers);
          const c = scoreColor(s);
          const status = s >= 8 ? "Óptimo" : s >= 5 ? "Mejorable" : "Riesgo";
          return (
            <FadeUp key={b.id} delay={i * 0.06} className="border border-[var(--jch-line)] p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold">{b.name}</h3>
                <span className="text-xs font-bold uppercase tracking-widest px-2 py-1 text-white" style={{ background: c }}>{status}</span>
              </div>
              <p className="text-3xl font-black mb-3" style={{ color: c }}>{s.toFixed(1)}</p>
              <ul className="space-y-1.5 text-xs text-[var(--jch-muted)] list-disc list-inside">
                {b.tips.map((tip) => <li key={tip}>{tip}</li>)}
              </ul>
            </FadeUp>
          );
        })}
      </div>

      <FadeUp delay={0.1} className="border border-[var(--jch-line)] bg-[var(--jch-surface)] p-8 md:p-10 mb-10">
        <h3 className="text-xl font-bold mb-3">{message.title}</h3>
        <p className="text-[var(--jch-muted)] leading-relaxed">{message.body}</p>
      </FadeUp>

      <FadeUp delay={0.15} className="mb-16">
        <ReportDownload topic="Test de salud financiera">
          <div style={{ fontFamily: "Inter, ui-sans-serif, sans-serif", padding: "2rem", maxWidth: "800px" }}>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: ".25rem" }}>Informe · Test de salud financiera 360º</h1>
            <p style={{ color: "#4A4A4A", marginBottom: "2rem" }}>HiloLegal · {new Date().toLocaleDateString("es-ES")}</p>

            <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Resultado global: {score.toFixed(1)}/10 — {stateLabel}</h2>
            <p style={{ fontWeight: 700, marginTop: ".5rem" }}>{message.title}</p>
            <p>{message.body}</p>

            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginTop: "1.5rem" }}>Por bloques</h2>
            {BLOCKS.map((b) => (
              <p key={b.id}>{b.name}: {calculateBlockScore(b.id, answers).toFixed(1)}/10</p>
            ))}

            <p style={{ marginTop: "2rem", fontSize: ".85rem", color: "#4A4A4A" }}>
              Diagnóstico orientativo, no sustituye asesoramiento personalizado. HiloLegal — {PHONE_DISPLAY} — {EMAIL}
            </p>
          </div>
        </ReportDownload>
      </FadeUp>

      <div className="flex flex-wrap justify-center gap-4">
        <button type="button" onClick={onEdit} className="btn-ghost">Volver a editar respuestas</button>
        <button type="button" onClick={onRestart} className="btn-ghost">Repetir evaluación</button>
        <motion.a
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={spring}
          href={WHATSAPP}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-[#1f6f78] text-white px-8 py-4 font-bold uppercase text-xs tracking-widest hover:bg-[#17535a] transition-colors"
        >
          Agendar reunión de planificación
        </motion.a>
      </div>
    </div>
  );
}

// ---------- FAQ ----------
const faqs = [
  { q: "¿Cuánto tarda el diagnóstico?", a: "Unos 5 minutos. Son 12 preguntas repartidas en 4 bloques, con la opción de volver atrás y editar tus respuestas antes de ver el resultado." },
  { q: "¿Qué significa la puntuación?", a: "De 0 a 10 por bloque y en global: por debajo de 5 hay riesgos importantes sin cubrir, entre 5 y 8 hay puntos de mejora, y por encima de 8 la base está bien construida." },
  { q: "¿Sustituye una consulta con un profesional?", a: "No. Es un diagnóstico orientativo para identificar puntos ciegos. Las decisiones concretas conviene tomarlas con datos reales de tu situación." },
];

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
                  <button onClick={() => setOpen(isOpen ? null : i)} className="w-full flex justify-between items-center text-left p-8 text-lg font-bold uppercase tracking-tight" aria-expanded={isOpen}>
                    <span>{f.q}</span>
                    <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={spring} className="material-symbols-outlined text-[var(--jch-accent-ink)]">
                      expand_more
                    </motion.span>
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

// ---------- CTA final + formulario ----------
function CtaFinal() {
  return (
    <section id="contact" className="py-[100px] border-t border-[var(--jch-line)] bg-[var(--jch-surface)]">
      <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24">
        <div className="space-y-12">
          <h2 className="contact-editorial__title text-5xl md:text-6xl font-bold tracking-tight">
            <Curtain>De la protección a <span className="text-[var(--jch-accent-ink)]">la optimización</span></Curtain>
          </h2>
          <FadeUp delay={0.1}>
            <p className="contact-editorial__description text-xl leading-relaxed">
              Cuéntanos tu resultado y revisamos juntos cómo cerrar los puntos ciegos con acciones concretas.
            </p>
          </FadeUp>
          <div className="space-y-10 pt-10 border-t border-[var(--jch-line)]">
            {[
              { i: "call", label: "Llámanos", v: PHONE_DISPLAY, href: "tel:+34647506040" },
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
            <Link to="/josecarlos" className="duo-block__cta">
              Ver asesoría patrimonial y financiera <span aria-hidden="true">→</span>
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
  const honeypotRef = useRef<HTMLInputElement>(null);
  const formLoadedAtRef = useRef(Date.now());
  const onChange = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!startedRef.current) {
      startedRef.current = true;
      trackEvent("tool_financial_health", { section: "formulario" });
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
          topic: "Test de salud financiera",
          website: honeypotRef.current?.value ?? "",
          formLoadedAt: formLoadedAtRef.current,
        },
      });
      setStatus("ok");
      trackEvent("contact_submit", { section: "formulario", topic: "Test de salud financiera" });
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
          placeholder="Cuéntanos tu situación"
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
        {status === "sending" ? "Enviando…" : status === "ok" ? "¡Enviado!" : "Solicitar revisión"}
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

// ---------- Footer ----------
function Footer() {
  return (
    <footer className="bg-[#1A1A1A] py-24 text-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-16">
          <div className="flex items-center gap-4 text-center md:text-left">
            <img src="/hilolegal-logo-white.webp" alt="Logo HiloLegal" loading="lazy" className="h-9 w-auto object-contain" />
            <div className="space-y-2">
              <div className="text-2xl font-black tracking-tighter uppercase">Test de Salud Financiera</div>
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
          </div>
          <div className="text-center text-[10px] text-gray-600 uppercase tracking-widest">
            © {new Date().getFullYear()} HILOLEGAL. TODOS LOS DERECHOS RESERVADOS.
          </div>
        </div>
      </div>
    </footer>
  );
}
