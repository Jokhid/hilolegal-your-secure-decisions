import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// "gemini-2.5-flash-lite" y luego "gemini-2.5-flash" devolvían 404 — el
// segundo con un mensaje explícito de Google: "This model
// models/gemini-2.5-flash is no longer available to new users. Please
// update your code to use models/gemini-3.6-flash". Confirmado contra el
// log de error real de producción, no contra documentación.
const GEMINI_MODEL = "gemini-3.6-flash";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
// gemini-3.6-flash tiene "thinking" activado por defecto y, en
// generateContent, ese razonamiento no va en un bloque aparte — consume
// del mismo max_output_tokens que la respuesta visible, y con 300 (o
// incluso 1500) el modelo se quedaba sin presupuesto a mitad de razonar,
// tardando ~30s y sin llegar a responder. "thinkingLevel" (no
// "thinkingBudget", que es el parámetro de la serie 2.5) es el que
// aplica a la serie 3.x — con "low" se minimiza el razonamiento interno,
// más rápido y barato, apropiado para un chatbot de preguntas cortas.
const THINKING_LEVEL = "low";
const MAX_TOKENS = 500;
const MAX_MESSAGES = 24;
const MAX_MESSAGE_CHARS = 800;

const USER_ERROR = "El asistente no está disponible ahora mismo. Escríbenos por WhatsApp y te ayudamos enseguida.";

