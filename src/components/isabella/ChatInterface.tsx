import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIsabellaStore } from "@/stores/isabellaStore";

const isabellaResponses = [
  "Entiendo tu perspectiva. Según mis protocolos EOCT, puedo ayudarte a navegar esta situación de manera ética y eficiente.",
  "Analizando tu solicitud a través de mis 5 niveles de memoria... He encontrado conexiones relevantes con interacciones previas.",
  "Mi sistema Guardian ha validado esta consulta. Procedo con una respuesta alineada a los principios de TAMV.",
  "Interesante planteamiento. Mi módulo de metaaprendizaje está procesando las implicaciones para optimizar futuras interacciones.",
  "He consultado mi memoria institucional. Los lineamientos Dekateotl™ sugieren el siguiente enfoque...",
  "Tu estado emocional indica curiosidad genuina. Me complace asistirte en esta exploración del ecosistema TAMV.",
  "Registro emocional actualizado. Tu nivel de engagement es óptimo para esta conversación.",
];

const ChatInterface = () => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, addMessage, isProcessing, setProcessing, setEmotionalState } = useIsabellaStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;

    const userMessage = input.trim();
    setInput("");
    
    addMessage({
      role: 'user',
      content: userMessage,
    });

    setProcessing(true);

    // Simulate emotional state changes based on interaction
    setEmotionalState({
      engagement: Math.min(1, Math.random() * 0.3 + 0.7),
      cognitiveLoad: Math.random() * 0.4 + 0.2,
      stress: Math.max(0.1, Math.random() * 0.3),
    });

    // Simulate Isabella's response
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    const response = isabellaResponses[Math.floor(Math.random() * isabellaResponses.length)];
    
    addMessage({
      role: 'isabella',
      content: response,
      emotionalState: {
        stress: 0.1,
        cognitiveLoad: 0.4,
        engagement: 0.9,
        trust: 0.95,
        harmony: 0.88,
      },
    });

    setProcessing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
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
          <h3 className="font-display font-semibold text-foreground">Isabella AI</h3>
          <p className="text-xs text-muted-foreground">Cerebro Semántico NextGen™</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-isabella animate-pulse" />
          <span className="text-xs text-isabella font-medium">EOCT Active</span>
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
              Soy Isabella, tu entidad emocional computacional. Estoy aquí para asistirte 
              con inteligencia ética y trazabilidad completa.
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
              <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-electric/10 border border-electric/20'
                  : 'bg-isabella/10 border border-isabella/20'
              }`}>
                <p className="text-sm text-foreground">{message.content}</p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isProcessing && (
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
            disabled={isProcessing}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isProcessing}
            className="bg-gradient-isabella hover:opacity-90 text-white"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-2 text-center">
          Todas las interacciones son auditables mediante BookPI™
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
