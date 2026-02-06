import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

export interface KaosTrack {
  id: string;
  title: string;
  description?: string;
  genre?: string;
  bpm?: number;
  key_signature?: string;
  duration_seconds?: number;
  cover_url?: string;
  emotional_tags: string[];
  is_public: boolean;
  plays_count: number;
  likes_count: number;
  artist_id: string;
  created_at: string;
}

interface KaosState {
  tracks: KaosTrack[];
  currentTrack: KaosTrack | null;
  isPlaying: boolean;
  streamUrl: string | null;
  volume: number;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchTracks: () => Promise<void>;
  playTrack: (trackId: string) => Promise<void>;
  pauseTrack: () => void;
  resumeTrack: () => void;
  setVolume: (volume: number) => void;
  getEmotionalPlaylist: (mood: string) => Promise<KaosTrack[]>;
  likeTrack: (trackId: string) => Promise<void>;
}

export const useKaosStore = create<KaosState>((set, get) => ({
  tracks: [],
  currentTrack: null,
  isPlaying: false,
  streamUrl: null,
  volume: 0.7,
  loading: false,
  error: null,

  fetchTracks: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.functions.invoke('kaos-audio', {
        body: {},
        method: 'GET'
      });

      if (error) throw error;
      
      // Parse response - handle both direct response and nested data
      const response = typeof data === 'string' ? JSON.parse(data) : data;
      set({ tracks: response.tracks || [], loading: false });
    } catch (error: any) {
      console.error('[KAOS Store] Error fetching tracks:', error);
      set({ error: error.message, loading: false });
    }
  },

  playTrack: async (trackId: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.functions.invoke('kaos-audio', {
        body: { path: `/stream/${trackId}` },
        method: 'GET'
      });

      if (error) throw error;
      
      const response = typeof data === 'string' ? JSON.parse(data) : data;
      
      if (response.success && response.url) {
        set({
          currentTrack: response.track,
          streamUrl: response.url,
          isPlaying: true,
          loading: false
        });
      } else {
        throw new Error(response.error || 'Failed to get stream URL');
      }
    } catch (error: any) {
      console.error('[KAOS Store] Error playing track:', error);
      set({ error: error.message, loading: false, isPlaying: false });
    }
  },

  pauseTrack: () => {
    set({ isPlaying: false });
  },

  resumeTrack: () => {
    const { streamUrl } = get();
    if (streamUrl) {
      set({ isPlaying: true });
    }
  },

  setVolume: (volume: number) => {
    set({ volume: Math.max(0, Math.min(1, volume)) });
  },

  getEmotionalPlaylist: async (mood: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('kaos-audio', {
        body: { path: `/emotional-playlist/${mood}` },
        method: 'GET'
      });

      if (error) throw error;
      
      const response = typeof data === 'string' ? JSON.parse(data) : data;
      return response.tracks || [];
    } catch (error: any) {
      console.error('[KAOS Store] Error getting emotional playlist:', error);
      return [];
    }
  },

  likeTrack: async (trackId: string) => {
    try {
      await supabase.functions.invoke('kaos-audio', {
        body: { path: `/like/${trackId}` },
        method: 'POST'
      });
      
      // Update local state
      set(state => ({
        tracks: state.tracks.map(t => 
          t.id === trackId 
            ? { ...t, likes_count: t.likes_count + 1 }
            : t
        )
      }));
    } catch (error: any) {
      console.error('[KAOS Store] Error liking track:', error);
    }
  }
}));
