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

export const Route = createFileRoute("/ahorro-potencial")({
  head: () => ({
    meta: [
      { title: "Calculadora de Ahorro Potencial | HiloLegal" },
      {
        name: "description",
        content: "Calcula cuánto dinero se escapa en pequeños gastos recurrentes y descubre tu ahorro potencial anual.",
      },
      { property: "og:title", content: "Calculadora de Ahorro Potencial | HiloLegal" },
      { property: "og:description", content: "Calcula cuánto dinero se escapa en pequeños gastos recurrentes y estima tu ahorro potencial anual." },
      { property: "og:url", content: "https://www.hilolegal.es/ahorro-potencial" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_ES" },
      { property: "og:site_name", content: "HiloLegal" },
      { property: "og:image", content: "https://www.hilolegal.es/yoderecha.webp" },
      { property: "og:image:width", content: "1672" },
      { property: "og:image:height", content: "941" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Calculadora de Ahorro Potencial | HiloLegal" },
      { name: "twitter:description", content: "Calcula cuánto dinero se escapa en pequeños gastos recurrentes y estima tu ahorro potencial anual." },
      { name: "twitter:image", content: "https://www.hilolegal.es/yoderecha.webp" },
    ],
    links: [{ rel: "canonical", href: "https://www.hilolegal.es/ahorro-potencial" }],
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
                { "@type": "ListItem", position: 2, name: "Calculadora de ahorro potencial", item: "https://www.hilolegal.es/ahorro-potencial" },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: AhorroPotencialPage,
});

const WHATSAPP = "https://wa.me/34647506040?text=Quiero%20informaci%C3%B3n%20sobre%20mi%20ahorro";
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
// Datos y cálculo
// ============================================================

interface Categoria {
  id: string;
  nombre: string;
  icono: string;
  precio: number;
  descripcion: string;
}

const CATEGORIAS: Categoria[] = [
  { id: "cafe", nombre: "Café y bebidas calientes", icono: "☕", precio: 1.5, descripcion: "Café diario en el trabajo o de camino a casa" },
  { id: "snacks", nombre: "Snacks y comida rápida", icono: "🍿", precio: 1.25, descripcion: "Patatas, chocolates, bollería y aperitivos" },
  { id: "cervezas", nombre: "Cervezas y bebidas alcohólicas", icono: "🍺", precio: 2.5, descripcion: "Cerveza en bares, vinos y cócteles" },
  { id: "tabaco", nombre: "Tabaco", icono: "🚬", precio: 6, descripcion: "Cajetillas o tabaco de liar comprados por costumbre" },
  { id: "refrescos", nombre: "Refrescos y bebidas frías", icono: "🥤", precio: 1.5, descripcion: "Refrescos, zumos y agua embotellada" },
  { id: "restaurantes", nombre: "Comida en restaurantes", icono: "🍽️", precio: 12, descripcion: "Almuerzos y cenas fuera de casa no planificadas" },
  { id: "compras", nombre: "Compras impulsivas", icono: "🛍️", precio: 5, descripcion: "Artículos no planificados en supermercados y tiendas" },
  { id: "suscripciones", nombre: "Suscripciones innecesarias", icono: "📱", precio: 9.99, descripcion: "Apps y servicios que apenas utilizas" },
  { id: "transporte", nombre: "Transporte por comodidad", icono: "🚗", precio: 3, descripcion: "Taxis, VTC o patinetes cuando hay alternativas" },
  { id: "comisiones", nombre: "Comisiones bancarias evitables", icono: "🏦", precio: 2, descripcion: "Cajeros ajenos, pagos fuera de plazo o cargos evitables" },
  { id: "otros", nombre: "Otros gastos", icono: "💸", precio: 2.5, descripcion: "Cualquier gasto pequeño que se repite" },
];

const FRECUENCIAS = [
  { id: "diario", nombre: "Diario", multiplicador: 365 },
  { id: "semanal", nombre: "Semanal", multiplicador: 52 },
  { id: "mensual", nombre: "Mensual", multiplicador: 12 },
] as const;

type FrecuenciaId = (typeof FRECUENCIAS)[number]["id"];

const CONSEJOS = [
  "Lleva café de casa en un termo reutilizable.",
  "Prepara snacks saludables antes de salir.",
  "Cancela suscripciones que no uses cada mes.",
  "Camina o usa transporte público en trayectos cortos.",
];

interface GastoState {
  activo: boolean;
  monto: number;
  frecuencia: FrecuenciaId;
}

const eur0 = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const eur2 = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 2 });
const pct1 = (n: number) => `${n.toFixed(1).replace(".", ",")} %`;

function gastoAnual(gasto: GastoState): number {
  if (!gasto.activo || !gasto.monto) return 0;
  const frecuencia = FRECUENCIAS.find((f) => f.id === gasto.frecuencia);
  return gasto.monto * (frecuencia?.multiplicador ?? 0);
}

// ============================================================
// Página
// ============================================================

function AhorroPotencialPage() {
  useEffect(() => {
    trackEvent("tool_wealth_audit", { section: "page_view", page: "ahorro-potencial" });
  }, []);

  return (
    <div className="josecarlos-original bg-[var(--jch-bg)] text-[var(--jch-ink)] selection:bg-[#C5A566] selection:text-white">
      <SmoothScroll />
      <Header />
      <main>
        <Hero />
        <Calculadora />
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
    ["Calculadora", "#calculadora"],
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
              Calculadora de Ahorro Potencial
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
          <WordReveal eager block delay={0.1} text="Lo pequeño también" />
          <WordReveal eager block delay={0.325} className="text-[var(--jch-accent-ink)]" text="decide tu futuro." />
        </h1>
        <FadeUp delay={0.6}>
          <p className="hero-subtitle max-w-2xl">
            Un café, una suscripción olvidada o una compra impulsiva no parecen relevantes por
            separado. Activa tus gastos recurrentes y descubre cuánto podrías recuperar al año.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}

// ---------- Calculadora ----------
function Calculadora() {
  const [gastos, setGastos] = useState<Record<string, GastoState>>(() =>
    Object.fromEntries(CATEGORIAS.map((c) => [c.id, { activo: false, monto: c.precio, frecuencia: "diario" as FrecuenciaId }])),
  );

  const toggle = (id: string) => setGastos((g) => ({ ...g, [id]: { ...g[id], activo: !g[id].activo } }));
  const setMonto = (id: string, monto: number) => setGastos((g) => ({ ...g, [id]: { ...g[id], monto: Math.max(0, monto) } }));
  const setFrecuencia = (id: string, frecuencia: FrecuenciaId) => setGastos((g) => ({ ...g, [id]: { ...g[id], frecuencia } }));

  const activos = CATEGORIAS.filter((c) => gastos[c.id].activo && gastos[c.id].monto > 0);
  const anual = useMemo(() => Object.values(gastos).reduce((sum, g) => sum + gastoAnual(g), 0), [gastos]);
  const diario = anual / 365;
  const semanal = anual / 52;
  const mensual = anual / 12;

  const nivelPct = Math.min((mensual / 300) * 100, 100);
  const nivelTexto =
    mensual === 0
      ? "Activa tus gastos recurrentes para ver el resultado."
      : mensual < 50
        ? "Bajo: buen control de pequeños gastos."
        : mensual < 150
          ? "Medio: hay margen para recuperar ahorro."
          : "Alto: conviene revisar hábitos y prioridades.";

  const diffReferencia = mensual - 150;
  const maxCategoria = Math.max(1, ...activos.map((c) => gastoAnual(gastos[c.id])));

  return (
    <section id="calculadora" className="py-20 border-t border-[var(--jch-line)]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            <Curtain>Marca tus gastos hormiga</Curtain>
          </h2>
          <FadeUp delay={0.1}>
            <p className="mt-3 text-base text-[var(--jch-muted)]">
              Activa los hábitos que se repiten en tu día a día y ajusta el importe y la frecuencia.
            </p>
          </FadeUp>
        </div>

        <FadeUp className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CATEGORIAS.map((categoria) => {
            const gasto = gastos[categoria.id];
            return (
              <div
                key={categoria.id}
                className={`border p-4 transition-colors ${gasto.activo ? "border-[#1f6f78] bg-[var(--jch-surface)]" : "border-[var(--jch-line)]"}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-2.5 min-w-0">
                    <span className="text-xl leading-none shrink-0" aria-hidden="true">{categoria.icono}</span>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold truncate">{categoria.nombre}</h3>
                      <p className="mt-0.5 text-xs text-[var(--jch-muted)] truncate">{categoria.descripcion}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={gasto.activo}
                    aria-label={`Activar ${categoria.nombre}`}
                    onClick={() => toggle(categoria.id)}
                    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${gasto.activo ? "bg-[#1f6f78]" : "bg-[var(--jch-line-strong)]"}`}
                  >
                    <span
                      className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
                      style={{ transform: gasto.activo ? "translateX(20px)" : "translateX(0)" }}
                    />
                  </button>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    min={0}
                    step={0.25}
                    value={gasto.monto}
                    disabled={!gasto.activo}
                    onChange={(e) => setMonto(categoria.id, Number(e.target.value) || 0)}
                    onWheel={(e) => e.currentTarget.blur()}
                    aria-label="Importe"
                    className="w-full bg-transparent border-0 border-b border-[var(--jch-line)] px-0 py-1.5 text-sm focus:ring-0 focus:border-[#1f6f78] transition-colors outline-none disabled:opacity-40"
                  />
                  <select
                    value={gasto.frecuencia}
                    disabled={!gasto.activo}
                    onChange={(e) => setFrecuencia(categoria.id, e.target.value as FrecuenciaId)}
                    aria-label="Frecuencia"
                    className="w-full bg-transparent border-0 border-b border-[var(--jch-line)] px-0 py-1.5 text-sm focus:ring-0 focus:border-[#1f6f78] transition-colors outline-none disabled:opacity-40"
                  >
                    {FRECUENCIAS.map((f) => (
                      <option key={f.id} value={f.id}>{f.nombre}</option>
                    ))}
                  </select>
                </div>
                <p className="mt-2 text-xs text-[var(--jch-dim)]">
                  <span className="font-bold text-[var(--jch-accent-ink)]">{eur2.format(gastoAnual(gasto))}</span> / año
                </p>
              </div>
            );
          })}
        </FadeUp>

        <FadeUp delay={0.1} className="mt-10 border border-[var(--jch-line)] bg-[var(--jch-surface)] p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 items-center">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--jch-dim)] mb-2">Gasto anual estimado</p>
              <p className="text-4xl md:text-5xl font-black text-[var(--jch-accent-ink)]">{eur0.format(anual)}</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--jch-dim)] mb-1">Diario</p>
                <p className="font-bold">{eur2.format(diario)}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--jch-dim)] mb-1">Semanal</p>
                <p className="font-bold">{eur2.format(semanal)}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--jch-dim)] mb-1">Mensual</p>
                <p className="font-bold">{eur2.format(mensual)}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6 pt-6 border-t border-[var(--jch-line)]">
            <div>
              <p className="text-sm text-[var(--jch-muted)] mb-2">Nivel de gasto hormiga</p>
              <div className="h-2 bg-[var(--jch-line)] overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#C5A566] to-[#1A1A1A]" style={{ width: `${nivelPct}%` }} />
              </div>
              <p className="mt-2 text-xs text-[var(--jch-dim)]">{nivelTexto}</p>
            </div>
            <div>
              <p className="text-sm text-[var(--jch-muted)] mb-2">Frente a la media española (150€/mes)</p>
              {mensual === 0 ? (
                <p className="text-sm text-[var(--jch-muted)]">Activa alguna categoría para comparar.</p>
              ) : (
                <p className={`text-sm font-bold ${diffReferencia > 0 ? "text-[#9b2c2c]" : "text-[#1f6f78]"}`}>
                  {diffReferencia > 0
                    ? `Gastas ${eur0.format(diffReferencia)} más que la referencia mensual.`
                    : diffReferencia < 0
                      ? `Gastas ${eur0.format(Math.abs(diffReferencia))} menos que la referencia mensual.`
                      : "Estás justo en la referencia mensual."}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-[var(--jch-line)]">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--jch-dim)] mb-4">Cuánto podrías recuperar al año</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex justify-between sm:block">
                <span className="text-sm text-[var(--jch-muted)]">Reduciendo el 50%</span>
                <span className="font-bold sm:block sm:mt-1">{eur0.format(anual * 0.5)}</span>
              </div>
              <div className="flex justify-between sm:block">
                <span className="text-sm text-[var(--jch-muted)]">Reduciendo el 75%</span>
                <span className="font-bold sm:block sm:mt-1">{eur0.format(anual * 0.75)}</span>
              </div>
              <div className="flex justify-between sm:block">
                <span className="text-sm text-[var(--jch-muted)]">Eliminación total</span>
                <span className="font-bold text-[var(--jch-accent-ink)] sm:block sm:mt-1">{eur0.format(anual)}</span>
              </div>
            </div>
          </div>
        </FadeUp>

        {activos.length > 0 && (
          <FadeUp delay={0.15} className="mt-10 border border-[var(--jch-line)] p-6 md:p-8">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--jch-dim)] mb-6">Distribución por categoría</p>
            <div className="space-y-4">
              {activos
                .slice()
                .sort((a, b) => gastoAnual(gastos[b.id]) - gastoAnual(gastos[a.id]))
                .map((categoria) => {
                  const valor = gastoAnual(gastos[categoria.id]);
                  return (
                    <div key={categoria.id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{categoria.icono} {categoria.nombre}</span>
                        <span className="font-bold">{eur0.format(valor)}</span>
                      </div>
                      <div className="h-2 bg-[var(--jch-line)] overflow-hidden">
                        <div className="h-full bg-[#C5A566]" style={{ width: `${(valor / maxCategoria) * 100}%` }} />
                      </div>
                    </div>
                  );
                })}
            </div>
          </FadeUp>
        )}

        <FadeUp delay={0.2} className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CONSEJOS.map((consejo) => (
            <div key={consejo} className="border-l-2 border-[#C5A566] pl-4 py-1 text-sm text-[var(--jch-muted)]">
              {consejo}
            </div>
          ))}
        </FadeUp>

        <FadeUp delay={0.25} className="mt-10">
          <ReportDownload topic="Calculadora de ahorro potencial">
            <div style={{ fontFamily: "Inter, ui-sans-serif, sans-serif", padding: "2rem", maxWidth: "800px" }}>
              <h1 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: ".25rem" }}>Informe · Ahorro potencial</h1>
              <p style={{ color: "#4A4A4A", marginBottom: "2rem" }}>HiloLegal · {new Date().toLocaleDateString("es-ES")}</p>

              <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Resumen</h2>
              <p>Gasto diario: {eur2.format(diario)} · Semanal: {eur2.format(semanal)} · Mensual: {eur2.format(mensual)} · Anual: {eur0.format(anual)}</p>
              <p>Ahorro potencial reduciendo un 50%: {eur0.format(anual * 0.5)}</p>
              <p>Ahorro potencial reduciendo un 75%: {eur0.format(anual * 0.75)}</p>
              <p>Ahorro potencial eliminando estos gastos por completo: {eur0.format(anual)}</p>

              <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginTop: "1.5rem" }}>Categorías activas</h2>
              <ul>
                {activos.map((c) => (
                  <li key={c.id}>{c.icono} {c.nombre}: {eur2.format(gastoAnual(gastos[c.id]))} / año</li>
                ))}
              </ul>

              <p style={{ marginTop: "2rem", fontSize: ".85rem", color: "#4A4A4A" }}>
                HiloLegal — {PHONE_DISPLAY} — {EMAIL}
              </p>
            </div>
          </ReportDownload>
        </FadeUp>
      </div>
    </section>
  );
}

