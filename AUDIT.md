# AUDIT.md — Transformación integral HiloLegal

Registro de la transformación de diseño/UX/CRO/SEO iniciada a partir del brief de 42 secciones. Todo el trabajo descrito aquí está en el árbol de trabajo local, **sin commitear ni desplegar a GitHub** hasta revisión y aprobación.

## Stack y arquitectura (punto de partida)

- **Framework**: TanStack Start (React + Vite + Nitro), desplegado en Cloudflare Workers, auto-deploy en push a `main`.
- **Rutas**: file-based (`src/routes/`) — home (`index.tsx`), `veronica.tsx`, `josecarlos.tsx`, blog (`blog.tsx`/`blog.index.tsx`/`blog.$slug.tsx`), `sitemap[.]xml.ts` como server route.
- **Estilos**: un sistema de variables CSS compartido (`--jch-*`) en `src/styles.css`, con Tailwind utility classes mezcladas en el JSX. Cada página tiene componentes `Curtain`/`FadeUp`/`WordReveal` duplicados localmente (no compartidos), y una clase de scope propia (`.hilolegal-original`, `.veronica-original`, `.josecarlos-original`) para pines específicos de página.
- **Animación**: Framer Motion en toda la web.
- **Analítica**: GTM + GA4 instalados en `__root.tsx` (fase previa a este proyecto).
- **Formularios**: `submitContact` server function; validación básica en cliente.
- **Imágenes**: WebP en `public/`, mayormente ya comprimidas (<250KB) tras una limpieza anterior.

## Deuda técnica y riesgos detectados antes de tocar nada

- `Curtain`/`FadeUp`/`WordReveal` están triplicados (uno por página) en vez de ser componentes compartidos — no los he consolidado en este pase para no arriesgar romper las 3 páginas a la vez; queda como oportunidad de refactor.
- `src/services-art.css` quedó huérfano: las clases que estilaba (`.services-editorial__card--with-art`, `.service-card__art`) ya no se usan tras rediseñar la sección de áreas de la home. Archivo pequeño, no rompe nada, pero es peso muerto — candidato a borrar.
- `serviciosJC.webp` (collage original que subiste para las fotos de servicios) sigue en `public/` sin usarse — mismo caso.
- Tres testimonios en `josecarlos.tsx` (Ana M. / Marcos R. / Familia López) tienen pinta de contenido de relleno anterior a este proyecto, no de reseñas verificadas — ver `CONTENT_REVIEW.md` punto 2.

## Cambios realizados en esta transformación

### Home (`index.tsx`) — reconstrucción completa
Arquitectura reordenada a 11 bloques: Hero → Cuatro áreas (portales grandes) → Concepto → Verónica × José Carlos → Prueba y autoridad → Método → Herramientas → Contenido (blog) → CTA final → Footer completo.

- **Hero**: copy nuevo exacto del brief, CTA doble (primario + "Ver servicios").
- **Cuatro áreas**: de tarjetas pequeñas a portales editoriales grandes (foto de fondo, numeración, kicker, tags, CTA), reordenadas Legal → Hipotecas → Patrimonio → Fincas.
- **Sección "Para quién trabajamos" eliminada** (Familias/Autónomos/Empresas/Propietarios) — no forma parte de la nueva arquitectura de 11 bloques. **Se perdió con ella la frase de "Autónomos" que se había reescrito en la sesión anterior a este proyecto** — pendiente de decidir si se reintegra en otro punto de la home.
- **Cifra "1200+ personas ayudadas" retirada** — no pude verificarla y el brief prohíbe mostrar cifras dudosas como ciertas. Los stats visibles ahora son solo "20+ años", "4 áreas" y "Altea" (ubicación).
- **Verónica × José Carlos**: de bios largas a un split editorial corto (nombre, área, una frase, CTA) + elemento "Jurídico × Patrimonial".
- **Sección de contenido (blog)** nueva: 3 posts recientes con categoría y CTA.
- **Footer**: de un footer mínimo a columnas completas (Servicios, Profesionales, Recursos, Contacto) — 12 enlaces internos nuevos con valor de enlazado SEO.
- **Header**: nav simplificado a Servicios/Profesionales/Herramientas/Blog/Contacto; CTA principal cambiado de "WhatsApp" a "Cuéntanos qué necesitas" (WhatsApp se mantiene, reubicado dentro de la sección de contacto para no perder ese canal).

