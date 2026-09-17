import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

// Las 4 páginas de derecho servían 200 tanto en /derecho-familia como en
// /DERECHO-FAMILIA (contenido duplicado sin redirección de origen — solo
// mitigado por el canonical). El router de TanStack es case-sensitive por
// diseño, así que la normalización se hace aquí, antes de que la petición
// llegue al handler de SSR.
const DERECHO_ROUTES = new Set([
  "/derecho-familia",
  "/derecho-penal",
  "/derecho-administrativo",
  "/derecho-inmobiliario",
]);

function derechoCaseRedirect(request: Request): Response | null {
  const url = new URL(request.url);
  const lower = url.pathname.toLowerCase();
  if (url.pathname !== lower && DERECHO_ROUTES.has(lower)) {
    url.pathname = lower;
    return Response.redirect(url.toString(), 301);
  }
  return null;
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    const redirect = derechoCaseRedirect(request);
    if (redirect) return redirect;

    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
