import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GOOGLE_SHEET_ID = "1Klnh7mZ1NiWs6vNx0omeKrJWbiUaROj2tEYm5KN9HTU";
const GOOGLE_SHEET_NAME = "Leads";
const GOOGLE_SHEET_URL = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/edit`;
const GOOGLE_SHEETS_WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbx1pcT_UivxYBAjFhe10RWYSjx5lq9YZIyd7LZ8V8OlFquTXxptA-rdr85P6h7q1ER7/exec";
const USER_ERROR = "No se ha podido enviar el formulario. Por favor, contacta por WhatsApp o inténtalo de nuevo en unos minutos.";

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
    const isHoneypotFilled = data.website.length > 0;
    const isTooFast = typeof data.formLoadedAt === "number" && Date.now() - data.formLoadedAt < MIN_FILL_TIME_MS;
    if (isHoneypotFilled || isTooFast) {
      return { success: true };
    }

    const webhookUrl =
      process.env.GOOGLE_SHEETS_WEBHOOK_URL ||
      process.env.SHEETS_WEBHOOK_URL ||
      process.env.CONTACT_WEBHOOK_URL ||
      GOOGLE_SHEETS_WEBHOOK_URL;

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
        email: data.email,
        interest: data.topic,
        topic: data.topic,
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
    const isHoneypotFilled = data.website.length > 0;
    const isTooFast = typeof data.formLoadedAt === "number" && Date.now() - data.formLoadedAt < MIN_FILL_TIME_MS;
    if (isHoneypotFilled || isTooFast) {
      return { success: true };
    }

    const webhookUrl =
      process.env.GOOGLE_SHEETS_WEBHOOK_URL ||
      process.env.SHEETS_WEBHOOK_URL ||
      process.env.CONTACT_WEBHOOK_URL ||
      GOOGLE_SHEETS_WEBHOOK_URL;

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
        name: data.name,
        phone: data.phone,
        email: data.email,
        interest: data.topic,
        topic: data.topic,
        message: data.message,
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
