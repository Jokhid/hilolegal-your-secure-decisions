import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GOOGLE_SHEET_ID = "1Klnh7mZ1NiWs6vNx0omeKrJWbiUaROj2tEYm5KN9HTU";
const GOOGLE_SHEET_NAME = "Leads";
const GOOGLE_SHEET_URL = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/edit`;
const USER_ERROR = "No se ha podido enviar el formulario. Por favor, contacta por WhatsApp o inténtalo de nuevo en unos minutos.";

const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  phone: z.string().trim().min(3).max(40),
  email: z.string().trim().email().max(255),
  topic: z.string().trim().min(1).max(100),
  message: z.string().trim().max(2000).optional().default(""),
});

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((input) => contactSchema.parse(input))
  .handler(async ({ data }) => {
    const webhookUrl =
      process.env.GOOGLE_SHEETS_WEBHOOK_URL ||
      process.env.SHEETS_WEBHOOK_URL ||
      process.env.CONTACT_WEBHOOK_URL;

    if (!webhookUrl) {
      console.error("Contact form webhook is not configured", {
        sheetId: GOOGLE_SHEET_ID,
        sheetName: GOOGLE_SHEET_NAME,
      });
      throw new Error(USER_ERROR);
    }

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
