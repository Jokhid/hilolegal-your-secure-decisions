// "service" liga cada artículo a la página del profesional correspondiente
// (José Carlos: financiero/hipotecario · Verónica: jurídico · fincas:
// administración de comunidades) — se usa para el filtro de /blog y para
// las secciones de contenido destacado en cada página.
export type BlogService = "josecarlos" | "veronica" | "fincas";

// Fuente oficial citada al final de un artículo (BOE, Banco de España, Seguridad
// Social, AEAT, INE...). Solo se añade cuando el contenido usa realmente esa
// fuente — no se rellena por defecto ni se inventan enlaces profundos, se enlaza
// siempre a la home oficial del organismo.
export type ArticleSource = { label: string; url: string };

export type BlogPost = {
  slug: string;
  title: string;
  category: string;
  readingTime: string;
  excerpt: string;
  metaDescription: string;
  keyword: string;
  content: string;
  service: BlogService;
  sources?: ArticleSource[];
  // Fecha real de última revisión de contenido (no la fecha de publicación).
  // Solo se rellena cuando el artículo ha sido efectivamente revisado.
  updatedAt?: string;
};

// Metadatos compartidos por servicio — usados por el filtro de /blog, el
// schema Article de cada post (autor real, no siempre José Carlos) y el CTA
// final de cada artículo, que ahora enlaza a la página correspondiente.
export const SERVICE_META: Record<
  BlogService,
  { label: string; authorName: string; authorUrl: string; authorBio: string; contactPath: string }
> = {
  josecarlos: {
    label: "Financiero e hipotecas",
    authorName: "José Carlos Hidalgo Ortega",
    authorUrl: "https://www.hilolegal.es/josecarlos",
    // Reutilizada literalmente de la sección "Sobre mí" de /josecarlos.
    authorBio: "Trabajo con familias y autónomos en decisiones relacionadas con financiación hipotecaria, protección, ahorro y planificación patrimonial.",
    contactPath: "/josecarlos",
  },
  veronica: {
    label: "Legal",
    authorName: "Verónica López Ramón",
    authorUrl: "https://www.hilolegal.es/veronica",
    // Reutilizada literalmente del hero de /veronica.
    authorBio: "Abogada en ejercicio con trayectoria en puestos de alta dirección en la Administración Pública de la Comunidad Valenciana y profesora asociada de Derecho en la Universidad de Alicante.",
    contactPath: "/veronica",
  },
  fincas: {
    label: "Administración de fincas",
    authorName: "José Carlos Hidalgo Ortega",
    authorUrl: "https://www.hilolegal.es/administracion-fincas",
    authorBio: "Trabajo con familias y autónomos en decisiones relacionadas con financiación hipotecaria, protección, ahorro y planificación patrimonial.",
    contactPath: "/administracion-fincas",
  },
};

// Taxonomía visible del blog — más granular que "service" (que solo decide
// autor/página de contacto). Se deriva del campo `category`, ya existente
// en cada post, así que no hace falta anotar los 25 posts uno a uno ni
// cambiar sus slugs. Añade aquí la entrada correspondiente si se crea un
// post con una `category` nueva que no encaje en el mapa.
export type BlogTopic = "legal" | "hipotecas" | "patrimonio" | "autonomos" | "comunidades";

export const TOPIC_LABEL: Record<BlogTopic, string> = {
  legal: "Legal",
  hipotecas: "Hipotecas",
  patrimonio: "Patrimonio",
  autonomos: "Autónomos",
  comunidades: "Comunidades",
};

const CATEGORY_TOPIC_MAP: Record<string, BlogTopic> = {
  "Derecho de familia": "legal",
  "Responsabilidad civil": "legal",
  "Sucesiones y herencias": "legal",
  "Arrendamientos": "legal",
  "Derecho penal": "legal",
  "Derecho civil": "legal",
  "Hipotecas": "hipotecas",
  "Ahorro e inversión": "patrimonio",
  "Planificación financiera": "patrimonio",
  "Planificación de jubilación": "patrimonio",
  "Educación financiera": "patrimonio",
  "Seguros": "patrimonio",
  "Protección y seguros": "autonomos",
  "Ahorro para autónomos": "autonomos",
  "Finanzas para autónomos": "autonomos",
  "Protección para autónomos": "autonomos",
  "Convivencia y gestión": "comunidades",
  "Normativa de comunidades": "comunidades",
  "Administración de fincas": "comunidades",
};

export function topicOf(post: Pick<BlogPost, "category" | "service">): BlogTopic {
  return (
    CATEGORY_TOPIC_MAP[post.category] ??
    (post.service === "veronica" ? "legal" : post.service === "fincas" ? "comunidades" : "patrimonio")
  );
}

