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

export const Route = createFileRoute("/simulador-hipoteca")({
  head: () => ({
    meta: [
      { title: "Simulador de Hipoteca Online | HiloLegal" },
      {
        name: "description",
        content:
          "Calcula la cuota, el LTV, los gastos y el precio máximo de vivienda que puedes permitirte. Simulador gratuito con cuadro de amortización.",
      },
      { property: "og:title", content: "Simulador de Hipoteca Online | HiloLegal" },
      { property: "og:description", content: "Cuota, LTV, gastos y precio máximo de vivienda, con cuadro de amortización." },
      { property: "og:url", content: "https://www.hilolegal.es/simulador-hipoteca" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:site_name", content: "HiloLegal" },
      { property: "og:image", content: "https://www.hilolegal.es/yoderecha.webp" },
      { property: "og:image:width", content: "1672" },
      { property: "og:image:height", content: "941" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Simulador de Hipoteca Online | HiloLegal" },
      { name: "twitter:description", content: "Cuota, LTV, gastos y precio máximo de vivienda, con cuadro de amortización." },
      { name: "twitter:image", content: "https://www.hilolegal.es/yoderecha.webp" },
    ],
    links: [
      { rel: "canonical", href: "https://www.hilolegal.es/simulador-hipoteca" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=call,mail,payments,percent,calculate,expand_more&display=swap",
      },
    ],
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
                { "@type": "ListItem", position: 2, name: "Simulador de hipoteca", item: "https://www.hilolegal.es/simulador-hipoteca" },
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
  component: SimuladorHipotecaPage,
});

const WHATSAPP = "https://wa.me/34647506040?text=Quiero%20informaci%C3%B3n%20sobre%20mi%20hipoteca";
const PHONE_DISPLAY = "647 50 60 40";
const EMAIL = "josecarlos@hilolegal.es";
const LOGO = "/hilolegal-logo-stacked-black.webp";

const Icon = ({ name, className = "" }: { name: string; className?: string }) => (
  <span aria-hidden="true" className={`material-symbols-outlined ${className}`}>{name}</span>
);

// ----- Motion primitives (idénticos a josecarlos.tsx / veronica.tsx / administracion-fincas.*.tsx) -----
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
// Cálculo financiero
// ============================================================

const eur0 = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const eur2 = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 2 });
const pct1 = (n: number) => `${n.toFixed(1).replace(".", ",")} %`;

/** Cuota mensual de un préstamo a interés fijo, sistema de amortización francés. */
function frenchPayment(loan: number, monthlyRate: number, months: number): number {
  if (months <= 0 || loan <= 0) return 0;
  if (monthlyRate <= 0) return loan / months;
  const factor = Math.pow(1 + monthlyRate, months);
  return (loan * (monthlyRate * factor)) / (factor - 1);
}

/** Capital máximo financiable dada una cuota mensual máxima (valor presente de una anualidad). */
function maxLoanFromPayment(payment: number, monthlyRate: number, months: number): number {
  if (months <= 0 || payment <= 0) return 0;
  if (monthlyRate <= 0) return payment * months;
  const factor = Math.pow(1 + monthlyRate, months);
  return (payment * (factor - 1)) / (monthlyRate * factor);
}

type HousingType = "usada" | "nueva";

/** Gastos estimados de la compraventa (no incluye los de constitución de la hipoteca,
 *  que desde 2019 corren a cargo del banco). Estimación orientativa para Comunidad Valenciana. */
function closingCosts(price: number, housingType: HousingType) {
  const safePrice = Math.max(0, price);
  const impuestos = housingType === "nueva" ? safePrice * 0.115 : safePrice * 0.10;
  const notaria = Math.min(900, Math.max(300, safePrice * 0.003));
  const registro = Math.min(500, Math.max(200, safePrice * 0.0015));
  const gestoria = 300;
  const tasacion = 350;
  return {
    impuestos,
    notaria,
    registro,
    gestoria,
    tasacion,
    total: impuestos + notaria + registro + gestoria + tasacion,
  };
}

interface AmortYear {
  year: number;
  cuotaAnual: number;
  intereses: number;
  amortizado: number;
  pendiente: number;
}

function buildAmortizationSchedule(loan: number, annualRatePct: number, years: number) {
  const months = Math.max(0, Math.round(years * 12));
  const monthlyRate = annualRatePct / 100 / 12;
  const cuota = frenchPayment(loan, monthlyRate, months);
  const yearly: AmortYear[] = [];
  let balance = loan;
  let yearInterest = 0;
  let yearPrincipal = 0;
  for (let m = 1; m <= months; m++) {
    const interest = balance * monthlyRate;
    let principal = cuota - interest;
    if (principal > balance) principal = balance;
    balance = Math.max(0, balance - principal);
    yearInterest += interest;
    yearPrincipal += principal;
    if (m % 12 === 0 || m === months) {
      yearly.push({
        year: Math.ceil(m / 12),
        cuotaAnual: yearInterest + yearPrincipal,
        intereses: yearInterest,
        amortizado: yearPrincipal,
        pendiente: balance,
      });
      yearInterest = 0;
      yearPrincipal = 0;
    }
  }
  return { cuota, months, yearly };
}

type RateMode = "fijo" | "variable" | "mixta";

interface RateConfigValue {
  mode: RateMode;
  tinFijo: number;
  fixedYears: number;
  diferencial: number;
  euribor: number;
}

/** Tipo de interés "de referencia" para cálculos que necesitan un único tipo
 *  (p.ej. la pantalla de "cuánto puedes permitirte"): en fijo y mixta se usa
 *  el TIN del primer tramo; en variable, euríbor + diferencial. */
function referenceRate({ mode, tinFijo, diferencial, euribor }: RateConfigValue): number {
  return mode === "variable" ? diferencial + euribor : tinFijo;
}

/** Cuadro de amortización de una hipoteca a tipo fijo, variable o mixta.
 *  En mixta, la cuota del tramo fijo se calcula como si todo el préstamo
 *  fuese a ese tipo durante el plazo completo (práctica habitual de las
 *  entidades); al pasar al tramo variable, la cuota se recalcula sobre el
 *  capital pendiente y el plazo restante, como hacen los bancos. */
function buildMortgageSchedule(loan: number, termYears: number, rate: RateConfigValue) {
  const totalMonths = Math.max(0, Math.round(termYears * 12));
  const variableRate = rate.diferencial + rate.euribor;
  const rate1 = rate.mode === "variable" ? variableRate : rate.tinFijo;
  const phase1Months = rate.mode === "mixta" ? Math.min(totalMonths, Math.max(0, Math.round(rate.fixedYears * 12))) : totalMonths;
  const monthlyRate1 = rate1 / 100 / 12;
  const cuotaFija = frenchPayment(loan, monthlyRate1, totalMonths);

  const yearly: AmortYear[] = [];
  let balance = loan;
  let yearInterest = 0;
  let yearPrincipal = 0;

  for (let m = 1; m <= phase1Months; m++) {
    const interest = balance * monthlyRate1;
    let principal = cuotaFija - interest;
    if (principal > balance) principal = balance;
    balance = Math.max(0, balance - principal);
    yearInterest += interest;
    yearPrincipal += principal;
    if (m % 12 === 0 || m === totalMonths) {
      yearly.push({ year: Math.ceil(m / 12), cuotaAnual: yearInterest + yearPrincipal, intereses: yearInterest, amortizado: yearPrincipal, pendiente: balance });
      yearInterest = 0;
      yearPrincipal = 0;
    }
  }

  let cuotaVariable = 0;
  if (rate.mode === "mixta" && phase1Months < totalMonths) {
    const remainingMonths = totalMonths - phase1Months;
    const monthlyRate2 = variableRate / 100 / 12;
    cuotaVariable = frenchPayment(balance, monthlyRate2, remainingMonths);
    for (let m = phase1Months + 1; m <= totalMonths; m++) {
      const interest = balance * monthlyRate2;
      let principal = cuotaVariable - interest;
      if (principal > balance) principal = balance;
      balance = Math.max(0, balance - principal);
      yearInterest += interest;
      yearPrincipal += principal;
      if (m % 12 === 0 || m === totalMonths) {
        yearly.push({ year: Math.ceil(m / 12), cuotaAnual: yearInterest + yearPrincipal, intereses: yearInterest, amortizado: yearPrincipal, pendiente: balance });
        yearInterest = 0;
        yearPrincipal = 0;
      }
    }
  }

  return {
    cuotaFija,
    cuotaVariable: rate.mode === "variable" ? cuotaFija : cuotaVariable,
    fixedMonths: phase1Months,
    months: totalMonths,
    yearly,
  };
}

interface ViabilityResult {
  viable: boolean;
  reasons: string[];
}

/** Chequeo de viabilidad orientativo con los criterios habituales de la banca
 *  española: financiación máxima del 100% del precio, LTV de referencia 80%
 *  y esfuerzo (cuota/ingresos) de referencia 35%. */
function evaluateViability({ loan, price, worstCuota, totalIncome, ltv }: { loan: number; price: number; worstCuota: number; totalIncome: number; ltv: number }): ViabilityResult {
  const reasons: string[] = [];
  if (totalIncome <= 0) {
    reasons.push("No se han indicado ingresos, así que no se puede evaluar el esfuerzo de la operación.");
  }
  if (price > 0 && loan > price) {
    reasons.push("Se necesitaría financiar más del 100% del precio de compra, algo que no ofrecen los bancos habitualmente.");
  }
  if (ltv > 80) {
    reasons.push(`El LTV (${pct1(ltv)}) supera el 80% que suelen exigir como máximo las entidades para vivienda habitual.`);
  }
  if (totalIncome > 0) {
    const esfuerzo = (worstCuota / totalIncome) * 100;
    if (esfuerzo > 35) {
      reasons.push(`La cuota supone un ${pct1(esfuerzo)} de los ingresos netos, por encima del 35% que suelen admitir las entidades.`);
    }
  }
  return { viable: reasons.length === 0, reasons };
}

// ============================================================
// Página
// ============================================================

function SimuladorHipotecaPage() {
  useEffect(() => {
    trackEvent("tool_mortgage", { section: "page_view", page: "simulador-hipoteca" });
  }, []);

  // El tipo de interés se configura una vez en "Simula tu hipoteca" y lo
  // reutiliza "¿Cuánto te puedes permitir?" para no pedir el mismo dato dos
  // veces y mantener la página como un único hilo didáctico.
  const [rate, setRate] = useState<RateConfigValue>({ mode: "fijo", tinFijo: 3.1, fixedYears: 10, diferencial: 0.9, euribor: 3.0 });

  return (
    <div className="josecarlos-original bg-[var(--jch-bg)] text-[var(--jch-ink)] selection:bg-[#C5A566] selection:text-white">
      <SmoothScroll />
      <Header />
      <main>
        <Hero />
        <Simulador rate={rate} onRateChange={setRate} />
        <CuantoPuedesPermitirte rate={rate} />
        <Amortizacion />
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
    ["Simulador", "#simulador"],
    ["Cuánto puedo permitirme", "#permitirte"],
    ["Amortización", "#amortizacion"],
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
              Simulador de Hipoteca
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
            HERRAMIENTA FINANCIERA
          </div>
        </FadeUp>
        <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.08] tracking-tight text-balance max-w-4xl">
          <WordReveal eager block delay={0.1} text="Antes de firmar," />
          <WordReveal eager block delay={0.325} className="text-[var(--jch-accent-ink)]" text="haz números." />
        </h1>
        <FadeUp delay={0.6}>
          <p className="hero-subtitle max-w-2xl">
            Calcula la cuota, el LTV y los gastos de tu hipoteca, y descubre el precio máximo de
            vivienda que puedes permitirte según tus ingresos. Con cuadro de amortización completo.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}

// ---------- Campos de formulario ----------
function NumberField({
  label,
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}) {
  const id = `nf-${label.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</label>
      <div className="flex items-baseline gap-2 border-b border-[var(--jch-line)] focus-within:border-[#C5A566] transition-colors">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={step}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => onChange(Math.max(min, Number(e.target.value) || 0))}
          onWheel={(e) => e.currentTarget.blur()}
          className="w-full bg-transparent border-0 px-0 py-4 focus:ring-0 outline-none"
        />
        {suffix && <span className="pb-4 text-sm text-[var(--jch-muted)]">{suffix}</span>}
      </div>
    </div>
  );
}

function RangeField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  display,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
  step?: number;
  display: string;
}) {
  const pctFill = max > min ? ((value - min) / (max - min)) * 100 : 0;
  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between gap-4">
        <label className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</label>
        <span className="text-lg font-bold text-[var(--jch-accent-ink)]">{display}</span>
      </div>
      <input
        type="range"
        className="jch-range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ background: `linear-gradient(to right, var(--jch-accent) ${pctFill}%, var(--jch-line) ${pctFill}%)` }}
      />
      <div className="flex justify-between text-[11px] text-[var(--jch-dim)] uppercase tracking-widest">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

// ---------- Configuración del tipo de interés (fijo / variable / mixta) ----------
function RateConfig({
  rate,
  onChange,
  termYears,
}: {
  rate: RateConfigValue;
  onChange: (next: RateConfigValue) => void;
  termYears: number;
}) {
  const modes: { key: RateMode; label: string }[] = [
    { key: "fijo", label: "Fijo" },
    { key: "variable", label: "Variable" },
    { key: "mixta", label: "Mixta" },
  ];
  const maxFixedYears = Math.max(1, termYears - 1);
  const variableYears = Math.max(0, termYears - rate.fixedYears);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em]">Tipo de interés</label>
        <div className="flex gap-3">
          {modes.map((m) => (
            <button
              key={m.key}
              type="button"
              onClick={() => onChange({ ...rate, mode: m.key })}
              className={`px-5 py-3 text-sm font-medium border transition-colors ${
                rate.mode === m.key
                  ? "border-[#C5A566] bg-[#C5A566] text-[#1A1A1A]"
                  : "border-[var(--jch-line)] text-[var(--jch-ink)] hover:border-[var(--jch-accent)]"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {(rate.mode === "fijo" || rate.mode === "mixta") && (
        <NumberField
          label={rate.mode === "mixta" ? "TIN del tramo fijo" : "TIN fijo (TIN anual)"}
          value={rate.tinFijo}
          onChange={(n) => onChange({ ...rate, tinFijo: n })}
          step={0.05}
          max={15}
          suffix="%"
        />
      )}

      {rate.mode === "mixta" && (
        <RangeField
          label="Duración del tramo fijo"
          value={Math.min(rate.fixedYears, maxFixedYears)}
          onChange={(n) => onChange({ ...rate, fixedYears: n })}
          min={1}
          max={maxFixedYears}
          display={`${Math.min(rate.fixedYears, maxFixedYears)} años`}
        />
      )}

      {(rate.mode === "variable" || rate.mode === "mixta") && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <NumberField label="Diferencial" value={rate.diferencial} onChange={(n) => onChange({ ...rate, diferencial: n })} step={0.05} max={5} suffix="%" />
          <NumberField label="Euríbor actual (referencia)" value={rate.euribor} onChange={(n) => onChange({ ...rate, euribor: n })} step={0.01} max={10} suffix="%" />
        </div>
      )}

      {rate.mode === "mixta" && (
        <p className="text-xs text-[var(--jch-dim)] leading-relaxed">
          Tramo variable: {variableYears} {variableYears === 1 ? "año" : "años"} restantes, a euríbor + diferencial ={" "}
          {(rate.diferencial + rate.euribor).toFixed(2).replace(".", ",")} %.
        </p>
      )}
    </div>
  );
}

// ---------- Simulador principal ----------
function Simulador({ rate, onRateChange }: { rate: RateConfigValue; onRateChange: (next: RateConfigValue) => void }) {
  const [price, setPrice] = useState(250000);
  const [income1, setIncome1] = useState(1800);
  const [income2, setIncome2] = useState(0);
  const [secondBorrower, setSecondBorrower] = useState(false);
  const [age, setAge] = useState(35);
  const [financingPct, setFinancingPct] = useState(80);
  const [housingType, setHousingType] = useState<HousingType>("usada");

  const maxTerm = Math.max(1, Math.min(75 - age, 40));
  const minTerm = Math.min(5, maxTerm);
  const [termYears, setTermYears] = useState(30);

  useEffect(() => {
    setTermYears((t) => Math.min(Math.max(t, minTerm), maxTerm));
  }, [minTerm, maxTerm]);

  const totalIncome = income1 + (secondBorrower ? income2 : 0);
  const gastos = useMemo(() => closingCosts(price, housingType), [price, housingType]);
  const loan = price * (financingPct / 100);
  const schedule = useMemo(() => buildMortgageSchedule(loan, termYears, rate), [loan, termYears, rate]);
  const worstCuota = Math.max(schedule.cuotaFija, schedule.cuotaVariable);
  const ltv = financingPct;
  const esfuerzoActual = totalIncome > 0 ? (worstCuota / totalIncome) * 100 : 0;
  const totalOperacion = price + gastos.total;
  const aportacionNecesaria = Math.max(0, totalOperacion - loan);
  const viabilidad = evaluateViability({ loan, price, worstCuota, totalIncome, ltv });

  return (
    <section id="simulador" className="py-[100px] border-t border-[var(--jch-line)]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="mb-16 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            <Curtain>Simula tu hipoteca</Curtain>
          </h2>
          <FadeUp delay={0.1}>
            <p className="mt-4 text-lg text-[var(--jch-muted)]">
              Introduce los datos de la operación y obtén la cuota, el LTV y los gastos estimados al instante.
            </p>
          </FadeUp>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <FadeUp className="space-y-10">
            <NumberField label="Precio de compra del inmueble" value={price} onChange={setPrice} step={1000} suffix="€" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <NumberField label={secondBorrower ? "Ingreso neto mensual — Titular 1" : "Ingreso neto mensual"} value={income1} onChange={setIncome1} step={50} suffix="€" />
              {secondBorrower ? (
                <div className="space-y-2">
                  <NumberField label="Ingreso neto mensual — Titular 2" value={income2} onChange={setIncome2} step={50} suffix="€" />
                  <button
                    type="button"
                    onClick={() => { setSecondBorrower(false); setIncome2(0); }}
                    className="text-xs text-[var(--jch-dim)] hover:text-[var(--jch-accent-ink)] transition-colors"
                  >
                    Quitar segundo titular
                  </button>
                </div>
              ) : (
                <div className="flex items-end pb-4">
                  <button
                    type="button"
                    onClick={() => setSecondBorrower(true)}
                    className="text-sm font-bold text-[var(--jch-accent-ink)] hover:opacity-70 transition-opacity"
                  >
                    + Añadir segundo titular
                  </button>
                </div>
              )}
            </div>

            <NumberField label="Edad del mayor titular" value={age} onChange={(n) => setAge(Math.min(74, Math.max(18, n)))} min={18} max={74} suffix="años" />

            <RangeField
              label={`Plazo de la hipoteca (máx. ${maxTerm} años según la edad)`}
              value={termYears}
              onChange={setTermYears}
              min={minTerm}
              max={maxTerm}
              display={`${termYears} años`}
            />

            <RateConfig rate={rate} onChange={onRateChange} termYears={termYears} />

            <RangeField
              label="Porcentaje de financiación"
              value={financingPct}
              onChange={setFinancingPct}
              min={40}
              max={100}
              display={pct1(financingPct)}
            />

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em]">Tipo de vivienda</label>
              <div className="flex gap-3">
                {(["usada", "nueva"] as HousingType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setHousingType(t)}
                    className={`px-5 py-3 text-sm font-medium border transition-colors ${
                      housingType === t
                        ? "border-[#C5A566] bg-[#C5A566] text-[#1A1A1A]"
                        : "border-[var(--jch-line)] text-[var(--jch-ink)] hover:border-[var(--jch-accent)]"
                    }`}
                  >
                    {t === "usada" ? "Segunda mano" : "Obra nueva"}
                  </button>
                ))}
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div className="lg:sticky lg:top-28 border border-[var(--jch-line)] bg-[var(--jch-surface)] p-8 md:p-10 space-y-8">
              <div className={`p-5 border ${viabilidad.viable ? "border-[#1f6f78] bg-[#1f6f78]/10" : "border-[#9b2c2c] bg-[#9b2c2c]/10"}`}>
                <p className={`text-sm font-black uppercase tracking-widest ${viabilidad.viable ? "text-[#1f6f78]" : "text-[#9b2c2c]"}`}>
                  {viabilidad.viable ? "Operación viable" : "Operación posiblemente inviable"}
                </p>
                {!viabilidad.viable && (
                  <ul className="mt-3 space-y-1.5 text-sm text-[var(--jch-muted)] list-disc list-inside">
                    {viabilidad.reasons.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--jch-dim)] mb-2">Cuota mensual estimada</p>
                {rate.mode === "mixta" ? (
                  <div className="space-y-3">
                    <div>
                      <p className="text-3xl md:text-4xl font-black text-[var(--jch-accent-ink)]">{eur0.format(schedule.cuotaFija)}</p>
                      <p className="text-xs text-[var(--jch-dim)]">Durante los primeros {rate.fixedYears} años (tramo fijo)</p>
                    </div>
                    <div>
                      <p className="text-3xl md:text-4xl font-black text-[var(--jch-accent-ink)]">{eur0.format(schedule.cuotaVariable)}</p>
                      <p className="text-xs text-[var(--jch-dim)]">Después, estimada al euríbor + diferencial actuales (tramo variable)</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-4xl md:text-5xl font-black text-[var(--jch-accent-ink)]">{eur0.format(schedule.cuotaFija)}</p>
                )}
                <p className="mt-2 text-sm text-[var(--jch-muted)]">
                  La cuota más alta supone un {pct1(esfuerzoActual)} de tus ingresos netos mensuales.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-[var(--jch-line)]">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--jch-dim)] mb-1">Capital a financiar</p>
                  <p className="text-xl font-bold">{eur0.format(loan)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--jch-dim)] mb-1">LTV</p>
                  <p className="text-xl font-bold">{pct1(ltv)}</p>
                  {ltv > 80 && (
                    <p className="mt-1 text-xs text-[var(--jch-dim)]">Por encima del 80% habitual de financiación bancaria.</p>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-[var(--jch-line)]">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--jch-dim)] mb-4">
                  Gastos estimados de la operación
                </p>
                <ul className="space-y-3 text-sm">
                  <li className="flex justify-between"><span className="text-[var(--jch-muted)]">Impuestos ({housingType === "nueva" ? "IVA + AJD" : "ITP"})</span><span className="font-bold">{eur0.format(gastos.impuestos)}</span></li>
                  <li className="flex justify-between"><span className="text-[var(--jch-muted)]">Tasación</span><span className="font-bold">{eur0.format(gastos.tasacion)}</span></li>
                  <li className="flex justify-between"><span className="text-[var(--jch-muted)]">Gestoría</span><span className="font-bold">{eur0.format(gastos.gestoria)}</span></li>
                  <li className="flex justify-between"><span className="text-[var(--jch-muted)]">Notaría</span><span className="font-bold">{eur0.format(gastos.notaria)}</span></li>
                  <li className="flex justify-between"><span className="text-[var(--jch-muted)]">Registro</span><span className="font-bold">{eur0.format(gastos.registro)}</span></li>
                  <li className="flex justify-between pt-3 border-t border-[var(--jch-line)]"><span className="font-bold">Total gastos</span><span className="font-black text-[var(--jch-accent-ink)]">{eur0.format(gastos.total)}</span></li>
                </ul>
                <p className="mt-4 text-xs text-[var(--jch-dim)] leading-relaxed">
                  Estimación orientativa (Comunidad Valenciana). Desde 2019 los gastos de constitución de la
                  hipoteca corren a cargo del banco; los mostrados aquí son los de la compraventa.
                </p>
              </div>

              <div className="pt-6 border-t border-[var(--jch-line)]">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--jch-dim)] mb-2">Necesitas tener ahorrado</p>
                <p className="text-3xl font-black text-[var(--jch-accent-ink)]">{eur0.format(aportacionNecesaria)}</p>
                <p className="mt-2 text-sm text-[var(--jch-muted)]">
                  Para financiar el {pct1(financingPct)} del precio ({eur0.format(loan)}) y cubrir los {eur0.format(gastos.total)} de
                  gastos sobre un precio de {eur0.format(price)}.
                </p>
              </div>
            </div>
          </FadeUp>
        </div>

        <FadeUp delay={0.15} className="mt-10">
          <ReportDownload topic="Simulador de hipoteca">
            <div style={{ fontFamily: "Inter, ui-sans-serif, sans-serif", padding: "2rem", maxWidth: "800px" }}>
              <h1 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: ".25rem" }}>Informe · Simulador de hipoteca</h1>
              <p style={{ color: "#4A4A4A", marginBottom: "2rem" }}>HiloLegal · {new Date().toLocaleDateString("es-ES")}</p>

              <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginTop: "1.5rem" }}>{viabilidad.viable ? "Operación viable" : "Operación posiblemente inviable"}</h2>
              {!viabilidad.viable && (
                <ul>{viabilidad.reasons.map((r) => <li key={r}>{r}</li>)}</ul>
              )}

              <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginTop: "1.5rem" }}>Datos de la operación</h2>
              <p>Precio de compra: {eur0.format(price)}</p>
              <p>Ingresos netos mensuales: {eur0.format(totalIncome)}</p>
              <p>Edad del mayor titular: {age} años · Plazo: {termYears} años</p>
              <p>Porcentaje de financiación: {pct1(financingPct)}</p>
              <p>
                Tipo de interés: {rate.mode === "fijo" ? `Fijo, TIN ${pct1(rate.tinFijo)}` : rate.mode === "variable" ? `Variable, euríbor + diferencial = ${pct1(rate.diferencial + rate.euribor)}` : `Mixto — TIN ${pct1(rate.tinFijo)} los primeros ${rate.fixedYears} años, después euríbor + diferencial = ${pct1(rate.diferencial + rate.euribor)}`}
              </p>
              <p>Tipo de vivienda: {housingType === "nueva" ? "Obra nueva" : "Segunda mano"}</p>

              <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginTop: "1.5rem" }}>Resultado</h2>
              <p>Cuota mensual: {eur0.format(schedule.cuotaFija)}{rate.mode === "mixta" ? ` (tramo fijo), después ${eur0.format(schedule.cuotaVariable)} (tramo variable, estimado)` : ""}</p>
              <p>Esfuerzo sobre ingresos: {pct1(esfuerzoActual)}</p>
              <p>Capital a financiar: {eur0.format(loan)} · LTV: {pct1(ltv)}</p>
              <p>Gastos estimados de la operación: {eur0.format(gastos.total)} (impuestos {eur0.format(gastos.impuestos)}, tasación {eur0.format(gastos.tasacion)}, gestoría {eur0.format(gastos.gestoria)}, notaría {eur0.format(gastos.notaria)}, registro {eur0.format(gastos.registro)})</p>
              <p style={{ fontWeight: 700 }}>Necesitas tener ahorrado: {eur0.format(aportacionNecesaria)}</p>

              <p style={{ marginTop: "2rem", fontSize: ".85rem", color: "#4A4A4A" }}>
                Cálculo orientativo. No sustituye a una oferta vinculante bancaria. HiloLegal — {PHONE_DISPLAY} — {EMAIL}
              </p>
            </div>
          </ReportDownload>
        </FadeUp>
      </div>
    </section>
  );
}

