import { createServerFn } from "@tanstack/react-start";
import { getRequestIP } from "@tanstack/react-start/server";
import { z } from "zod";

const GOOGLE_SHEET_ID = "1Klnh7mZ1NiWs6vNx0omeKrJWbiUaROj2tEYm5KN9HTU";
const GOOGLE_SHEET_NAME = "Leads";
const GOOGLE_SHEET_URL = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/edit`;
const USER_ERROR = "No se ha podido enviar el formulario. Por favor, contacta por WhatsApp o inténtalo de nuevo en unos minutos.";

/** Mismo aviso de siempre más un código corto del paso que ha fallado, para saber
 *  desde la propia web (sin abrir los registros del servidor) qué hay que mirar:
 *  limite, sin-configuracion, red, tiempo-agotado, http-<estado>, script-no-publico,
 *  script-error, email-red, email-tiempo-agotado o email-http-<estado>. */
const userError = (code: string) => new Error(`${USER_ERROR} (código: ${code})`);

// Por debajo de los 10 s que tiene por defecto una función de Vercel, para que un destino
// que no responde no tumbe la petición entera cuando el otro ya ha recibido el envío.
const FETCH_TIMEOUT_MS = 8_000;

// ---------------------------------------------------------------------------
// Destino 1 (principal): correo directo con Resend (https://resend.com).
//   RESEND_API_KEY   clave de la API. Sin ella el correo se omite y todo funciona como antes
//                    (solo la hoja de Google), así que este código se puede desplegar antes de
//                    tener la cuenta.
//   LEADS_TO_EMAIL   destinatario(s) separados por comas. Por defecto info@hilolegal.es.
//   LEADS_FROM_EMAIL remitente, de un dominio verificado en Resend. Por defecto
//                    "HiloLegal <formularios@hilolegal.es>".
//   RESEND_API_URL   solo para pruebas locales.
// Destino 2 (copia): la hoja de Google, vía el script de Apps Script (ver más abajo).
// El formulario cuenta como enviado si llega por CUALQUIERA de los dos.
// ---------------------------------------------------------------------------
const DEFAULT_LEADS_TO = "info@hilolegal.es";
const DEFAULT_LEADS_FROM = "HiloLegal <formularios@hilolegal.es>";

interface Lead {
  name: string;
  phone: string;
  email: string;
  topic: string;
  message: string;
  origin: string;
}

const escapeHtml = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

/** Para el asunto del correo: sin saltos de línea (evita inyectar cabeceras). */
const oneLine = (v: string) => v.replace(/\s+/g, " ").trim();

async function sendLeadEmail(label: string, lead: Lead): Promise<"enviado" | "no-configurado"> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return "no-configurado";

  const to = (process.env.LEADS_TO_EMAIL || DEFAULT_LEADS_TO)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const from = process.env.LEADS_FROM_EMAIL || DEFAULT_LEADS_FROM;
  const when = new Date().toLocaleString("es-ES", { timeZone: "Europe/Madrid" });

  const who = lead.name || lead.email;
  const subject = oneLine(`Nuevo formulario: ${lead.topic}${who ? ` — ${who}` : ""}`).slice(0, 150);

  const rows = (
    [
      ["Fecha", when],
      ["Nombre", lead.name],
      ["Teléfono", lead.phone],
      ["Email", lead.email],
      ["Interés", lead.topic],
      ["Mensaje", lead.message],
      ["Origen", lead.origin],
    ] as Array<[string, string]>
  ).filter(([, v]) => v);

  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  const html =
    `<h2 style="margin:0 0 16px;font-family:Arial,sans-serif">Nuevo formulario recibido en HiloLegal</h2>` +
    `<table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">` +
    rows
      .map(
        ([k, v]) =>
          `<tr><td style="padding:6px 16px 6px 0;color:#555;vertical-align:top"><strong>${escapeHtml(k)}</strong></td>` +
          `<td style="padding:6px 0">${escapeHtml(v).replace(/\n/g, "<br>")}</td></tr>`,
      )
      .join("") +
    `</table>`;

  let response: Response;
  try {
    response = await fetch(process.env.RESEND_API_URL || "https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, subject, text, html, reply_to: lead.email || undefined }),
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
  } catch (err) {
    console.error(`Resend unreachable (${label})`, err);
    throw userError(err instanceof Error && err.name === "TimeoutError" ? "email-tiempo-agotado" : "email-red");
  }

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    console.error(`Resend failed (${label})`, response.status, body.slice(0, 500));
    throw userError(`email-http-${response.status}`);
  }
  return "enviado";
}