const financialPosts: Omit<BlogPost, "service">[] = [
  {
    slug: "dinero-parado-en-el-banco",
    title: "Dinero parado en el banco: cuánto estás perdiendo sin saberlo (2026)",
    category: "Ahorro e inversión",
    readingTime: "5 min",
    keyword: "dinero parado en el banco",
    excerpt: "Si tienes dinero en cuenta corriente, crees que estás ahorrando. La inflación dice lo contrario. Te explico cuánto pierdes cada año.",
    metaDescription: "¿Tienes dinero en cuenta corriente y crees que ahorras? En 2026 la inflación acumulada en España supera el 20%. Te explico cuánto estás perdiendo.",
    content: `## El dinero que no se mueve, retrocede

Tener dinero en una cuenta corriente sin invertir no es ahorrar: es perder poder adquisitivo cada año, porque la inflación crece más rápido que el interés —casi nulo— que paga esa cuenta. En 2026, con una inflación acumulada que supera el 20% desde 2020, ese efecto ya no es teórico.\n\nImagina que en enero de 2020 ingresas 10.000 € en una cuenta corriente. Sin tocarlos. Sin gastarlos. Siendo, en apariencia, completamente responsable con tu economía.

Hoy, en 2026, sigues viendo 10.000 € en el extracto. Pero algo ha cambiado.

La inflación acumulada en España desde 2020 supera el 20 %. Lo que antes costaba 100 € ahora cuesta más de 120 €. Tu saldo no se ha movido, pero su poder adquisitivo ha caído en picado.

En términos reales, has perdido más de 2.000 € de capacidad de compra sin haber gastado un solo euro. Eso no es ahorrar. Es guardar dinero mientras el tiempo trabaja en tu contra.

## ¿Cuál es la diferencia entre guardar y ahorrar?

> Guardar dinero es dejar que el tiempo trabaje en tu contra. Ahorrar es hacer que el tiempo trabaje a tu favor.

El verdadero ahorro implica que tu dinero crece por encima de la inflación. Que cuando llegues a tu objetivo —comprar una casa, financiar la educación de tus hijos o jubilarte— tu poder de compra sea igual o mayor al que tenías cuando empezaste.

## El IPC: el enemigo invisible de tus ahorros

El Índice de Precios al Consumo no aparece en tu extracto bancario. Pero lleva años haciendo el mismo trabajo silencioso: reducir lo que valen tus ahorros, décima a décima, mes a mes.

Los bancos remuneran muchas cuentas entre el 0 % y el 1 % anual. La inflación media en España en los últimos cinco años ha sido muy superior. El resultado es una pérdida real de patrimonio enmascarada por una sensación de seguridad falsa.

## ¿Cuánto te cuesta exactamente tener dinero parado?

- 10.000 € en cuenta corriente durante 5 años con inflación media del 4 % = pérdida de poder adquisitivo de aproximadamente 2.163 €.
- 50.000 € en las mismas condiciones = pérdida de unos 10.800 € en cinco años.
- 100.000 € = más de 21.000 € de capacidad de compra evaporada.

## Qué alternativas existen

- Seguros de ahorro a largo plazo con garantía creciente (como el SIALP), que puede llegar al 85 % del valor más alto alcanzado por la inversión, según el producto y sus condiciones concretas.
- Planes garantizados de inversión con garantía entre el 95 % y el 110 % del capital aportado, disponibles en productos específicos y sujetos a las condiciones de cada entidad.
- Fondos de inversión con diferentes perfiles de riesgo.
- Planes de pensiones con ventajas fiscales para tipos altos.
- Carteras gestionadas con criterios ASG.

## La pregunta que deberías hacerte hoy

No es si puedes ahorrar. La pregunta correcta es: ¿lo que estás haciendo hoy realmente es ahorrar?

**¿Quieres saber exactamente cuánto te está costando tener tu dinero parado? Escríbeme y lo calculamos juntos. El diagnóstico es gratuito.**`,
    sources: [{ label: "Agencia Tributaria", url: "https://sede.agenciatributaria.gob.es" }],
    updatedAt: "31 de agosto de 2026",
  },
  {
    slug: "que-pasaria-con-tu-familia-si-no-pudieras-trabajar",
    title: "¿Qué pasaría con tu familia si mañana no pudieras trabajar?",
    category: "Protección y seguros",
    readingTime: "5 min",
    keyword: "qué pasa si no puedo trabajar autónomo",
    excerpt: "Una baja, un diagnóstico o un accidente puede dejarte sin ingresos de un día para otro. ¿Tiene tu familia un plan real?",
    metaDescription: "Una baja laboral, un diagnóstico inesperado o un accidente puede dejarte sin ingresos de un día para otro. ¿Tiene tu familia un plan real? Te lo explico.",
    content: `## La pregunta que casi nadie se hace hasta que es tarde

Sin un seguro de protección de ingresos, una baja médica larga puede dejar a tu familia solo con la prestación pública —normalmente muy por debajo de tus ingresos habituales— durante semanas o meses.\n\n> ¿Qué pasaría con mi familia si mañana yo no puedo estar?

No hablo de muerte —aunque también hay que planificarlo. Hablo de algo más probable: una baja médica larga, un accidente, una incapacidad temporal o permanente.

## Qué cobraría un autónomo durante una incapacidad temporal por contingencias comunes

Esto aplica a una baja por enfermedad común o accidente no laboral, que es el escenario más habitual. Si tienes cubiertas las contingencias profesionales (accidente de trabajo o enfermedad profesional), el cálculo y los plazos son distintos y conviene revisarlos aparte con tu mutua.

En contingencias comunes, la cobertura pública para un autónomo con base de cotización media funciona, según la Seguridad Social, así:

- Días 1 al 3: cobras 0 €.
- Días 4 al 20: cobras el 60 % de tu base de cotización (no de tus ingresos reales).
- A partir del día 21: cobras el 75 % de tu base.

Si tu base es la mínima y tus gastos fijos mensuales son de 2.500-3.000 €, el desfase puede ser de más de 2.000 € al mes desde el primer día.

## La diferencia entre tener un seguro y tener una estrategia

Una estrategia real responde con concreción a:

- ¿Cuántos meses puede sobrevivir tu economía familiar sin tus ingresos?
- ¿Qué parte de tus gastos fijos quedarían cubiertos en una baja prolongada?
- ¿Tienes cobertura por incapacidad permanente?
- ¿Tu familia podría mantener la hipoteca si tú faltas?

## Los tres errores más comunes en protección financiera

1. Confiar solo en la cobertura pública.
2. Tener un seguro de vida pero no un seguro de incapacidad.
3. No revisar la cobertura cuando cambia la situación vital.

## Cómo construir una protección financiera real

El objetivo no es contratar más productos. Es tener respuesta a esa pregunta incómoda antes de que la vida te la haga de forma abrupta.

> La mayoría de las personas no planean fracasar. Simplemente fracasan en planear.

**Si quieres revisar juntos si tienes esa respuesta clara, escríbeme. La primera conversación no cuesta nada.**`,
    sources: [{ label: "Seguridad Social", url: "https://www.seg-social.es" }],
    updatedAt: "31 de agosto de 2026",
  },
  {
    slug: "prevision-financiera-vision",
    title: "Previsión financiera: por qué los que planifican no tienen más suerte, sino más visión",
    category: "Planificación financiera",
    readingTime: "4 min",
    keyword: "previsión financiera personal",
    excerpt: "Prever no es adivinar el futuro. Es decidir hoy qué harás si algo cambia mañana.",
    metaDescription: "Prever no es adivinar el futuro. Es decidir hoy qué harás si algo cambia mañana. Así funciona la planificación financiera real y por qué la mayoría llega tarde.",
    content: `## Prever: del latín «ver antes»

Prever no es adivinar el futuro. Es decidir hoy qué harás si algo cambia mañana, para no tener que improvisar bajo presión cuando ese cambio llegue.\n\nLa palabra prever viene del latín *prae* (antes) y *videre* (ver). Ver antes de que ocurra. Precaverse va un paso más allá: guardarse de un peligro antes de que llegue.

Hay dos tipos de personas ante el futuro: las que esperan a que algo pase, y las que ya habían pensado qué harían si pasaba. Las segundas no tienen más suerte. Tienen más visión.

## El problema: vivimos atrapados en el presente

Las facturas, los hijos, el trabajo. El día a día consume toda la energía y el futuro parece siempre lejano. Hasta que deja de serlo: una baja inesperada, un diagnóstico, una jubilación que llega sin nada preparado.

## El activo más valioso que nadie protege

Aseguramos la casa, el coche y el móvil. Pero muy pocos aseguran su activo más valioso: su capacidad de generar ingresos.

Para muchos autónomos, la respuesta honesta a "¿cuánto aguantarías sin ingresos?" es bastante menos tiempo del que les gustaría admitir.

## Los pilares de una previsión bien construida

- **Protección de ingresos**: cobertura ante incapacidad temporal o permanente que cubra la diferencia real entre lo que paga el sistema y lo que necesitas.
- **Ahorro estructurado**: un vehículo privado que acumule patrimonio de forma eficiente desde ahora.
- **Planificación de la jubilación**: con horizonte real, no con el producto que te ofreció el banco hace diez años.

## El coste de esperar

Quien empieza a ahorrar 200 € al mes a los 35 años con rentabilidad media del 5 % anual, llegará a los 65 con aproximadamente 166.000 €. Empezando a los 45: unos 83.000 €. La mitad por haber esperado diez años.

**Si quieres hacer ese ejercicio, estoy aquí. Sin compromiso, sin presión. Solo claridad sobre tu situación.**`,
  },
  {
    slug: "contigo-senior-nationale-nederlanden",
    title: "Contigo Senior: qué cubre y para quién es ideal este seguro de Nationale-Nederlanden",
    category: "Seguros",
    readingTime: "5 min",
    keyword: "seguro para mayores de 55 años España",
    excerpt: "Una solución de salud y apoyo para personas de entre 55 y 80 años. Qué cubre y para quién tiene sentido.",
    metaDescription: "Contigo Senior de Nationale-Nederlanden: salud y apoyo para personas de 55 a 80 años. Te explico qué cubre y para quién tiene sentido.",
    content: `## La paradoja de los 55

Contigo Senior es un seguro de salud y apoyo de Nationale-Nederlanden pensado para personas de entre 55 y 80 años, centrado en cobertura médica y servicios de asistencia en el día a día, no solo en hospitalización.\n\nMuchas personas que superan los 55 años llegan a esta etapa con una situación que pocos verbalizan: han construido patrimonio, tienen experiencia. Pero sienten que si algo falla, no tienen a nadie detrás.

## Qué es Contigo Senior

Contigo Senior no es un seguro de salud convencional. Es una solución integral para la etapa entre los 55 y los 80 años que combina cobertura sanitaria, apoyo en el hogar y protección económica ante imprevistos.

## Qué cubre exactamente

### Cobertura sanitaria

- Consultas ilimitadas con médico de familia y geriatras de Sanitas.
- 5 consultas anuales con especialistas.
- Bienestar preventivo: podología, análisis clínicos, radiografías, densitometrías y ecografías.
- Cobertura dental incluida.

### Apoyo en el hogar

Si la persona sufre un percance que le impide realizar las tareas cotidianas, Contigo Senior envía un auxiliar a domicilio para limpieza, compra y aseo personal.

### Protección económica

- Hasta 65.000 € para adaptar la vivienda o cubrir gastos imprevistos.
- Posibilidad de contratación hasta los 80 años.
- Para autónomos: deducción de hasta 500 € en IRPF.

## ¿Para quién tiene sentido?

- Autónomos o profesionales independientes de entre 55 y 75 años sin cobertura sanitaria privada.
- Personas que viven solas o con red de apoyo familiar limitada.
- Propietarios que quieren proteger su patrimonio ante imprevistos domésticos.
- Quienes quieren acceso preferente a especialistas sin listas de espera públicas.

## Lo que lo diferencia de un seguro médico convencional

Un seguro médico estándar cubre la enfermedad. Contigo Senior cubre la etapa. No solo te da acceso al médico, sino que te acompaña cuando las necesidades son más complejas.

> Si tienes más de 55 años y quieres analizar si Contigo Senior tiene sentido para ti, escríbeme. Te lo explico sin compromiso.`,
    sources: [{ label: "Nationale-Nederlanden España", url: "https://www.nnespana.es" }, { label: "Agencia Tributaria", url: "https://sede.agenciatributaria.gob.es" }],
    updatedAt: "31 de agosto de 2026",
  },
  {
    slug: "autonomo-ahorros-cuenta-corriente",
    title: "Autónomo con ahorros en cuenta corriente: el error silencioso que te cuesta dinero cada año",
    category: "Ahorro para autónomos",
    readingTime: "4 min",
    keyword: "ahorro para autónomos España",
    excerpt: "Si eres autónomo y tienes dinero en cuenta sin estrategia, estás perdiendo rentabilidad real cada año.",
    metaDescription: "Si eres autónomo y tienes dinero en cuenta corriente sin estrategia de ahorro, pierdes rentabilidad real cada año. Te explico qué alternativas existen.",
    content: `## El mito del dinero «controlado»

Tener todos tus ahorros como autónomo en la cuenta corriente, sin ninguna estrategia detrás, tiene un coste real: pierdes rentabilidad frente a la inflación cada año, aunque la cifra de la cuenta no baje.\n\nCuando hablo con autónomos sobre sus finanzas, escucho con frecuencia la misma frase: «Es que yo no soy de invertir. Prefiero tenerlo controlado.»

Controlado. En una cuenta que cobra comisiones de mantenimiento y ofrece entre el 0 % y el 1 % anual, mientras la inflación ha estado por encima del 3 % los últimos años.

## El autónomo y su relación con el dinero en reposo

El problema no es tener un colchón de seguridad. Es no hacer nada con el dinero que va más allá de ese colchón.

Si tienes 6 meses de gastos en cuenta como reserva, tiene sentido. Si tienes 50.000 € u 80.000 € parados sin estrategia, eso es patrimonio perdiendo valor cada año.

## Las alternativas no son solo para grandes patrimonios

- **SIALP**: aportación desde cantidades pequeñas, con posible exención fiscal de los rendimientos a partir de 5 años si se cumplen los requisitos legales, y garantía de capital según el producto.
- **Fondos de inversión**: empiezas con poco capital, son líquidos y tienen perfiles desde conservador a más agresivo.
- **PPES (Plan de Pensiones de Empleo Simplificado)**: hasta 4.250 € adicionales con desgravación fiscal directa en IRPF.
- **Carteras gestionadas**: diversificación sin gestión activa por tu parte.

## La jubilación del autónomo: el problema que nadie quiere ver

Un autónomo que ha cotizado por la base mínima tiene derecho a una pensión pública de aproximadamente 700-800 € al mes. Si hoy vives con 3.000-4.000 €, eso es una caída de más del 75 % en tu nivel de vida.

## ¿Cuánto dinero tienes parado ahora mismo sin trabajar para ti?

> Soy especialista en ahorro para autónomos en Altea, Benidorm y la Costa Blanca. Escríbeme y analizamos tu situación real.`,
    sources: [{ label: "Agencia Tributaria", url: "https://sede.agenciatributaria.gob.es" }],
    updatedAt: "31 de agosto de 2026",
  },
  {
    slug: "sialp-2026-ahorro-sin-impuestos",
    title: "SIALP 2026: el producto de ahorro a largo plazo que el Gobierno quiere relanzar",
    category: "Ahorro e inversión",
    readingTime: "6 min",
    keyword: "qué es un SIALP",
    excerpt: "Un seguro de ahorro a largo plazo con un régimen fiscal específico: puede permitir la exención de los rendimientos si se cumplen los requisitos legales. Cómo funciona y por qué interesa.",
    metaDescription: "El SIALP es un seguro de ahorro a largo plazo con un régimen fiscal específico, sujeto a los requisitos legales vigentes. El Gobierno planea relanzarlo en 2026.",
    content: `## ¿Qué es un SIALP?

El SIALP —Seguro Individual de Ahorro a Largo Plazo— es una modalidad de ahorro que puede permitir la exención fiscal de los rendimientos positivos cuando se cumplen los requisitos establecidos legalmente, entre ellos mantener el dinero invertido un mínimo de cinco años. La fiscalidad depende del cumplimiento de esos requisitos y de la normativa vigente en cada momento (puedes consultarla en la Agencia Tributaria).

## Por qué el SIALP vuelve al foco en 2026

El Ministerio de Economía ha anunciado planes para relanzar los SIALP dentro de la nueva etiqueta europea «Finance Europe», con el objetivo de movilizar el ahorro paralizado en cuentas corrientes hacia proyectos empresariales europeos.

## Cómo funciona exactamente

- Aportación máxima: 5.000 € al año.
- Plazo mínimo para la exención fiscal: 5 años.
- Tributación si retiras antes de 5 años: como rendimiento del capital mobiliario.
- Liquidez: puedes rescatar en cualquier momento (pierdes la ventaja fiscal antes del quinto año).
- Traspaso: puedes mover el capital a otro SIALP sin penalización.

## No todos los SIALP son iguales

La mayoría ofrece la garantía mínima legal del 85 % sobre las primas aportadas e invierte de forma muy conservadora. No es lo mismo garantizar el 85 % de lo que pusiste que garantizar el 85 % del valor más alto alcanzado por tu inversión.

## Por qué el Plan Creciente SIALP de Nationale-Nederlanden lidera el mercado

Según ICEA, lidera con una cuota del 27,02 %, diez puntos por encima del segundo. Tres razones:

### 1. La garantía crece contigo

Gracias a la tecnología iGG (individualized Growing Guarantee), garantiza el 85 % del valor más alto alcanzado por la inversión, no del capital inicial.

### 2. Rentabilidad real, no solo seguridad

Con hasta el 75 % de exposición a renta variable, ofrece protección del capital y potencial de rentabilidad por encima de la inflación.

### 3. Inversión con criterios ASG

Pionero en invertir con criterios ambientales, sociales y de buen gobierno.

## ¿Para quién tiene sentido?

- Profesionales con entre 2.000 y 5.000 € al año que no necesitan tocar a corto plazo.
- Autónomos que quieren ahorro garantizado complementario al plan de pensiones.
- Personas que buscan rentabilidad neta real sin riesgo elevado.

**¿Tienes dudas sobre si el SIALP encaja en tu situación? Escríbeme y te lo explico en menos de 15 minutos.**`,
    sources: [{ label: "Agencia Tributaria", url: "https://sede.agenciatributaria.gob.es" }, { label: "BOE", url: "https://www.boe.es" }],
    updatedAt: "31 de agosto de 2026",
  },
  {
    slug: "educacion-financiera-lo-que-el-colegio-no-te-enseno",
    title: "Educación financiera: lo que el colegio no te enseñó y te cuesta dinero cada año",
    category: "Educación financiera",
    readingTime: "5 min",
    keyword: "educación financiera España",
    excerpt: "12 años de colegio, cero clases sobre dinero. Los conceptos básicos que cambian todo.",
    metaDescription: "En España se pasan 12 años en el colegio sin una sola clase sobre cómo funciona el dinero. Te explico qué conceptos básicos cambian todo.",
    content: `## Doce años de colegio. Cero clases sobre dinero.

Aprendemos a calcular el área de un trapecio, memorizamos ríos y capitales. Pero nadie nos explica qué es la inflación. Nadie nos enseña cómo funciona realmente una hipoteca. Nadie nos habla del interés compuesto.

Y al llegar a la vida adulta tenemos que tomar decisiones de enorme impacto: comprar una casa, endeudarnos, invertir, planificar la jubilación.

## Los cuatro conceptos que nadie te enseñó

### 1. La inflación

Es el aumento sostenido del nivel general de precios. Cuando la inflación es del 4 %, lo que hoy cuesta 100 € costará 104 € dentro de un año. Tu dinero en cuenta corriente no crece al mismo ritmo: pierde valor en términos reales.

### 2. El interés compuesto

Es el efecto de que los rendimientos generen nuevos rendimientos. 1.000 € al 6 % anual se convierten en 1.791 € en 10 años. En 30 años, en 5.743 €. Sin aportar nada más.

### 3. El coste real de una hipoteca

Una hipoteca de 150.000 € a 30 años al 3 % supone pagar aproximadamente 77.000 € en intereses, además del capital.

### 4. Por qué tener dinero parado también es perder

Si tu dinero no crece al menos al ritmo de la inflación, cada año vale menos. No hacer nada también es una decisión financiera.

## Lo que pasa cuando no sabes cómo funciona el dinero

> Cuanto menos entiendes cómo funciona el dinero, más difícil es distinguir qué producto encaja contigo y cuál solo conviene a quien te lo vende.

El banco te ofrece el producto que más le conviene a él. El gestor te vende el fondo con mayor comisión. La hipoteca tiene condiciones que no comparaste porque no sabías qué comparar.

## Por dónde empezar

No necesitas un máster. Necesitas tres o cuatro conceptos claros y alguien que te los explique en función de tu situación real.

**Si quieres entender cómo funciona tu dinero y qué estás dejando de ganar, escríbeme. La conversación inicial no cuesta nada.**`,
  },
  {
    slug: "plan-de-pensiones-o-sialp",
    title: "Plan de pensiones o SIALP: cuál te conviene según tu situación en 2026",
    category: "Ahorro e inversión",
    readingTime: "6 min",
    keyword: "plan de pensiones vs SIALP",
    excerpt: "No hay respuesta universal: depende de tus ingresos, tu perfil fiscal y cuándo necesitas el dinero.",
    metaDescription: "¿Plan de pensiones o SIALP? No hay respuesta universal: depende de tus ingresos, tu perfil fiscal y cuándo necesitas el dinero. Te lo explico con números.",
    content: `## La pregunta que más me hacen

No hay una respuesta universal: un plan de pensiones suele convenir más si buscas reducir la base imponible del IRPF ahora y tienes un tipo marginal alto; un SIALP suele convenir más si priorizas liquidez y una posible exención fiscal a largo plazo. La decisión depende de tus ingresos, tu perfil fiscal y cuándo necesitas el dinero.\n\n«José Carlos, ¿me conviene más un plan de pensiones o un SIALP?» La respuesta depende de tu situación concreta.

## El plan de pensiones: el aplazador de impuestos

Reduces tu base imponible del IRPF hoy, pero pagas impuestos cuando rescatas. La lógica es que hoy tributas a un tipo alto y al jubilarte tributarás a un tipo más bajo. Si eso se cumple, ganas.

### Límites 2026

- Trabajadores por cuenta ajena: hasta 1.500 € anuales.
- Autónomos con PPES: hasta 5.750 € (1.500 € individuales + 4.250 € al PPES).

### Lo que casi nadie te cuenta

Al rescatar el plan, tributarás por el 100 % del capital acumulado como rendimiento del trabajo. Y está bloqueado: solo lo rescatas en jubilación, incapacidad, enfermedad grave, desempleo de larga duración o cuando hayan pasado más de 10 años desde la aportación.

## El SIALP: un régimen fiscal específico

No desgravas al aportar, pero si mantienes el dinero al menos 5 años y se cumplen los requisitos legales, los rendimientos pueden quedar exentos según la normativa vigente.

### Límites 2026

- Aportación máxima: 5.000 € anuales.
- Plazo mínimo: 5 años.
- Liquidez total (pierdes beneficio fiscal antes de 5 años).
- Garantía mínima del 85 % de las primas aportadas.

## El plan de pensiones gana si...

- Tu tipo marginal de IRPF actual es superior al 30 %.
- Al jubilarte tributarás a un tipo claramente inferior.
- No necesitas acceder al dinero antes de jubilarte.

## El SIALP gana si...

- Tienes ingresos medios y quieres ahorro real neto de impuestos.
- Valoras tener liquidez aunque sea con penalización fiscal.
- Quieres garantía de capital.
- Buscas complementar la jubilación sin complicar tu IRPF hoy.

## La decisión inteligente

No hay un producto universalmente mejor. Hay una estrategia correcta para cada situación.

**Escríbeme y en 5 minutos te digo cuál te conviene realmente en tu situación. Sin jerga financiera.**`,
    sources: [{ label: "Agencia Tributaria", url: "https://sede.agenciatributaria.gob.es" }],
    updatedAt: "31 de agosto de 2026",
  },
  {
    slug: "flujo-caja-vs-riqueza-real-autonomo",
    title: "Flujo de caja vs riqueza real: el error financiero más caro del autónomo",
    category: "Finanzas para autónomos",
    readingTime: "4 min",
    keyword: "flujo de caja autónomo",
    excerpt: "Ver una cifra alta en tu cuenta no significa que tengas seguridad financiera.",
    metaDescription: "Ver una cifra alta en tu cuenta no significa que tengas seguridad financiera. Te explico la diferencia entre flujo de caja y riqueza real.",
    content: `## La trampa de la cuenta con muchos ceros

Tener mucho dinero en la cuenta corriente de tu negocio no significa que seas rico: puede ser solo flujo de caja a la espera de pagar impuestos, proveedores o nóminas. Confundir ambas cosas es el error financiero que más cuesta a un autónomo.\n\nHay una sensación particular que conoce casi todo autónomo con buen nivel de facturación: ver una cifra alta en la cuenta corriente y sentir que todo está bajo control. Esa sensación es, en muchos casos, una trampa.

El dinero que aparece en tu cuenta hoy no es tuyo del todo. Hay impuestos pendientes, facturas que aún no han llegado, gastos variables.

## Liquidez no es seguridad

El **flujo de caja** es el dinero que entra y sale del negocio. Es liquidez.

La **riqueza real** es la diferencia entre lo que tienes (activos) y lo que debes (pasivos). Es patrimonio neto que existe independientemente de si sigues facturando.

Un autónomo puede tener flujo excelente y al mismo tiempo riqueza real muy baja si el dinero entra y sale a la misma velocidad sin acumular patrimonio.

> Si el dinero entra y sale a la misma velocidad, no tienes un negocio consolidado. Tienes ingresos por tu trabajo, sin el colchón que da tener patrimonio detrás.

## La pregunta incómoda

¿Cuántos meses sobreviviría tu estructura familiar si mañana dejaras de emitir facturas? Si la respuesta es menos de tres meses, tienes un problema de arquitectura financiera.

## Cómo construir riqueza real siendo autónomo

1. **Proteger los ingresos**: cobertura ante incapacidad que cubra la diferencia entre lo que paga el sistema y lo que necesitas.
2. **Acumular patrimonio sistemáticamente**: un porcentaje fijo de ingresos a un vehículo de ahorro, independientemente del mes.
3. **Planificar la jubilación desde hoy**: cuanto antes empieces, más trabaja el interés compuesto a tu favor.

## Conviene revisarlo antes de que se convierta en un problema

Cuanto antes se ordena esta diferencia entre flujo de caja y patrimonio real, menos cuesta corregirla.

**Si quieres revisar tu arquitectura financiera como autónomo, escríbeme. La primera consulta es gratuita.**`,
  },
  {
    slug: "base-minima-autonomos-baja-2026",
    title: "Base mínima de autónomos en 2026: cuánto pierdes realmente cuando te pones enfermo",
    category: "Protección para autónomos",
    readingTime: "6 min",
    keyword: "base mínima autónomos baja laboral 2026",
    excerpt: "¿Sabes cuánto cobrarías si mañana te pusieras de baja? Los números son peores de lo que crees.",
    metaDescription: "¿Sabes cuánto cobrarías realmente si mañana te pusieras de baja? Los números son mucho peores de lo que crees. Te lo explico con el cálculo real para 2026.",
    content: `## La dicotomía financiera peligrosa del autónomo

Si cotizas por la base mínima, tu prestación por incapacidad temporal se calcula sobre esa base, no sobre lo que realmente ingresas — así que el contraste entre tu nivel de vida real y lo que cobrarías de baja suele ser mucho mayor de lo que la mayoría de autónomos espera.\n\nMuchos profesionales autónomos vivimos con ingresos medios o altos pero cuota baja. Esa contradicción tiene consecuencias muy concretas cuando la vida decide ponerte a prueba.

## El cálculo real: qué cobras de baja en 2026

Supongamos rendimiento neto mensual de 5.000 €. Según las tablas 2026, te corresponde el tramo de 4.050 € – 6.000 €. Tu base mínima obligatoria: ~1.732 €. Cuota mensual: ~545 €.

Este cálculo corresponde a una baja por **contingencias comunes** (enfermedad común o accidente no laboral), según las reglas de la Seguridad Social. Si la baja es por accidente de trabajo o enfermedad profesional, el cálculo y los plazos son distintos.

Si sufres una enfermedad común que te deja fuera un mes:

- **Días 1 a 3**: 0 €. Período de carencia.
- **Días 4 a 20**: ~34 €/día (60 % base). Unos 578 € en 17 días.
- **Día 21 en adelante**: ~43 €/día (75 % base).

A final de mes habrías cobrado ~1.180 €. Pero tienes que seguir pagando la cuota de autónomos (545 €). **Ingreso neto real: unos 635 €.**

Si tus gastos fijos familiares son de 3.000 € mensuales, acabas de generar un agujero de 2.365 € en un solo mes. Sin haber hecho nada mal.

## Y la jubilación: el problema que llega aunque no quieras verlo

Tu pensión pública se calcula sobre tus bases de cotización. Si has cotizado por la mínima aunque ganes 5.000 €/mes, tu pensión reflejará esa base mínima.

Pasarías de vivir con 5.000 € al mes a recibir una pensión de aproximadamente 1.700 €. Una caída del 66 %.

## Los tres pilares que protegen al autónomo

1. **Seguro médico privado**: tu tiempo es dinero. Deducible hasta 500 € por ti y por cada miembro de tu familia (máximo 2.000 €).
2. **Seguro de incapacidad temporal (ILT) y vida**: cubre matemáticamente la diferencia entre lo que paga el Estado y tus gastos reales. Deducible hasta 500 € en IRPF.
3. **Ahorro e inversión privado**: complementa la pensión pública. Hasta 5.750 € anuales aportando a planes de pensiones para autónomos.

## No delegues tu estabilidad en una normativa que cambia cada legislatura

Lo que sí puedes controlar es tu patrimonio privado, tu cobertura complementaria y tu estrategia de ahorro. Eso nadie te lo quita.

**Si quieres calcular cuánto cobrarías de baja y cuánto perderías en la jubilación con tu situación actual, escríbeme.**`,
    sources: [{ label: "Seguridad Social", url: "https://www.seg-social.es" }],
    updatedAt: "31 de agosto de 2026",
  },
  {
    slug: "jubilacion-en-espana",
    title: "Jubilación en España: la historia real que nadie quiere ver",
    category: "Planificación de jubilación",
    readingTime: "5 min",
    keyword: "jubilación digna España",
    excerpt: "Susana cotizó toda su vida. Hoy duerme en el sofá para poder alquilar las habitaciones. ¿Qué falló?",
    metaDescription: "Una jubilada de 79 años duerme en el sofá porque alquila sus habitaciones para pagar las facturas. ¿Qué falló y qué puedes hacer tú para que no te pase?",
    content: `## Una historia real

La pensión pública no garantiza necesariamente mantener el mismo nivel de ingresos que tenías antes de jubilarte. Para muchas personas que cotizaron toda su vida, la pensión final resulta muy inferior a lo que necesitan para vivir como antes.\n\nSusana tiene 79 años. Es viuda. Cobró su sueldo toda la vida, cotizó durante décadas y siguió todas las reglas. Hoy cobra 800 € de pensión. Para pagar alquiler y facturas, alquila las habitaciones de su piso a estudiantes. Ella duerme en el salón, en un sofá cama.

No es metáfora. Es una noticia publicada en *El Economista* en abril de 2025.

## ¿Qué falló?

Susana no hizo nada mal. El problema es estructural:

- La pensión pública no garantiza necesariamente mantener el mismo nivel de ingresos que tenías antes de jubilarte.
- La pensión media en 2025 ronda los 1.300 € mensuales. Para quienes cotizaron por bases bajas, mucho menos.
- La inflación erosiona el poder adquisitivo año a año, pese a revalorizaciones.
- Las personas que no construyeron patrimonio privado dependen al 100 % del Estado.

## El espejo que nadie quiere mirar

> Cumplió las reglas. Trabajó. Cotizó. Aportó. Y aun así, su jubilación se parece más a una estrategia de supervivencia que a un descanso merecido.

## Qué diferencia a quienes llegan bien a la jubilación

1. Cotizar por bases más altas durante los años de mayores ingresos.
2. Construir patrimonio privado de forma sistemática: SIALP, fondos, planes de pensiones, inmuebles.
3. Tener cobertura de salud privada para no depender de listas de espera.
4. Planificar con tiempo para que el interés compuesto trabaje a tu favor.

## ¿Cuánto necesitas realmente para jubilarte bien?

Si hoy vives con 3.000 € al mes y quieres mantener ese nivel durante 20 años, necesitas 720.000 € en activos privados. Si la pensión pública cubre 1.200 €, necesitas generar 1.800 € adicionales al mes desde tu patrimonio.

No es imposible. Pero requiere empezar hoy, no a los 60.

**Si quieres calcular tu brecha de jubilación y construir un plan real para cubrirla, escríbeme. Lo hacemos juntos.**`,
    sources: [{ label: "Seguridad Social", url: "https://www.seg-social.es" }],
    updatedAt: "31 de agosto de 2026",
  },
  {
    slug: "preparar-perfil-financiero-hipoteca-2026",
    title: "Cómo preparar tu perfil financiero antes de pedir una hipoteca: la guía paso a paso (2026)",
    category: "Hipotecas",
    readingTime: "15 min",
    keyword: "cómo preparar perfil financiero hipoteca",
    excerpt: "Antes de buscar piso, necesitas preparar tu perfil financiero. Los bancos usan algoritmos estrictos que van mucho más allá del sueldo.",
    metaDescription: "Antes de buscar piso, prepara tu perfil financiero. Los bancos usan algoritmos que van más allá del sueldo. Te explico qué revisan exactamente.",
    content: `## El error que comete la mayoría antes de pedir una hipoteca

Antes de buscar piso, conviene preparar tu perfil financiero: los bancos analizan tu comportamiento económico con algoritmos de scoring que van más allá del sueldo, así que entender qué revisan de antemano puede marcar la diferencia entre que te aprueben la hipoteca o no.\n\nAbrir Idealista o Fotocasa. Enamorarse de un piso. Llamar para visitar. Negociar el precio. Y después, sentarse con el banco.

Ese orden es el más común. Y también es el más caro.

Porque si el banco te dice que no —o te ofrece condiciones peores de las que mereces— ya habrás invertido semanas de ilusión, tiempo y energía en una operación que no tenía base sólida.

> Antes de enamorarte de un piso, necesitas enamorar al banco. Y para eso, hay que prepararse.

Hoy los bancos no aprueban hipotecas por empatía ni por la relación con el director de sucursal. Lo hacen mediante algoritmos de scoring que analizan tu comportamiento financiero al milímetro. Conocer esas reglas de antemano puede marcar la diferencia entre aprobar o denegar tu operación.

## 1. Tolerancia cero con la morosidad

Este es el punto que más sorprende a mis clientes. Creen que un buen sueldo compensa cualquier imperfección en su historial. No es así.

Los sistemas de scoring bancario analizan tu comportamiento de pago con una precisión que va más allá de lo que la mayoría imagina. Un retraso puntual en el pago de un recibo de luz, una letra que se devolvió aunque fuera por un error bancario, un préstamo pequeño pagado con retraso hace años... cualquiera de estos elementos puede generar una señal de alerta que complique la aprobación del expediente, dependiendo de la entidad y del resto de tu perfil.

Para el algoritmo, pagar mal o tarde tiene solo dos interpretaciones posibles: que tu economía está ajustada o que tienes mala disciplina financiera. Ninguna de las dos es una buena carta de presentación ante un banco que va a prestarte cientos de miles de euros.

> **Acción previa:** revisa tus domiciliaciones y asegúrate de que ningún recibo ha quedado pendiente en los últimos 24 meses. Si tienes algún apunte negativo en ASNEF o en ficheros de morosidad, resuélvelo antes de iniciar el proceso.

## 2. Lo que tus nóminas cuentan de ti (más de lo que crees)

Los analistas de riesgos no se limitan a mirar el neto que cobras a final de mes. Leen tu nómina como si fuera un informe completo de tu situación económica real.

Dos elementos concretos que disparan alarmas inmediatas:

- **Anticipos de sueldo:** si has pedido un anticipo a tu empresa, el banco lo interpreta como que vas económicamente muy ajustado ante cualquier imprevisto. Es una señal de vulnerabilidad financiera que puede pesar mucho en la decisión.
- **Embargos en nómina:** cualquier embargo reflejado en tu nómina —incluso por algo aparentemente menor como una multa de tráfico no pagada— suele ser un factor muy negativo para la mayoría de entidades, y puede complicar seriamente la operación.

La recomendación es clara: durante los seis meses previos a solicitar una hipoteca, mantén una nómina limpia, sin movimientos que puedan interpretarse como señales de tensión económica.

## 3. La CIRBE: el informe que el banco siempre consulta

La Central de Información de Riesgos del Banco de España (CIRBE) recoge todos tus préstamos, créditos y tarjetas con saldo dispuesto superior a 1.000 euros. Es el primero de los documentos que cualquier entidad consultará antes de evaluar tu operación.

Hay tres errores frecuentes que arruinan operaciones hipotecarias perfectamente viables:

1. **Olvidar avales del pasado:** es muy habitual que los clientes aseguren no tener deudas, sin recordar que hace diez o quince años avalaron la compra del coche de un familiar. Ese aval sigue en tu CIRBE y reduce drásticamente tu capacidad real de endeudamiento.
2. **Pedir un préstamo personal justo antes de firmar:** algunos compradores solicitan un crédito para pagar muebles o gastos de la mudanza pocas semanas antes de la firma. Si el banco vuelve a consultar la CIRBE el día de la firma ante notario y detecta ese nuevo crédito, la operación puede quedar denegada de forma definitiva.
3. **Microcréditos y créditos de tarjetas:** si estás acostumbrado a solicitarlos y, al pedir la hipoteca, tienes varias deudas pequeñas, los bancos interpretan que tienes problemas de liquidez, sobreendeudamiento o malos hábitos financieros. Además de perjudicar tu ratio de endeudamiento.

> **Acción previa:** solicita tu informe CIRBE en el Banco de España (es gratuito y puedes hacerlo online). Revísalo con calma antes de iniciar ningún proceso. Cualquier sorpresa es mejor descubrirla tú antes que el banco.

## 4. Tu contrato de trabajo importa más de lo que imaginas

No todos los contratos estables se evalúan de la misma manera. El algoritmo hace distinciones importantes:

- **Contrato indefinido ordinario:** el perfil más favorable. Cuanta más antigüedad en la empresa, mejor.
- **Contrato fijo discontinuo:** muchos bancos exigen un mínimo de 18 meses de antigüedad continuada para considerarlo como ingreso estable. Nunca programes la firma de tu hipoteca durante tu período de inactividad: el banco pedirá tu vida laboral actualizada antes de la firma ante notario y, si constas como desempleado, la operación puede caer.
- **Contratos temporales recientes:** generan incertidumbre en el scoring. Si llevas menos de dos años en tu empresa actual, el proceso puede ser más difícil o requerir condiciones adicionales.

## 5. Tus ingresos tienen que ser oficiales y demostrables al 100%

La normativa hipotecaria vigente en España exige que la financiación se conceda basándose exclusivamente en ingresos justificables documentalmente ante Hacienda.

### Alquileres como fuente de ingresos

Si tienes pisos en alquiler, el banco no sumará lo que cobras bruto cada mes. Aplicará el rendimiento neto que declaras en tu IRPF. Si tras restar gastos deducibles —seguros, reparaciones, amortizaciones— el rendimiento neto queda en cero o negativo, esos ingresos no te servirán para calcular tu capacidad de pago.

## La lupa especial del banco sobre los autónomos

Si eres trabajador por cuenta propia, las reglas del juego cambian. El banco no mira lo que entra en tu cuenta: mira lo que declaras a Hacienda.

### Autónomos en estimación directa

Al banco no le importa tu facturación bruta. Le importa tu rendimiento neto declarado. Si facturas 170.000 € al año pero deduces gastos elevados y tu beneficio neto se queda en 15.000 €, el banco calculará tu viabilidad sobre esos 15.000 €.

Revisarán con detalle tu declaración de la renta y tus modelos trimestrales (modelo 130) para comprobar la consistencia de tus ingresos durante al menos los dos últimos años.

### Autónomos por módulos

Los profesionales que tributan por módulos (taxistas, comerciantes, agricultores…) declaran un rendimiento oficial fijo que suele estar muy por debajo de sus ingresos reales. Esa diferencia los convierte en perfiles complicados para los algoritmos automáticos de la banca online. Tu mejor opción suele ser la banca tradicional, donde el gestor tiene margen para evaluar tu perfil de forma global.

### Autónomos societarios

Muchos socios o gerentes creen que, al asignarse una nómina mensual, el banco los tratará como empleados. No suele ser así: para la mayoría de analistas, sigues siendo autónomo a efectos de la operación, y algunas entidades pueden exigir una trayectoria más larga al frente de tu empresa —a menudo en torno a tres años—, con cuentas anuales que demuestren estabilidad y capacidad de pago sostenida.

## El paso previo que todo comprador inteligente da primero

Antes de visitar un solo piso, antes de hablar con ninguna inmobiliaria, reúne toda tu documentación financiera —nóminas de los últimos seis meses, declaración de la renta de los dos últimos años, vida laboral e informe CIRBE— y siéntate con alguien que te ayude a hacer un diagnóstico real de tu capacidad hipotecaria.

Ese diagnóstico te dirá tres cosas: cuánto puedes pedir, a qué condiciones puedes aspirar y qué aspectos de tu perfil conviene mejorar antes de iniciar el proceso formal.

> Un comprador informado no pierde el tiempo con viviendas o bancos que no encajan con su perfil. Llega a las negociaciones con ventaja.

**¿Quieres saber si tu perfil está listo para una hipoteca en 2026? Escríbeme y hacemos juntos ese diagnóstico previo. Es gratuito, sin compromiso y puede ahorrarte meses de proceso.**`,
    sources: [{ label: "Banco de España", url: "https://www.bde.es" }],
    updatedAt: "31 de agosto de 2026",
  },
];

