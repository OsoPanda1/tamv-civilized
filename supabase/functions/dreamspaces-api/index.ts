// DreamSpaces API - List, Enter, and Manage DreamSpaces
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
    let user = null;
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user: authUser } } = await supabase.auth.getUser(token);
      user = authUser;
    }

    const url = new URL(req.url);
    const path = url.pathname.replace('/dreamspaces-api', '');
    
    // GET /list - List all public dreamspaces
    if (req.method === 'GET' && (path === '/list' || path === '' || path === '/')) {
      console.log('[DreamSpaces] Listing dreamspaces');
      
      const { data: spaces, error } = await supabase
        .from('dreamspaces')
        .select('id, title, slug, description, scene_type, role_civilizatorio, phase, is_public, visitors, cover_image_url, economic_loop, ethical_limits, created_at')
        .eq('is_public', true)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Get user's access level if authenticated
      let userLevel = 'user';
      if (user) {
        const { data: roles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);
        
        const roleHierarchy = ['user', 'citizen', 'builder', 'governor', 'admin', 'dao_admin'];
        if (roles) {
          for (const r of roles) {
            const idx = roleHierarchy.indexOf(r.role);
            if (idx > roleHierarchy.indexOf(userLevel)) {
              userLevel = r.role;
            }
          }
        }
      }

      return new Response(JSON.stringify({
        success: true,
        spaces: spaces || [],
        user_level: userLevel,
        total: spaces?.length || 0
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // POST /enter - Enter a DreamSpace (create instance)
    if (req.method === 'POST' && path === '/enter') {
      if (!user) {
        return new Response(JSON.stringify({ error: 'Authentication required' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const body = await req.json();
      const { dreamspace_id, node, cell } = body;

      if (!dreamspace_id) {
        return new Response(JSON.stringify({ error: 'dreamspace_id required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      console.log(`[DreamSpaces] User ${user.id} entering space ${dreamspace_id}`);

      // Get dreamspace
      const { data: space, error: spaceError } = await supabase
        .from('dreamspaces')
        .select('*')
        .eq('id', dreamspace_id)
        .single();

      if (spaceError || !space) {
        return new Response(JSON.stringify({ error: 'DreamSpace not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Check access level
      const minLevel = space.min_level || 'user';
      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      const roleHierarchy = ['user', 'citizen', 'builder', 'governor', 'admin', 'dao_admin'];
      let userLevel = 'user';
      if (userRoles) {
        for (const r of userRoles) {
          const idx = roleHierarchy.indexOf(r.role);
          if (idx > roleHierarchy.indexOf(userLevel)) {
            userLevel = r.role;
          }
        }
      }

      if (roleHierarchy.indexOf(userLevel) < roleHierarchy.indexOf(minLevel)) {
        return new Response(JSON.stringify({ 
          error: 'Access denied',
          required_level: minLevel,
          your_level: userLevel
        }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Create instance
      const { data: instance, error: instanceError } = await supabase
        .from('dreamspace_instances')
        .insert({
          dreamspace_id: space.id,
          user_id: user.id,
          node: node || 'spawn',
          cell: cell || 'A1',
          emotion_start: 'serenidad',
          msr_session_id: crypto.randomUUID()
        })
        .select()
        .single();

      if (instanceError) throw instanceError;

      // Increment visitors
      await supabase
        .from('dreamspaces')
        .update({ visitors: (space.visitors || 0) + 1 })
        .eq('id', space.id);

      // Log MSR event
      const eventPayload = {
        action: 'dreamspace_enter',
        space_id: space.id,
        space_title: space.title,
        user_id: user.id,
        instance_id: instance.id
      };

      await supabase.from('msr_events').insert({
        event_type: 'DREAMSPACE_ENTER',
        actor_id: user.id,
        payload: eventPayload,
        payload_hash: await sha256(JSON.stringify(eventPayload)),
        constitution_version: 'v1.0.0'
      });

      console.log(`[DreamSpaces] Instance created: ${instance.id}`);

      return new Response(JSON.stringify({
        success: true,
        instance_id: instance.id,
        session_id: instance.msr_session_id,
        space: {
          id: space.id,
          title: space.title,
          slug: space.slug,
          scene_type: space.scene_type,
          economic_loop: space.economic_loop,
          ethical_limits: space.ethical_limits
        },
        started_at: instance.started_at
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // POST /exit - Exit a DreamSpace
    if (req.method === 'POST' && path === '/exit') {
      if (!user) {
        return new Response(JSON.stringify({ error: 'Authentication required' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const body = await req.json();
      const { instance_id, emotion_end, experience_points } = body;

      if (!instance_id) {
        return new Response(JSON.stringify({ error: 'instance_id required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Update instance
      const { data: instance, error } = await supabase
        .from('dreamspace_instances')
        .update({
          ended_at: new Date().toISOString(),
          emotion_end: emotion_end || 'serenidad',
          experience_points: experience_points || 0
        })
        .eq('id', instance_id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      console.log(`[DreamSpaces] User ${user.id} exited instance ${instance_id}`);

      return new Response(JSON.stringify({
        success: true,
        instance,
        duration_seconds: instance.ended_at && instance.started_at 
          ? Math.floor((new Date(instance.ended_at).getTime() - new Date(instance.started_at).getTime()) / 1000)
          : 0
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // GET /my-instances - Get user's instances
    if (req.method === 'GET' && path === '/my-instances') {
      if (!user) {
        return new Response(JSON.stringify({ error: 'Authentication required' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const { data: instances, error } = await supabase
        .from('dreamspace_instances')
        .select(`
          *,
          dreamspaces (id, title, slug, scene_type)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      return new Response(JSON.stringify({
        success: true,
        instances: instances || []
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[DreamSpaces] Error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
