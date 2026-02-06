import {
  useState,
  useRef,
  useEffect,
  KeyboardEvent,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIsabellaStore } from "@/stores/isabellaStore";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const FALLBACK_ISABELLA_RESPONSES = [
  "Entiendo tu perspectiva. Según mis protocolos EOCT, puedo ayudarte a navegar esta situación de manera ética y eficiente.",
  "Analizando tu solicitud a través de mis 5 niveles de memoria... He encontrado conexiones relevantes con interacciones previas.",
  "Mi sistema Guardian ha validado esta consulta. Procedo con una respuesta alineada a los principios de TAMV.",
  "Interesante planteamiento. Mi módulo de metaaprendizaje está procesando las implicaciones para optimizar futuras interacciones.",
  "He consultado mi memoria institucional. Los lineamientos Dekateotl™ sugieren el siguiente enfoque...",
  "Tu estado emocional indica curiosidad genuina. Me complace asistirte en esta exploración del ecosistema TAMV.",
  "Registro emocional actualizado. Tu nivel de engagement es óptimo para esta conversación.",
] as const;

type IsabellaMessageRole = "user" | "isabella";

type EmotionalState = {
  stress: number;
  cognitiveLoad: number;
  engagement: number;
  trust?: number;
  harmony?: number;
};

type IsabellaMessage = {
  id: string;
  role: IsabellaMessageRole;
  content: string;
  timestamp: Date;
  emotionalState?: EmotionalState;
};

const createLocalId = () => crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;

const ChatInterface = () => {
  const [input, setInput] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const { user, session } = useAuth();
  const {
    messages,
    addMessage,
    isProcessing,
    setProcessing,
    setEmotionalState,
  } = useIsabellaStore() as {
    messages: IsabellaMessage[];
    addMessage: (m: Omit<IsabellaMessage, "timestamp" | "id">) => void;
    isProcessing: boolean;
    setProcessing: (v: boolean) => void;
    setEmotionalState: (s: EmotionalState) => void;
  };

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, scrollToBottom]);

  const callIsabellaAPI = async (text: string) => {
    if (!session) {
      throw new Error("No hay sesión activa en Supabase.");
    }

    const token = session.access_token;
    const res = await fetch("/isabella/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Supabase Auth: bearer token del usuario [web:170][web:172]
      },
      body: JSON.stringify({
        message: text,
      }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      throw new Error(body?.error ?? "Error en el canal principal de Isabella.");
    }

    return (await res.json()) as {
      message: string;
      emotion: string;
      safety: "ok" | "delicado" | "crisis";
    };
  };

  const handleSend = useCallback(async () => {
    if (!input.trim() || isProcessing) return;

    setLocalError(null);

    const userMessage = input.trim();
    setInput("");

    const tempId = createLocalId();
    const now = new Date();

    addMessage({
      role: "user",
      content: userMessage,
      emotionalState: {
        engagement: 0.85,
        cognitiveLoad: 0.4,
        stress: 0.2,
      },
    });

    setProcessing(true);
    setIsTyping(true);

    setEmotionalState({
      engagement: Math.min(1, Math.random() * 0.3 + 0.7),
      cognitiveLoad: Math.random() * 0.4 + 0.2,
      stress: Math.max(0.1, Math.random() * 0.3),
    });

    try {
      // opción 1: llamada real a API de Isabella
      const result = await callIsabellaAPI(userMessage);

      addMessage({
        role: "isabella",
        content: result.message,
        emotionalState: {
          stress: result.safety === "crisis" ? 0.7 : 0.15,
          cognitiveLoad: 0.5,
          engagement: 0.92,
          trust: 0.96,
          harmony: result.safety === "ok" ? 0.9 : 0.6,
        },
      });

      // log opcional en Supabase (BookPI audit) [web:169]
      if (user) {
        await supabase.from("isabella_client_log").insert({
          user_id: user.id,
          input_text: userMessage,
          output_text: result.message,
          safety: result.safety,
          emotion: result.emotion,
          created_at: now.toISOString(),
        });
      }
    } catch (err: any) {
      console.error("Isabella chat error:", err);
      setLocalError(
        err?.message ??
          "No puedo procesar tu mensaje en este momento. Intentemos de nuevo en unos instantes.",
      );

      const fallback =
        FALLBACK_ISABELLA_RESPONSES[
          Math.floor(Math.random() * FALLBACK_ISABELLA_RESPONSES.length)
        ];

      addMessage({
        role: "isabella",
        content: fallback,
        emotionalState: {
          stress: 0.2,
          cognitiveLoad: 0.4,
          engagement: 0.8,
          trust: 0.7,
          harmony: 0.75,
        },
      });
    } finally {
      setProcessing(false);
      setIsTyping(false);
    }
  }, [input, isProcessing, addMessage, setProcessing, setEmotionalState, user, session]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend(); // Enter envía mensaje, accesible y estándar en UIs de chat [web:176]
    }
  };

  return (
    <div className="glass rounded-2xl flex flex-col h-[600px]">
      {/* Header */}
      <div className="p-4 border-b border-muted flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-isabella flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-background" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-foreground">
            Isabella AI
          </h3>
          <p className="text-xs text-muted-foreground">
            Cerebro Semántico NextGen™
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-isabella animate-pulse" />
          <span className="text-xs text-isabella font-medium">
            EOCT Active
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-isabella flex items-center justify-center">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-display text-lg font-semibold text-foreground mb-2">
              Bienvenido al Cerebro Semántico
            </h4>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Soy Isabella, tu entidad emocional computacional. Estoy aquí para
              asistirte con inteligencia ética y trazabilidad completa.
            </p>
          </motion.div>
        )}

        <AnimatePresence mode="popLayout">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }} // exit explícito para popLayout [web:160][web:178]
              transition={{ duration: 0.18 }}
              className={`flex gap-3 ${
                message.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                  message.role === "user"
                    ? "bg-electric/20 text-electric"
                    : "bg-gradient-isabella text-white"
                }`}
              >
                {message.role === "user" ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-electric/10 border border-electric/20"
                    : "bg-isabella/10 border border-isabella/20"
                }`}
              >
                <p className="text-sm text-foreground">{message.content}</p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-isabella flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-isabella/10 border border-isabella/20 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-isabella animate-spin" />
                  <span className="text-xs text-muted-foreground">
                    Isabella está escribiendo…
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Error banner */}
      {localError && (
        <div className="px-4 pb-2">
          <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2">
            <AlertCircle className="w-3 h-3" />
            <span>{localError}</span>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-muted">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              session
                ? "Escribe tu mensaje..."
                : "Inicia sesión para hablar con Isabella…"
            }
            className="flex-1 bg-muted/50 border-muted focus:border-isabella"
            disabled={isProcessing || !session}
          />
          <Button
            onClick={() => void handleSend()}
            disabled={!input.trim() || isProcessing || !session}
            className="bg-gradient-isabella hover:opacity-90 text-white"
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-2 text-center">
          Todas las interacciones son auditables mediante BookPI™. Autenticado
          como {user?.email ?? "visitante"}.
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