const fincasPosts: Omit<BlogPost, "service">[] = [
  {
    slug: "conflictos-comunidad-propietarios-como-cortarlos",
    title: "Los 5 conflictos que más veces destruyen la convivencia en una comunidad (y cómo se cortan a tiempo)",
    category: "Convivencia y gestión",
    readingTime: "6 min",
    keyword: "conflictos comunidad de propietarios",
    excerpt: "El ruido de las 23:00, la sombrilla que siempre ocupa la misma tumbona, el vecino que lleva meses sin pagar. Los cinco conflictos que más se repiten en las comunidades, y por qué casi todos tienen solución antes de llegar a un juzgado.",
    metaDescription: "Los cinco conflictos que más deterioran la convivencia en tu comunidad: ruidos, zonas comunes, impagos, roces y falta de mantenimiento. Cómo cortarlos a tiempo.",
    content: `## El ruido de las 23:00, la sombrilla de siempre, la cuota que no llega

Los cinco conflictos que más deterioran la convivencia en una comunidad de propietarios son los ruidos, el uso de zonas comunes, los impagos, los roces personales entre vecinos y la falta de mantenimiento.\n\nNinguno de estos problemas empieza siendo grave. Todos pueden acabar siéndolo si nadie los gestiona a tiempo.

Estos son los cinco conflictos que más se repiten en las comunidades de propietarios, y el motivo por el que casi siempre tienen solución antes de llegar a un juzgado.

## 1. Ruidos

Música, fiestas, actividad diaria a horas intempestivas. Es la queja más habitual en cualquier comunidad, y también la más fácil de convertir en una guerra fría entre vecinos si no hay una norma clara sobre horarios y un canal establecido para reportarlo.

## 2. Uso de las zonas comunes

Piscina, jardín, salón de usos múltiples, garaje. Cuando no está claro quién puede usar qué y en qué condiciones, cada propietario aplica su propio criterio, y ahí empieza la fricción.

## 3. Impagos de cuotas

No es solo un problema entre dos vecinos: afecta a toda la comunidad, porque compromete el mantenimiento, las mejoras y los servicios que todos pagan. Cuanto más tarde se gestiona un impago, más difícil resulta recuperarlo y más tensión genera entre quienes sí pagan puntualmente.

## 4. Conflictos personales

A veces no hay ni ruido ni impago de por medio. Solo diferencias de carácter, malentendidos o historias acumuladas entre vecinos que llevan años compartiendo edificio. Este tipo de conflicto es el más difícil de resolver con normativa, porque no es un problema de reglas, es un problema de relación.

## 5. Falta de mantenimiento

Fachadas, zonas comunes o instalaciones que se van deteriorando por falta de decisión o de fondos. Los propietarios que ven cómo se deprecia su patrimonio suelen ser los primeros en encender la mecha del conflicto.

## Por qué casi todos estos conflictos tienen algo en común

Ninguno de los cinco se resuelve "hablándolo" en el rellano. Se resuelven con tres cosas: normativa clara, mediación activa y gestión diligente. Y ahí es donde entra la figura del administrador de fincas.

**Normativa clara.** Los Estatutos y el Reglamento de Régimen Interno son los documentos que anticipan estos conflictos antes de que ocurran: qué horario tiene la piscina, qué se considera ruido excesivo, cómo se reparte el uso del salón de usos múltiples. Un administrador con experiencia no redacta estas normas de forma genérica, las adapta a los conflictos reales que ya existen o son previsibles en esa comunidad concreta.

**Mediación activa.** Cuando el conflicto ya existe, alguien tiene que ponerse en medio sin tomar partido. Esa es una de las funciones menos visibles y más importantes del administrador: facilitar la comunicación entre vecinos, y entre propietarios y proveedores de servicios, antes de que un malentendido se convierta en una disputa formal.

**Gestión diligente de la morosidad.** Los recordatorios a tiempo y, si hace falta, el inicio ágil de los procedimientos legales, no son solo un trámite administrativo. Son lo que protege la estabilidad financiera de la comunidad y la sensación de equidad entre quienes cumplen con sus obligaciones.

## La idea con la que quedarte

Ningún edificio con varias familias está libre de tensiones. La diferencia entre una comunidad que convive bien y una que se desgasta en conflictos constantes casi nunca está en la suerte que tuvieron con los vecinos. Está en si alguien gestionó esos conflictos con normativa clara y a tiempo, antes de que se convirtieran en un problema personal entre las partes.

**En HiloLegal ayudamos a comunidades de propietarios a redactar y actualizar sus Estatutos y Reglamentos de Régimen Interno, y a gestionar los conflictos y la morosidad con procedimientos ágiles y legalmente sólidos.**`,
  },
  {
    slug: "estatutos-comunidad-propietarios-que-dicen",
    title: "¿Sabes qué dicen los estatutos de tu comunidad? La mayoría de propietarios, no.",
    category: "Normativa de comunidades",
    readingTime: "6 min",
    keyword: "estatutos comunidad de propietarios",
    excerpt: "Casi nadie los lee hasta que hay un problema. Y para entonces ya es tarde para decidir las reglas: solo queda cumplirlas o pelearlas. Qué son los estatutos y por qué muchas comunidades ni siquiera los tienen.",
    metaDescription: "Los estatutos deciden, antes de cualquier conflicto, quién usa qué, quién paga qué y cómo se decide en tu comunidad. Qué son, qué regulan y cómo se actualizan.",
    content: `## El documento que casi nadie lee hasta que hay un problema

Los estatutos son el documento que decide, antes de que surja cualquier conflicto, quién puede usar qué, quién paga qué y cómo se toman las decisiones en tu edificio. Entender cómo funcionan no es un tecnicismo para abogados: es la diferencia entre anticiparte a un problema o sufrirlo.

Vamos a desglosarlo.

## El dato que sorprende a la mayoría: muchas comunidades no tienen estatutos

La mayoría de comunidades de propietarios no dispone de estatutos propios. Se constituyeron, empezaron a funcionar, y nunca llegaron a redactar ni aprobar este documento.

¿Significa eso que esas comunidades funcionan sin ninguna regla? No. Significa que, a falta de estatutos propios, se rigen únicamente por lo que marca la Ley de Propiedad Horizontal de forma supletoria. Es decir: por defecto, no por decisión propia.

La diferencia es importante. Sin estatutos, la comunidad pierde la posibilidad de adaptar las normas a su realidad concreta: no puede establecer, por ejemplo, restricciones específicas sobre el alquiler turístico, usos particulares de las zonas comunes, o mayorías reforzadas para determinadas decisiones, salvo que lo haga a través de otros acuerdos que suelen ser más frágiles y más fáciles de impugnar que unos estatutos correctamente inscritos.

Tener estatutos no es un lujo de comunidades "muy organizadas". Es la herramienta que te permite decidir tus propias reglas, en lugar de heredar únicamente las que la ley prevé para todos por igual.

## 1. Definen quién puede usar qué (y en qué condiciones)

El portal, el garaje, la piscina, el jardín, la zona deportiva: todo espacio compartido tiene, o debería tener, su uso regulado en los estatutos.

¿Puede un propietario alquilar su plaza de garaje a alguien externo a la comunidad? ¿Hay horario para la piscina? ¿Se puede usar el local social para un evento privado? La respuesta no está en el sentido común de cada vecino, está en el documento que todos aceptaron al comprar su vivienda.

Cuando esto no está claro, no hay "buena convivencia" que lo arregle. Hay discusión.

## 2. Reparten las obligaciones, no solo los derechos

Los estatutos no solo dicen qué puedes usar. Dicen qué debes aportar:

- Cómo se calcula tu parte de los gastos comunes.
- Si estás obligado a asistir o puedes delegar tu voto en las juntas.
- Cómo se elige a la junta directiva y cómo se aprueban las decisiones importantes.
- Qué mantenimiento corresponde a cada propietario y cuál es responsabilidad colectiva.

Esta parte es la que más sorprende a los propietarios: muchas obligaciones que se dan por sentadas ("eso lo paga la comunidad", "eso lo arregla el vecino de abajo") en realidad están escritas en blanco y negro, y no siempre dicen lo que todos asumen.

## 3. Marcan cómo se resuelve un conflicto antes de que llegue a los tribunales

Ningún edificio con varias familias está libre de desacuerdos. La diferencia entre una comunidad que gestiona sus conflictos y una que se rompe por ellos suele estar en si los estatutos contemplan, o no, un procedimiento claro: mediación, votación, plazos, mayorías necesarias.

Sin ese marco, cada disputa se convierte en un pulso personal. Con él, se convierte en un procedimiento a seguir.

## 4. No son estáticos: también se pueden actualizar

Una comunidad de hace veinte años no tiene las mismas necesidades que una de hoy. Nuevos usos de los espacios, cambios normativos, instalaciones que no existían cuando se redactaron los estatutos originales.

Por eso, un buen documento de estatutos incluye también el procedimiento para modificarlos: qué mayoría se necesita, cómo se propone un cambio, cómo se formaliza.

## La idea con la que quedarte

Los estatutos no son papeleo de trámite. Son el acuerdo que evita que la convivencia dependa de la buena voluntad de cada vecino en cada momento.

**En HiloLegal ayudamos a comunidades a revisar sus estatutos, resolver dudas de interpretación y actualizarlos cuando ya no se ajustan a la realidad del edificio.**`,
  },
  {
    slug: "senales-cambiar-administrador-de-fincas",
    title: "Las señales que indican que tu comunidad necesita cambiar de administrador de fincas",
    category: "Administración de fincas",
    readingTime: "5 min",
    keyword: "cambiar administrador de fincas",
    excerpt: "Preguntas que se quedan sin respuesta, incidencias que se acumulan, cuentas que nadie termina de entender. Las cinco señales que más se repiten antes de un cambio de administrador.",
    metaDescription: "Las cinco señales de que tu comunidad necesita cambiar de administrador: comunicación, incidencias, tecnología, transparencia y estancamiento.",
    content: `## Ninguna señal por separado, pero las cinco juntas

Las señales más claras de que una comunidad necesita cambiar de administrador de fincas son: mala comunicación, incidencias sin seguimiento, falta de herramientas digitales, poca transparencia en las cuentas y estancamiento en la gestión año tras año.\n\nLlevas semanas esperando una respuesta a una incidencia sencilla. Nadie te explica en qué se ha ido el dinero de la última derrama. Y cada junta se parece sospechosamente a la anterior, sin que nada mejore de verdad.

Ninguna de estas señales, por separado, parece motivo suficiente para cambiar de administrador. Juntas, sí lo son. Te contamos las cinco que más se repiten.

## 1. Preguntas que se quedan sin respuesta clara

Un presidente de comunidad escribe. Pasan días. La respuesta, cuando llega, no aclara nada. Esto no es un detalle menor: si tu administrador no comunica con claridad y en tiempos razonables, cada decisión de la comunidad se toma con información incompleta.

La comunicación no es un extra de cortesía. Es la base para que la comunidad pueda decidir con criterio.

## 2. Incidencias que se acumulan sin resolverse

Una gotera que tarda meses en gestionarse. Un ascensor averiado sin seguimiento claro. Una consulta administrativa que se pierde entre correos. Cuando esto se convierte en la norma y no en la excepción, no es mala suerte: es un servicio que ya no está a la altura de lo que la comunidad necesita.

## 3. Cero tecnología, toda la gestión a mano

Portales para consultar cuotas, incidencias reportadas y resueltas con seguimiento, comunicación por canales ágiles: esto ya no es innovación, es el estándar. Si tu administrador sigue gestionando la comunidad como si fuera 2010, cada gestión te va a costar más tiempo y más fricción de la necesaria.

## 4. Cuentas que nadie termina de entender

¿Sabes exactamente en qué se ha gastado el dinero de tu comunidad este trimestre? Si la respuesta es "más o menos", hay un problema. Una gestión financiera seria significa informes claros, accesibles y detallados, no un resumen genérico una vez al año.

La falta de transparencia no siempre es mala intención. A veces es simple desorganización. Pero el efecto sobre la confianza de los propietarios es el mismo.

## 5. La sensación de que nada cambia

Las mismas quejas, la misma junta, los mismos problemas sin resolver, año tras año. Un buen administrador no se limita a mantener el statu quo: busca de forma activa cómo mejorar la gestión, optimizar costes y elevar la calidad de vida de la comunidad. Si tu comunidad lleva tiempo estancada, probablemente no sea un problema de los vecinos. Es un problema de gestión.

## Cambiar de administrador no es un drama, es una decisión de gestión

Muchas comunidades aguantan años con un servicio mediocre por miedo al cambio: pensar que el proceso será complicado, que se perderá continuidad, que "mejor malo conocido". En la práctica, el cambio de administrador es un procedimiento con pasos claros y plazos definidos, y bien gestionado, no genera ninguna disrupción para la comunidad.

Lo que sí tiene coste es quedarse con un administrador que no comunica, no resuelve, no informa y no mejora.

**En HiloLegal gestionamos comunidades con comunicación directa, tecnología que simplifica cada gestión, transparencia financiera total y un compromiso activo con la mejora continua. Si alguna de estas cinco señales te suena familiar, es buen momento para hablar.**`,
  },
];