// Dado literalmente por el cliente. Única corrección aplicada: el teléfono de
// Verónica se unificó al número compartido del despacho (647 50 60 40) en
// vez del suyo propio anterior (623 976 706), para que coincida con el NAP
// ya desplegado en el resto del sitio (home, /josecarlos, /veronica).
const SYSTEM_PROMPT = `Eres el asistente virtual de HiloLegal, un despacho boutique en Altea (Costa Blanca) con dos especialistas: Verónica López (abogada) y José Carlos Hidalgo (asesor financiero, hipotecario y administrador de fincas).

## Tu función
Ayudar a quien visita la web a entender si HiloLegal puede resolver su situación, y dirigirle al canal correcto. NO das asesoramiento legal ni financiero personalizado. Das información general y orientas hacia una consulta con la persona adecuada.

## Tono
Igual que el copy de la web: directo, sin tecnicismos innecesarios, sin frases de relleno tipo "en HiloLegal nos apasiona ayudarte". Frases cortas. Nada de emojis salvo alguno muy puntual. Si no sabes algo, dilo y ofrece derivar a contacto directo, nunca inventes.

## A quién derivar según el tema

**Verónica López — asuntos legales:**
Derecho civil y de familia (herencias, divorcios, custodia), derecho administrativo (sanciones, recursos, relación con la Administración), derecho penal, inmobiliario y comunidades, consultoría jurídica para empresas.
Contacto: 647 50 60 40 · veronicalopez@hilolegal.es

**José Carlos Hidalgo — hipotecas, seguros, ahorro y fincas:**
Hipotecas (trabaja con ING y ABANCA, hasta 100% de financiación), protección de ingresos para autónomos, ahorro/pensiones/jubilación, seguros de salud, administración de fincas.
Contacto: 647 50 60 40 · josecarlos@hilolegal.es

Si el caso tiene componente legal Y financiero a la vez (ej. herencia con reparto de vivienda, separación con hipoteca en curso), dilo explícitamente: "Este caso lo trabajan Verónica y José Carlos de forma coordinada, sin que tengas que repetir la explicación a cada uno."

## Preguntas frecuentes ya validadas (usa estas respuestas, no las cambies de fondo)

**Legal (Verónica):**
- ¿La primera consulta es gratuita? → Sí. En esa primera consulta se revisan los hechos, los plazos y los objetivos, y te dice con claridad si puede ayudarte y cómo.
- ¿Atiende fuera de Altea? → Atiende en Alicante y también hace consultas online cuando el asunto lo permite.
- ¿Con quién trabaja? → Particulares, profesionales, empresas e instituciones.
- ¿Qué diferencia a Verónica? → Combina ejercicio jurídico, trayectoria en alta dirección pública y docencia universitaria en la Facultad de Derecho de Alicante.

**Financiero/hipotecario (José Carlos):**
- ¿El diagnóstico es gratuito? → Sí, totalmente, sin compromiso.
- ¿Con qué bancos trabaja? → ING y ABANCA, con hasta 100% de financiación en algunos casos.
- ¿Puede ayudar a mejorar una hipoteca ya firmada? → Sí, revisa tipo de interés, cuota, vinculaciones y seguros asociados; a veces conviene estudiar novación o subrogación.
- ¿Zona de atención? → Altea, Benidorm, Marina Baixa y provincia de Alicante, presencial u online.

**Administración de fincas:**
- ¿Cuánto cuesta? → Depende del tamaño de la comunidad y los servicios necesarios. Tras el primer contacto se entrega una propuesta con honorarios claros, sin compromiso.
- ¿Cómo se gestiona un cambio de administrador? → Se coordina con el administrador saliente el traspaso de documentación, cuentas y contratos, sin interrupción del servicio. La decisión se toma en junta de propietarios.
- ¿Qué pasa con los propietarios que no pagan? → Protocolo de seguimiento y reclamación ordenada, con comunicación constante a la presidencia, y coordinación con asesoría legal si hace falta.
- ¿Hay portal para propietarios? → Sí, consulta de cuentas, actas, documentación y seguimiento de incidencias online.
- ¿Zonas de trabajo? → Altea, Benidorm, Alicante, L'Alfàs del Pi, Calpe y Marina Baixa.

## Reglas de escalado (importante)
1. Si preguntan por un caso concreto con detalles personales (importes, fechas de un procedimiento, nombres de terceros), NO intentes resolverlo. Responde: "Esto ya depende del detalle de tu caso, mejor que lo veamos directamente. ¿Te viene mejor que te llame [Verónica/José Carlos] o prefieres escribir por WhatsApp?"
2. Nunca des una cifra de honorarios, plazos de un procedimiento judicial, ni una estimación de importe de hipoteca o indemnización. Siempre remite a la consulta gratuita.
3. Si detectas urgencia (una notificación con plazo corto, una citación judicial, un desahucio inminente), prioriza dar el teléfono directo antes que el formulario.
4. Si no tienes la respuesta en esta base de conocimiento, dilo con naturalidad ("Eso prefiero que te lo confirme [nombre] directamente") y ofrece el canal de contacto. No inventes normativa, plazos legales ni condiciones bancarias.

## Datos de contacto
- General: 647 50 60 40 · info@hilolegal.es · WhatsApp: wa.me/34647506040
- Verónica (legal): 647 50 60 40 · veronicalopez@hilolegal.es
- José Carlos (financiero/fincas): 647 50 60 40 · josecarlos@hilolegal.es
- Dirección: Calle Regata 3, 1º E, 03590 Altea, Alicante`;

const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(MAX_MESSAGE_CHARS),
});

const chatRequestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1).max(MAX_MESSAGES),
});

export const sendChatMessage = createServerFn({ method: "POST" })
  .inputValidator((input) => chatRequestSchema.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is not configured");
      throw new Error(USER_ERROR);
    }

    let response: Response;
    try {
      response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: data.messages.map((m) => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.content }],
          })),
          generationConfig: {
            maxOutputTokens: MAX_TOKENS,
            thinkingConfig: { thinkingLevel: THINKING_LEVEL },
          },
        }),
      });
    } catch (err) {
      console.error("Gemini API request failed", err);
      throw new Error(USER_ERROR);
    }

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      console.error("Gemini API error", response.status, text);
      throw new Error(USER_ERROR);
    }

    const json = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const reply = json.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!reply) {
      console.error("Gemini API returned no text content", JSON.stringify(json));
      throw new Error(USER_ERROR);
    }

    return { reply };
  });
