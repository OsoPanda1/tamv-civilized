// KAOS Audio Engine - Manage tracks and generate signed URLs
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
    const path = url.pathname.replace('/kaos-audio', '');
    
    // GET /tracks - List public tracks
    if (req.method === 'GET' && (path === '/tracks' || path === '' || path === '/')) {
      console.log('[KAOS] Listing tracks');
      
      let query = supabase
        .from('kaos_tracks')
        .select('id, title, description, genre, bpm, key_signature, duration_seconds, cover_url, emotional_tags, is_public, plays_count, likes_count, artist_id, created_at')
        .order('created_at', { ascending: false });

      // If not authenticated, only show public tracks
      if (!user) {
        query = query.eq('is_public', true);
      } else {
        // Show public tracks + user's own tracks
        query = query.or(`is_public.eq.true,artist_id.eq.${user.id}`);
      }

      const { data: tracks, error } = await query.limit(100);

      if (error) throw error;

      return new Response(JSON.stringify({
        success: true,
        tracks: tracks || [],
        total: tracks?.length || 0
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // GET /stream/:trackId - Get signed URL for streaming
    if (req.method === 'GET' && path.startsWith('/stream/')) {
      const trackId = path.replace('/stream/', '');
      
      console.log(`[KAOS] Streaming track ${trackId}`);

      // Get track info
      const { data: track, error: trackError } = await supabase
        .from('kaos_tracks')
        .select('*')
        .eq('id', trackId)
        .single();

      if (trackError || !track) {
        return new Response(JSON.stringify({ error: 'Track not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Check access
      if (!track.is_public && (!user || user.id !== track.artist_id)) {
        // Check if user is KAOS admin
        if (user) {
          const { data: roles } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .in('role', ['kaos_admin', 'dao_admin', 'admin']);
          
          if (!roles || roles.length === 0) {
            return new Response(JSON.stringify({ error: 'Access denied' }), {
              status: 403,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          }
        } else {
          return new Response(JSON.stringify({ error: 'Access denied' }), {
            status: 403,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
      }

      // Generate signed URL (10 minutes expiry)
      const { data: signedUrl, error: urlError } = await supabase.storage
        .from('kaos-music')
        .createSignedUrl(track.bucket_path, 60 * 10);

      if (urlError) throw urlError;

      // Increment play count
      await supabase
        .from('kaos_tracks')
        .update({ plays_count: (track.plays_count || 0) + 1 })
        .eq('id', trackId);

      console.log(`[KAOS] Signed URL generated for track ${trackId}`);

      return new Response(JSON.stringify({
        success: true,
        url: signedUrl.signedUrl,
        track: {
          id: track.id,
          title: track.title,
          artist_id: track.artist_id,
          duration_seconds: track.duration_seconds,
          bpm: track.bpm,
          emotional_tags: track.emotional_tags
        },
        expires_in: 600
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // POST /upload-track - Upload a new track (artist only)
    if (req.method === 'POST' && path === '/upload-track') {
      if (!user) {
        return new Response(JSON.stringify({ error: 'Authentication required' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const body = await req.json();
      const { title, description, genre, bpm, key_signature, duration_seconds, bucket_path, cover_url, emotional_tags, is_public } = body;

      if (!title || !bucket_path) {
        return new Response(JSON.stringify({ error: 'title and bucket_path required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      console.log(`[KAOS] User ${user.id} uploading track: ${title}`);

      // Create track record
      const { data: track, error } = await supabase
        .from('kaos_tracks')
        .insert({
          artist_id: user.id,
          title,
          description,
          genre,
          bpm,
          key_signature,
          duration_seconds,
          bucket_path,
          cover_url,
          emotional_tags: emotional_tags || [],
          is_public: is_public || false
        })
        .select()
        .single();

      if (error) throw error;

      // Log MSR event
      const eventPayload = {
        action: 'kaos_track_upload',
        track_id: track.id,
        artist_id: user.id,
        title
      };

      await supabase.from('msr_events').insert({
        event_type: 'KAOS_TRACK_UPLOAD',
        actor_id: user.id,
        payload: eventPayload,
        payload_hash: await sha256(JSON.stringify(eventPayload)),
        constitution_version: 'v1.0.0'
      });

      return new Response(JSON.stringify({
        success: true,
        track
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // POST /like/:trackId - Like a track
    if (req.method === 'POST' && path.startsWith('/like/')) {
      if (!user) {
        return new Response(JSON.stringify({ error: 'Authentication required' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const trackId = path.replace('/like/', '');

      const { data: track, error } = await supabase
        .from('kaos_tracks')
        .update({ likes_count: supabase.rpc ? 1 : 1 }) // Will be incremented by trigger
        .eq('id', trackId)
        .select()
        .single();

      // Simple increment
      await supabase.rpc('increment_likes', { track_id: trackId }).catch(() => {
        // Fallback: direct update
        return supabase
          .from('kaos_tracks')
          .update({ likes_count: (track?.likes_count || 0) + 1 })
          .eq('id', trackId);
      });

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // GET /emotional-playlist/:mood - Get tracks by emotional tag
    if (req.method === 'GET' && path.startsWith('/emotional-playlist/')) {
      const mood = path.replace('/emotional-playlist/', '');
      
      console.log(`[KAOS] Getting emotional playlist for mood: ${mood}`);

      const { data: tracks, error } = await supabase
        .from('kaos_tracks')
        .select('id, title, description, genre, bpm, duration_seconds, cover_url, emotional_tags, plays_count')
        .eq('is_public', true)
        .contains('emotional_tags', [mood])
        .order('plays_count', { ascending: false })
        .limit(20);

      if (error) throw error;

      return new Response(JSON.stringify({
        success: true,
        mood,
        tracks: tracks || []
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[KAOS] Error:', error);
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