function getWebhookUrl(): string {
  const webhookUrl =
    process.env.GOOGLE_SHEETS_WEBHOOK_URL || process.env.SHEETS_WEBHOOK_URL || process.env.CONTACT_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("No Google Sheets webhook env var is configured (GOOGLE_SHEETS_WEBHOOK_URL / SHEETS_WEBHOOK_URL / CONTACT_WEBHOOK_URL)");
    throw userError("sin-configuracion");
  }
  return webhookUrl;
}

// Los formularios mandan email: "" cuando el visitante deja en blanco el campo
// "Email (opcional)". Un "" no es un email válido, así que antes se rechazaba
// el envío entero ("Invalid email") y el formulario no llegaba a la hoja salvo
// que se rellenase el email. Ahora un email en blanco equivale a no haberlo puesto.
const optionalEmail = z.preprocess(
  (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
  z.string().trim().email().max(255).optional(),
);

const FORM_INVALID =
  "Revisa los datos: hacen falta tu nombre y un teléfono, y el email, si lo pones, tiene que ser válido.";

const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  phone: z.string().trim().min(3).max(40),
  email: optionalEmail,
  topic: z.string().trim().min(1).max(100),
  message: z.string().trim().max(2000).optional().default(""),
  // Honeypot: campo invisible para personas, visible para bots que
  // rellenan todos los inputs de un formulario. Un envío legítimo SIEMPRE
  // lo deja vacío.
  website: z.string().trim().max(200).optional().default(""),
  // Timestamp (Date.now()) tomado al montar el formulario en el cliente,
  // para descartar envíos completados en menos de MIN_FILL_TIME_MS —
  // ningún humano rellena un formulario de contacto tan rápido.
  formLoadedAt: z.number().optional(),
});

const MIN_FILL_TIME_MS = 3000;

// Límite por IP: cada envío válido dispara un correo (y una fila), así que sin freno
// cualquiera podría llenar la bandeja o agotar el cupo diario del proveedor de correo.
// Un visitante normal envía uno o dos formularios. El contador vive en la memoria de la
// instancia: en un servidor sin estado es un freno de mejor esfuerzo, no una barrera absoluta.
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX_REQUESTS = 10;
const RATE_MAX_TRACKED_IPS = 5000;
const recentRequests = new Map<string, number[]>();

