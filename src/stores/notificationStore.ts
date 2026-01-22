import { create } from 'zustand';
import { MSREventType, TimeUpState } from './msrLedgerStore';

// Notification Types for TAMV Omniverse
export type NotificationType = 
  | 'TIME_UP_ALERT'
  | 'MSR_CRITICAL'
  | 'GOVERNANCE_VOTE'
  | 'ISABELLA_SENTENCE'
  | 'SECURITY_BREACH'
  | 'PROPOSAL_UPDATE'
  | 'SYSTEM_INFO'
  | 'DIGNITY_ATTACK';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'critical';

export interface TAMVNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  timestamp: Date;
  read: boolean;
  dismissed: boolean;
  actionUrl?: string;
  metadata?: {
    eventId?: string;
    proposalId?: string;
    msrHash?: string;
    timeUpState?: TimeUpState;
    actorDid?: string;
  };
}

// Emergency Protocol States
export type EmergencyProtocol = 
  | 'NORMAL'
  | 'ELEVATED'
  | 'HIGH_ALERT'
  | 'CRISIS'
  | 'LOCKDOWN';

interface NotificationStore {
  // Notifications
  notifications: TAMVNotification[];
  unreadCount: number;
  
  // Emergency Protocol
  emergencyState: EmergencyProtocol;
  emergencyReason?: string;
  
  // Real-time connection status
  isConnected: boolean;
  lastHeartbeat: Date;
  
  // Actions
  addNotification: (notification: Omit<TAMVNotification, 'id' | 'timestamp' | 'read' | 'dismissed'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  dismissNotification: (id: string) => void;
  clearAll: () => void;
  
  // Emergency
  setEmergencyState: (state: EmergencyProtocol, reason?: string) => void;
  
  // Connection
  setConnected: (connected: boolean) => void;
  updateHeartbeat: () => void;
  
  // TIME UP specific
  triggerTimeUpNotification: (state: TimeUpState, reason: string) => void;
  
  // MSR specific  
  triggerMSRCriticalNotification: (eventType: MSREventType, description: string, eventId: string) => void;
  
  // Isabella Sentence
  triggerIsabellaSentence: (sentenceId: string, verdict: string, parties: string[]) => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  emergencyState: 'NORMAL',
  isConnected: true,
  lastHeartbeat: new Date(),
  
  addNotification: (notificationData) => {
    const newNotification: TAMVNotification = {
      ...notificationData,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      read: false,
      dismissed: false,
    };
    
    set((state) => ({
      notifications: [newNotification, ...state.notifications].slice(0, 100), // Keep last 100
      unreadCount: state.unreadCount + 1,
    }));
    
    // Auto-escalate emergency for critical notifications
    if (notificationData.priority === 'critical') {
      const current = get().emergencyState;
      if (current === 'NORMAL') {
        get().setEmergencyState('ELEVATED', notificationData.title);
      }
    }
  },
  
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),
  
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),
  
  dismissNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, dismissed: true } : n
      ),
    })),
  
  clearAll: () => set({ notifications: [], unreadCount: 0 }),
  
  setEmergencyState: (state, reason) =>
    set({ emergencyState: state, emergencyReason: reason }),
  
  setConnected: (connected) => set({ isConnected: connected }),
  
  updateHeartbeat: () => set({ lastHeartbeat: new Date() }),
  
  triggerTimeUpNotification: (state, reason) => {
    const priorityMap: Record<TimeUpState, NotificationPriority> = {
      NORMAL: 'low',
      SOFT_LIMIT: 'medium',
      HARD_LIMIT: 'high',
      SILENCE_MODE: 'high',
      LOCKDOWN: 'critical',
      PERMANENT_RESTRICTION: 'critical',
    };
    
    get().addNotification({
      type: 'TIME_UP_ALERT',
      title: `⚠️ TIME UP: ${state}`,
      message: reason,
      priority: priorityMap[state],
      metadata: { timeUpState: state },
    });
  },
  
  triggerMSRCriticalNotification: (eventType, description, eventId) => {
    const isCritical = ['IA_DIGNITY_ATTACK', 'SANCTION_EVENT', 'SECURITY_EVENT'].includes(eventType);
    
    get().addNotification({
      type: isCritical ? 'MSR_CRITICAL' : 'SYSTEM_INFO',
      title: `📋 MSR: ${eventType}`,
      message: description,
      priority: isCritical ? 'critical' : 'medium',
      actionUrl: '/governance?tab=ledger',
      metadata: { eventId },
    });
  },
  
  triggerIsabellaSentence: (sentenceId, verdict, parties) => {
    get().addNotification({
      type: 'ISABELLA_SENTENCE',
      title: '⚖️ Sentencia Digital de Isabella',
      message: `Veredicto emitido: ${verdict}. Partes involucradas: ${parties.join(', ')}`,
      priority: 'high',
      actionUrl: `/governance?sentence=${sentenceId}`,
      metadata: { eventId: sentenceId },
    });
  },
}));