// ---------- Cuánto puedes permitirte ----------
function CuantoPuedesPermitirte({ rate }: { rate: RateConfigValue }) {
  const [income1, setIncome1] = useState(1800);
  const [income2, setIncome2] = useState(0);
  const [secondBorrower, setSecondBorrower] = useState(false);
  const [termYears, setTermYears] = useState(30);
  const [effortRate, setEffortRate] = useState(35);
  const [financingPct, setFinancingPct] = useState(80);

  const totalIncome = income1 + (secondBorrower ? income2 : 0);
  const annualRate = referenceRate(rate);
  const monthlyRate = annualRate / 100 / 12;
  const months = Math.round(termYears * 12);
  const maxCuota = totalIncome * (effortRate / 100);
  const maxLoan = maxLoanFromPayment(maxCuota, monthlyRate, months);
  const maxPrice = financingPct > 0 ? maxLoan / (financingPct / 100) : 0;
  const aportacionNecesaria = Math.max(0, maxPrice - maxLoan);

  return (
    <section id="permitirte" className="py-[100px] border-t border-[var(--jch-line)] bg-[var(--jch-surface)]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="mb-16 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            <Curtain>¿Cuánto te puedes <span className="text-[var(--jch-accent-ink)]">permitir?</span></Curtain>
          </h2>
          <FadeUp delay={0.1}>
            <p className="mt-4 text-lg text-[var(--jch-muted)]">
              El precio máximo de vivienda que podrías financiar sin que la cuota supere la tasa de
              esfuerzo elegida sobre tus ingresos.
            </p>
          </FadeUp>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <FadeUp className="space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <NumberField label={secondBorrower ? "Ingreso neto mensual — Titular 1" : "Ingreso neto mensual"} value={income1} onChange={setIncome1} step={50} suffix="€" />
              {secondBorrower ? (
                <div className="space-y-2">
                  <NumberField label="Ingreso neto mensual — Titular 2" value={income2} onChange={setIncome2} step={50} suffix="€" />
                  <button type="button" onClick={() => { setSecondBorrower(false); setIncome2(0); }} className="text-xs text-[var(--jch-dim)] hover:text-[var(--jch-accent-ink)] transition-colors">
                    Quitar segundo titular
                  </button>
                </div>
              ) : (
                <div className="flex items-end pb-4">
                  <button type="button" onClick={() => setSecondBorrower(true)} className="text-sm font-bold text-[var(--jch-accent-ink)] hover:opacity-70 transition-opacity">
                    + Añadir segundo titular
                  </button>
                </div>
              )}
            </div>

            <RangeField label="Plazo de la hipoteca" value={termYears} onChange={setTermYears} min={5} max={40} display={`${termYears} años`} />

            <RangeField
              label="Tasa de esfuerzo (cuota sobre ingresos)"
              value={effortRate}
              onChange={setEffortRate}
              min={30}
              max={45}
              display={pct1(effortRate)}
            />

            <RangeField
              label="Porcentaje de financiación"
              value={financingPct}
              onChange={setFinancingPct}
              min={40}
              max={100}
              display={pct1(financingPct)}
            />
          </FadeUp>

          <FadeUp delay={0.1} className="border border-[var(--jch-line)] bg-[var(--jch-bg)] p-8 md:p-10 space-y-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--jch-dim)] mb-2">Precio máximo de vivienda</p>
              <p className="text-4xl md:text-5xl font-black text-[var(--jch-accent-ink)]">{eur0.format(maxPrice)}</p>
            </div>
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-[var(--jch-line)]">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--jch-dim)] mb-1">Cuota mensual</p>
                <p className="text-xl font-bold">{eur0.format(maxCuota)}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--jch-dim)] mb-1">Aportación necesaria</p>
                <p className="text-xl font-bold">{eur0.format(aportacionNecesaria)}</p>
              </div>
            </div>
            <p className="text-xs text-[var(--jch-dim)] leading-relaxed pt-2">
              Calculado con el tipo de interés configurado en "Simula tu hipoteca"
              {rate.mode === "variable" ? ` (variable, euríbor + diferencial = ${pct1(annualRate)})` : ` (${pct1(annualRate)}${rate.mode === "mixta" ? ", tramo fijo" : ""})`}.
              No incluye los gastos de la operación. La aprobación final depende del análisis de riesgo de cada entidad bancaria.
            </p>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

