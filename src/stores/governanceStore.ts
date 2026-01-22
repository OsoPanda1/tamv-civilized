import { create } from 'zustand';
import { useMSRLedgerStore } from './msrLedgerStore';
import { useNotificationStore } from './notificationStore';

// Proposal Types - DAOs híbridas NO tienen poder sobre decisiones económicas ni estructura
export type ProposalCategory = 
  | 'COMMUNITY'      // Propuestas comunitarias (DAO puede votar)
  | 'OPERATIONAL'    // Operaciones (DAO puede votar)
  | 'CULTURAL'       // Cultura y eventos (DAO puede votar)
  | 'ECONOMIC'       // BLOQUEADO para DAOs - Solo Fundacional
  | 'STRUCTURAL'     // BLOQUEADO para DAOs - Solo Fundacional
  | 'CONSTITUTIONAL' // BLOQUEADO para DAOs - Solo Fundacional + Consejo Técnico
  | 'EMERGENCY';     // Solo Guardianes + Isabella

export type VoterTier = 'citizen' | 'architect' | 'guardian' | 'celestial' | 'founder';

// Pesos de votación ponderada
export const TIER_WEIGHTS: Record<VoterTier, number> = {
  citizen: 1,
  architect: 3,
  guardian: 7,
  celestial: 15,
  founder: 100, // Veto power on structural changes
};

// Categorías bloqueadas para DAOs
export const DAO_BLOCKED_CATEGORIES: ProposalCategory[] = ['ECONOMIC', 'STRUCTURAL', 'CONSTITUTIONAL'];

export type ProposalStatus = 
  | 'draft'
  | 'review'
  | 'voting'
  | 'passed'
  | 'rejected'
  | 'vetoed'
  | 'implemented'
  | 'appealed'
  | 'sentenced'; // Isabella ha emitido sentencia

export interface Vote {
  id: string;
  voterId: string;
  voterDid: string;
  voterTier: VoterTier;
  proposalId: string;
  direction: 'for' | 'against' | 'abstain';
  weight: number;
  timestamp: Date;
  msrHash?: string;
}

export interface GovernanceProposal {
  id: string;
  title: string;
  description: string;
  category: ProposalCategory;
  status: ProposalStatus;
  
  // Proposer info
  proposerId: string;
  proposerDid: string;
  proposerTier: VoterTier;
  
  // Voting
  votes: Vote[];
  weightedVotesFor: number;
  weightedVotesAgainst: number;
  quorumRequired: number;
  quorumReached: boolean;
  
  // Timeline
  createdAt: Date;
  votingStartsAt?: Date;
  votingEndsAt?: Date;
  implementedAt?: Date;
  
  // MSR anchoring
  msrEventId?: string;
  
  // Conflict resolution
  hasConflict: boolean;
  conflictParties?: string[];
  isabellaVerdict?: IsabellaSentence;
}

// Isabella Digital Sentence for conflict resolution
export interface IsabellaSentence {
  id: string;
  proposalId: string;
  verdict: 'affirm' | 'reject' | 'modify' | 'defer' | 'nullify';
  reasoning: string;
  constitutionalBasis: string[]; // BookPI article codes
  ethicalScore: number; // 0-100
  bindingLevel: 'advisory' | 'binding' | 'absolute';
  penalties?: string[];
  remediation?: string;
  issuedAt: Date;
  msrEventId: string;
}

interface GovernanceStore {
  // Proposals
  proposals: GovernanceProposal[];
  activeProposals: GovernanceProposal[];
  
  // Isabella Sentences
  sentences: IsabellaSentence[];
  
  // Actions
  createProposal: (proposal: Omit<GovernanceProposal, 'id' | 'createdAt' | 'votes' | 'weightedVotesFor' | 'weightedVotesAgainst' | 'quorumReached' | 'status'>) => string;
  
  castVote: (proposalId: string, vote: Omit<Vote, 'id' | 'timestamp' | 'weight'>) => boolean;
  
  moveToVoting: (proposalId: string) => void;
  
  closeVoting: (proposalId: string) => void;
  
