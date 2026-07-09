import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

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
    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

    if (!webhookUrl) {
      // Sin webhook configurado: aceptamos el envío para no romper la UI en local.
      console.warn("GOOGLE_SHEETS_WEBHOOK_URL no está configurado. Simulando envío.");
      return { success: true, simulated: true };
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify({
        name: data.name,
        phone: data.phone,
        email: data.email,
        topic: data.topic,
        message: data.message,
        origin: "Web HiloLegal",
      }),
    });

    const text = await response.text();

    if (!response.ok) {
      throw new Error(`Webhook falló (${response.status}): ${text}`);
    }

    return { success: true };
  });
