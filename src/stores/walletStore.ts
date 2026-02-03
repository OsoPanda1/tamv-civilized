import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

// Quantum-Split configurations based on ecosistema-nextgen-tamv
export type SplitType = 
  | 'quantum_70_25'    // Creator: 70%, Resilience: 25%, Phoenix: 5%
  | 'quantum_50_50'    // Creator: 50%, Community: 45%, Phoenix: 5%
  | 'quantum_80_15'    // Premium: 80%, Resilience: 15%, Phoenix: 5%
  | 'equal_split'      // 33/33/33
  | 'standard'         // Legacy
  | 'gift'
  | 'withdrawal';

export interface SplitConfig {
  id: SplitType;
  name: string;
  description: string;
  creator: number;
  resilience: number;
  phoenix: number;
}

export const SPLIT_CONFIGS: Record<SplitType, SplitConfig> = {
  quantum_70_25: {
    id: 'quantum_70_25',
    name: 'Quantum Standard',
    description: 'Distribución estándar para creadores',
    creator: 70,
    resilience: 25,
    phoenix: 5,
  },
  quantum_50_50: {
    id: 'quantum_50_50',
    name: 'Quantum Community',
    description: 'Distribución orientada a comunidad',
    creator: 50,
    resilience: 45,
    phoenix: 5,
  },
  quantum_80_15: {
    id: 'quantum_80_15',
    name: 'Quantum Premium',
    description: 'Para creadores premium verificados',
    creator: 80,
    resilience: 15,
    phoenix: 5,
  },
  equal_split: {
    id: 'equal_split',
    name: 'Distribución Equitativa',
    description: 'Partes iguales para todos',
    creator: 33,
    resilience: 34,
    phoenix: 33,
  },
  standard: {
    id: 'standard',
    name: 'Estándar',
    description: 'Sin split especial',
    creator: 100,
    resilience: 0,
    phoenix: 0,
  },
  gift: {
    id: 'gift',
    name: 'Regalo',
    description: 'Transacción de regalo',
    creator: 100,
    resilience: 0,
    phoenix: 0,
  },
  withdrawal: {
    id: 'withdrawal',
    name: 'Retiro',
    description: 'Retiro de fondos',
    creator: 100,
    resilience: 0,
    phoenix: 0,
  },
};

export interface Transaction {
  id: string;
  type: 'credit' | 'debit' | 'transfer' | 'split' | 'reward' | 'gift' | 'split_payout';
  amount: number;
  splitType: SplitType;
  creatorAmount: number;
  vaultAmount: number;
  fenixAmount: number;
  status: 'pending' | 'completed' | 'failed';
  description?: string;
  createdAt: Date;
}

export interface NubiWallet {
  id: string;
  userId: string;
  balance: number;
  lockedBalance: number;
  totalEarned: number;
  totalSpent: number;
  currency: string;
}

interface WalletStore {
  wallet: NubiWallet | null;
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  selectedSplitType: SplitType;
  
  // Setters
  setSplitType: (type: SplitType) => void;
  
  // API Actions
  fetchWallet: (userId: string) => Promise<void>;
  credit: (amount: number, description?: string) => Promise<boolean>;
  spend: (amount: number, splitType: SplitType, description?: string) => Promise<boolean>;
  transfer: (recipientId: string, amount: number, splitType: SplitType) => Promise<boolean>;
  fetchTransactions: () => Promise<void>;
  createTransaction: (params: {
    type: Transaction['type'];
    amount: number;
    description: string;
    splitType?: SplitType;
    recipientId?: string;
  }) => Promise<Transaction | null>;
  
  // Quantum-Split calculations
  calculateSplit: (amount: number, splitType: SplitType) => {
    creator: number;
    resilience: number;
    phoenix: number;
  };
}