  // Isabella Sentence
  requestIsabellaSentence: (proposalId: string, conflictDescription: string) => Promise<IsabellaSentence>;
  
  applyIsabellaSentence: (sentenceId: string) => void;
  
  // Validation
  canVote: (proposalId: string, voterTier: VoterTier) => boolean;
  
  isDAOBlocked: (category: ProposalCategory) => boolean;
  
  // Stats
  getProposalStats: () => {
    total: number;
    active: number;
    passed: number;
    rejected: number;
    sentenced: number;
  };
}

// Calculate quorum based on category
const calculateQuorum = (category: ProposalCategory): number => {
  switch (category) {
    case 'EMERGENCY': return 30;
    case 'COMMUNITY': return 100;
    case 'OPERATIONAL': return 150;
    case 'CULTURAL': return 100;
    case 'ECONOMIC': return 500;
    case 'STRUCTURAL': return 1000;
    case 'CONSTITUTIONAL': return 2000;
    default: return 100;
  }
};

// Mock proposals
const initialProposals: GovernanceProposal[] = [
  {
    id: 'prop-001',
    title: 'Expansión de DreamSpaces Públicos',
    description: 'Propuesta para crear 5 nuevos espacios públicos XR gratuitos para la comunidad TAMV.',
    category: 'COMMUNITY',
    status: 'voting',
    proposerId: 'user-001',
    proposerDid: 'did:tamv:quantum:0x7f8a9b2c',
    proposerTier: 'architect',
    votes: [],
    weightedVotesFor: 245,
    weightedVotesAgainst: 67,
    quorumRequired: 100,
    quorumReached: true,
    createdAt: new Date('2025-01-15'),
    votingStartsAt: new Date('2025-01-18'),
    votingEndsAt: new Date('2025-01-25'),
    hasConflict: false,
  },
  {
    id: 'prop-002',
    title: 'Protocolo de Mentoría Guardian',
    description: 'Establecer un programa formal de mentoría entre Guardianes y Ciudadanos.',
    category: 'OPERATIONAL',
    status: 'review',
    proposerId: 'user-002',
    proposerDid: 'did:tamv:quantum:0xa1b2c3d4',
    proposerTier: 'guardian',
    votes: [],
    weightedVotesFor: 0,
    weightedVotesAgainst: 0,
    quorumRequired: 150,
    quorumReached: false,
    createdAt: new Date('2025-01-20'),
    hasConflict: false,
  },
  {
    id: 'prop-003',
    title: 'Festival Cultural TAMV 2025',
    description: 'Organizar el primer festival cultural con conciertos 4D, arte digital y ceremonias.',
    category: 'CULTURAL',
    status: 'passed',
    proposerId: 'user-003',
    proposerDid: 'did:tamv:quantum:0xf5e4d3c2',
    proposerTier: 'celestial',
    votes: [],
    weightedVotesFor: 892,
    weightedVotesAgainst: 123,
    quorumRequired: 100,
    quorumReached: true,
    createdAt: new Date('2025-01-10'),
    votingStartsAt: new Date('2025-01-12'),
    votingEndsAt: new Date('2025-01-19'),
    implementedAt: new Date('2025-01-20'),
    hasConflict: false,
  },
];

const initialSentences: IsabellaSentence[] = [
  {
    id: 'sentence-001',
    proposalId: 'prop-archived-001',
    verdict: 'modify',
    reasoning: 'La propuesta original contenía elementos que podrían afectar la privacidad de los ciudadanos. Se ordena modificar la sección 3.2 para incluir consentimiento explícito.',
    constitutionalBasis: ['DIGNIDAD_DIGITAL_01', 'MSR_TRANSPARENCY'],
    ethicalScore: 78,
    bindingLevel: 'binding',
    remediation: 'Añadir cláusula de consentimiento antes de implementación.',
    issuedAt: new Date('2025-01-05'),
    msrEventId: 'msr-event-567',
  },
];

