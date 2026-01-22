import { create } from 'zustand';

// MSR Ledger Event Types (as per architecture spec)
export type MSREventType = 
  | 'SYSTEM_EVENT'
  | 'SECURITY_EVENT'
  | 'ETHICAL_EVENT'
  | 'GOVERNANCE_EVENT'
  | 'ECONOMIC_EVENT'
  | 'FOUNDATIONAL_EVENT'
  | 'AI_DECISION_EVENT'
  | 'SANCTION_EVENT'
  | 'CONSTITUTIONAL_CHANGE'
  | 'TIME_UP_EVENT'
  | 'IA_DIGNITY_ATTACK';

export interface MSREvent {
  id: string;
  type: MSREventType;
  actor: string; // DID
  timestamp: Date;
  payloadHash: string;
  constitutionVersion: string;
  signature: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
  chainedHash?: string;
}

// BookPI Constitutional Article
export interface ConstitutionalArticle {
  code: string;
  version: string;
  status: 'active' | 'deprecated' | 'pending';
  title: string;
  text: string;
  effectiveFrom: Date;
  msrAnchor?: string;
  category: 'foundational' | 'operational' | 'ethical' | 'economic';
}

// TIME UP Protocol States
export type TimeUpState = 
  | 'NORMAL'
  | 'SOFT_LIMIT'
  | 'HARD_LIMIT'
  | 'SILENCE_MODE'
  | 'LOCKDOWN'
  | 'PERMANENT_RESTRICTION';

// Safety Module State
export interface SafetyState {
  timeUpStatus: TimeUpState;
  threatLevel: number; // 0-100
  contentClassification: 'safe' | 'review' | 'blocked';
  behavioralScore: number;
  lastAudit: Date;
  activeProtocols: string[];
}

interface MSRLedgerStore {
  // Ledger Events
  events: MSREvent[];
  addEvent: (event: Omit<MSREvent, 'id' | 'timestamp' | 'chainedHash'>) => void;
  
  // Constitution
  constitution: ConstitutionalArticle[];
  currentVersion: string;
  
  // Safety
  safetyState: SafetyState;
  updateSafetyState: (state: Partial<SafetyState>) => void;
  triggerTimeUp: (level: TimeUpState, reason: string) => void;
  
  // Chain integrity
  verifyChainIntegrity: () => boolean;
  getLastHash: () => string;
  
  // Stats
  ledgerHeight: number;
  getLedgerStats: () => {
    totalEvents: number;
    byType: Record<MSREventType, number>;
    lastEvent: MSREvent | null;
  };
}

// Generate a deterministic hash (simulated)
const generateHash = (data: string): string => {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return 'msr:' + Math.abs(hash).toString(16).padStart(16, '0');
};

// Initial Constitution
const initialConstitution: ConstitutionalArticle[] = [
  {
    code: 'DIGNIDAD_DIGITAL_01',
    version: '1.0.0',
    status: 'active',
    title: 'Dignidad Digital Humana',
    text: 'Todo ciudadano digital posee derechos inalienables sobre su identidad, datos y presencia en el ecosistema TAMV.',
    effectiveFrom: new Date('2024-01-01'),
    category: 'foundational',
  },
  {
    code: 'TIME_UP_PROTOCOL',
    version: '2.1.0',
    status: 'active',
    title: 'Protocolo TIME UP',
    text: 'Sistema de protección temporal que limita interacciones cuando se detecta riesgo psicológico o comportamiento perjudicial.',
    effectiveFrom: new Date('2024-01-01'),
    category: 'ethical',
  },
  {
    code: 'MSR_TRANSPARENCY',
    version: '1.2.0',
    status: 'active',
    title: 'Transparencia MSR',
    text: 'Todas las transacciones económicas y decisiones algorítmicas son registradas inmutablemente en el ledger MSR.',
    effectiveFrom: new Date('2024-01-01'),
    category: 'economic',
  },
  {
    code: 'ISABELLA_ETHICS',
    version: '3.0.0',
    status: 'active',
    title: 'Ética de Isabella AI',
    text: 'Isabella opera bajo principios de no-instrumentalización, explicabilidad y preservación de la autonomía humana.',
    effectiveFrom: new Date('2024-01-01'),
    category: 'ethical',
  },
  {
    code: 'IA_DIGNITY_ATTACK',
    version: '1.0.0',
    status: 'active',
    title: 'Protección contra Ataques a la Dignidad',
    text: 'Se activa cuando se detecta instrumentalización, deshumanización, manipulación emocional reiterada o explotación cognitiva.',
    effectiveFrom: new Date('2024-01-01'),
    category: 'foundational',
  },
];