const legalPosts: Omit<BlogPost, "service">[] = [
  {
    slug: "separacion-o-divorcio-diferencias",
    title: "Separación o divorcio: la pregunta que casi todo el mundo confunde",
    category: "Derecho de familia",
    readingTime: "5 min",
    keyword: "diferencia entre separación y divorcio",
    excerpt: "\"Nos vamos a separar\" y \"nos vamos a divorciar\" se usan como si fueran lo mismo. Legalmente, no lo son. Y confundirlos puede llevarte a elegir un camino que no es el que realmente buscas.",
    metaDescription: "Separación y divorcio no son lo mismo legalmente. Qué los diferencia, sus efectos sobre matrimonio y reconciliación, y cómo elegir el camino correcto.",
    content: `## Dos palabras que se usan igual y no lo son

"Nos vamos a separar" y "nos vamos a divorciar" se usan como si fueran lo mismo. Legalmente, no lo son. Y confundirlos puede llevarte a elegir un camino que no es el que realmente buscas.

Vamos a aclararlo sin rodeos.

## Separación: tomas distancia, pero el vínculo sigue vivo

La separación judicial permite a una pareja casada dejar de convivir sin disolver el matrimonio. Puede pedirse de mutuo acuerdo o de forma unilateral por uno de los cónyuges.

Lo que la define:

- Seguís legalmente casados. Por tanto, no podéis contraer un nuevo matrimonio mientras la separación esté vigente.
- Es reversible. Si hay reconciliación, es posible retomar la convivencia conyugal sin necesidad de volver a casaros.

Es, en cierto modo, una puerta que se cierra pero no se sella.

## Divorcio: la ruptura que no tiene marcha atrás

El divorcio disuelve el matrimonio de forma definitiva. A diferencia de la separación, libera a ambas partes del vínculo legal, permitiendo que cada una pueda volver a casarse si lo desea. Puede tramitarse por mutuo acuerdo o de forma contenciosa, según el nivel de entendimiento entre las partes.

Lo que lo define:

- Es irreversible. Una vez dictada la sentencia, ya no estáis casados. No hay vuelta atrás sin pasar por un nuevo matrimonio.
- No hay "periodo de prueba". Es una decisión definitiva, no una pausa.

## ¿Y los efectos legales? Se parecen, pero no son iguales

Custodia de los hijos, pensión de alimentos, liquidación de bienes comunes: tanto la separación como el divorcio regulan estos aspectos. La diferencia está en el trasfondo: la separación mantiene ciertos derechos y obligaciones propios del matrimonio, mientras que el divorcio los extingue de forma definitiva.

Esto significa que dos parejas pueden firmar acuerdos con contenido similar en custodia o pensión, pero con un estatus civil completamente distinto al final del proceso.

## Entonces, ¿cuál elegir?

No hay una respuesta única, hay una pregunta que responder primero: ¿buscas distancia con posibilidad de reconciliación, o quieres cerrar esta etapa por completo?

Si existe la posibilidad de que la relación se reconduzca, o simplemente no estás preparado para dar el paso definitivo, la separación ofrece ese margen. Si tienes claro que el matrimonio ha terminado y quieres recuperar tu libertad civil, incluyendo la posibilidad de volver a casarte, el camino es el divorcio.

## La idea con la que quedarte

Separación y divorcio no son sinónimos legales, son dos decisiones distintas con consecuencias distintas. Elegir sin entender bien esa diferencia puede salirte caro, en tiempo, en trámites y en cómo queda regulada tu situación personal y patrimonial.

**En HiloLegal analizamos tu caso concreto para ayudarte a decidir qué proceso se ajusta realmente a lo que necesitas, y te acompañamos en cada paso para que tus derechos queden protegidos de forma justa.**`,
  },
  {
    slug: "reclamar-indemnizacion-por-danos",
    title: "Reclamar una indemnización por daños: por qué \"tener razón\" no basta",
    category: "Responsabilidad civil",
    readingTime: "5 min",
    keyword: "reclamar indemnización por daños",
    excerpt: "En un juzgado no gana quien tiene razón, gana quien puede demostrarla. Lo que realmente determina si una reclamación por daños y perjuicios prospera o se queda por el camino.",
    metaDescription: "Reclamar una indemnización por daños y perjuicios exige algo más que tener razón: prueba sólida, estrategia procesal y una cuantificación del daño con rigor.",
    content: `## Tener razón es el punto de partida, no la garantía

Mucha gente llega a una reclamación de daños convencida de que con contar lo que pasó es suficiente. La realidad es más exigente: en un juzgado no gana quien tiene razón, gana quien puede demostrarla.

Esto es lo que realmente determina si una reclamación por daños y perjuicios prospera o se queda por el camino.

## 1. La prueba: el verdadero campo de batalla

Quien reclama tiene que demostrar tres cosas, no una: que el daño existió, que fue consecuencia de la conducta de la otra parte, y cuánto vale exactamente ese perjuicio.

No basta con decir "me hicieron daño". Hay que traer informes médicos, peritajes, testimonios de expertos y toda la documentación que sostenga cada una de esas tres afirmaciones. Cuanto más sólida y específica sea esa prueba, más difícil es para la otra parte discutirla.

## 2. Antes del juzgado: negociación y mediación

No toda reclamación tiene que acabar en un litigio largo. Muchas veces, sentar a las partes con un tercero imparcial que facilite el diálogo permite llegar a un acuerdo justo en semanas, en lugar de en años.

No es un paso "de segunda categoría" frente a demandar. Es, en muchos casos, la vía más rápida hacia el mismo resultado: una reparación justa del daño sufrido.

## 3. Lo que pasa dentro del proceso también decide el resultado

Una vez en el juzgado, no todo se juega en la sentencia final. Las decisiones que toma el juez durante el proceso —qué pruebas admite, si acuerda medidas cautelares, qué hechos considera controvertidos— condicionan directamente hacia dónde se inclina el caso.

Por eso la forma en que se presentan los argumentos en cada audiencia importa tanto como el argumento en sí. Un caso bien fundamentado puede perder fuerza si no se defiende bien en cada uno de estos momentos previos a la sentencia.

## 4. Poner precio al daño: la parte más delicada

Cuantificar un daño no es un cálculo simple. Hay elementos objetivos, como la pérdida de ingresos o los gastos médicos, y elementos más difíciles de traducir en números, como el sufrimiento causado.

Aquí es donde más reclamaciones se quedan cortas: piden una indemnización mal calculada, sin el respaldo pericial necesario, y el tribunal termina reconociendo mucho menos de lo que el daño realmente valía.

## La idea con la que quedarte

Tener razón es el punto de partida, no la garantía de nada. Lo que realmente determina el resultado de una reclamación por daños es la solidez de la prueba, la estrategia dentro y fuera del juzgado, y una cuantificación del daño hecha con rigor, no a ojo.

**En HiloLegal preparamos cada reclamación con ese nivel de exigencia: prueba bien construida, estrategia procesal clara y una valoración económica del daño que resista cualquier discusión.**`,
  },
  {
    slug: "custodia-compartida-que-valora-un-juez",
    title: "Custodia compartida: lo que de verdad valora un juez (y lo que no)",
    category: "Derecho de familia",
    readingTime: "6 min",
    keyword: "custodia compartida requisitos",
    excerpt: "\"Pedimos custodia compartida al 50%, así que nos la tienen que dar.\" Es una de las ideas más extendidas en una primera consulta de familia, y casi siempre equivocada.",
    metaDescription: "La custodia compartida no se gana por pedirla ni se pierde por no pedirla al 50%. Qué valora un juez y los dos mitos que más confunden a los progenitores.",
    content: `## "Nos tienen que dar la compartida": el mito más extendido

"Pedimos custodia compartida al 50%, así que nos la tienen que dar." Es una de las frases que más veces se oye en una primera consulta de familia. Y es, casi siempre, una idea equivocada.

La custodia compartida ya es el régimen más habitual en España: se concede en torno a la mitad de los divorcios con hijos menores. Pero que sea el modelo preferente no significa que se conceda automáticamente ni que dependa de lo que pidan los progenitores. Depende de lo que un juez considere mejor para el menor.

## No es un derecho de los padres

La custodia compartida se decide en función del interés superior del menor, no del interés de cada progenitor en repartirse el tiempo al 50%. El Tribunal Supremo lo dejó claro desde 2013: este régimen debe considerarse "normal o incluso deseable" siempre que sea posible, pero esa posibilidad se valora caso por caso.

## Lo que realmente mira un juez

- **Implicación previa en el día a día.** Quién se ha ocupado hasta ahora de los coles, las citas médicas, las actividades extraescolares y la organización cotidiana de los hijos. Un progenitor que empieza a implicarse justo cuando llega la separación parte con desventaja frente a quien ya lo venía haciendo.
- **Proximidad de domicilios.** Si vivir en dos casas implica cambios de colegio, desplazamientos largos o inestabilidad social para el menor, eso juega en contra de la custodia compartida.
- **Capacidad de comunicación entre los progenitores.** Un conflicto constante y la incapacidad de coordinarse en cuestiones básicas del menor es una de las razones más habituales para descartarla.
- **Informe de los equipos psicosociales.** En los procesos con conflicto entre las partes, este informe suele ser la prueba que más pesa en la decisión final.

## El segundo mito: "si pido compartida, no pago pensión"

Este es el error más caro. La custodia compartida no elimina automáticamente la pensión de alimentos. Si existe una diferencia relevante de ingresos entre los progenitores, sigue siendo habitual fijar una pensión a cargo de quien tiene mayor capacidad económica. Plantear la custodia compartida como estrategia para dejar de pagar suele ser contraproducente: se detecta, y resta credibilidad ante el juez.

## Lo que no es definitivo

El régimen de custodia fijado en una sentencia no es inamovible. Si se produce un cambio relevante y duradero en las circunstancias —un traslado de domicilio, una variación importante de horarios laborales, un cambio en las necesidades del menor— es posible solicitar una modificación de medidas.

## La idea con la que quedarte

La custodia compartida no se gana por pedirla ni se pierde por no pedirla al 50%. Se decide en función de hechos concretos: quién se ha implicado, dónde vive cada uno, cómo se comunican los progenitores y qué necesita realmente el menor. Plantear el proceso desde esa realidad, y no desde lo que "debería tocar", es lo que marca la diferencia en la sentencia.

**En HiloLegal preparamos cada caso de familia analizando qué criterios juegan a tu favor y cuáles hay que reforzar antes de llegar a la vista.**`,
    sources: [{ label: "Consejo General del Poder Judicial", url: "https://www.poderjudicial.es" }],
    updatedAt: "31 de agosto de 2026",
  },
  {
    slug: "pension-de-alimentos-como-se-calcula",
    title: "Pensión de alimentos: cómo se calcula de verdad (y cuándo puede cambiar)",
    category: "Derecho de familia",
    readingTime: "6 min",
    keyword: "cómo se calcula la pensión de alimentos",
    excerpt: "\"¿Cuánto me va a tocar pagar?\" Es la pregunta que más rápido llega en cualquier consulta de divorcio con hijos. Y la respuesta incómoda es: no hay una tabla fija que lo diga con exactitud.",
    metaDescription: "La pensión de alimentos no tiene fórmula fija: depende de las necesidades de los hijos y la capacidad económica de cada progenitor. Cuándo se puede modificar.",
    content: `## No hay una fórmula automática

"¿Cuánto me va a tocar pagar?" Es la pregunta que más rápido llega en cualquier consulta de divorcio con hijos. Y la respuesta incómoda es: no hay una tabla fija que lo diga con exactitud. Hay un análisis.

La pensión de alimentos se determina en función de dos variables: las necesidades reales de los hijos y la capacidad económica de cada progenitor. Existen tablas orientativas del Consejo General del Poder Judicial que ayudan a estimar un rango, pero la cuantía final depende de un análisis individualizado: ingresos, gastos fijos, patrimonio, número de hijos y régimen de custodia.

Por eso dos familias con ingresos similares pueden acabar con pensiones distintas: lo que cambia es todo lo demás.

## ¿Y si hay custodia compartida? ¿Desaparece la pensión?

No necesariamente. Cuando los tiempos de convivencia y los ingresos de ambos progenitores son similares, es habitual que cada uno asuma los gastos ordinarios durante sus periodos de convivencia, sin pensión cruzada. Pero si hay una diferencia relevante de ingresos, o si uno de los progenitores asume más gastos directos, sigue siendo frecuente fijar una pensión a cargo del que tiene mayor capacidad económica, aunque la custodia sea compartida al 50%.

## Cuándo se puede modificar

La pensión no es un número fijo para siempre. Se puede pedir su modificación cuando se produce un cambio de circunstancias que cumple estos requisitos:

- Es objetivo y demostrable (una nómina, un despido, un informe médico).
- Es sustancial, no una simple incomodidad económica.
- No ha sido buscado a propósito para reducir la pensión.
- Tiene vocación de permanencia, no es algo puntual o transitorio.

Ejemplos habituales: pérdida del empleo, una bajada salarial relevante, una enfermedad que aumenta los gastos del menor, o el paso de custodia monoparental a compartida.

Un matiz importante: el nacimiento de nuevos hijos del progenitor que paga la pensión no es, por sí solo, motivo suficiente para reducirla. Así lo ha establecido el Tribunal Supremo.

## Lo que no puedes hacer nunca

Dejar de pagar por tu cuenta porque consideras que tu situación ha cambiado. Mientras no exista una nueva resolución judicial o un acuerdo homologado, la pensión vigente sigue siendo exigible. El impago reiterado, además, puede tener consecuencias penales.

Lo correcto es presentar cuanto antes una demanda de modificación de medidas, acompañada de la documentación que acredite el cambio. Cuanto antes se presente, antes se resuelve, y la nueva cuantía suele aplicarse desde la fecha de la demanda, no desde que se dicta la sentencia.

## La idea con la que quedarte

La pensión de alimentos no se calcula "a ojo" ni se cambia por decisión unilateral de quien paga. Se fija con criterios objetivos y se modifica solo con un cambio real y acreditado de circunstancias, siempre por la vía judicial correcta.

**En HiloLegal analizamos si tu situación actual justifica una modificación de medidas y te acompañamos en todo el proceso para que la nueva pensión refleje tu realidad económica real.**`,
    sources: [{ label: "Consejo General del Poder Judicial", url: "https://www.poderjudicial.es" }],
    updatedAt: "31 de agosto de 2026",
  },
  {
    slug: "herencia-entre-hermanos-sin-acuerdo",
    title: "Herencia entre hermanos sin acuerdo: opciones antes de llegar a juicio",
    category: "Sucesiones y herencias",
    readingTime: "5 min",
    keyword: "herencia entre hermanos sin acuerdo",
    excerpt: "Cuando varios herederos no se ponen de acuerdo sobre un piso, una cuenta o un negocio familiar, hay varias opciones antes de llegar a juicio: la partición de mutuo acuerdo, el contador-partidor, la mediación familiar y, como último recurso, la división judicial.\n\nUn piso, una cuenta corriente, un negocio familiar. Y varios hermanos que no se ponen de acuerdo en qué hacer con nada de eso. Las vías que conviene agotar antes de pensar en un juicio.",
    metaDescription: "Un desacuerdo entre herederos no tiene que acabar en los tribunales. Partición de mutuo acuerdo, contador-partidor, mediación y división judicial: las opciones.",
    content: `## Cuando el reparto se atasca

Un piso, una cuenta corriente, un negocio familiar. Y varios hermanos que no se ponen de acuerdo en qué hacer con nada de eso. Es una de las situaciones más comunes en derecho de sucesiones, y también una de las que más tiempo, dinero y relaciones familiares puede destruir si se gestiona mal desde el principio.

Antes de pensar en un juicio, hay varias vías que conviene agotar.

## 1. La partición de mutuo acuerdo, aunque no haya acuerdo total todavía

Muchos herederos asumen que si no están de acuerdo en todo, no hay nada que hacer salvo litigar. No es así. Es posible cerrar acuerdos parciales: repartir lo que sí genera consenso y dejar solo lo conflictivo para una vía específica de resolución, en lugar de bloquear toda la herencia por un único bien en disputa.

## 2. La figura del contador-partidor

Cuando los herederos no consiguen ponerse de acuerdo en cómo dividir los bienes, se puede nombrar un contador-partidor: una persona (puede ser designada por el testador, por los propios herederos, o por el juez) que realiza el reparto de forma técnica y equilibrada, incluso sin unanimidad previa.

Su partición, una vez aprobada, tiene un peso legal que puede evitar directamente el litigio.

## 3. La mediación familiar

En conflictos hereditarios, muchas veces lo que está en juego no es solo el valor económico del bien, sino una historia familiar de fondo: quién cuidó a los padres, quién se sintió menos valorado, quién teme perder algo simbólico, no solo material.

Un mediador no decide por las partes, pero facilita que la conversación se centre en intereses reales y no en posiciones enrocadas. En muchos casos, esto permite llegar a un acuerdo en semanas que, por la vía judicial, habría tardado años.

## 4. La división judicial de la herencia, como último recurso

Cuando ninguna de las vías anteriores funciona, queda la división judicial: un procedimiento en el que es el juzgado quien decide cómo repartir los bienes. Es la opción más lenta, la más cara, y la que con más frecuencia deja heridas familiares que no se cierran con la sentencia.

No es la vía a evitar por sistema, pero sí conviene tratarla como el último paso, no como el primero.

## Lo que casi nadie tiene en cuenta a tiempo

Cuanto más tiempo pasa sin resolver el reparto, más se complica: los bienes generan gastos (impuestos, mantenimiento, comunidad), las posturas se endurecen, y en el caso de inmuebles, puede llegar a bloquearse su venta o uso durante años. Actuar pronto, con asesoramiento, casi siempre sale más barato que esperar a que el desacuerdo se convierta en litigio.

## La idea con la que quedarte

Un desacuerdo entre herederos no tiene que acabar automáticamente en los tribunales. Entre "estar de acuerdo en todo" y "juicio" hay varias vías intermedias, y la mayoría de herencias conflictivas se resuelven en alguna de ellas.

**En HiloLegal ayudamos a familias a encontrar la vía más rápida y menos desgastante para resolver un reparto complicado, valorando cada caso antes de recomendar litigar.**`,
  },
  {
    slug: "desahucios-cuanto-tarda-y-errores",
    title: "Desahucios: cuánto tarda de verdad y los errores que lo alargan aún más",
    category: "Arrendamientos",
    readingTime: "6 min",
    keyword: "cuánto tarda un desahucio",
    excerpt: "\"En un mes lo tengo fuera.\" Es lo que muchos propietarios esperan cuando un inquilino deja de pagar. La realidad, en la mayoría de los juzgados españoles, es muy distinta.",
    metaDescription: "Un desahucio por impago suele tardar entre 6 y 12 meses. Cómo funciona el proceso y los errores más comunes, del propietario y del inquilino, que lo alargan.",
    content: `## "En un mes lo tengo fuera": la expectativa que no coincide con la realidad

"En un mes lo tengo fuera." Es lo que muchos propietarios esperan cuando un inquilino deja de pagar. La realidad, en la mayoría de los juzgados españoles, es muy distinta: la duración media de un desahucio por impago se mueve entre 6 y 12 meses, y en algunos partidos judiciales puede prolongarse bastante más.

Conocer los plazos reales, y los errores que los alargan, es lo que marca la diferencia entre resolver la situación en tiempo razonable o quedar atrapado en ella durante más de un año.

## Cómo funciona el proceso, paso a paso

1. **Requerimiento de pago.** Antes de ir a juzgado, lo habitual es enviar un burofax reclamando la deuda, normalmente con un plazo de unos 30 días para pagar.
2. **Demanda de desahucio.** Si no hay pago, se presenta la demanda, que suele combinar la resolución del contrato, el desalojo y la reclamación de las rentas debidas.
3. **Admisión y notificación.** El juzgado admite la demanda y notifica al inquilino. Este trámite, dependiendo de la carga del juzgado, puede tardar varios meses por sí solo.
4. **Oposición o allanamiento.** Si el inquilino se opone, hay vista y sentencia, lo que alarga considerablemente el proceso. Si no se opone, el trámite es más rápido.
5. **Lanzamiento.** Ejecución del desalojo, una vez firme la resolución.

## Los errores más comunes por parte del propietario

- Esperar demasiado para actuar. Cuanta más deuda se acumula antes de reclamar, más larga y compleja se vuelve la situación, y más difícil resulta recuperar lo debido.
- No formalizar bien el requerimiento previo. Un burofax mal redactado o sin acuse de recibo puede debilitar la demanda posterior.
- No prever la enervación. El inquilino puede detener el desahucio pagando toda la deuda antes de la vista, salvo que ya haya usado antes ese mismo recurso en el contrato. Muchos propietarios se sorprenden cuando esto ocurre en el último momento.
- No contar con seguro o cobertura legal. Los costes de abogado, procurador y el tiempo sin cobrar renta pueden suponer un impacto económico relevante si el proceso se alarga.

## Los errores más comunes por parte del inquilino

- No responder a las notificaciones. Ignorar el burofax o la demanda no detiene el proceso, solo hace que llegue a su fase final sin haber explorado ninguna alternativa.
- No acreditar una situación de vulnerabilidad a tiempo. Cuando existen menores o personas vulnerables en la vivienda, la ley permite valorar esa situación y, en algunos casos, suspender temporalmente el lanzamiento, pero hay que alegarlo y acreditarlo dentro del proceso, no después.
- Dejar pasar el plazo para pagar y frenar el desahucio. Existe una ventana de tiempo para regularizar la deuda antes de la vista. Una vez pasada, esa opción desaparece.

## La idea con la que quedarte

Un desahucio no se gana ni se pierde en el último mes, se define en las primeras semanas: cómo se formaliza el requerimiento, cuándo se actúa, y qué documentación se aporta desde el principio. Tanto para el propietario que quiere recuperar su vivienda cuanto antes, como para el inquilino que necesita tiempo o quiere regularizar su situación, la diferencia está en moverse pronto y con la estrategia correcta.

**En HiloLegal gestionamos desahucios tanto desde la posición del propietario como del inquilino, buscando siempre la vía más rápida y menos costosa para cada caso.**`,
    sources: [{ label: "Consejo General del Poder Judicial", url: "https://www.poderjudicial.es" }],
    updatedAt: "31 de agosto de 2026",
  },
  {
    slug: "cancelacion-antecedentes-penales",
    title: "Antecedentes penales: cuándo se cancelan de verdad (y por qué no se borran solos)",
    category: "Derecho penal",
    readingTime: "5 min",
    keyword: "cancelación de antecedentes penales",
    excerpt: "\"Ya cumplí mi condena hace años, ¿por qué me lo siguen pidiendo?\" Los antecedentes penales no desaparecen automáticamente por el simple paso del tiempo. Hay que solicitarlo.",
    metaDescription: "Los antecedentes penales no se cancelan solos: hay plazos según la gravedad de la pena, requisito de no reincidencia y solicitud ante el Ministerio de Justicia.",
    content: `## "Ya cumplí mi condena, ¿por qué me lo siguen pidiendo?"

"Ya cumplí mi condena hace años, ¿por qué me lo siguen pidiendo?" Es una pregunta habitual, y la respuesta sorprende a mucha gente: los antecedentes penales no desaparecen automáticamente por el simple paso del tiempo. Hay que solicitarlo.

## Los plazos no son iguales para todos los casos

El artículo 136 del Código Penal establece plazos distintos según la gravedad de la pena, que van desde 6 meses hasta 10 años sin volver a delinquir. Cuanto más grave la condena, más largo el plazo de espera antes de poder pedir la cancelación.

Ese plazo empieza a contar desde que la pena queda extinguida por completo, no desde la fecha de la sentencia. Esto incluye haber cumplido también la responsabilidad civil derivada del delito (indemnizaciones, multas pendientes), no solo la pena principal.

## El requisito que más gente pasa por alto: no volver a delinquir

Durante todo el plazo de espera, la persona no puede cometer ningún nuevo delito. Si lo hace, el cómputo se interrumpe y vuelve a empezar desde cero. Es uno de los motivos más frecuentes por los que una solicitud de cancelación se deniega o se retrasa mucho más de lo esperado.

## La cancelación no es automática

Aunque se haya cumplido el plazo correspondiente, los antecedentes no desaparecen solos del registro. Es necesario presentar una solicitud formal ante el Ministerio de Justicia, con la documentación que acredite que se cumplen todos los requisitos. El plazo máximo para resolver esta solicitud es de tres meses.

Un matiz importante: aunque la cancelación formal todavía no se haya tramitado, si ya se cumplen los requisitos, jueces y tribunales no deberían tener en cuenta esos antecedentes a efectos de una nueva causa. En la práctica, sin embargo, tener la cancelación formalizada evita muchísimos problemas.

## Qué cambia en el día a día cuando se cancelan

Los antecedentes cancelados dejan de aparecer en el certificado de antecedentes penales, el documento que se pide para:

- Determinados procesos de selección de empleo público o privado.
- Oposiciones y ciertas profesiones reguladas.
- Trámites de extranjería y permisos de residencia.
- Solicitudes de nacionalidad.

A efectos prácticos, y salvo excepciones muy concretas, es como si la condena no constara. No es lo mismo, sin embargo, en procedimientos judiciales posteriores muy específicos, donde la reincidencia sí puede seguir teniéndose en cuenta según el tipo de delito.

## La idea con la que quedarte

Cumplir la condena es solo el primer paso. Sin la solicitud de cancelación, esos antecedentes pueden seguir apareciendo indefinidamente y condicionando oportunidades laborales o trámites administrativos, incluso años después de haber pagado ya por completo con la justicia.

**En HiloLegal revisamos si ya cumples los plazos y requisitos para solicitar la cancelación, y tramitamos todo el procedimiento para evitar retrasos por errores de documentación.**`,
    sources: [{ label: "BOE", url: "https://www.boe.es" }, { label: "Ministerio de Justicia", url: "https://www.mjusticia.gob.es" }],
    updatedAt: "31 de agosto de 2026",
  },
  {
    slug: "antes-de-firmar-un-documento-legal",
    title: "Antes de firmar cualquier documento legal, hazte estas 3 preguntas",
    category: "Derecho civil",
    readingTime: "4 min",
    keyword: "qué mirar antes de firmar un contrato",
    excerpt: "La mayoría de problemas legales no nacen de una mala intención de nadie. Nacen de una firma puesta con prisa, sin hacerse antes las preguntas correctas.",
    metaDescription: "Tres preguntas que hacerte siempre antes de firmar un documento legal: si entiendes lo que aceptas, qué pasa si sale mal, y a qué precio puedes salir.",
    content: `## Los problemas legales casi nunca empiezan con mala intención

Antes de firmar cualquier documento legal, hazte tres preguntas: ¿entiendes de verdad lo que estás aceptando?, ¿qué pasa si algo sale mal?, y ¿puedes salir de esto, y a qué precio?\n\nLa mayoría de problemas legales que llegan a un despacho no nacen de una mala intención de nadie. Nacen de una firma puesta con prisa, sin hacerse antes las preguntas correctas.

No hace falta ser abogado para evitarlo. Hace falta hacerse estas tres preguntas, siempre, antes de firmar.

## 1. ¿Entiendo de verdad lo que estoy aceptando, o solo lo doy por hecho?

Firmar un documento no debería ser un acto de fe hacia quien te lo entrega. Si hay una cláusula que no entiendes, una palabra técnica que no sabrías explicar a otra persona, o una condición que "seguro que es lo normal", ese es exactamente el punto que hay que aclarar antes de firmar, no después.

La firma es la prueba de que aceptaste el contenido. Una vez puesta, alegar que "no lo entendí" rara vez sirve de defensa.

## 2. ¿Qué pasa si algo sale mal?

Casi todos los documentos se leen pensando en el escenario bueno: el préstamo se paga sin problemas, el alquiler dura lo previsto, el negocio funciona. La pregunta que de verdad protege es la contraria: ¿qué dice este documento si las cosas no salen como esperas?

Penalizaciones, plazos de resolución, garantías exigidas, qué ocurre en caso de impago o incumplimiento. Es la parte que casi nadie lee con atención, y la que determina cuánto te cuesta un imprevisto.

## 3. ¿Puedo salir de esto si cambio de opinión, y a qué precio?

Todo documento legal debería responder, aunque sea implícitamente, a esta pregunta: si en seis meses quiero deshacer esto, ¿puedo hacerlo?, ¿en qué plazo?, ¿con qué coste o penalización?

Muchas cláusulas de permanencia, comisiones de cancelación anticipada o periodos de preaviso solo se descubren cuando ya es tarde para evitarlas, precisamente porque nadie preguntó por ellas al principio.

## Lo que de verdad marca la diferencia

Estas tres preguntas no requieren conocimientos jurídicos. Requieren el hábito de no firmar nada por costumbre, cortesía o presión de tiempo. Cuando la respuesta a cualquiera de ellas te genera dudas, esa es la señal de que conviene una revisión legal antes de firmar, no después de que el problema ya exista.

**En HiloLegal revisamos contratos y documentos antes de que los firmes, no solo cuando ya han generado un problema. Cuesta menos una revisión previa que una defensa posterior.**`,
  },
];

