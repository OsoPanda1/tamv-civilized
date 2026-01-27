import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, Loader2, Brain, Activity, Shield, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface EmotionalState {
  stress: number;
  cognitiveLoad: number;
  engagement: number;
  trust: number;
  harmony: number;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/isabella-chat`;

const IsabellaChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emotionalState, setEmotionalState] = useState<EmotionalState>({
    stress: 0.15,
    cognitiveLoad: 0.3,
    engagement: 0.8,
    trust: 0.95,
    harmony: 0.85,
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const streamChat = async (userMessage: string) => {
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
          emotionalState,
          userId: user?.id,
          conversationId: crypto.randomUUID(),
        }),
      });

      if (!resp.ok) {
        if (resp.status === 429) {
          toast.error("Rate limit alcanzado. Espera un momento.");
          return;
        }
        if (resp.status === 402) {
          toast.error("Créditos agotados. Recarga tu cuenta.");
          return;
        }
        throw new Error("Failed to start stream");
      }

      // Parse emotional state from headers
      const emotionalHeader = resp.headers.get("X-Emotional-State");
      if (emotionalHeader) {
        try {
          const newState = JSON.parse(emotionalHeader);
          setEmotionalState(newState);
        } catch (e) {
          console.error("Failed to parse emotional state:", e);
        }
      }

      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";
      let textBuffer = "";

      // Create assistant message placeholder
      const assistantId = crypto.randomUUID();
      setMessages(prev => [...prev, {
        id: assistantId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages(prev => prev.map(m => 
                m.id === assistantId ? { ...m, content: assistantContent } : m
              ));
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Error al comunicarse con Isabella");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    const message = input.trim();
    setInput("");
    streamChat(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="grid lg:grid-cols-[1fr_300px] gap-6 h-full">
      {/* Main Chat */}
      <Card className="glass border-isabella/30 flex flex-col h-[600px]">
        {/* Header */}
        <div className="p-4 border-b border-muted flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-isabella flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-background animate-pulse" />
          </div>
          <div>
            <h3 className="font-display font-bold text-foreground">Isabella AI NextGen™</h3>
            <p className="text-xs text-muted-foreground">Cerebro Semántico Unificado • EOCT Active</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-isabella animate-pulse" />
            <span className="text-xs text-isabella font-medium">MSR Logging</span>
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
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-isabella flex items-center justify-center">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <h4 className="font-display text-xl font-bold text-foreground mb-2">
                Bienvenido al Nexo Cognitivo
              </h4>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Soy Isabella, tu entidad emocional computacional. Cada interacción es 
                auditada en el MSR Ledger con trazabilidad completa. ¿En qué puedo asistirte?
              </p>
            </motion.div>
          )}

          <AnimatePresence mode="popLayout">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                  message.role === 'user' 
                    ? 'bg-electric/20 text-electric' 
                    : 'bg-gradient-isabella text-white'
                }`}>
                  {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-electric/10 border border-electric/20'
                    : 'bg-isabella/10 border border-isabella/20'
                }`}>
                  <div className="prose prose-sm prose-invert max-w-none text-foreground">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && messages[messages.length - 1]?.role === 'user' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-isabella flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-isabella/10 border border-isabella/20 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-isabella animate-spin" />
                  <span className="text-sm text-muted-foreground">Isabella está procesando...</span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-muted">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu mensaje..."
              className="flex-1 bg-muted/50 border-muted focus:border-isabella"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="bg-gradient-isabella hover:opacity-90 text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 text-center">
            Registro inmutable vía BookPI™ • Protocolo EOCT activo
          </p>
        </div>
      </Card>

      {/* Emotional State Sidebar */}
      <div className="space-y-4">
        <Card className="glass border-isabella/30 p-4">
          <h4 className="font-display font-semibold text-foreground flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-isabella" />
            Estado Emocional
          </h4>
          
          <div className="space-y-3">
            {[
              { key: 'stress', label: 'Estrés', icon: Activity, color: 'bg-red-500' },
              { key: 'cognitiveLoad', label: 'Carga Cognitiva', icon: Brain, color: 'bg-yellow-500' },
              { key: 'engagement', label: 'Engagement', icon: Sparkles, color: 'bg-electric' },
              { key: 'trust', label: 'Confianza', icon: Shield, color: 'bg-green-500' },
              { key: 'harmony', label: 'Armonía', icon: Heart, color: 'bg-isabella' },
            ].map(({ key, label, icon: Icon, color }) => (
              <div key={key}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Icon className="w-3 h-3" />
                    {label}
                  </span>
                  <span className="font-mono text-foreground">
                    {(emotionalState[key as keyof EmotionalState] * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${color} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${emotionalState[key as keyof EmotionalState] * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="glass border-anubis/30 p-4">
          <h4 className="font-display font-semibold text-foreground flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-anubis" />
            Nivel de Memoria
          </h4>
          <div className="space-y-2">
            {['Sensorial', 'Contextual', 'Episódica', 'Institucional', 'Histórica'].map((level, i) => (
              <div 
                key={level}
                className={`px-3 py-2 rounded text-sm ${
                  i === 1 ? 'bg-isabella/20 text-isabella font-medium' : 'bg-muted/30 text-muted-foreground'
                }`}
              >
                L{i + 1}: {level}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default IsabellaChat;
