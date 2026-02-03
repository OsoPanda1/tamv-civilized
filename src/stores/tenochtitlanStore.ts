import { create } from 'zustand';

// Estados ontológicos del sistema Tenochtitlan
export type OntologicalState = 
  | 'NORMAL'           // Máxima apertura civilizatoria
  | 'SOSPECHA'         // Microsegmentación silenciosa
  | 'CONTENCION'       // Redirección a laberinto cognitivo
  | 'AMENAZA_CIVILIZACIONAL'; // Protocolo Aztek Gods activado

export type SecurityLevel = 'standard' | 'elevated' | 'high' | 'maximum';

export interface SecurityGuardian {
  id: string;
  name: string;
  layers: number;
  status: 'active' | 'standby' | 'activated' | 'offline';
  description: string;
  capabilities: string[];
}

export interface ThreatIndicator {
  system: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: Date;
  resolved: boolean;
}

export interface TenochtitlanState {
  // Estado ontológico actual
  currentState: OntologicalState;
  securityLevel: SecurityLevel;
  
  // Guardianes del sistema
  guardians: SecurityGuardian[];
  
  // Indicadores de amenaza
  threatIndicators: ThreatIndicator[];
  overallThreatScore: number;
  
  // Métricas de seguridad
  iga: number; // Índice de Ganancia por Ataque
  attacksBlocked: number;
  honeypodCaptures: number;
  
  // Estado del laberinto infinito
  cognitiveLabyrinth: {
    active: boolean;
    trappedEntities: number;
    layers: number;
  };
}

// Guardianes predefinidos basados en el ecosistema
const DEFAULT_GUARDIANS: SecurityGuardian[] = [
  {
    id: 'anubis',
    name: 'ANUBIS CENTINEL',
    layers: 4,
    status: 'active',
    description: 'Sistema Primario - 4 Capas Encriptadas',
    capabilities: ['Identidad', 'Tráfico', 'Acceso', 'Registro'],
  },
  {
    id: 'horus',
    name: 'HORUS CENTINEL',
    layers: 10,
    status: 'standby',
    description: 'Standby Evolutivo - 6 Capas + 2 Ofuscación + 2 Aislamiento',
    capabilities: ['Monitoreo continuo', 'Análisis de patrones', 'Detección de anomalías'],
  },
  {
    id: 'dekateotl',
    name: 'DEKATEOTL',
    layers: 11,
    status: 'standby',
    description: 'Orquestación Suprema - Verificación Triple',
    capabilities: ['Consenso', 'Ética', 'Legal', 'Coordinación Total'],
  },
  {
    id: 'aztek-gods',
    name: 'AZTEK GODS',
    layers: 22,
    status: 'standby',
    description: 'Standby Absoluto - Máxima seguridad para continuidad',
    capabilities: ['Single point failure prevention', 'Captura protection', 'Total collapse prevention'],
  },
  {
    id: 'quetzalcoatl',
    name: 'QUETZALCOATL',
    layers: 6,
    status: 'active',
    description: 'Radar Anti-Fraude',
    capabilities: ['Lavado detection', 'Manipulación detection', 'Correlación multi-célula'],
  },
  {
    id: 'ojo-ra',
    name: 'OJO DE RA',
    layers: 5,
    status: 'active',
    description: 'Anti-Contenido Ilegal (NO censura ideas)',
    capabilities: ['Abuso detection', 'Explotación detection', 'Violencia ilegal detection'],
  },
];

interface TenochtitlanStoreActions {
  // Estado
  state: TenochtitlanState;
  
  // Actions
  setOntologicalState: (state: OntologicalState) => void;
  addThreatIndicator: (indicator: Omit<ThreatIndicator, 'timestamp'>) => void;
  resolveThreat: (system: string) => void;
  activateGuardian: (guardianId: string) => void;
  deactivateGuardian: (guardianId: string) => void;
  updateThreatScore: () => void;
  activateLabyrinth: () => void;
  deactivateLabyrinth: () => void;
  incrementHoneypodCapture: () => void;
  incrementBlockedAttacks: () => void;
}