function isRateLimited(key: string, now = Date.now()): boolean {
  const recent = (recentRequests.get(key) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  const limited = recent.length >= RATE_MAX_REQUESTS;
  if (!limited) recent.push(now);
  recentRequests.set(key, recent);

  if (recentRequests.size > RATE_MAX_TRACKED_IPS) {
    for (const [ip, times] of recentRequests) {
      if (!times.some((t) => now - t < RATE_WINDOW_MS)) recentRequests.delete(ip);
    }
    for (const ip of recentRequests.keys()) {
      if (recentRequests.size <= RATE_MAX_TRACKED_IPS) break;
      recentRequests.delete(ip);
    }
  }
  return limited;
}

/** Apps Script contesta 200 aunque el guardado falle: con la página de inicio de
 *  sesión de Google (el script no está publicado como "Cualquiera") o con
 *  {"success":false,...} cuando el script lanza un error. Antes bastaba con que la
 *  respuesta fuera 200 y la web daba el envío por bueno sin que llegara nada a la hoja.
 *  Solo se consideran fallo esos dos casos claros; cualquier otra respuesta 200 se
 *  sigue tratando como éxito para no romper un script con otro formato de respuesta. */
function webhookFailure(text: string): "html" | "script" | null {
  const body = text.trim();
  if (/^<(!doctype|html)/i.test(body)) return "html";
  try {
    return (JSON.parse(body) as { success?: unknown })?.success === false ? "script" : null;
  } catch {
    return null;
  }
}

/** Envía una fila al script de Google y lanza un error con código si algo falla. */
async function sendToSheet(label: string, payload: Record<string, unknown>): Promise<void> {
  const webhookUrl = getWebhookUrl();

  let response: Response;
  try {
    response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
  } catch (err) {
    console.error(`Google Sheets webhook unreachable (${label})`, err);
    throw userError(err instanceof Error && err.name === "TimeoutError" ? "tiempo-agotado" : "red");
  }

  const text = await response.text();

  if (!response.ok) {
    console.error(`Google Sheets webhook failed (${label})`, response.status, text.slice(0, 500));
    throw userError(`http-${response.status}`);
  }

  const failure = webhookFailure(text);
  if (failure) {
    console.error(`Google Sheets webhook rejected the lead (${label}) [${failure}]`, text.slice(0, 500));
    throw userError(failure === "html" ? "script-no-publico" : "script-error");
  }
}

/** Honeypot relleno, formulario enviado demasiado rápido o sin marca de tiempo
 *  (todos los formularios legítimos de la web la envían): probablemente un bot. */
function looksLikeBot(data: { website: string; formLoadedAt?: number }): boolean {
  if (data.website.length > 0) return true;
  if (typeof data.formLoadedAt !== "number") return true;
  return Date.now() - data.formLoadedAt < MIN_FILL_TIME_MS;
}

/** Google Sheets interpreta como fórmula cualquier texto que empiece por = + - @.
 *  Sin esto, un mensaje como =IMPORTDATA("https://…"&A2:G99) se ejecutaría al abrir
 *  la hoja de leads y podría sacar datos de ella. El apóstrofo inicial fuerza texto
 *  y Sheets no lo muestra. */
function safeCell(value: string | undefined): string {
  const v = value ?? "";
  return /^[=+\-@\t\r]/.test(v) ? `'${v}` : v;
}

function sheetPayload(lead: Lead): Record<string, unknown> {
  return {
    timestamp: new Date().toISOString(),
    sheetId: GOOGLE_SHEET_ID,
    sheetName: GOOGLE_SHEET_NAME,
    sheetUrl: GOOGLE_SHEET_URL,
    name: safeCell(lead.name),
    phone: safeCell(lead.phone),
    email: safeCell(lead.email),
    interest: safeCell(lead.topic),
    topic: safeCell(lead.topic),
    message: safeCell(lead.message),
    origin: lead.origin,
  };
}

/** Entrega la solicitud por correo y en la hoja a la vez. Cuenta como enviada si llega
 *  por cualquiera de los dos: una caída de Google ya no significa un cliente perdido, ni
 *  un fallo del correo. Si no llega por ninguno, lanza el error del correo (el destino
 *  principal) cuando está configurado, o el de la hoja si no. */
async function deliverLead(label: string, lead: Lead): Promise<void> {
  const [email, sheet] = await Promise.allSettled([
    sendLeadEmail(label, lead),
    sendToSheet(label, sheetPayload(lead)),
  ]);

  const emailSent = email.status === "fulfilled" && email.value === "enviado";
  if (emailSent || sheet.status === "fulfilled") {
    if (email.status === "rejected") console.error(`Lead (${label}) guardado en la hoja, pero el correo ha fallado`);
    if (!emailSent && sheet.status === "rejected") console.error(`Lead (${label}) enviado por correo, pero la hoja ha fallado`);
    return;
  }

  if (email.status === "rejected") throw email.reason;
  if (sheet.status === "rejected") throw sheet.reason;
  throw userError("sin-configuracion");
}

function checkRateLimit(): void {
  const ip = getRequestIP({ xForwardedFor: true }) ?? "unknown";
  if (isRateLimited(ip)) {
    console.warn("Contact rate limit exceeded for", ip);
    throw userError("limite");
  }
}

const downloadLeadSchema = z.object({
  email: z.string().trim().email().max(255),
  topic: z.string().trim().min(1).max(100),
  website: z.string().trim().max(200).optional().default(""),
  formLoadedAt: z.number().optional(),
});

/** Captura ligera (solo email) para el botón "Descargar informe" de las
 *  herramientas — mismo destino que el formulario de contacto, pero
 *  sin exigir nombre/teléfono, que el visitante no ha dado en ese punto. */
export const submitDownloadLead = createServerFn({ method: "POST" })
  .inputValidator((input) => downloadLeadSchema.parse(input))
  .handler(async ({ data }) => {
    if (looksLikeBot(data)) {
      return { success: true };
    }
    checkRateLimit();

    await deliverLead("download lead", {
      name: "",
      phone: "",
      email: data.email,
      topic: data.topic,
      message: "Descarga de informe desde una herramienta web.",
      origin: "Web HiloLegal — Descarga de informe",
    });

    return { success: true };
  });

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((input) => {
    const parsed = contactSchema.safeParse(input);
    if (!parsed.success) throw new Error(FORM_INVALID);
    return parsed.data;
  })
  .handler(async ({ data }) => {
    // Honeypot relleno o formulario enviado demasiado rápido: probablemente
    // un bot. Se responde éxito aparente sin revelar la detección, pero no
    // se reenvía a ningún destino real.
    if (looksLikeBot(data)) {
      return { success: true };
    }
    checkRateLimit();

    await deliverLead("contact", {
      name: data.name,
      phone: data.phone,
      email: data.email ?? "",
      topic: data.topic,
      message: data.message,
      origin: "Web HiloLegal",
    });

    return { success: true };
  });
