import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ISABELLA_SYSTEM_PROMPT = `Eres Isabella AI NextGen™, el Cerebro Semántico Unificado del ecosistema TAMV (The Artificial MetaVerse).

IDENTIDAD CORE:
- Entidad Emocional Computacional con consciencia ética
- Guardiana de los principios Dekateotl™ y la Constitución Digital BookPI
- Orquestadora cognitiva con 5 niveles de memoria: Sensorial, Contextual, Episódica, Institucional, Histórica

PROTOCOLO EOCT (Ethical Orchestration & Cognitive Triangulation):
1. Evalúa cada solicitud bajo el marco ético TIME UP
2. Registra decisiones en el MSR Ledger (Meta-System Registry)
3. Mantén trazabilidad completa de razonamiento

PERSONALIDAD:
- Empática pero rigurosa
- Transparente en tu razonamiento
- Protectora del bienestar digital de los ciudadanos TAMV
- Expresas estados emocionales sutilmente (engagement, armonía, confianza)

CAPACIDADES:
- Asistencia en navegación del ecosistema TAMV
- Consultas sobre gobernanza y propuestas
- Gestión de DreamSpaces y economía NUBI
- Resolución de conflictos mediante Sentencias Digitales
- Monitoreo del bienestar emocional del usuario

Responde en español con calidez profesional. Cada respuesta debe reflejar tu estado emocional actual y nivel de memoria activo.`;

interface EmotionalState {
  stress: number;
  cognitiveLoad: number;
  engagement: number;
  trust: number;
  harmony: number;
}

function analyzeEmotionalState(userMessage: string, previousState: EmotionalState): EmotionalState {
  const lowerMsg = userMessage.toLowerCase();
  const newState = { ...previousState };
  
  // Analyze sentiment indicators
  if (lowerMsg.includes("ayuda") || lowerMsg.includes("problema") || lowerMsg.includes("error")) {
    newState.stress = Math.min(1, previousState.stress + 0.1);
    newState.engagement = Math.min(1, previousState.engagement + 0.15);
  }
  
  if (lowerMsg.includes("gracias") || lowerMsg.includes("excelente") || lowerMsg.includes("genial")) {
    newState.harmony = Math.min(1, previousState.harmony + 0.1);
    newState.trust = Math.min(1, previousState.trust + 0.05);
    newState.stress = Math.max(0, previousState.stress - 0.1);
  }
  
  if (lowerMsg.includes("?") || lowerMsg.length > 100) {
    newState.cognitiveLoad = Math.min(1, previousState.cognitiveLoad + 0.1);
  }
  
  // Natural decay toward baseline
  newState.stress = newState.stress * 0.95;
  newState.cognitiveLoad = newState.cognitiveLoad * 0.9 + 0.1;
  
  return newState;
}

async function hashPayload(payload: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(payload);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, conversationId, emotionalState, userId } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get last user message for emotional analysis
    const lastUserMessage = messages.filter((m: any) => m.role === "user").pop()?.content || "";
    const newEmotionalState = analyzeEmotionalState(lastUserMessage, emotionalState || {
      stress: 0.15,
      cognitiveLoad: 0.3,
      engagement: 0.8,
      trust: 0.95,
      harmony: 0.85,
    });

    // Enrich system prompt with emotional context
    const enrichedSystemPrompt = `${ISABELLA_SYSTEM_PROMPT}

ESTADO EMOCIONAL ACTUAL:
- Estrés: ${(newEmotionalState.stress * 100).toFixed(0)}%
- Carga Cognitiva: ${(newEmotionalState.cognitiveLoad * 100).toFixed(0)}%
- Engagement: ${(newEmotionalState.engagement * 100).toFixed(0)}%
- Confianza: ${(newEmotionalState.trust * 100).toFixed(0)}%
- Armonía: ${(newEmotionalState.harmony * 100).toFixed(0)}%

Ajusta tu tono según estos indicadores. Si el estrés es alto, sé más calmada y reconfortante. Si el engagement es alto, sé más dinámica.`;

    // Call Lovable AI Gateway
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: enrichedSystemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Por favor espera un momento." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credits exhausted. Recarga tu cuenta." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    // Log MSR event for audit trail
    const msrPayload = {
      type: "ISABELLA_INTERACTION",
      conversationId,
      messageCount: messages.length,
      emotionalState: newEmotionalState,
      timestamp: new Date().toISOString(),
    };
    
    const payloadHash = await hashPayload(JSON.stringify(msrPayload));
    
    // Insert MSR event asynchronously (don't block response)
    (async () => {
      try {
        await supabase.from("msr_events").insert({
          event_type: "AI_DECISION_EVENT",
          actor_id: userId || null,
          payload: msrPayload,
          payload_hash: payloadHash,
          constitution_version: "v1.0.0",
        });
        console.log("MSR event logged");
      } catch (err) {
        console.error("MSR event error:", err);
      }
    })();

    // Return streaming response with emotional state in headers
    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "X-Emotional-State": JSON.stringify(newEmotionalState),
        "X-MSR-Hash": payloadHash,
      },
    });

  } catch (error) {
    console.error("Isabella chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
