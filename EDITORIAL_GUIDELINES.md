# EDITORIAL_GUIDELINES.md

Guía de voz y rigor editorial para todo el contenido publicado en hilolegal.es (páginas comerciales, blog, formularios). Creado el 31/08/2026 a partir de la "Fase final de optimización" — se actualiza cuando cambie el criterio, nunca en silencio.

---

## 1. Voz HiloLegal

Precisión, autoridad, sobriedad, claridad, cercanía, experiencia, transparencia.

- **Precisión**: cada cifra, plazo o porcentaje debe poder atribuirse a una fuente concreta o marcarse explícitamente como ejemplo/hipótesis.
- **Autoridad**: se construye mostrando criterio y experiencia real, no adjetivos ("líder", "el mejor") ni cargos enumerados.
- **Sobriedad**: sin superlativos, sin signos de exclamación en titulares, sin lenguaje de infoproducto.
- **Claridad**: frases cortas, una idea por frase, sin tecnicismo innecesario sin explicar.
- **Cercanía**: se habla directamente al lector ("tú"), pero sin familiaridad forzada.
- **Experiencia**: se apoya en casos y razonamiento profesional, no en promesas de resultado.
- **Transparencia**: cuando algo depende de condiciones, normativa vigente o de la entidad, se dice explícitamente — no se generaliza.

## 2. Qué evitar siempre

- Exageraciones y superlativos no verificables.
- Urgencia artificial ("el momento es ahora", "no esperes más").
- Lenguaje de infoproducto/gurú financiero (miedo, culpa, clickbait).
- Promesas absolutas o interpretables como garantía de resultado.
- Comparar con "todo el mercado" cuando en realidad se compara con un número acotado de entidades.

## 3. Norma vs. experiencia vs. opinión

Antes de publicar una afirmación legal o financiera, clasifícala:

| Tipo | Qué es | Cómo se presenta |
|---|---|---|
| A. Norma o dato oficial | Está en el BOE, en una web oficial (AEAT, Seguridad Social, Banco de España, INE) | Se cita la fuente, enlazando a la home oficial del organismo — nunca una URL profunda inventada |
| B. Criterio habitual de mercado | Lo hacen "algunas entidades" o "suele ser así", pero no es ley | Se usa lenguaje como "algunas entidades pueden...", "es habitual que...", nunca como regla universal |
| C. Experiencia profesional | Viene de casos gestionados por José Carlos o Verónica | Se presenta como experiencia propia, no como estadística ("en los casos que gestiono suelo ver...") |
| D. Opinión / interpretación | Valoración personal sobre una tendencia o situación | Se marca como tal, nunca se disfraza de dato |

**Nunca presentar B, C o D como si fueran A.**

## 4. Uso de fuentes

- El componente `ArticleSources` (`src/components/ArticleSources.tsx`) muestra "Fuentes consultadas" al final de un artículo, **solo cuando el post declara `sources` reales** en `blogPosts.ts` (campo opcional `ArticleSource[]`).
- Los enlaces van siempre a la home pública del organismo (p. ej. `https://www.seg-social.es`, `https://www.boe.es`, `https://www.bde.es`, `https://sede.agenciatributaria.gob.es`), nunca a una URL profunda que podamos no controlar si cambia.
- No se fabrican fuentes. Si no hay una fuente real que respalde una afirmación de tipo A, se reformula como B, C o D, o se elimina.
- El campo opcional `updatedAt` en `BlogPost` (fecha en formato "31 de agosto de 2026") solo se rellena cuando el contenido ha sido efectivamente revisado en esa fecha — nunca se inventa una fecha de revisión.

## 5. Tratamiento de la experiencia institucional de Verónica

La experiencia institucional de Verónica López constituye un activo profesional relevante y puede comunicarse como experiencia en alta dirección pública, gestión institucional, elaboración y aplicación normativa y conocimiento interno de la Administración. En páginas comerciales generales no enumerar cargos políticos o institucionales concretos salvo instrucción expresa. El objetivo es reforzar autoridad jurídica sin introducir asociaciones ideológicas innecesarias.

En la práctica:

- **No usar**: "Directora General de...", "Subsecretaria de...", "Diputada...", "Concejala...", "Teniente de alcalde...".
- **Usar en su lugar**: "Experiencia en alta dirección de la Administración Pública", "Responsabilidades institucionales en distintos niveles de la Administración", "Experiencia en gestión pública y elaboración normativa", "Más de dos décadas combinando ejercicio jurídico, experiencia institucional y docencia universitaria".
- La experiencia está documentada y no debe tratarse como dudosa — lo que se revisa es el **tono**, no el hecho. Ejemplo: "he dirigido esa maquinaria por dentro" → "he trabajado desde dentro de la Administración y conozco cómo se tramitan los procedimientos y cómo se toman las decisiones".
- Esta regla aplica a la comunicación comercial general. Si en el futuro se decide crear una sección de currículum específica con cargos concretos, requiere instrucción expresa del cliente.

## 6. Criterios específicos para artículos financieros/legales

- Nunca prometer rentabilidad garantizada de forma genérica — si un producto concreto tiene una garantía real (p. ej. un Plan Garantizado de Inversión), la cifra se atribuye a **ese producto**, nunca como característica de una categoría entera (p. ej. "los SIALP dan hasta el X%" cuando el X% pertenece a otro producto).
- SIALP: no usar "sin impuestos", "exención fiscal total" ni "rentabilidad garantizada" como afirmación genérica. La exención depende de cumplir los requisitos legales vigentes — decirlo así, citando Agencia Tributaria/BOE cuando se detalla el régimen.
- CIRBE: explicar qué es, qué contiene, cómo la usan las entidades y qué datos proceden del Banco de España — nunca presentarla como un sistema de scoring automático sin fuente acreditada.
- Incapacidad temporal: distinguir siempre contingencias comunes de accidente de trabajo/enfermedad profesional — las cuantías y plazos difieren. Citar Seguridad Social como fuente.
- Jubilación: no afirmar que "el sistema está diseñado para no dejarte en la calle" ni equivalentes — la pensión pública no garantiza mantener el nivel de ingresos previo. Citar Seguridad Social para cifras concretas.
- Ejemplos numéricos con rentabilidad asumida (p. ej. una proyección a 30 años) deben declarar explícitamente la hipótesis usada ("asumiendo una rentabilidad media del X% anual, sin garantía") para que no se lean como promesa fuera de contexto.

## 7. CTAs y sistema de intención

Los CTAs no usan "Diagnóstico" como palabra genérica en toda la web — es específica del área patrimonial ("Diagnóstico patrimonial"). El CTA genérico de contacto es "Enviar consulta".

El sistema de intención (`INTENTS`/`IntentKey`/`onSelectIntent` en `josecarlos.tsx`) existe para que cada CTA fije el `topic` correcto antes de llegar al formulario. Antes de crear un formulario o CTA nuevo, comprobar si puede resolverse dentro de este sistema existente en vez de duplicar lógica.

## 8. Actualizar esta guía

Cuando el cliente dé una instrucción nueva sobre tono, fuentes o algún área sensible (p. ej. el perfil de Verónica), se añade aquí como sección nueva fechada — no se sobrescribe el criterio anterior sin dejar constancia de qué cambió y por qué.
