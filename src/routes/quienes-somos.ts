import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

// Legacy URL from the site's previous "Hidalgo & López" branding, still
// indexed by Google (confirmed via search — this exact path surfaced with
// the old brand name in its title). Its content now lives distributed
// across the home page, so redirect there instead of leaving it a 404.
// See SEO_REDIRECTS.md.
export const Route = createFileRoute("/quienes-somos")({
  server: {
    handlers: {
      GET: async () => {
        return new Response(null, {
          status: 301,
          headers: { Location: "https://www.hilolegal.es/" },
        });
      },
    },
  },
});