export const useWalletStore = create<WalletStore>((set, get) => ({
  wallet: null,
  transactions: [],
  isLoading: false,
  error: null,
  selectedSplitType: 'quantum_70_25',

  setSplitType: (selectedSplitType) => set({ selectedSplitType }),

  calculateSplit: (amount: number, splitType: SplitType) => {
    const config = SPLIT_CONFIGS[splitType] || SPLIT_CONFIGS.quantum_70_25;
    return {
      creator: (amount * config.creator) / 100,
      resilience: (amount * config.resilience) / 100,
      phoenix: (amount * config.phoenix) / 100,
    };
  },

  fetchWallet: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.functions.invoke('nubi-transaction', {
        body: { action: 'balance', userId }
      });

      if (error) throw error;

      if (data.wallet) {
        set({
          wallet: {
            id: data.wallet.id,
            userId: data.wallet.user_id,
            balance: parseFloat(data.wallet.balance),
            lockedBalance: parseFloat(data.wallet.locked_balance || 0),
            totalEarned: parseFloat(data.wallet.total_earned || 0),
            totalSpent: parseFloat(data.wallet.total_spent || 0),
            currency: data.wallet.currency || 'NUBI',
          },
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Wallet fetch error:', error);
      set({ error: 'Failed to fetch wallet', isLoading: false });
    }
  },

  credit: async (amount: number, description?: string) => {
    const { wallet } = get();
    if (!wallet) return false;

    set({ isLoading: true });
    try {
      const { data, error } = await supabase.functions.invoke('nubi-transaction', {
        body: { 
          action: 'credit', 
          userId: wallet.userId, 
          amount, 
          description 
        }
      });

      if (error) throw error;

      set(state => ({
        wallet: state.wallet ? { ...state.wallet, balance: data.newBalance } : null,
        isLoading: false,
      }));

      return true;
    } catch (error) {
      set({ error: 'Credit failed', isLoading: false });
      return false;
    }
  },

  spend: async (amount: number, splitType: SplitType, description?: string) => {
    const { wallet } = get();
    if (!wallet) return false;

    set({ isLoading: true });
    try {
      const { data, error } = await supabase.functions.invoke('nubi-transaction', {
        body: { 
          action: 'spend', 
          userId: wallet.userId, 
          amount, 
          splitType,
          description 
        }
      });

      if (error) throw error;

      if (!data.success) {
        set({ error: data.error, isLoading: false });
        return false;
      }

      set(state => ({
        wallet: state.wallet ? { ...state.wallet, balance: data.newBalance } : null,
        isLoading: false,
      }));

      return true;
    } catch (error) {
      set({ error: 'Spend failed', isLoading: false });
      return false;
    }
  },

  transfer: async (recipientId: string, amount: number, splitType: SplitType) => {
    const { wallet } = get();
    if (!wallet) return false;

    set({ isLoading: true });
    try {
      const { data, error } = await supabase.functions.invoke('nubi-transaction', {
        body: { 
          action: 'transfer', 
          userId: wallet.userId, 
          recipientId,
          amount, 
          splitType 
        }
      });

      if (error) throw error;

      set(state => ({
        wallet: state.wallet ? { ...state.wallet, balance: data.newBalance } : null,
        isLoading: false,
      }));

      return true;
    } catch (error) {
      set({ error: 'Transfer failed', isLoading: false });
      return false;
    }
  },

  fetchTransactions: async () => {
    const { wallet } = get();
    if (!wallet) return;

    try {
      const { data, error } = await supabase
        .from('nubi_transactions')
        .select('*')
        .eq('wallet_id', wallet.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const transactions: Transaction[] = (data as any[])?.map(t => ({
        id: t.id,
        type: t.type,
        amount: parseFloat(t.amount),
        splitType: t.split_type || 'standard',
        creatorAmount: parseFloat(t.creator_amount || 0),
        vaultAmount: parseFloat(t.vault_amount || 0),
        fenixAmount: parseFloat(t.fenix_amount || 0),
        status: t.status,
        description: t.description,
        createdAt: new Date(t.created_at),
      })) || [];

      set({ transactions });
    } catch (error) {
      console.error('Transactions fetch error:', error);
    }
  },

  createTransaction: async (params) => {
    const { wallet, selectedSplitType, calculateSplit } = get();
    if (!wallet) return null;

    set({ isLoading: true });
    try {
      const splitType = params.splitType || selectedSplitType;
      const splitBreakdown = calculateSplit(params.amount, splitType);

      const { data, error } = await supabase.functions.invoke('nubi-transaction', {
        body: {
          action: params.type === 'credit' ? 'credit' : 'spend',
          userId: wallet.userId,
          amount: params.amount,
          description: params.description,
          splitType,
          recipientId: params.recipientId,
        },
      });

      if (error) throw error;

      const newTransaction: Transaction = {
        id: data?.transactionId || crypto.randomUUID(),
        type: params.type,
        amount: params.amount,
        splitType,
        creatorAmount: splitBreakdown.creator,
        vaultAmount: splitBreakdown.resilience,
        fenixAmount: splitBreakdown.phoenix,
        status: 'completed',
        description: params.description,
        createdAt: new Date(),
      };

      set((state) => ({
        transactions: [newTransaction, ...state.transactions],
        wallet: state.wallet && data?.newBalance !== undefined
          ? { ...state.wallet, balance: data.newBalance }
          : state.wallet,
        isLoading: false,
      }));

      return newTransaction;
    } catch (error) {
      console.error('Error creating transaction:', error);
      set({ isLoading: false });
      return null;
    }
  },
}));
