# SEO_REDIRECTS.md

Migración de URLs antiguas (marca previa "Hidalgo & López") a la estructura actual de HiloLegal.

## Metodología

No tengo acceso a Google Search Console ni a logs de servidor de este dominio, así que esta lista **no es exhaustiva** — se basa en lo que resultó visible por búsqueda pública (Google) el 27-28 de agosto de 2026. Antes de dar esto por cerrado, revisa Search Console → Páginas → "No indexadas" / "Indexadas pero..." para ver si hay más URLs antiguas con impresiones reales que no aparecieron aquí.

## URLs confirmadas

| URL antigua | Estado antes | Acción | Estado después |
|---|---|---|---|
| `/quienes-somos` y `/quienes-somos/` | Indexada por Google con título "Quiénes somos – Hidalgo & López"; devolvía 404 en el sitio actual | **301 → `/`** (implementado en `src/routes/quienes-somos.ts`) | 301 confirmado en local con curl |

Ese contenido ("quiénes somos") ahora vive repartido entre la home (sección Concepto, sección Verónica × José Carlos) — no hay un equivalente 1:1, así que redirige a la home en vez de a una página específica.

## Por qué no hay más entradas

Busqué variantes típicas de una web antigua de despacho (contacto, servicios, equipo, aviso-legal) combinadas con "Hidalgo López Altea" y no aparecieron más URLs propias del dominio indexadas — solo la de arriba y despachos de terceros sin relación. Esto **no confirma que no existan** otras URLs antiguas sin tráfico de búsqueda actual (por ejemplo si alguien las enlaza directamente desde otra web, o si Google las tiene indexadas pero no las mostró en estas búsquedas concretas).

## Cómo añadir una entrada nueva

Si encuentras otra URL antigua (por Search Console, por un enlace externo roto, etc.):

1. Decide destino:
   - **301** si hay una página actual que cubre el mismo contenido.
   - **410** si el contenido ya no existe y no hay sustituto (le dice a Google "esto se fue a propósito", mejor que un 404 genérico para que deje de re-intentar indexarlo).
2. Crea `src/routes/<ruta-antigua>.ts` con el mismo patrón que `quienes-somos.ts`:
   ```ts
   export const Route = createFileRoute("/ruta-antigua")({
     server: {
       handlers: {
         GET: async () => new Response(null, { status: 301, headers: { Location: "https://www.hilolegal.es/destino" } }),
       },
     },
   });
   ```
   Para un 410: `new Response(null, { status: 410 })`, sin `Location`.
3. Evita encadenar redirects (si A→B y ahora B→C, actualiza A→C directamente).
4. Verifica con `curl -sI` que el status code y el `Location` son correctos antes de desplegar.
