import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

export interface DreamSpace {
  id: string;
  title: string;
  slug?: string;
  description?: string;
  scene_type: string;
  role_civilizatorio?: string;
  phase?: string;
  is_public: boolean;
  visitors: number;
  cover_image_url?: string;
  min_level?: string;
  economic_loop?: Record<string, any>;
  ethical_limits?: Record<string, any>;
  created_at: string;
}

export interface DreamSpaceInstance {
  id: string;
  dreamspace_id: string;
  session_id: string;
  started_at: string;
  ended_at?: string;
  emotion_start?: string;
  emotion_end?: string;
  experience_points: number;
}

interface DreamSpacesState {
  spaces: DreamSpace[];
  currentSpace: DreamSpace | null;
  currentInstance: DreamSpaceInstance | null;
  userLevel: string;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchSpaces: () => Promise<void>;
  enterSpace: (spaceId: string, node?: string, cell?: string) => Promise<DreamSpaceInstance | null>;
  exitSpace: (instanceId: string, emotionEnd?: string, xp?: number) => Promise<void>;
  setCurrentSpace: (space: DreamSpace | null) => void;
}

export const useDreamSpacesStore = create<DreamSpacesState>((set, get) => ({
  spaces: [],
  currentSpace: null,
  currentInstance: null,
  userLevel: 'user',
  loading: false,
  error: null,

  fetchSpaces: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.functions.invoke('dreamspaces-api', {
        body: { path: '/list' },
        method: 'GET'
      });

      if (error) throw error;
      
      const response = typeof data === 'string' ? JSON.parse(data) : data;
      set({ 
        spaces: response.spaces || [], 
        userLevel: response.user_level || 'user',
        loading: false 
      });
    } catch (error: any) {
      console.error('[DreamSpaces Store] Error fetching spaces:', error);
      set({ error: error.message, loading: false });
    }
  },

  enterSpace: async (spaceId: string, node?: string, cell?: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.functions.invoke('dreamspaces-api', {
        body: { 
          dreamspace_id: spaceId,
          node: node || 'spawn',
          cell: cell || 'A1'
        },
        method: 'POST'
      });

      if (error) throw error;
      
      const response = typeof data === 'string' ? JSON.parse(data) : data;
      
      if (response.success) {
        const instance: DreamSpaceInstance = {
          id: response.instance_id,
          dreamspace_id: spaceId,
          session_id: response.session_id,
          started_at: response.started_at,
          emotion_start: 'serenidad',
          experience_points: 0
        };
        
        set({ 
          currentInstance: instance,
          currentSpace: response.space,
          loading: false 
        });
        
        return instance;
      } else {
        throw new Error(response.error || 'Failed to enter space');
      }
    } catch (error: any) {
      console.error('[DreamSpaces Store] Error entering space:', error);
      set({ error: error.message, loading: false });
      return null;
    }
  },

  exitSpace: async (instanceId: string, emotionEnd?: string, xp?: number) => {
    try {
      await supabase.functions.invoke('dreamspaces-api', {
        body: {
          instance_id: instanceId,
          emotion_end: emotionEnd || 'serenidad',
          experience_points: xp || 0
        },
        method: 'POST'
      });
      
      set({ currentInstance: null, currentSpace: null });
    } catch (error: any) {
      console.error('[DreamSpaces Store] Error exiting space:', error);
    }
  },

  setCurrentSpace: (space: DreamSpace | null) => {
    set({ currentSpace: space });
  }
}));
