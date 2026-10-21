import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GOOGLE_SHEET_ID = "1Klnh7mZ1NiWs6vNx0omeKrJWbiUaROj2tEYm5KN9HTU";
const GOOGLE_SHEET_NAME = "Leads";
const GOOGLE_SHEET_URL = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/edit`;
const USER_ERROR = "No se ha podido enviar el formulario. Por favor, contacta por WhatsApp o inténtalo de nuevo en unos minutos.";

/** Mismo aviso de siempre más un código corto del paso que ha fallado, para saber
 *  desde la propia web (sin abrir los registros del servidor) qué hay que mirar:
 *  sin-configuracion, red, http-<estado>, script-no-publico o script-error. */
const userError = (code: string) => new Error(`${USER_ERROR} (código: ${code})`);

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
    });
  } catch (err) {
    console.error(`Google Sheets webhook unreachable (${label})`, err);
    throw userError("red");
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

    await sendToSheet("download lead", {
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

    await sendToSheet("contact", {
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
    });

    return { success: true };
  });