### José Carlos (`josecarlos.tsx`) — reestructuración
- Los 3 pilares **PROTEGER / FINANCIAR / PLANIFICAR** ahora explícitos justo después del hero (reetiquetado de la sección "Diagnosis" ya existente, que ya tenía esa estructura de fondo).
- **Administración de fincas separada** de la rejilla de servicios financieros — ahora es su propia sección visualmente distinta (fondo `--jch-surface`, sin foto, formato lista en vez de tarjeta), situada al final antes del footer, tal como pide el brief ("no debe competir visualmente con ahorro, inversión, seguros, hipotecas, salud").
- **"Sobre mí" adelantado** antes de la rejilla de servicios (asesoramiento antes que soluciones).
- **Sección de herramientas añadida**, enlazando a las 2 calculadoras reales que ya existían.
- **Claim "hasta el 100% de financiación" retirado** del copy visible de la tarjeta de hipotecas y de la `description`/`makesOffer` del JSON-LD — el copy visible y los datos estructurados ahora dicen lo mismo.

### Verónica (`veronica.tsx`) — reestructuración
- Los 6 módulos de servicios (antes tarjetas con texto largo continuo) ahora son un **acordeón accesible**: primer párrafo visible (~35-90 palabras según el módulo), botón "Leer más"/"Leer menos" con `aria-expanded`/`aria-controls` correctos, panel con `role="region"` y `aria-labelledby`. Verificado interactivamente que abre/cierra.
- CTA cambiado de "Consultar" a "Cuéntanos tu caso" (CTA contextual, como pide el brief).
- **og:image/twitter:image añadidos** — su página compartía la foto de la home hasta ahora.

### SEO técnico
- **Canonical unificado a www** en las 4 rutas (home, José Carlos, Verónica, blog + posts) — antes contradecían al sitemap, que ya usaba www desde una corrección anterior.
- **Barra final del canonical de José Carlos** unificada con el resto (sin barra, como Verónica y blog).
- **Redirect 301** de `/quienes-somos` (URL de la marca anterior "Hidalgo & López", todavía indexada por Google, devolvía 404) a la home. Ver `SEO_REDIRECTS.md`.

### Documentación creada
- `AUDIT.md` (este archivo).
- `CONTENT_REVIEW.md` — 5 afirmaciones financieras que necesitan validación humana antes de darlas por buenas.
- `SEO_REDIRECTS.md` — metodología y la única URL antigua confirmada hasta ahora.

## Decisiones de diseño (ronda 5 — resueltas por el cliente)

- **Paleta ocre-única: HECHO.** Los 40 usos de teal (`#1f6f78`) en los 6 archivos que lo tenían se sustituyeron por ocre (`#C5A566`). Donde el patrón por defecto→hover era teal→ocre, el hover pasó a un ocre más oscuro (`#9c7d4a`) para que siga habiendo cambio visible al pasar el ratón — sustituir sin más habría dejado botones sin ningún feedback de hover. Encontré y corregí 2 colisiones que un simple find-replace habría dejado rotas: `.duo-block__cta:hover` y `.pros__cta:hover` apuntaban a `var(--jch-accent)`, que ahora es igual al color por defecto — las cambié a `var(--jch-ink)` en el hover, igual que ya hacían el resto de CTA de texto del sitio. `--jch-accent-2` en el sistema de variables ahora vale lo mismo que `--jch-accent`. Verificado: build limpio, color por defecto confirmado por computed style (`rgb(197,165,102)`), reglas de hover confirmadas en el CSS compilado.
- **Foto conjunta de José Carlos y Verónica**: confirmado que no hace falta recuperarla.
- **Fotografía de "Legal"** (`legal.webp`) sigue mostrando mazo/balanza de justicia — el brief pide evitarlo pero no hay foto de repuesto. Sigue pendiente.
- **Administración de fincas**: el cliente pidió página propia con arquitectura completa (`/administracion-fincas` + 4 subpáginas). Brief detallado recibido — ver sección "Fincas" más abajo para el estado de esta pieza, es la más grande que queda pendiente.

