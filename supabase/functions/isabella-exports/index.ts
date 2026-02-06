// Isabella Exports - Generate and access emotional reports
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const url = new URL(req.url);
    const path = url.pathname.replace('/isabella-exports', '');
    
    // POST /generate - Generate emotional report for a conversation
    if (req.method === 'POST' && path === '/generate') {
      const body = await req.json();
      const { conversation_id } = body;

      if (!conversation_id) {
        return new Response(JSON.stringify({ error: 'conversation_id required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      console.log(`[Isabella Exports] Generating report for conversation ${conversation_id}`);

      // Get conversation and messages
      const { data: conversation, error: convError } = await supabase
        .from('isabella_conversations')
        .select('*')
        .eq('id', conversation_id)
        .eq('user_id', user.id)
        .single();

      if (convError || !conversation) {
        return new Response(JSON.stringify({ error: 'Conversation not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const { data: messages } = await supabase
        .from('isabella_messages')
        .select('*')
        .eq('conversation_id', conversation_id)
        .order('created_at', { ascending: true });

      // Analyze emotional journey
      const emotionalJourney = analyzeEmotionalJourney(messages || []);
      
      // Generate report content (simplified - in production use AI)
      const reportContent = generateReportContent(conversation, messages || [], emotionalJourney);
      
      // Store in bucket
      const fileName = `${user.id}/${conversation_id}/report-${new Date().toISOString().split('T')[0]}.json`;
      
      const { error: uploadError } = await supabase.storage
        .from('isabella-exports')
        .upload(fileName, JSON.stringify(reportContent), {
          contentType: 'application/json',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Create export record
      const { data: exportRecord, error: exportError } = await supabase
        .from('isabella_exports')
        .insert({
          user_id: user.id,
          conversation_id,
          export_type: 'emotional_report',
          bucket_path: fileName,
          title: `Reporte Emocional - ${conversation.title || 'Conversación'}`,
          emotional_summary: emotionalJourney,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
        })
        .select()
        .single();

      if (exportError) throw exportError;

      // Log MSR event
      await supabase.from('msr_events').insert({
        event_type: 'ISABELLA_EXPORT_GENERATED',
        actor_id: user.id,
        payload: {
          export_id: exportRecord.id,
          conversation_id,
          export_type: 'emotional_report'
        },
        payload_hash: await sha256(JSON.stringify({ export_id: exportRecord.id })),
        constitution_version: 'v1.0.0'
      });

      console.log(`[Isabella Exports] Report generated: ${exportRecord.id}`);

      return new Response(JSON.stringify({
        success: true,
        export: exportRecord,
        emotional_summary: emotionalJourney
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // GET /download/:exportId - Get signed URL for download
    if (req.method === 'GET' && path.startsWith('/download/')) {
      const exportId = path.replace('/download/', '');

      console.log(`[Isabella Exports] Downloading export ${exportId}`);

      // Get export record
      const { data: exportRecord, error } = await supabase
        .from('isabella_exports')
        .select('*')
        .eq('id', exportId)
        .eq('user_id', user.id)
        .single();

      if (error || !exportRecord) {
        return new Response(JSON.stringify({ error: 'Export not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Generate signed URL (5 minutes)
      const { data: signedUrl, error: urlError } = await supabase.storage
        .from('isabella-exports')
        .createSignedUrl(exportRecord.bucket_path, 60 * 5);

      if (urlError) throw urlError;

      return new Response(JSON.stringify({
        success: true,
        url: signedUrl.signedUrl,
        export: exportRecord,
        expires_in: 300
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // GET /list - List user's exports
    if (req.method === 'GET' && (path === '/list' || path === '' || path === '/')) {
      const { data: exports, error } = await supabase
        .from('isabella_exports')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      return new Response(JSON.stringify({
        success: true,
        exports: exports || []
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[Isabella Exports] Error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

interface EmotionalState {
  trust: number;
  harmony: number;
  engagement: number;
  stress: number;
  cognitiveLoad: number;
}

function analyzeEmotionalJourney(messages: any[]): any {
  if (messages.length === 0) {
    return {
      overall: 'neutral',
      start_state: null,
      end_state: null,
      peak_moments: [],
      average_metrics: { trust: 0.5, harmony: 0.5, engagement: 0.5, stress: 0.3, cognitiveLoad: 0.3 }
    };
  }

  const emotionalStates = messages
    .filter(m => m.emotional_state)
    .map(m => m.emotional_state as EmotionalState);

  if (emotionalStates.length === 0) {
    return {
      overall: 'neutral',
      start_state: null,
      end_state: null,
      peak_moments: [],
      average_metrics: { trust: 0.5, harmony: 0.5, engagement: 0.5, stress: 0.3, cognitiveLoad: 0.3 }
    };
  }

  const avgMetrics = {
    trust: emotionalStates.reduce((sum, s) => sum + (s.trust || 0.5), 0) / emotionalStates.length,
    harmony: emotionalStates.reduce((sum, s) => sum + (s.harmony || 0.5), 0) / emotionalStates.length,
    engagement: emotionalStates.reduce((sum, s) => sum + (s.engagement || 0.5), 0) / emotionalStates.length,
    stress: emotionalStates.reduce((sum, s) => sum + (s.stress || 0.3), 0) / emotionalStates.length,
    cognitiveLoad: emotionalStates.reduce((sum, s) => sum + (s.cognitiveLoad || 0.3), 0) / emotionalStates.length
  };

  let overall = 'neutral';
  if (avgMetrics.harmony > 0.7 && avgMetrics.stress < 0.3) overall = 'positive';
  else if (avgMetrics.stress > 0.6 || avgMetrics.harmony < 0.4) overall = 'challenging';

  return {
    overall,
    start_state: emotionalStates[0],
    end_state: emotionalStates[emotionalStates.length - 1],
    total_messages: messages.length,
    average_metrics: avgMetrics
  };
}

function generateReportContent(conversation: any, messages: any[], emotionalJourney: any): any {
  return {
    title: `Reporte Emocional Isabella`,
    generated_at: new Date().toISOString(),
    conversation: {
      id: conversation.id,
      title: conversation.title,
      started_at: conversation.created_at,
      memory_level: conversation.memory_level
    },
    emotional_journey: emotionalJourney,
    message_count: messages.length,
    insights: [
      emotionalJourney.overall === 'positive' 
        ? 'La conversación mostró un patrón emocional positivo y constructivo.'
        : emotionalJourney.overall === 'challenging'
        ? 'Se detectaron momentos de tensión que fueron procesados durante la conversación.'
        : 'La conversación mantuvo un tono neutral y equilibrado.',
      `Nivel de confianza promedio: ${Math.round(emotionalJourney.average_metrics.trust * 100)}%`,
      `Nivel de armonía promedio: ${Math.round(emotionalJourney.average_metrics.harmony * 100)}%`
    ],
    recommendations: [
      'Continúa explorando temas que te generen bienestar.',
      'Isabella está aquí para acompañarte en tu journey emocional.',
      'Recuerda que cada conversación contribuye a tu crecimiento personal.'
    ]
  };
}

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
