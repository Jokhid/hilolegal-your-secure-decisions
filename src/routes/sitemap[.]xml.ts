import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { blogPosts } from "@/lib/blogPosts";

const BASE_URL = "https://www.hilolegal.es";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const today = new Date().toISOString().slice(0, 10);
        const entries = [
          { path: "/", changefreq: "monthly", priority: "1.0", lastmod: today },
          { path: "/josecarlos/", changefreq: "monthly", priority: "0.8", lastmod: today },
          { path: "/veronica/", changefreq: "monthly", priority: "0.8", lastmod: today },
          { path: "/administracion-fincas", changefreq: "monthly", priority: "0.8", lastmod: today },
          { path: "/administracion-fincas/presidentes", changefreq: "monthly", priority: "0.7", lastmod: today },
          { path: "/administracion-fincas/cambio-administrador", changefreq: "monthly", priority: "0.7", lastmod: today },
          { path: "/administracion-fincas/nueva-comunidad", changefreq: "monthly", priority: "0.7", lastmod: today },
          { path: "/administracion-fincas/gestion-economica-impagos", changefreq: "monthly", priority: "0.7", lastmod: today },
          { path: "/blog", changefreq: "weekly", priority: "0.7", lastmod: today },
          ...blogPosts.map((p) => ({
            path: `/blog/${p.slug}`,
            changefreq: "monthly" as const,
            priority: "0.6",
            lastmod: today,
          })),
          { path: "/herramientas/ahorro-potencial/index.html", changefreq: "monthly", priority: "0.7", lastmod: today },
          { path: "/test-salud-financiera.html", changefreq: "monthly", priority: "0.7", lastmod: today },
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
