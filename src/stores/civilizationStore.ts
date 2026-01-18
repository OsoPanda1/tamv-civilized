import { create } from 'zustand';

// L0 - Identity Layer Types
export interface SovereignIdentity {
  id: string;
  displayName: string;
  did: string; // Decentralized Identifier
  tier: 'citizen' | 'architect' | 'guardian' | 'celestial';
  karmaScore: number;
  msrReputation: number;
  walletBalance: number;
  createdAt: Date;
}

// L1 - Economy Layer Types
export interface WalletTransaction {
  id: string;
  type: 'income' | 'expense' | 'transfer' | 'reward';
  amount: number;
  description: string;
  counterparty?: string;
  timestamp: Date;
  msrHash?: string;
}

// L2 - Social Layer Types
export interface SocialPost {
  id: string;
  authorId: string;
  authorName: string;
  authorTier: SovereignIdentity['tier'];
  content: string;
  resonanceCount: number;
  timestamp: Date;
}

// L3 - Economy Tokens
export interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'digital' | 'nft' | 'service' | 'experience';
  creatorId: string;
  creatorName: string;
  msrTokenId?: string;
  imageUrl?: string;
}

// L4 - XR DreamSpace
export interface DreamSpaceAsset {
  id: string;
  name: string;
  type: '3d-model' | 'audio' | 'texture' | 'shader';
  msrHash: string;
  ownerId: string;
}

// L5 - Governance
export interface GovernanceProposal {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'passed' | 'rejected' | 'pending';
  votesFor: number;
  votesAgainst: number;
  proposerId: string;
  createdAt: Date;
}

// L6 - BookPI Observability
export interface SystemMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
  timestamp: Date;
}

interface CivilizationStore {
  // Identity
  identity: SovereignIdentity | null;
  setIdentity: (identity: SovereignIdentity) => void;
  
  // Wallet
  transactions: WalletTransaction[];
  addTransaction: (transaction: Omit<WalletTransaction, 'id' | 'timestamp'>) => void;
  
  // Social
  socialFeed: SocialPost[];
  addPost: (post: Omit<SocialPost, 'id' | 'timestamp'>) => void;
  
  // Marketplace
  marketplaceItems: MarketplaceItem[];
  
  // Governance
  proposals: GovernanceProposal[];
  
  // System Metrics
  systemMetrics: SystemMetric[];
  updateMetric: (id: string, value: number, status: SystemMetric['status']) => void;
}

// Initial mock data
const mockIdentity: SovereignIdentity = {
  id: 'TAMV-777-EOCT',
  displayName: 'Explorador TAMV',
  did: 'did:tamv:quantum:0x7f8a9b2c3d4e5f6a7b8c9d0e1f2a3b4c',
  tier: 'architect',
  karmaScore: 847,
  msrReputation: 92.4,
  walletBalance: 12450.75,
  createdAt: new Date('2024-01-15'),
};

const mockTransactions: WalletTransaction[] = [
  { id: '1', type: 'income', amount: 500, description: 'Recompensa DreamSpace™', timestamp: new Date() },
  { id: '2', type: 'expense', amount: 75, description: 'NFT TAMVCrum Adquirido', timestamp: new Date() },
  { id: '3', type: 'reward', amount: 150, description: 'Bonus Karma Social', timestamp: new Date() },
  { id: '4', type: 'transfer', amount: 200, description: 'Transferencia P2P', counterparty: 'Guardian Maya', timestamp: new Date() },
];

const mockMarketplace: MarketplaceItem[] = [
  { id: '1', name: 'Avatar Quantum Obsidiana', description: 'Avatar 4D con shaders de lujo', price: 250, category: 'nft', creatorId: '1', creatorName: 'Artista TAMV' },
  { id: '2', name: 'Espacio DreamCraft', description: 'Template para DreamSpace personal', price: 500, category: 'experience', creatorId: '2', creatorName: 'Celestial Labs' },
  { id: '3', name: 'Pack Sonoro KAOS', description: 'Audio 3D espacial premium', price: 175, category: 'digital', creatorId: '3', creatorName: 'Sound Oracle' },
  { id: '4', name: 'Mentoría Isabella AI', description: 'Sesión 1:1 con IA avanzada', price: 350, category: 'service', creatorId: '4', creatorName: 'TAMV Official' },
];

const mockMetrics: SystemMetric[] = [
  { id: '1', name: 'MSR Nodes Active', value: 42, unit: 'nodos', status: 'healthy', timestamp: new Date() },
  { id: '2', name: 'Isabella Latency', value: 23, unit: 'ms', status: 'healthy', timestamp: new Date() },
  { id: '3', name: 'DreamSpaces Online', value: 1247, unit: 'mundos', status: 'healthy', timestamp: new Date() },
  { id: '4', name: 'Transacciones 24h', value: 8934, unit: 'tx', status: 'healthy', timestamp: new Date() },
  { id: '5', name: 'Dekateotl™ Alerts', value: 3, unit: 'alertas', status: 'warning', timestamp: new Date() },
  { id: '6', name: 'Uptime EOCT', value: 99.97, unit: '%', status: 'healthy', timestamp: new Date() },
];

export const useCivilizationStore = create<CivilizationStore>((set) => ({
  identity: mockIdentity,
  setIdentity: (identity) => set({ identity }),
  
  transactions: mockTransactions,
  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [
        {
          ...transaction,
          id: crypto.randomUUID(),
          timestamp: new Date(),
        },
        ...state.transactions,
      ],
    })),
  
  socialFeed: [],
  addPost: (post) =>
    set((state) => ({
      socialFeed: [
        {
          ...post,
          id: crypto.randomUUID(),
          timestamp: new Date(),
        },
        ...state.socialFeed,
      ],
    })),
  
  marketplaceItems: mockMarketplace,
  
  proposals: [],
  
  systemMetrics: mockMetrics,
  updateMetric: (id, value, status) =>
    set((state) => ({
      systemMetrics: state.systemMetrics.map((m) =>
        m.id === id ? { ...m, value, status, timestamp: new Date() } : m
      ),
    })),
}));