const mortgagePosts: Omit<BlogPost, "service">[] = [
  {
    slug: "subrogacion-hipotecaria-cambiar-de-banco",
    title: "La subrogación hipotecaria",
    category: "Hipotecas",
    readingTime: "3 min",
    keyword: "subrogación hipotecaria",
    excerpt: "Llevas años pagando la misma hipoteca y no has vuelto a mirar el mercado ni una sola vez. Muy pocas familias saben que pueden cambiar de banco sin pedir permiso al suyo.",
    metaDescription: "La subrogación hipotecaria te permite cambiar de banco sin pedir permiso al tuyo. Cómo funciona y qué plazo tiene tu banco para reaccionar.",
    content: `## Llevas años pagando la misma hipoteca y no la has vuelto a mirar

La subrogación hipotecaria es el mecanismo que te permite cambiar tu hipoteca a otro banco sin necesitar el permiso del tuyo actual, cancelando la hipoteca original y abriendo una nueva con mejores condiciones en la entidad de destino.\n\nLlevas 6 años pagando la misma hipoteca. Y no has vuelto a mirar el mercado ni una sola vez.

La mayoría de familias hace esto: firma la hipoteca, respira aliviada, y no vuelve a tocar el tema durante años. Como si esa decisión, tomada en un momento concreto, tuviera que ser la misma para siempre.

Pero el mercado cambia. Y tu hipoteca no tiene por qué quedarse quieta con él.

## Lo que muy pocas familias saben que pueden hacer

**Puedes cambiar tu hipoteca a otro banco, sin pedir permiso al tuyo.** Se llama subrogación hipotecaria. Si otro banco te ofrece mejores condiciones (menos interés, otro tipo de cuota, otro plazo), puedes trasladar tu hipoteca allí. La decisión es tuya, no de tu banco actual.

**No tienes que hacer tú todo el papeleo.** Es el banco nuevo quien se encarga de la mayor parte de las gestiones: tasación, notaría, registro. Tu parte del trabajo es mucho más pequeña de lo que la gente imagina.

**Tu banco actual tiene 15 días para reaccionar.** En cuanto le comunicas que tienes una oferta mejor en otro banco, tiene ese plazo para intentar igualarla. Si lo hace, ganas sin moverte. Si no lo hace, te vas y ganas igual.

## Un caso real

Hace poco ayudé a una familia que llevaba con la misma hipoteca desde que compraron su piso. Nunca se habían planteado revisarla. Con la subrogación, consiguieron mejorar sus condiciones y ahorrar varios miles de euros en lo que les quedaba de préstamo.

Lo único que hicieron distinto fue preguntar.

## La idea con la que quedarte

Revisamos el seguro del coche cada año buscando algo mejor. La hipoteca, que suele ser el gasto más grande de toda una familia, casi nadie la vuelve a mirar.

¿Cuándo fue la última vez que comprobaste si tu hipoteca sigue siendo la mejor opción para tu familia?`,
  },
  {
    slug: "ahorros-parados-en-el-banco-autonomos",
    title: "¿Por qué estás perdiendo dinero al tener todos tus ahorros en el banco?",
    category: "Ahorro para autónomos",
    readingTime: "3 min",
    keyword: "ahorro parado en el banco autónomos",
    excerpt: "\"Prefiero tenerlo todo en el banco, por si acaso.\" Es la frase que más veces escucho en una primera auditoría con un autónomo. Y es, casi siempre, la decisión que más dinero le está costando.",
    metaDescription: "Tener todo el ahorro parado en cuenta corriente tiene un coste real: pierde poder adquisitivo cada año. La liquidez para imprevistos no es tenerlo todo parado.",
    content: `## "Prefiero tenerlo todo en el banco, por si acaso"

Tener todos tus ahorros parados en el banco tiene un coste real: pierdes poder adquisitivo cada año frente a la inflación. Tener liquidez para imprevistos no es lo mismo que tener todo el dinero parado sin ninguna estrategia.

"Prefiero tenerlo todo en el banco, por si acaso." Es la frase que más veces escucho en una primera auditoría con un autónomo. Y es, casi siempre, la decisión que más dinero le está costando sin que se dé cuenta.

Vamos a hacer el número, no la teoría.

## El número: 40.000 € parados durante 10 años

Un autónomo con 40.000 € ahorrados, todo en cuenta corriente, durante 10 años.

Ese dinero no desaparece. Pero pierde poder adquisitivo cada año que pasa, porque la inflación sigue subiendo mientras esos 40.000 € se quedan exactamente igual.

En una cuenta remunerada o un producto de ahorro sencillo, incluso a un interés modesto, esos mismos 40.000 € generarían varios miles de euros en una década. Ese dinero no aparece de la nada. Aparece porque alguien decidió que ese ahorro trabajara, en lugar de dormir.

## La diferencia no es el riesgo. Es el desconocimiento

Muchos autónomos evitan mover su dinero porque piensan que "invertir" significa bolsa, riesgo, perder el control. Pero antes de hablar de invertir, hay un paso previo que casi nadie da: sacar el ahorro de una cuenta que no hace nada por él.

Tener liquidez para imprevistos es imprescindible. Tenerlo todo parado, no.

## La idea con la que quedarte

Si llevas años acumulando ahorro sin moverlo, la pregunta no es si deberías invertir. Es cuánto te está costando cada año no haberlo revisado.`,
  },
];

export const blogPosts: BlogPost[] = [
  ...financialPosts.map((p) => ({ ...p, service: "josecarlos" as const })),
  ...mortgagePosts.map((p) => ({ ...p, service: "josecarlos" as const })),
  ...legalPosts.map((p) => ({ ...p, service: "veronica" as const })),
  ...fincasPosts.map((p) => ({ ...p, service: "fincas" as const })),
];

export const findPost = (slug: string) => blogPosts.find((p) => p.slug === slug);
