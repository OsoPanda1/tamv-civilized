import { create } from 'zustand';

export interface Message {
  id: string;
  role: 'user' | 'isabella';
  content: string;
  timestamp: Date;
  emotionalState?: EmotionalState;
}

export interface EmotionalState {
  stress: number;
  cognitiveLoad: number;
  engagement: number;
  trust: number;
  harmony: number;
}

interface IsabellaStore {
  messages: Message[];
  emotionalState: EmotionalState;
  isProcessing: boolean;
  memoryLevel: 'sensorial' | 'contextual' | 'episodica' | 'institucional' | 'historica';
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  setEmotionalState: (state: Partial<EmotionalState>) => void;
  setProcessing: (processing: boolean) => void;
  setMemoryLevel: (level: IsabellaStore['memoryLevel']) => void;
  clearMessages: () => void;
}

export const useIsabellaStore = create<IsabellaStore>((set) => ({
  messages: [],
  emotionalState: {
    stress: 0.15,
    cognitiveLoad: 0.3,
    engagement: 0.8,
    trust: 0.95,
    harmony: 0.85,
  },
  isProcessing: false,
  memoryLevel: 'contextual',
  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: crypto.randomUUID(),
          timestamp: new Date(),
        },
      ],
    })),
  setEmotionalState: (newState) =>
    set((state) => ({
      emotionalState: { ...state.emotionalState, ...newState },
    })),
  setProcessing: (processing) => set({ isProcessing: processing }),
  setMemoryLevel: (level) => set({ memoryLevel: level }),
  clearMessages: () => set({ messages: [] }),
}));
