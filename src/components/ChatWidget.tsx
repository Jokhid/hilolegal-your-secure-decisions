import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useServerFn } from "@tanstack/react-start";
import { MessageCircle, X, Send } from "lucide-react";
import { sendChatMessage } from "@/lib/chat.functions";
import { trackEvent } from "@/lib/analytics";
import { useDialogA11y } from "@/lib/useDialogA11y";

const WHATSAPP = "https://wa.me/34647506040";
const MAX_USER_MESSAGES = 6;
const SESSION_KEY = "hilolegal-chat-count";

const GREETING =
  "Hola. Soy el asistente de HiloLegal. ¿En qué puedo ayudarte? Puedo orientarte hacia hipotecas y seguros, temas legales, o administración de fincas.";
const FALLBACK_TEXT =
  "El asistente no está disponible ahora mismo. Escríbenos por WhatsApp y te ayudamos enseguida.";
const LIMIT_TEXT = "Para seguir con el detalle de tu caso, mejor continuemos por WhatsApp.";

type ChatMsg = {
  id: string;
  role: "user" | "assistant";
  content: string;
  kind?: "greeting" | "fallback" | "limit";
};

let idCounter = 0;
const nextId = () => `m${idCounter++}`;

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([
    { id: nextId(), role: "assistant", content: GREETING, kind: "greeting" },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [userMessageCount, setUserMessageCount] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const send = useServerFn(sendChatMessage);

  useDialogA11y(isOpen, () => setIsOpen(false), panelRef);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY);
      if (stored) setUserMessageCount(Number(stored) || 0);
    } catch {
      // ignore (private browsing, storage disabled, etc.)
    }
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  const limitReached = userMessageCount >= MAX_USER_MESSAGES;

  const openWidget = () => {
    setIsOpen(true);
    trackEvent("chat_open");
  };

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending || limitReached) return;

    const userMsg: ChatMsg = { id: nextId(), role: "user", content: text };
    const nextCount = userMessageCount + 1;
    const history = [...messages, userMsg]
      .filter((m) => m.kind !== "greeting" && m.kind !== "fallback" && m.kind !== "limit")
      .map((m) => ({ role: m.role, content: m.content }));

    setMessages((m) => [...m, userMsg]);
    setInput("");
    setSending(true);
    setUserMessageCount(nextCount);
    try {
      sessionStorage.setItem(SESSION_KEY, String(nextCount));
    } catch {
      // ignore
    }

    trackEvent("chat_message_sent");

    try {
      const result = await send({ data: { messages: history } });
      setMessages((m) => [...m, { id: nextId(), role: "assistant", content: result.reply }]);
      trackEvent("chat_reply_received");
      if (nextCount >= MAX_USER_MESSAGES) {
        setMessages((m) => [...m, { id: nextId(), role: "assistant", content: LIMIT_TEXT, kind: "limit" }]);
      }
    } catch {
      setMessages((m) => [...m, { id: nextId(), role: "assistant", content: FALLBACK_TEXT, kind: "fallback" }]);
      trackEvent("chat_error");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <button
        type="button"
        aria-label={isOpen ? "Cerrar chat" : "Abrir chat con HiloLegal"}
        onClick={() => (isOpen ? setIsOpen(false) : openWidget())}
        className="fixed bottom-6 right-6 z-[9998] flex h-14 w-14 items-center justify-center rounded-full bg-[#1f6f78] text-white shadow-xl transition-colors hover:bg-[#17535a]"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Chat con HiloLegal"
            tabIndex={-1}
            initial={{ opacity: 0, y: reduce ? 0 : 16, scale: reduce ? 1 : 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduce ? 0 : 16, scale: reduce ? 1 : 0.98 }}
            transition={{ duration: reduce ? 0 : 0.2 }}
            className="jch-chat-panel fixed inset-x-4 bottom-4 top-16 z-[9998] flex flex-col overflow-hidden rounded-2xl border shadow-2xl outline-none sm:inset-x-auto sm:top-auto sm:bottom-24 sm:right-6 sm:h-[560px] sm:w-[380px]"
          >
            <div className="jch-chat-header flex items-center justify-between border-b px-5 py-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest">HiloLegal</p>
                <p className="jch-chat-muted text-xs">Asistente virtual</p>
              </div>
              <button
                type="button"
                aria-label="Cerrar chat"
                onClick={() => setIsOpen(false)}
                className="jch-chat-muted hover:opacity-70"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      m.role === "user" ? "jch-chat-bubble--user" : "jch-chat-bubble--assistant"
                    }`}
                  >
                    {m.content}
                    {m.kind === "fallback" || m.kind === "limit" ? (
                      <a
                        href={WHATSAPP}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 block font-bold underline"
                      >
                        Escribir por WhatsApp →
                      </a>
                    ) : null}
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex justify-start">
                  <div className="jch-chat-bubble--assistant flex items-center gap-1 rounded-2xl px-4 py-3">
                    <span className="jch-chat-dot" />
                    <span className="jch-chat-dot" />
                    <span className="jch-chat-dot" />
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSend} className="jch-chat-input-bar flex items-center gap-2 border-t px-4 py-3">
              <input
                type="text"
                aria-label="Escribe tu mensaje"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={500}
                disabled={sending || limitReached}
                placeholder={limitReached ? "Continúa por WhatsApp →" : "Escribe tu consulta..."}
                className="jch-chat-muted flex-1 bg-transparent text-sm outline-none placeholder:opacity-60 disabled:opacity-50"
              />
              <button
                type="submit"
                aria-label="Enviar mensaje"
                disabled={sending || limitReached || !input.trim()}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1f6f78] text-white transition-colors hover:bg-[#17535a] disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
