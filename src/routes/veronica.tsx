import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";
import { SmoothScroll } from "@/components/SmoothScroll";
import { submitContact } from "@/lib/contact.functions";
const banner3Asset = { url: "/veronica-assets/file_00000000b9c07246b0256fc18d8d4888.webp" };

export const Route = createFileRoute("/veronica")({
  head: () => ({
    meta: [
      { title: "VerÃ³nica LÃ³pez RamÃ³n | Abogada en Altea Â· Costa Blanca Â· Alicante" },
      { name: "description", content: "Abogada con experiencia en alta direcciÃ³n pÃºblica, docencia universitaria y ejercicio privado. Derecho civil, administrativo, familia y comunidades. Consulta en Altea." },
      { property: "og:title", content: "VerÃ³nica LÃ³pez RamÃ³n | Abogada en Altea Â· Costa Blanca Â· Alicante" },
      { property: "og:description", content: "Abogada con experiencia en alta direcciÃ³n pÃºblica, docencia universitaria y ejercicio privado. Derecho civil, administrativo, familia y comunidades. Consulta en Altea." },
    ],
  }),
  component: Index,
});

const EMAIL = "veronicalopez@hilolegal.es";
const PHONE_DISPLAY = "623 976 706";
const WHATSAPP = "https://wa.me/34623976706";

// Photos in /public â€” use the optimized .webp versions (the .png originals
// are 1-3MB each; the .webp copies are already generated and 10-20x lighter)
const IMG = (n: number) => `/veronica-assets/${n}.webp`;

const LogoMark = ({ className = "", dotClassName = "" }: { className?: string; dotClassName?: string }) => (
  <span className={`font-black tracking-tighter leading-none ${className}`}>
    VL<span className={dotClassName} style={{ color: "#C5A566" }}>.</span>
  </span>
);

