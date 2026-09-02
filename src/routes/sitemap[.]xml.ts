import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { blogPosts } from "@/lib/blogPosts";

const BASE_URL = "https://www.hilolegal.es";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        // Fechas reales (última modificación conocida de cada archivo/plantilla),
        // no "hoy" recalculado en cada petición — así lastmod sí sirve como
        // señal real de re-rastreo para Google. Actualizar a mano cuando se
        // edite el contenido visible de la página correspondiente.
        const entries = [
          { path: "/", changefreq: "monthly", priority: "1.0", lastmod: "2026-09-01" },
          { path: "/josecarlos", changefreq: "monthly", priority: "0.8", lastmod: "2026-09-01" },
          { path: "/veronica", changefreq: "monthly", priority: "0.8", lastmod: "2026-09-01" },
          { path: "/administracion-fincas", changefreq: "monthly", priority: "0.8", lastmod: "2026-09-01" },
          { path: "/administracion-fincas/presidentes", changefreq: "monthly", priority: "0.7", lastmod: "2026-09-01" },
          { path: "/administracion-fincas/cambio-administrador", changefreq: "monthly", priority: "0.7", lastmod: "2026-09-01" },
          { path: "/administracion-fincas/nueva-comunidad", changefreq: "monthly", priority: "0.7", lastmod: "2026-09-01" },
          { path: "/administracion-fincas/gestion-economica-impagos", changefreq: "monthly", priority: "0.7", lastmod: "2026-09-01" },
          { path: "/blog", changefreq: "weekly", priority: "0.7", lastmod: "2026-08-31" },
          ...blogPosts.map((p) => ({
            path: `/blog/${p.slug}`,
            changefreq: "monthly" as const,
            priority: "0.6",
            lastmod: p.updatedAt ?? p.publishedAt,
          })),
          { path: "/ahorro-potencial", changefreq: "monthly", priority: "0.7", lastmod: "2026-09-02" },
          { path: "/test-salud-financiera", changefreq: "monthly", priority: "0.7", lastmod: "2026-09-02" },
          { path: "/simulador-hipoteca", changefreq: "monthly", priority: "0.7", lastmod: "2026-09-02" },
        ];

        const urls = entries
          .map(
            (e) =>
              `  <url>\n    <loc>${BASE_URL}${e.path}</loc>\n    <lastmod>${e.lastmod}</lastmod>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
          )
          .join("\n");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