// ---------- FAQ ----------
const faqs = [
  { q: "¿De dónde salen estas categorías?", a: "Son los gastos pequeños y recurrentes más habituales: café, snacks, suscripciones, transporte por comodidad... Puedes ajustar el importe y la frecuencia de cada uno a tu caso real." },
  { q: "¿Qué es la 'media española' de referencia?", a: "Una cifra orientativa (150€/mes) para que puedas situar tu resultado, no un dato oficial exacto." },
  { q: "¿Este ahorro se puede invertir directamente?", a: "El cálculo muestra el margen recuperable. Qué hacer con ese margen (fondo de emergencia, ahorro, inversión) depende de tu situación — lo vemos juntos si quieres." },
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
            <Curtain>Convierte este dato en <span className="text-[var(--jch-accent-ink)]">una decisión</span></Curtain>
          </h2>
          <FadeUp delay={0.1}>
            <p className="contact-editorial__description text-xl leading-relaxed">
              Si quieres revisar tu capacidad de ahorro, protección, hipoteca o planificación,
              podemos verlo con números reales.
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
      trackEvent("tool_wealth_audit", { section: "formulario" });
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
          topic: "Calculadora de ahorro potencial",
          website: honeypotRef.current?.value ?? "",
          formLoadedAt: formLoadedAtRef.current,
        },
      });
      setStatus("ok");
      trackEvent("contact_submit", { section: "formulario", topic: "Calculadora de ahorro potencial" });
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
              <div className="text-2xl font-black tracking-tighter uppercase">Ahorro Potencial</div>
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
