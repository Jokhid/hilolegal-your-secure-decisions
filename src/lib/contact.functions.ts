import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GOOGLE_SHEET_ID = "1Klnh7mZ1NiWs6vNx0omeKrJWbiUaROj2tEYm5KN9HTU";
const GOOGLE_SHEET_NAME = "Leads";
const GOOGLE_SHEET_URL = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/edit`;
const USER_ERROR = "No se ha podido enviar el formulario. Por favor, contacta por WhatsApp o inténtalo de nuevo en unos minutos.";

function getWebhookUrl(): string {
  const webhookUrl =
    process.env.GOOGLE_SHEETS_WEBHOOK_URL || process.env.SHEETS_WEBHOOK_URL || process.env.CONTACT_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("No Google Sheets webhook env var is configured (GOOGLE_SHEETS_WEBHOOK_URL / SHEETS_WEBHOOK_URL / CONTACT_WEBHOOK_URL)");
    throw new Error(USER_ERROR);
  }
  return webhookUrl;
}

const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  phone: z.string().trim().min(3).max(40),
  email: z.string().trim().email().max(255).optional(),
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

const downloadLeadSchema = z.object({
  email: z.string().trim().email().max(255),
  topic: z.string().trim().min(1).max(100),
  website: z.string().trim().max(200).optional().default(""),
  formLoadedAt: z.number().optional(),
});

/** Captura ligera (solo email) para el botón "Descargar informe" de las
 *  herramientas — misma hoja y webhook que el formulario de contacto, pero
 *  sin exigir nombre/teléfono, que el visitante no ha dado en ese punto. */
export const submitDownloadLead = createServerFn({ method: "POST" })
  .inputValidator((input) => downloadLeadSchema.parse(input))
  .handler(async ({ data }) => {
    if (looksLikeBot(data)) {
      return { success: true };
    }

    const webhookUrl = getWebhookUrl();

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        sheetId: GOOGLE_SHEET_ID,
        sheetName: GOOGLE_SHEET_NAME,
        sheetUrl: GOOGLE_SHEET_URL,
        name: "",
        phone: "",
        email: safeCell(data.email),
        interest: safeCell(data.topic),
        topic: safeCell(data.topic),
        message: "Descarga de informe desde una herramienta web.",
        origin: "Web HiloLegal — Descarga de informe",
      }),
    });

    const text = await response.text();

    if (!response.ok) {
      console.error("Google Sheets webhook failed (download lead)", response.status, text);
      throw new Error(USER_ERROR);
    }

    return { success: true };
  });

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((input) => contactSchema.parse(input))
  .handler(async ({ data }) => {
    // Honeypot relleno o formulario enviado demasiado rápido: probablemente
    // un bot. Se responde éxito aparente sin revelar la detección, pero no
    // se reenvía a ningún destino real.
    if (looksLikeBot(data)) {
      return { success: true };
    }

    const webhookUrl = getWebhookUrl();

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        sheetId: GOOGLE_SHEET_ID,
        sheetName: GOOGLE_SHEET_NAME,
        sheetUrl: GOOGLE_SHEET_URL,
        name: safeCell(data.name),
        phone: safeCell(data.phone),
        email: safeCell(data.email),
        interest: safeCell(data.topic),
        topic: safeCell(data.topic),
        message: safeCell(data.message),
        origin: "Web HiloLegal",
      }),
    });

    const text = await response.text();

    if (!response.ok) {
      console.error("Google Sheets webhook failed", response.status, text);
      throw new Error(USER_ERROR);
    }

    return { success: true };
  });