## Reseñas y testimonios — resuelto (ronda 5)

- 2 reseñas reales de Google (Cristian Llopis, SRG — ambas sobre trabajo de Verónica) añadidas a la página de Verónica, con `Review`/`reviewRating` en el JSON-LD de su `LegalService`. No se añadió `aggregateRating` — solo tengo estas 2 reseñas puntuales, no la media/total real de su perfil de Google, y ponerlo sin saberlo sería inventar un dato.
- Los 3 testimonios de José Carlos (Ana M., Marcos R., Familia López) — confirmados como contenido de relleno no verificado — **se eliminaron** en vez de dejarlos. No tengo reseñas reales específicas de José Carlos todavía; su sección de testimonios queda sin renderizar (componente y sección quitados del `<main>`, no solo ocultos) hasta que existan.

## Analítica — estado (ronda 2)

Implementado `src/lib/analytics.ts`: helper centralizado que empuja al dataLayer de GTM con un set cerrado de nombres de evento (`AnalyticsEvent` como union type, no strings sueltos). Conectado y **verificado en vivo con un click real** (no solo compilación):
- `nav_service_legal/mortgage/wealth/property` — los 4 portales de la home.
- `cta_legal/mortgage/wealth/property` — CTAs de servicio en las 3 páginas.
- `tool_wealth_audit`/`tool_financial_health` — las 2 calculadoras (home y José Carlos).
- `blog_article_click` — tarjetas de blog (home y `/blog`).
- `contact_start` (primer campo tocado)/`contact_submit` (envío correcto) — los 3 formularios de contacto.

## Formularios — estado (ronda 2, sección 23)

Los 3 formularios de contacto (home, José Carlos, Verónica) pedían Nombre + Teléfono + Email, los tres obligatorios. Se dejó **Email como opcional** en los tres (Nombre + Teléfono siguen siendo obligatorios — es el contacto más rápido, y ya es el único obligatorio en el formulario de la home). El campo Mensaje ya era opcional en los tres; se etiquetó explícitamente "(opcional)" para que quede claro sin tener que probarlo.

**Ronda 4 — implementado**: el formulario de José Carlos ahora muestra 4 campos adicionales (precio vivienda, financiación aproximada, ingresos, situación laboral) **solo cuando se elige "Nueva Hipoteca"** en el desplegable — progressive disclosure, no un formulario/modal aparte. Verificado interactivamente que aparecen y desaparecen correctamente al cambiar el desplegable.

Detalle técnico importante: estos 4 campos **no se envían como columnas nuevas** al webhook de Google Sheets — se incorporan al campo `message` ya existente antes de enviar. El motivo: el servidor que recibe el formulario (`contact.functions.ts`) reenvía a un Google Apps Script externo cuyo mapeo de columnas no puedo verificar desde aquí; añadir claves JSON nuevas arriesgaba que se perdieran en silencio. Metiéndolas en `message` (un campo de texto que el sheet ya captura de forma fiable) garantizo que el dato llega, aunque no como columna separada. Si quieres columnas propias en el Sheet, hay que tocar el Apps Script — decímelo si tienes acceso a él.

## Accesibilidad — estado (ronda 2)

Hecho en este pase: el acordeón de Verónica sigue el patrón WCAG de disclosure (botón real, `aria-expanded`, `aria-controls`, `role="region"`, `aria-labelledby`). Un único `<h1>` por página en las 3 páginas reestructuradas (verificado). Landmarks `header`/`main`/`footer` únicos por página (verificado en Verónica).

