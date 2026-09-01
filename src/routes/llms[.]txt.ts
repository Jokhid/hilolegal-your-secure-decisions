import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

// Servido como ruta (no como archivo estático en /public) para poder fijar
// explícitamente el charset — sin él, el servidor devuelve
// "Content-Type: text/plain" sin "; charset=utf-8" y las tildes se
// muestran mal (mismo problema que no tiene sitemap.xml porque el XML
// declara su propio encoding internamente; un .txt plano no tiene eso).
const LLMS_TXT = `# HiloLegal

> Boutique legal y patrimonial en Altea, Costa Blanca. Abogacía, planificación financiera, hipotecas, seguros y administración de fincas para familias, autónomos y comunidades de propietarios.

## Profesionales

- [Verónica López](https://www.hilolegal.es/veronica): área jurídica — derecho civil y de familia, derecho administrativo, derecho penal, inmobiliario y comunidades, consultoría jurídica.
- [José Carlos Hidalgo](https://www.hilolegal.es/josecarlos): área patrimonial e hipotecaria — hipotecas, protección, ahorro, jubilación y administración de fincas.

## Secciones principales

- [Inicio](https://www.hilolegal.es/): presentación de HiloLegal y las cuatro áreas de servicio.
- [José Carlos Hidalgo](https://www.hilolegal.es/josecarlos): hipotecas y planificación patrimonial.
- [Verónica López](https://www.hilolegal.es/veronica): asesoramiento jurídico.
- [Administración de fincas](https://www.hilolegal.es/administracion-fincas): gestión de comunidades de propietarios.
  - [Soy presidente de una comunidad](https://www.hilolegal.es/administracion-fincas/presidentes): acompañamiento a presidentes de comunidades de propietarios.
  - [Cambio de administrador de fincas](https://www.hilolegal.es/administracion-fincas/cambio-administrador): traspaso ordenado desde otro administrador.
  - [Nueva comunidad de propietarios](https://www.hilolegal.es/administracion-fincas/nueva-comunidad): constitución y primeros pasos de una comunidad nueva.
  - [Gestión económica e impagos](https://www.hilolegal.es/administracion-fincas/gestion-economica-impagos): cuentas, presupuestos y morosidad en comunidades.
- [Blog](https://www.hilolegal.es/blog): artículos sobre derecho, hipotecas, patrimonio y comunidades.
  - [Dinero parado en el banco: cuánto estás perdiendo sin saberlo](https://www.hilolegal.es/blog/dinero-parado-en-el-banco)
  - [Cómo preparar tu perfil financiero antes de pedir una hipoteca](https://www.hilolegal.es/blog/preparar-perfil-financiero-hipoteca-2026)
  - [Jubilación en España: la historia real que nadie quiere ver](https://www.hilolegal.es/blog/jubilacion-en-espana)
  - [Base mínima de autónomos en 2026: cuánto pierdes realmente cuando te pones enfermo](https://www.hilolegal.es/blog/base-minima-autonomos-baja-2026)
  - [Custodia compartida: lo que de verdad valora un juez](https://www.hilolegal.es/blog/custodia-compartida-que-valora-un-juez)
  - [Señales que indican que tu comunidad necesita cambiar de administrador](https://www.hilolegal.es/blog/senales-cambiar-administrador-de-fincas)

## Contacto

- Teléfono: +34 647 50 60 40
- Email: info@hilolegal.es
- Dirección: Calle Regata 3, 1º E, 03590 Altea, Alicante, España

## Nota sobre el contenido del blog

Los artículos del blog de HiloLegal son material educativo y divulgativo. No constituyen asesoramiento legal ni financiero vinculante para ningún caso concreto — para eso es necesaria una consulta directa con Verónica López o José Carlos Hidalgo.
`;

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: async () => {
        return new Response(LLMS_TXT, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