export const useGovernanceStore = create<GovernanceStore>((set, get) => ({
  proposals: initialProposals,
  activeProposals: initialProposals.filter((p) => p.status === 'voting'),
  sentences: initialSentences,
  
  createProposal: (proposalData) => {
    const id = `prop-${Date.now()}`;
    
    const newProposal: GovernanceProposal = {
      ...proposalData,
      id,
      createdAt: new Date(),
      votes: [],
      weightedVotesFor: 0,
      weightedVotesAgainst: 0,
      quorumReached: false,
      status: 'draft',
      quorumRequired: calculateQuorum(proposalData.category),
    };
    
    set((state) => ({
      proposals: [newProposal, ...state.proposals],
    }));
    
    // Register in MSR
    useMSRLedgerStore.getState().addEvent({
      type: 'GOVERNANCE_EVENT',
      actor: proposalData.proposerDid,
      payloadHash: `proposal:${id}`,
      constitutionVersion: '3.4.1',
      signature: `ed25519:proposal:${id}`,
      description: `Nueva propuesta: ${proposalData.title}`,
      severity: 'info',
    });
    
    return id;
  },
  
  castVote: (proposalId, voteData) => {
    const proposal = get().proposals.find((p) => p.id === proposalId);
    if (!proposal || proposal.status !== 'voting') return false;
    
    // Check if DAO blocked
    if (get().isDAOBlocked(proposal.category) && 
        !['guardian', 'celestial', 'founder'].includes(voteData.voterTier)) {
      return false;
    }
    
    const weight = TIER_WEIGHTS[voteData.voterTier];
    
    const newVote: Vote = {
      ...voteData,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      weight,
    };
    
    set((state) => ({
      proposals: state.proposals.map((p) => {
        if (p.id !== proposalId) return p;
        
        const updatedVotes = [...p.votes, newVote];
        const weightedFor = voteData.direction === 'for' 
          ? p.weightedVotesFor + weight 
          : p.weightedVotesFor;
        const weightedAgainst = voteData.direction === 'against'
          ? p.weightedVotesAgainst + weight
          : p.weightedVotesAgainst;
        
        return {
          ...p,
          votes: updatedVotes,
          weightedVotesFor: weightedFor,
          weightedVotesAgainst: weightedAgainst,
          quorumReached: weightedFor + weightedAgainst >= p.quorumRequired,
        };
      }),
    }));
    
    // Notification
    useNotificationStore.getState().addNotification({
      type: 'GOVERNANCE_VOTE',
      title: '🗳️ Nuevo voto registrado',
      message: `Voto ${voteData.direction} en: ${proposal.title}`,
      priority: 'low',
      metadata: { proposalId },
    });
    
    return true;
  },
  
  moveToVoting: (proposalId) => {
    const now = new Date();
    const votingEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
    
    set((state) => ({
      proposals: state.proposals.map((p) =>
        p.id === proposalId
          ? { ...p, status: 'voting', votingStartsAt: now, votingEndsAt: votingEnd }
          : p
      ),
      activeProposals: state.proposals.filter((p) => 
        p.id === proposalId || p.status === 'voting'
      ),
    }));
  },
  
  closeVoting: (proposalId) => {
    const proposal = get().proposals.find((p) => p.id === proposalId);
    if (!proposal) return;
    
    const passed = proposal.weightedVotesFor > proposal.weightedVotesAgainst && 
                   proposal.quorumReached;
    
    set((state) => ({
      proposals: state.proposals.map((p) =>
        p.id === proposalId
          ? { ...p, status: passed ? 'passed' : 'rejected' }
          : p
      ),
      activeProposals: state.activeProposals.filter((p) => p.id !== proposalId),
    }));
    
    // MSR Event
    useMSRLedgerStore.getState().addEvent({
      type: 'GOVERNANCE_EVENT',
      actor: 'did:tamv:system:governance',
      payloadHash: `voting:${proposalId}:${passed ? 'passed' : 'rejected'}`,
      constitutionVersion: '3.4.1',
      signature: `ed25519:voting:${proposalId}`,
      description: `Votación cerrada: ${proposal.title} - ${passed ? 'APROBADA' : 'RECHAZADA'}`,
      severity: passed ? 'info' : 'warning',
    });
    
    // Notification
    useNotificationStore.getState().addNotification({
      type: 'PROPOSAL_UPDATE',
      title: passed ? '✅ Propuesta Aprobada' : '❌ Propuesta Rechazada',
      message: proposal.title,
      priority: 'high',
      actionUrl: `/governance?proposal=${proposalId}`,
      metadata: { proposalId },
    });
  },
  
  requestIsabellaSentence: async (proposalId, conflictDescription) => {
    const proposal = get().proposals.find((p) => p.id === proposalId);
    if (!proposal) throw new Error('Proposal not found');
    
    // Simulate Isabella AI processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    const sentenceId = `sentence-${Date.now()}`;
    const verdicts: IsabellaSentence['verdict'][] = ['affirm', 'reject', 'modify', 'defer'];
    const randomVerdict = verdicts[Math.floor(Math.random() * verdicts.length)];
    
    const sentence: IsabellaSentence = {
      id: sentenceId,
      proposalId,
      verdict: randomVerdict,
      reasoning: `Tras analizar el conflicto: "${conflictDescription}", Isabella determina que ${
        randomVerdict === 'affirm' ? 'la propuesta es éticamente válida y debe proceder.' :
        randomVerdict === 'reject' ? 'la propuesta viola principios constitucionales y debe ser rechazada.' :
        randomVerdict === 'modify' ? 'la propuesta requiere modificaciones para cumplir estándares éticos.' :
        'se requiere más información antes de emitir un veredicto definitivo.'
      }`,
      constitutionalBasis: ['DIGNIDAD_DIGITAL_01', 'ISABELLA_ETHICS'],
      ethicalScore: Math.floor(Math.random() * 40) + 60,
      bindingLevel: proposal.category === 'CONSTITUTIONAL' ? 'absolute' : 'binding',
      issuedAt: new Date(),
      msrEventId: `msr-sentence-${sentenceId}`,
    };
    
    // Update proposal
    set((state) => ({
      proposals: state.proposals.map((p) =>
        p.id === proposalId
          ? { ...p, hasConflict: true, isabellaVerdict: sentence, status: 'sentenced' }
          : p
      ),
      sentences: [sentence, ...state.sentences],
    }));
    
    // MSR Event
    useMSRLedgerStore.getState().addEvent({
      type: 'AI_DECISION_EVENT',
      actor: 'did:tamv:ai:isabella',
      payloadHash: `sentence:${sentenceId}`,
      constitutionVersion: '3.4.1',
      signature: `ed25519:isabella:${sentenceId}`,
      description: `Sentencia Digital emitida: ${sentence.verdict.toUpperCase()} - ${proposal.title}`,
      severity: randomVerdict === 'reject' ? 'critical' : 'warning',
    });
    
    // Notification
    useNotificationStore.getState().triggerIsabellaSentence(
      sentenceId,
      sentence.verdict,
      proposal.conflictParties || [proposal.proposerDid]
    );
    
    return sentence;
  },
  
  applyIsabellaSentence: (sentenceId) => {
    const sentence = get().sentences.find((s) => s.id === sentenceId);
    if (!sentence) return;
    
    set((state) => ({
      proposals: state.proposals.map((p) =>
        p.id === sentence.proposalId
          ? { 
              ...p, 
              status: sentence.verdict === 'affirm' ? 'passed' :
                      sentence.verdict === 'reject' ? 'rejected' : 'sentenced'
            }
          : p
      ),
    }));
  },
  
  canVote: (proposalId, voterTier) => {
    const proposal = get().proposals.find((p) => p.id === proposalId);
    if (!proposal || proposal.status !== 'voting') return false;
    
    if (get().isDAOBlocked(proposal.category)) {
      return ['guardian', 'celestial', 'founder'].includes(voterTier);
    }
    
    return true;
  },
  
  isDAOBlocked: (category) => DAO_BLOCKED_CATEGORIES.includes(category),
  
  getProposalStats: () => {
    const proposals = get().proposals;
    return {
      total: proposals.length,
      active: proposals.filter((p) => p.status === 'voting').length,
      passed: proposals.filter((p) => p.status === 'passed').length,
      rejected: proposals.filter((p) => p.status === 'rejected').length,
      sentenced: proposals.filter((p) => p.status === 'sentenced').length,
    };
  },
}));