// ---------- Cuadro de amortización + consulta ----------
function Amortizacion() {
  const [loan, setLoan] = useState(200000);
  const [rate, setRate] = useState(3.1);
  const [termYears, setTermYears] = useState(30);
  const [consultaAnio, setConsultaAnio] = useState(5);

  const schedule = useMemo(() => buildAmortizationSchedule(loan, rate, termYears), [loan, rate, termYears]);

  useEffect(() => {
    setConsultaAnio((y) => Math.min(Math.max(y, 1), Math.max(1, termYears)));
  }, [termYears]);

  const currentYear = new Date().getFullYear();
  const rowConsulta = schedule.yearly[consultaAnio - 1];
  const amortizadoTotal = loan - (rowConsulta?.pendiente ?? loan);
  const pctAmortizado = loan > 0 ? (amortizadoTotal / loan) * 100 : 0;

  return (
    <section id="amortizacion" className="py-[100px] border-t border-[var(--jch-line)]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="mb-16 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            <Curtain>Cuadro de amortización</Curtain>
          </h2>
          <FadeUp delay={0.1}>
            <p className="mt-4 text-lg text-[var(--jch-muted)]">
              Cómo evoluciona tu deuda año a año, y cuánto te quedará pendiente en la fecha que elijas.
            </p>
          </FadeUp>
        </div>

        <FadeUp className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
          <NumberField label="Capital pendiente / préstamo" value={loan} onChange={setLoan} step={1000} suffix="€" />
          <NumberField label="Tipo de interés (TIN anual)" value={rate} onChange={setRate} step={0.05} max={15} suffix="%" />
          <NumberField label="Plazo" value={termYears} onChange={(n) => setTermYears(Math.min(40, Math.max(1, n)))} min={1} max={40} suffix="años" />
        </FadeUp>

        <FadeUp delay={0.1} className="border border-[var(--jch-line)] bg-[var(--jch-surface)] p-8 md:p-10 mb-16">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--jch-dim)] mb-6">
            ¿Cuánto te quedará pendiente en el futuro?
          </p>
          <RangeField
            label="Dentro de…"
            value={consultaAnio}
            onChange={setConsultaAnio}
            min={1}
            max={Math.max(1, termYears)}
            display={`${consultaAnio} ${consultaAnio === 1 ? "año" : "años"}`}
          />
          {rowConsulta && (
            <p className="mt-6 text-lg leading-relaxed">
              En <span className="font-bold text-[var(--jch-accent-ink)]">{currentYear + consultaAnio}</span>{" "}
              (dentro de {consultaAnio} {consultaAnio === 1 ? "año" : "años"}) te quedarán pendientes{" "}
              <span className="font-bold text-[var(--jch-accent-ink)]">{eur0.format(rowConsulta.pendiente)}</span>{" "}
              — habrás amortizado el {pct1(pctAmortizado)} del capital inicial ({eur0.format(amortizadoTotal)}).
            </p>
          )}
        </FadeUp>

        <FadeUp delay={0.15} className="overflow-x-auto border border-[var(--jch-line)]">
          <table className="w-full text-sm border-collapse min-w-[560px]">
            <thead>
              <tr className="bg-[var(--jch-surface)] text-left">
                <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--jch-dim)]">Año</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--jch-dim)] text-right">Cuota anual</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--jch-dim)] text-right">Intereses</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--jch-dim)] text-right">Amortizado</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--jch-dim)] text-right">Pendiente</th>
              </tr>
            </thead>
            <tbody>
              {schedule.yearly.map((row) => (
                <tr key={row.year} className={`border-t border-[var(--jch-line)] ${row.year === consultaAnio ? "bg-[#C5A566]/10" : ""}`}>
                  <td className="p-4 font-bold">{currentYear + row.year}</td>
                  <td className="p-4 text-right">{eur0.format(row.cuotaAnual)}</td>
                  <td className="p-4 text-right text-[var(--jch-muted)]">{eur0.format(row.intereses)}</td>
                  <td className="p-4 text-right text-[var(--jch-muted)]">{eur0.format(row.amortizado)}</td>
                  <td className="p-4 text-right font-bold">{eur0.format(row.pendiente)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </FadeUp>
      </div>
    </section>
  );
}

// ---------- FAQ ----------
const faqs = [
  { q: "¿Este simulador sustituye a la oferta vinculante del banco?", a: "No. Es una herramienta orientativa para hacer números antes de negociar. La oferta vinculante final depende del análisis de riesgo y las condiciones concretas de cada entidad." },
  { q: "¿Cómo se calculan los gastos de la operación?", a: "Se estiman con los criterios habituales para Comunidad Valenciana: impuestos de compraventa (ITP o IVA+AJD según sea vivienda usada o nueva), tasación, gestoría, notaría y registro. Desde 2019 los gastos de constitución de la hipoteca (AJD, notaría y registro de la escritura del préstamo) los paga el banco." },
  { q: "¿Qué pasa si tengo dos titulares con ingresos distintos?", a: "Puedes añadir un segundo titular en el simulador. Se suman ambos ingresos netos para calcular la tasa de esfuerzo y la capacidad de financiación conjunta." },
  { q: "¿Por qué el plazo máximo depende de la edad?", a: "Los bancos suelen limitar el plazo a que la hipoteca termine antes de los 75 años del titular de mayor edad, con un máximo habitual de 40 años." },
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
            <Curtain>Hazlo con <span className="text-[var(--jch-accent-ink)]">números reales</span></Curtain>
          </h2>
          <FadeUp delay={0.1}>
            <p className="contact-editorial__description text-xl leading-relaxed">
              Este simulador es un punto de partida. Cuéntanos tu situación y revisamos juntos la
              viabilidad de tu hipoteca con las condiciones reales del banco.
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
              Ver asesoría hipotecaria y financiera <span aria-hidden="true">→</span>
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
      trackEvent("tool_mortgage", { section: "formulario" });
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
          topic: "Simulador de hipoteca",
          website: honeypotRef.current?.value ?? "",
          formLoadedAt: formLoadedAtRef.current,
        },
      });
      setStatus("ok");
      trackEvent("contact_submit", { section: "formulario", topic: "Simulador de hipoteca" });
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
              <div className="text-2xl font-black tracking-tighter uppercase">Simulador de Hipoteca</div>
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