**Nuevo en esta ronda**:
- **Focus ring de teclado global**: no existía ningún `:focus-visible` personalizado — el sitio dependía por completo del outline por defecto del navegador. Añadida una regla global (`outline: 2px solid var(--jch-accent)`), verificada con una pulsación de Tab real (no solo `.focus()` por JS, que no dispara `:focus-visible` de forma fiable). Los inputs de formulario tienen `focus:outline-none` de Tailwind con mayor especificidad, así que siguen mostrando solo su indicador de color de borde existente — no se tocó, es una mejora menor pendiente si se quiere unificar.
- **Objetivo táctil del footer**: los enlaces del footer nuevo medían ~20px de alto (por debajo del mínimo). Añadido padding vertical a cada enlace — ahora ~41.6px, dentro del AA de WCAG 2.2 (24×24 mínimo) y muy cerca del AAA recomendado (44×44).

**Sigue sin hacer**: auditoría WCAG 2.2 AA completa con herramienta real (Lighthouse/axe), navegación por teclado exhaustiva en las 3 páginas, prueba con lector de pantalla real, indicador de foco reforzado en los inputs de formulario.

## Rendimiento — estado

No se ha ejecutado Lighthouse ni ninguna medición formal de Core Web Vitals — no tengo esa herramienta disponible aquí. Los cambios de esta transformación no añaden JS pesado nuevo (mismos primitivos de animación reutilizados, mismas dependencias); el bundle de Framer Motion/React Router sigue siendo el mismo tamaño que en la auditoría anterior (~384KB / ~650KB sin comprimir). No se ha tocado la carga de fuentes.

## Limpieza de deuda técnica (ronda 3)

- **`src/altea-image.css` eliminado por completo.** Su única regla apuntaba a `.trust-block__body::after` (la foto conjunta `josecarlos_veronica.webp` que se veía en la sección "Decisiones importantes" de la home). Al eliminar `TrustBlock()` en la reconstrucción de la home, ese elemento del DOM dejó de existir y la regla quedó huérfana. **Aviso explícito**: esto significa que esa foto conjunta de José Carlos y Verónica ya no aparece en ningún sitio de la web. No la reintroduje porque el nuevo bloque "Concepto" del brief pide mantenerse corto y ya tiene su propia imagen (`nosotros_cliente.webp`) — pero si querías conservar esa foto conjunta en algún punto, dímelo y la reincorporo.
- Reglas `.trust-block__*` eliminadas de `styles.css` y `services-art.css` (mismo motivo — el componente que las usaba ya no existe).
- Reglas `#audiencia h2 .jch-accent` y `.services-editorial__card--with-art`/`.service-card__art` eliminadas de `services-art.css` (secciones "Para quién trabajamos" y las tarjetas pequeñas de "Áreas" ya no existen desde la reconstrucción de la home).
- Verificado que nada se rompió: build limpio, y comprobé en vivo que `.position-block__media` (sigue usada) y el hero (`main > section:first-child`, sigue usado) renderizan igual que antes.
- **No tocado todavía**: `public/serviciosJC.webp` (el collage original que subiste) sigue sin usarse — no lo borro sin que lo confirmes explícitamente, ya que es un archivo que subiste tú, no algo que yo generé.

## Pendientes (de las 42 secciones del brief, lo que queda)

- Página propia de Administración de fincas (si se decide que sea independiente).
- Auditoría WCAG 2.2 AA completa con herramienta real (Lighthouse/axe).
- Paso de rendimiento con Lighthouse / medición de Core Web Vitals reales.
- Formulario cualificado específico de hipoteca (sección 23) — falta decidir dónde vive en la UI.
- Indicador de foco reforzado en los inputs de formulario (hoy solo cambio de color de borde).
- Consolidar `Curtain`/`FadeUp`/`WordReveal` en componentes compartidos (deuda técnica, no visual).
- Limpiar `src/services-art.css` y `public/serviciosJC.webp` si se confirma que no hacen falta.
- Reseñas reales (bloqueado, pendiente de que las pases).
- Confirmar los 5 puntos de `CONTENT_REVIEW.md`.
- Decisión de paleta ocre-única vs. teal+ocre.