const Icon = ({ name, className = "" }: { name: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

const services = [
  { icon: "account_balance", title: "Derecho administrativo y relaciones con la AdministraciÃ³n", text: "La AdministraciÃ³n PÃºblica se rige por tiempos, lÃ³gicas internas y criterios normativos especÃ­ficos. Limitarse a leer el boletÃ­n oficial es insuficiente cuando afrontas una sanciÃ³n, un recurso o una relaciÃ³n contractual con un organismo pÃºblico.Â Â Â  Â Â \n\n\nHe dirigido esa maquinaria por dentro, conozco cÃ³mo se instruyen los expedientes, cÃ³mo interpretan los tÃ©cnicos la normativa y dÃ³nde se sitÃºan los mÃ¡rgenes legales que no aparecen en los manuales." },
  { icon: "gavel", title: "Derecho civil y de familia", text: "Las decisiones personales mÃ¡s relevantes conllevan una dimensiÃ³n jurÃ­dica inevitable. Una herencia sin planificar, un proceso de divorcio carente de estrategia o un contrato redactado con premura generan conflictos que se arrastran durante aÃ±os.Â Â  Â Â \n\n\nÂ Trabajo con absoluto rigor tÃ©cnico, comunicando con honestidad las opciones reales de Ã©xito. El valor del asesoramiento no radica en decir lo que deseas escuchar, sino en mostrar la realidad del escenario legal." },
  { icon: "home", title: "Inmobiliario y comunidades", text: "La compra, venta o arrendamiento de un inmueble exige certezas jurÃ­dicas para proteger el capital invertido.Â Â Â \nÂ \nTrabajamos en coordinaciÃ³n directa con el Ã¡rea de administraciÃ³n de fincas de HiloLegal, ofreciendo una soluciÃ³n que cubre desde la auditorÃ­a legal previa de la propiedad hasta la reclamaciÃ³n judicial por impagos, manteniendo un Ãºnico interlocutor estratÃ©gico." },
  { icon: "balance", title: "Derecho penal", text: "Un procedimiento penal representa el escenario mÃ¡s exigente para la reputaciÃ³n y viabilidad de una empresa o un particular. Requiere una defensa tÃ©cnica sin fisuras, una estrategia clara desde la primera declaraciÃ³n y un acompaÃ±amiento que anticipe los movimientos de la acusaciÃ³n.Â Â  Â \n\n\nOfrezco asistencia letrada con absoluta transparencia sobre las expectativas reales del caso. Defensa y representaciÃ³n en procedimientos penales.Â \nClaridad total sobre el proceso, sin promesas que no se pueden cumplir." },
  { icon: "psychology", title: "ConsultorÃ­a jurÃ­dica especializada", text: "Las empresas que licitan con el sector pÃºblico o actÃºan en mercados regulados necesitan identificar las contingencias jurÃ­dicas antes de que se consoliden. El riesgo en el entorno pÃºblico rara vez reside en el texto estricto de la ley, se encuentra en los criterios de aplicaciÃ³n de la propia AdministraciÃ³n.Â Â  Â \n\n\nHaber ocupado puestos de alta direcciÃ³n en la Generalitat Valenciana me permite detectar las vulnerabilidades que pasan desapercibidas desde el exterior de la instituciÃ³n. Informes, dictÃ¡menes y orientaciÃ³n estratÃ©gica en asuntos que requieren experiencia tÃ©cnica, criterio jurÃ­dico y visiÃ³n institucional." },
  { icon: "shield", title: "Estrategia jurÃ­dica preventiva", text: "AnÃ¡lisis previo de riesgos, revisiÃ³n documental, preparaciÃ³n de actuaciones y diseÃ±o de estrategias antes de tomar decisiones relevantes." },
];

const errors = [
  { n: "01", title: "Consultar demasiado tarde", text: "Muchos asuntos se complican porque se pide ayuda cuando el conflicto ya estÃ¡ avanzado, los plazos corren o la documentaciÃ³n no se ha preparado bien." },
  { n: "02", title: "Mirar solo el expediente", text: "Un buen anÃ¡lisis jurÃ­dico debe valorar los hechos, la prueba, los tiempos, los riesgos y las consecuencias prÃ¡cticas de cada decisiÃ³n." },
  { n: "03", title: "Judicializar sin estrategia", text: "No todos los asuntos deben acabar en los tribunales. A veces conviene negociar, requerir, preparar mejor la posiciÃ³n o anticipar escenarios antes de iniciar acciones." },
];

const method = [
  { n: "01.", title: "DiagnÃ³stico inicial", text: "Se estudian los hechos, la documentaciÃ³n, los antecedentes, los plazos y los objetivos reales del cliente." },
  { n: "02.", title: "ValoraciÃ³n jurÃ­dica", text: "Se analizan las alternativas posibles, los puntos fuertes, los riesgos y las consecuencias prÃ¡cticas de cada vÃ­a." },
  { n: "03.", title: "Hoja de ruta", text: "Se define una estrategia clara, con actuaciones concretas, prioridades y seguimiento profesional del asunto." },
];

const faqs = [
  { q: "Â¿QuÃ© tipo de asuntos lleva VerÃ³nica LÃ³pez?", a: "Asuntos jurÃ­dicos que requieren anÃ¡lisis, estrategia y criterio profesional, especialmente en el Ã¡mbito administrativo, civil, institucional y de asesoramiento preventivo." },
  { q: "Â¿Trabaja con particulares, empresas e instituciones?", a: "SÃ­. El asesoramiento puede dirigirse a particulares, profesionales, empresas, entidades e instituciones que necesiten orientaciÃ³n jurÃ­dica especializada." },
  { q: "Â¿La primera consulta es gratuita?", a: "La primera consulta permite valorar el asunto, revisar la informaciÃ³n bÃ¡sica y determinar la mejor forma de actuar." },
  { q: "Â¿Atiende en Alicante?", a: "Atiende en Alicante y tambiÃ©n puede realizar consultas online cuando el asunto lo permita." },
  { q: "Â¿QuÃ© diferencia este despacho?", a: "La combinaciÃ³n de experiencia jurÃ­dica, trayectoria institucional y visiÃ³n acadÃ©mica. Esa perspectiva permite analizar cada asunto con profundidad y diseÃ±ar estrategias realistas." },
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
    <div className="veronica-original bg-white text-[#1A1A1A] selection:bg-[#C5A566] selection:text-white">
      <SmoothScroll />
      <Header />

      <main>
        <Hero />
        <TrustStats />
        <Diagnosis />
        <Differentiation />
        <Services />
        <Method />
        <About />
        <HiloLegal />
        <FAQ />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}

function Header() {
  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ ...spring, delay: 0.1 }}
      className="sticky top-0 w-full z-50 bg-white/85 backdrop-blur-xl border-b border-[#E5E5E5]"
    >
      <nav className="flex justify-between items-center w-full px-6 py-5 max-w-[1200px] mx-auto">
        <a className="flex items-center gap-3 group" href="https://hilolegal.es" target="_blank" rel="noopener noreferrer">
          <motion.img
            src="/veronica-assets/logo.png"
            alt="Logo VerÃ³nica LÃ³pez"
            className="h-10 w-10 object-contain"
            whileHover={{ rotate: -6, scale: 1.05 }}
            transition={spring}
          />
          <span className="text-base md:text-lg font-bold tracking-tight uppercase text-[#1A1A1A]">
            VerÃ³nica LÃ³pez
          </span>
        </a>
        <div className="hidden md:flex items-center gap-10">
          {[["Ãreas", "#services"], ["MÃ©todo", "#method"], ["Sobre mÃ­", "#about"], ["FAQ", "#faq"], ["Contacto", "#contact"]].map(([l, h]) => (
            <a
              key={h}
              className="relative text-sm font-medium text-[#1A1A1A] group"
              href={h}
            >
              <span className="transition-colors group-hover:text-[#C5A566]">{l}</span>
              <span className="absolute left-0 -bottom-1 h-[1px] w-full origin-left scale-x-0 bg-[#C5A566] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
            </a>
          ))}
        </div>
        <motion.a
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={spring}
          className="bg-[#1A1A1A] text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#C5A566] transition-colors"
          href={WHATSAPP}
        >
          WhatsApp
        </motion.a>
      </nav>
    </motion.header>
  );
}

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  return (
    <section ref={ref} className="relative pt-20 pb-32 overflow-hidden border-b border-white/10 bg-black text-white">
      <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        <motion.div style={{ y: textY }} className="lg:col-span-7 space-y-10">
          <FadeUp>
            <div className="inline-flex items-center gap-3 text-[#C5A566] font-bold text-xs uppercase tracking-widest">
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: 32 }}
                transition={{ duration: 0.9, ease: easeOutExpo, delay: 0.4 }}
                className="h-[2px] bg-[#C5A566] block"
              />
              ABOGADA Â· VISIÃ“N INSTITUCIONAL
            </div>
          </FadeUp>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.02] tracking-tight text-balance">
            {[
              "Derecho con criterio.",
              "La experiencia desde dentro.",
            ].map((line, i) => (
              <Curtain key={i} delay={0.15 + i * 0.1} className="block">
                <span className="block">{line}</span>
              </Curtain>
            ))}
          </h1>

          <FadeUp delay={0.6}>
            <p className="text-xl text-white/70 max-w-xl leading-relaxed">
              Abogada en ejercicio con trayectoria en puestos de alta direcciÃ³n en la AdministraciÃ³n PÃºblica de la Comunidad Valenciana y profesora asociada de Derecho en la Universidad de Alicante.{"\u00a0"}Conozco la ley porque la enseÃ±o, la aplico y he ayudado a redactarla desde la propia instituciÃ³n.
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
                Primera consulta
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={spring}
                className="border border-white text-white px-10 py-5 font-bold uppercase text-xs tracking-widest hover:bg-white hover:text-black transition-colors"
                href="#about"
              >
                Conocer trayectoria
              </motion.a>
            </div>
          </FadeUp>
        </motion.div>

        <div className="lg:col-span-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...spring, delay: 0.4 }}
            className="relative group"
          >
            <div className="absolute -inset-4 border border-[#E5E5E5] -z-10 transition-colors duration-500 group-hover:border-[#C5A566]" />
            <div className="relative overflow-hidden">
              <motion.img
                style={{ y: imgY, scale: imgScale }}
                alt="VerÃ³nica LÃ³pez, abogada"
                className="w-full h-auto object-cover"
                src={IMG(1)}
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function TrustStats() {
  const items = [
    { i: "workspace_premium", t: "20 AÃ‘OS DE EJERCICIO PROFESIONAL" },
    { i: "account_balance", t: "Alta direcciÃ³n pÃºblica" },
    { i: "school", t: "Docencia en la Facultad de Derecho" },
  ];
  return (
    <section className="py-16 border-b border-[#E5E5E5]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:divide-x divide-[#E5E5E5]">
          {items.map((s, idx) => (
            <FadeUp key={s.i} delay={idx * 0.1} className={idx === 0 ? "" : "md:pl-12"}>
              <div className="flex flex-col items-center md:items-start gap-4">
                <Icon name={s.i} className="text-[#C5A566] text-4xl" />
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
    { n: "01", t: "Trayectoria consolidada", d: "20 aÃ±os de ejercicio profesional en asesoramiento jurÃ­dico, defensa de intereses y anÃ¡lisis de asuntos complejos.", img: 3 },
    { n: "02", t: "Criterio institucional", d: "Experiencia en alta direcciÃ³n dentro de la administraciÃ³n local y autonÃ³mica, con conocimiento real del funcionamiento institucional.", img: 2 },
    { n: "03", t: "VisiÃ³n acadÃ©mica", d: "Profesora en la Facultad de Derecho de Alicante, con una visiÃ³n tÃ©cnica, acadÃ©mica y prÃ¡ctica del Derecho.", img: 4 },
  ];
  return (
    <section className="py-[100px]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="mb-24 space-y-6 max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-balance">
            <Curtain>Experiencia jurÃ­dica, criterio institucional y visiÃ³n prÃ¡ctica</Curtain>
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
                <div className="relative overflow-hidden aspect-square">
                  <motion.img
                    src={IMG(x.img)}
                    alt={x.t}
                    className="absolute inset-0 w-full h-full object-cover"
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.06 }}
                    transition={{ duration: 1.2, ease: easeOutExpo }}
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <div className="text-[#C5A566] font-black text-2xl">{x.n}</div>
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

function Differentiation() {
  return (
    <section className="py-[100px] bg-[#1A1A1A] text-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          <div className="lg:sticky lg:top-32 space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-balance">
              <Curtain>Hay abogados que conocen la ley.{"\u00a0"}Pocos la han aplicado desde ambos lados.</Curtain>
            </h2>
          </div>
          <FadeUp delay={0.1}>
            <div className="space-y-8 text-xl text-gray-300 leading-relaxed">
              <p>He trabajado como asesora jurÃ­dica, como parte del equipo directivo de organismos pÃºblicos autonÃ³micos y locales y como profesora universitaria. Eso significa que cuando tienes un problema con la AdministraciÃ³n, con un contrato, con una herencia o con cualquier asunto civil, no empiezo desde cero: entiendo cÃ³mo razona el sistema, cuÃ¡ndo vale la pena batallar y cuÃ¡ndo hay un camino mÃ¡s inteligente.{"\u00a0"}{"\u00a0"}{"\n\n\n"}Cuando asumo un asunto, no gestiono un expediente burocrÃ¡tico, evalÃºo una decisiÃ³n con consecuencias reales. Mi objetivo es que conozcas el impacto econÃ³mico y jurÃ­dico de cada escenario antes de dar el paso, eliminando la incertidumbre.</p>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="py-[100px]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="mb-24 space-y-6 max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            <Curtain>Ãreas de asesoramiento jurÃ­dico</Curtain>
          </h2>
          <FadeUp delay={0.15}>
            <p className="text-xl text-[#4A4A4A] max-w-2xl">Un enfoque integral que combina derecho administrativo, civil, familia, penal e institucional con una visiÃ³n estratÃ©gica y preventiva.</p>
          </FadeUp>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#E5E5E5]">
          {services.map((s, idx) => (
            <FadeUp key={s.title} delay={(idx % 2) * 0.08}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={spring}
                className="h-full bg-white p-12 hover:bg-[#1A1A1A] group transition-colors border border-transparent hover:border-[#1A1A1A]"
              >
                <Icon name={s.icon} className="text-[#C5A566] text-4xl mb-8 group-hover:text-white transition-colors" />
                <h3 className="text-xl font-bold mb-4 group-hover:text-[#C5A566] transition-colors">{s.title}</h3>
                <p className="text-[#4A4A4A] mb-10 group-hover:text-white transition-colors leading-relaxed">{s.text}</p>
                <a className="text-xs font-black uppercase tracking-widest flex items-center gap-2 group-hover:text-white transition-colors" href="#contact">
                  Consultar <Icon name="arrow_forward" className="text-sm" />
                </a>
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

function Method() {
  return (
    <section id="method" className="py-[100px] bg-[#F4EFEA] border-y border-[#E5E5E5]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-12">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
              <Curtain>Una forma de trabajar basada en anÃ¡lisis, claridad y estrategia</Curtain>
            </h2>
            <div className="space-y-12">
              {method.map((m, idx) => (
                <FadeUp key={m.n} delay={idx * 0.1}>
                  <div className="flex gap-8">
                    <span className="text-3xl font-black text-[#C5A566]">{m.n}</span>
                    <div>
                      <h4 className="text-xl font-bold mb-2 uppercase tracking-tight">{m.title}</h4>
                      <p className="text-[#4A4A4A] leading-relaxed">{m.text}</p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
          <FadeUp delay={0.1}>
            <div className="relative overflow-hidden aspect-square">
              <motion.img
                src={IMG(5)}
                alt="MÃ©todo de trabajo jurÃ­dico"
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ scale: 1.1 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, ease: easeOutExpo }}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white space-y-2">
                <Icon name="balance" className="text-white text-5xl" />
                <p className="font-bold uppercase tracking-widest text-xs">Rigor y Estrategia</p>
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
          <FadeUp className="lg:col-span-5">
            <div className="relative group">
              <motion.div
                initial={{ x: 16, y: 16 }}
                whileInView={{ x: 16, y: 16 }}
                whileHover={{ x: 0, y: 0 }}
                transition={spring}
                className="absolute inset-0 border border-[#C5A566] -z-10"
              />
              <div className="relative overflow-hidden">
                <motion.img
                  alt="VerÃ³nica LÃ³pez"
                  className="w-full h-[600px] object-cover"
                  src={IMG(6)}
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
                <span className="text-[#C5A566] font-bold text-xs uppercase tracking-widest">SOBRE MÃ</span>
                <h2 className="text-5xl font-bold tracking-tight">VerÃ³nica LÃ³pez</h2>
                <p className="text-2xl font-medium text-[#C5A566] italic">Conocer la norma importa. Saber aplicarla con estrategia marca la diferencia.</p>
              </div>
            </FadeUp>
            <FadeUp delay={0.1}>
              <div className="space-y-6 text-xl text-[#4A4A4A] leading-relaxed">
                <p>Abogada con mÃ¡s de 20 aÃ±os de experiencia y una trayectoria marcada por el rigor jurÃ­dico, la responsabilidad institucional y la vocaciÃ³n docente.</p>
                <p>He ocupado puestos de alta direcciÃ³n en la administraciÃ³n local y autonÃ³mica, lo que me permite conocer desde dentro el funcionamiento de las instituciones pÃºblicas y los procedimientos administrativos.</p>
                <p>Mi experiencia como profesora en la Facultad de Derecho de Alicante aporta una visiÃ³n tÃ©cnica y acadÃ©mica: anÃ¡lisis profundo, explicaciÃ³n clara y estrategia bien fundamentada.</p>
              </div>
            </FadeUp>
            <FadeUp delay={0.2}>
              <div className="flex flex-wrap gap-3 pt-2">
                {["Administrativo", "Civil", "Institucional", "Empresas"].map((t) => (
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
                <Icon name="location_on" className="text-[#C5A566]" />
                <span className="text-sm uppercase tracking-widest">Altea Â· Costa Blanca Â· Alicante</span>
              </div>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}

function HiloLegal() {
  return (
    <section className="py-[100px] bg-[#F4EFEA] border-y border-[#E5E5E5]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <FadeUp>
            <div className="space-y-8">
              <span className="text-[#C5A566] font-bold text-xs uppercase tracking-widest">PARTE DE HILOLEGAL</span>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                <Curtain>Una firma, dos especialistas</Curtain>
              </h2>
              <div className="space-y-6 text-xl text-[#4A4A4A] leading-relaxed">
                <p>Soy cofundadora de HiloLegal junto a JosÃ© Carlos Hidalgo, consultor patrimonial e hipotecario. Unificamos el criterio jurÃ­dico y el financiero. Si un caso presenta ambas vertientes, trabajamos de forma coordinada bajo una sola firma, evitando que tengas que duplicar explicaciones con distintos profesionales.</p>
                <p>Una firma, dos especialistas, sin que tengas que empezar desde cero con cada uno.</p>
              </div>
              <motion.a
                href="/josecarlos/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ x: 4 }}
                transition={spring}
                className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#C5A566] hover:text-[#1A1A1A] transition-colors"
              >
                Conocer a JosÃ© Carlos <Icon name="arrow_forward" className="text-sm" />
              </motion.a>
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <div className="relative overflow-hidden aspect-[4/3]">
              <motion.img
                src={banner3Asset.url}
                alt="HiloLegal"
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ scale: 1.1 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, ease: easeOutExpo }}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white space-y-2">
                <a href="https://hilolegal.es" target="_blank" rel="noopener noreferrer" className="font-bold uppercase tracking-widest text-xs hover:text-[#C5A566] transition-colors">HiloLegal</a>
              </div>
            </div>
          </FadeUp>
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
          <Curtain>Preguntas Frecuentes</Curtain>
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
                      className="material-symbols-outlined text-[#C5A566]"
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
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    topic: "Consulta jurÃ­dica general",
    message: "",
  });

  const onChange = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      await submit({ data: form });
      setStatus("ok");
      setForm({ name: "", phone: "", email: "", topic: "Consulta jurÃ­dica general", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "No se ha podido enviar el formulario.");
    }
  }

  return (
    <section id="contact" className="py-[100px]">
      <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24">
        <div className="space-y-12">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight">
            <Curtain>Hablemos de tu asunto</Curtain>
          </h2>
          <FadeUp delay={0.1}>
            <p className="text-xl text-[#4A4A4A] leading-relaxed">
              Si necesitas asesoramiento jurÃ­dico, rellena el formulario y explica brevemente tu situaciÃ³n. Revisaremos la informaciÃ³n inicial y contactaremos contigo para valorar los siguientes pasos.
            </p>
          </FadeUp>
          <div className="space-y-10 pt-10 border-t border-[#E5E5E5]">
            {[
              { i: "call", label: "TelÃ©fono", v: PHONE_DISPLAY, href: `tel:+34${PHONE_DISPLAY.replace(/\s/g, "")}` },
              { i: "mail", label: "Email", v: EMAIL, href: `mailto:${EMAIL}` },
            ].map((c, idx) => (
              <FadeUp key={c.i} delay={idx * 0.1}>
                <motion.a
                  href={c.href}
                  whileHover={{ x: 4 }}
                  transition={spring}
                  className="flex items-center gap-8 group"
                >
                  <div className="w-16 h-16 bg-[#1A1A1A] flex items-center justify-center text-white group-hover:bg-[#C5A566] transition-colors">
                    <Icon name={c.i} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest opacity-50 mb-1">{c.label}</p>
                    <p className="text-2xl font-bold break-all">{c.v}</p>
                  </div>
                </motion.a>
              </FadeUp>
            ))}
          </div>
        </div>
        <FadeUp>
          <form className="space-y-10" onSubmit={onSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <Field label="Nombre" type="text" placeholder="Tu nombre" value={form.name} onChange={onChange("name")} required />
              <Field label="TelÃ©fono" type="tel" placeholder="Tu nÃºmero" value={form.phone} onChange={onChange("phone")} required />
            </div>
            <Field label="Email" type="email" placeholder="tu@email.com" value={form.email} onChange={onChange("email")} required />
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em]">Tipo de asunto</label>
              <select
                value={form.topic}
                onChange={onChange("topic")}
                className="w-full bg-transparent border-0 border-b border-[#E5E5E5] px-0 py-4 focus:ring-0 focus:border-[#C5A566] transition-colors outline-none"
              >
                <option>Consulta jurÃ­dica general</option>
                <option>Derecho administrativo</option>
                <option>Derecho civil</option>
                <option>Asesoramiento a empresas</option>
                <option>ConsultorÃ­a jurÃ­dica institucional</option>
                <option>Otro asunto</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em]">Mensaje</label>
              <textarea
                rows={4}
                placeholder="Explica brevemente tu situaciÃ³n"
                value={form.message}
                onChange={onChange("message")}
                className="w-full bg-transparent border-0 border-b border-[#E5E5E5] px-0 py-4 focus:ring-0 focus:border-[#C5A566] transition-colors outline-none placeholder:text-gray-300"
              />
            </div>

            <motion.button
              type="submit"
              disabled={status === "sending"}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={spring}
              className="inline-block text-center w-full bg-[#C5A566] text-white py-6 font-black uppercase text-xs tracking-[0.3em] hover:bg-[#1A1A1A] transition-colors shadow-2xl shadow-[#C5A566]/20 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === "sending" ? "Enviandoâ€¦" : "Enviar consulta"}
            </motion.button>


            {status === "ok" && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-[#1A1A1A] font-bold uppercase tracking-widest"
              >
                Gracias. Hemos recibido tu consulta y contactaremos contigo a la mayor brevedad.
              </motion.p>
            )}
            {status === "error" && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-600"
              >
                {errorMsg || "Algo ha ido mal. IntÃ©ntalo de nuevo en unos minutos."}
              </motion.p>
            )}
          </form>
        </FadeUp>
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
            <img src="/veronica-assets/logo-white.png" alt="Logo VerÃ³nica LÃ³pez" className="h-12 w-12 object-contain" />
            <div className="space-y-2">
              <div className="text-2xl font-black tracking-tighter uppercase">VerÃ³nica LÃ³pez</div>
              <p className="text-gray-500 text-xs tracking-widest uppercase">Abogada Â· Administrativo Â· Civil Â· Institucional</p>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-10">
            {[
              { l: "Privacidad", href: "/privacidad.html" },
              { l: "TÃ©rminos", href: "/terminos.html" },
            ].map(({ l, href }) => (
              <a key={l} className="relative text-[10px] font-bold uppercase tracking-[0.2em] group" href={href} target="_blank" rel="noopener noreferrer">
                <span className="transition-colors group-hover:text-[#C5A566]">{l}</span>
                <span className="absolute left-0 -bottom-1 h-[1px] w-full origin-left scale-x-0 bg-[#C5A566] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
              </a>
            ))}
          </div>
        </div>
        <div className="mt-20 pt-10 border-t border-white/5 text-center text-[10px] text-gray-600 uppercase tracking-widest">
          Â© {new Date().getFullYear()} VERÃ“NICA LÃ“PEZ. TODOS LOS DERECHOS RESERVADOS.
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
