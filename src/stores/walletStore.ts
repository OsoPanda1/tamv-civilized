import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

export type SplitType = 'quantum_70_25' | 'quantum_50_50' | 'standard' | 'gift' | 'withdrawal';

export interface Transaction {
  id: string;
  type: 'credit' | 'debit' | 'transfer' | 'split';
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
  
  fetchWallet: (userId: string) => Promise<void>;
  credit: (amount: number, description?: string) => Promise<boolean>;
  spend: (amount: number, splitType: SplitType, description?: string) => Promise<boolean>;
  transfer: (recipientId: string, amount: number, splitType: SplitType) => Promise<boolean>;
  fetchTransactions: () => Promise<void>;
}

export const useWalletStore = create<WalletStore>((set, get) => ({
  wallet: null,
  transactions: [],
  isLoading: false,
  error: null,

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

      // Note: This will fail type check until types regenerate, using any cast
      const transactions: Transaction[] = (data as any[])?.map(t => ({
        id: t.id,
        type: t.type,
        amount: parseFloat(t.amount),
        splitType: t.split_type,
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
}));