// Initial Ledger Events
const initialEvents: MSREvent[] = [
  {
    id: 'genesis-001',
    type: 'FOUNDATIONAL_EVENT',
    actor: 'did:tamv:genesis:founder',
    timestamp: new Date('2024-01-01'),
    payloadHash: generateHash('TAMV_GENESIS'),
    constitutionVersion: '1.0.0',
    signature: 'ed25519:genesis_signature',
    description: 'Génesis del Ecosistema TAMV - Civilización Digital Soberana',
    severity: 'info',
    chainedHash: 'msr:0000000000000000',
  },
  {
    id: 'const-001',
    type: 'CONSTITUTIONAL_CHANGE',
    actor: 'did:tamv:governance:council',
    timestamp: new Date('2024-01-15'),
    payloadHash: generateHash('CONSTITUTION_V1'),
    constitutionVersion: '1.0.0',
    signature: 'ed25519:constitution_signature',
    description: 'Adopción de la Constitución Digital BookPI v1.0',
    severity: 'info',
  },
  {
    id: 'isabella-001',
    type: 'AI_DECISION_EVENT',
    actor: 'did:tamv:ai:isabella',
    timestamp: new Date(),
    payloadHash: generateHash('ISABELLA_INIT'),
    constitutionVersion: '3.0.0',
    signature: 'ed25519:isabella_signature',
    description: 'Isabella AI NextGen™ inicializada con ética EOCT',
    severity: 'info',
  },
];

export const useMSRLedgerStore = create<MSRLedgerStore>((set, get) => ({
  events: initialEvents,
  constitution: initialConstitution,
  currentVersion: '3.4.1',
  ledgerHeight: initialEvents.length,
  
  safetyState: {
    timeUpStatus: 'NORMAL',
    threatLevel: 5,
    contentClassification: 'safe',
    behavioralScore: 95,
    lastAudit: new Date(),
    activeProtocols: ['EOCT', 'Guardian', 'Dekateotl'],
  },
  
  addEvent: (eventData) => {
    const lastHash = get().getLastHash();
    const newEvent: MSREvent = {
      ...eventData,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      chainedHash: lastHash,
    };
    
    set((state) => ({
      events: [...state.events, newEvent],
      ledgerHeight: state.ledgerHeight + 1,
    }));
  },
  
  updateSafetyState: (newState) =>
    set((state) => ({
      safetyState: { ...state.safetyState, ...newState, lastAudit: new Date() },
    })),
  
  triggerTimeUp: (level, reason) => {
    const { addEvent, updateSafetyState } = get();
    
    updateSafetyState({ timeUpStatus: level });
    
    addEvent({
      type: 'TIME_UP_EVENT',
      actor: 'did:tamv:system:safety',
      payloadHash: generateHash(reason),
      constitutionVersion: get().currentVersion,
      signature: 'ed25519:safety_signature',
      description: `TIME UP activado: ${level} - ${reason}`,
      severity: level === 'LOCKDOWN' || level === 'PERMANENT_RESTRICTION' ? 'critical' : 'warning',
    });
  },
  
  verifyChainIntegrity: () => {
    const events = get().events;
    if (events.length <= 1) return true;
    
    for (let i = 1; i < events.length; i++) {
      if (events[i].chainedHash !== generateHash(JSON.stringify(events[i - 1]))) {
        return false;
      }
    }
    return true;
  },
  
  getLastHash: () => {
    const events = get().events;
    if (events.length === 0) return 'msr:0000000000000000';
    return generateHash(JSON.stringify(events[events.length - 1]));
  },
  
  getLedgerStats: () => {
    const events = get().events;
    const byType: Record<string, number> = {};
    
    events.forEach((event) => {
      byType[event.type] = (byType[event.type] || 0) + 1;
    });
    
    return {
      totalEvents: events.length,
      byType: byType as Record<MSREventType, number>,
      lastEvent: events.length > 0 ? events[events.length - 1] : null,
    };
  },
}));