export const useTenochtitlanStore = create<TenochtitlanStoreActions>((set, get) => ({
  state: {
    currentState: 'NORMAL',
    securityLevel: 'standard',
    guardians: DEFAULT_GUARDIANS,
    threatIndicators: [],
    overallThreatScore: 0,
    iga: 0.72, // > 0.7 indica sistema antifrágil
    attacksBlocked: 1247,
    honeypodCaptures: 89,
    cognitiveLabyrinth: {
      active: false,
      trappedEntities: 0,
      layers: 0,
    },
  },

  setOntologicalState: (newState) => {
    const securityLevelMap: Record<OntologicalState, SecurityLevel> = {
      NORMAL: 'standard',
      SOSPECHA: 'elevated',
      CONTENCION: 'high',
      AMENAZA_CIVILIZACIONAL: 'maximum',
    };

    set((s) => ({
      state: {
        ...s.state,
        currentState: newState,
        securityLevel: securityLevelMap[newState],
      },
    }));

    // Auto-activate guardians based on state
    if (newState === 'CONTENCION') {
      get().activateGuardian('horus');
    }
    if (newState === 'AMENAZA_CIVILIZACIONAL') {
      get().activateGuardian('dekateotl');
      get().activateGuardian('aztek-gods');
      get().activateLabyrinth();
    }
  },

  addThreatIndicator: (indicator) => {
    const newIndicator: ThreatIndicator = {
      ...indicator,
      timestamp: new Date(),
    };

    set((s) => ({
      state: {
        ...s.state,
        threatIndicators: [newIndicator, ...s.state.threatIndicators].slice(0, 100),
      },
    }));

    get().updateThreatScore();
  },

  resolveThreat: (system) => {
    set((s) => ({
      state: {
        ...s.state,
        threatIndicators: s.state.threatIndicators.map((t) =>
          t.system === system ? { ...t, resolved: true } : t
        ),
      },
    }));

    get().updateThreatScore();
  },

  activateGuardian: (guardianId) => {
    set((s) => ({
      state: {
        ...s.state,
        guardians: s.state.guardians.map((g) =>
          g.id === guardianId ? { ...g, status: 'activated' as const } : g
        ),
      },
    }));
  },

  deactivateGuardian: (guardianId) => {
    set((s) => ({
      state: {
        ...s.state,
        guardians: s.state.guardians.map((g) =>
          g.id === guardianId ? { ...g, status: 'standby' as const } : g
        ),
      },
    }));
  },

  updateThreatScore: () => {
    const { threatIndicators } = get().state;
    const unresolvedThreats = threatIndicators.filter((t) => !t.resolved);

    const severityWeights: Record<string, number> = {
      low: 0.1,
      medium: 0.25,
      high: 0.5,
      critical: 1.0,
    };

    const score = unresolvedThreats.reduce(
      (acc, t) => acc + (severityWeights[t.severity] || 0),
      0
    );

    const normalizedScore = Math.min(score / 5, 1);

    // Determine state based on score
    let newOntologicalState: OntologicalState = 'NORMAL';
    if (normalizedScore > 0.7) {
      newOntologicalState = 'AMENAZA_CIVILIZACIONAL';
    } else if (normalizedScore > 0.4) {
      newOntologicalState = 'CONTENCION';
    } else if (normalizedScore > 0.1) {
      newOntologicalState = 'SOSPECHA';
    }

    set((s) => ({
      state: {
        ...s.state,
        overallThreatScore: normalizedScore,
        currentState: newOntologicalState,
      },
    }));
  },

  activateLabyrinth: () => {
    set((s) => ({
      state: {
        ...s.state,
        cognitiveLabyrinth: {
          active: true,
          trappedEntities: s.state.cognitiveLabyrinth.trappedEntities,
          layers: Math.floor(Math.random() * 100) + 50,
        },
      },
    }));
  },

  deactivateLabyrinth: () => {
    set((s) => ({
      state: {
        ...s.state,
        cognitiveLabyrinth: {
          ...s.state.cognitiveLabyrinth,
          active: false,
        },
      },
    }));
  },

  incrementHoneypodCapture: () => {
    set((s) => ({
      state: {
        ...s.state,
        honeypodCaptures: s.state.honeypodCaptures + 1,
        cognitiveLabyrinth: {
          ...s.state.cognitiveLabyrinth,
          trappedEntities: s.state.cognitiveLabyrinth.trappedEntities + 1,
        },
        // Increase IGA when we capture attackers (system gets stronger)
        iga: Math.min(s.state.iga + 0.001, 1),
      },
    }));
  },

  incrementBlockedAttacks: () => {
    set((s) => ({
      state: {
        ...s.state,
        attacksBlocked: s.state.attacksBlocked + 1,
        iga: Math.min(s.state.iga + 0.0005, 1),
      },
    }));
  },
}));
