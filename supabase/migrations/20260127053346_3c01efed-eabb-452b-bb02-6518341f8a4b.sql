-- NUBI Wallet & Transactions System
CREATE TABLE public.nubi_wallets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  balance NUMERIC(18,8) NOT NULL DEFAULT 0,
  locked_balance NUMERIC(18,8) NOT NULL DEFAULT 0,
  total_earned NUMERIC(18,8) NOT NULL DEFAULT 0,
  total_spent NUMERIC(18,8) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'NUBI',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Quantum-Split Transaction Types
CREATE TYPE transaction_split_type AS ENUM ('quantum_70_25', 'quantum_50_50', 'standard', 'gift', 'withdrawal');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'cancelled', 'locked');

CREATE TABLE public.nubi_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_id UUID NOT NULL REFERENCES public.nubi_wallets(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- credit, debit, split, transfer
  amount NUMERIC(18,8) NOT NULL,
  split_type transaction_split_type NOT NULL DEFAULT 'standard',
  -- Quantum-Split distribution
  creator_amount NUMERIC(18,8) DEFAULT 0,
  vault_amount NUMERIC(18,8) DEFAULT 0,
  fenix_amount NUMERIC(18,8) DEFAULT 0,
  status transaction_status NOT NULL DEFAULT 'pending',
  description TEXT,
  metadata JSONB DEFAULT '{}',
  reference_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Isabella Conversations for persistence
CREATE TABLE public.isabella_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT DEFAULT 'Nueva conversación',
  emotional_state JSONB DEFAULT '{"stress": 0.15, "cognitiveLoad": 0.3, "engagement": 0.8, "trust": 0.95, "harmony": 0.85}',
  memory_level TEXT DEFAULT 'contextual',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.isabella_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.isabella_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'isabella')),
  content TEXT NOT NULL,
  emotional_state JSONB,
  msr_event_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- BookPI / MSR Events for audit trail
CREATE TABLE public.msr_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  actor_id UUID REFERENCES auth.users(id),
  payload JSONB NOT NULL,
  payload_hash TEXT NOT NULL,
  constitution_version TEXT DEFAULT 'v1.0.0',
  signature TEXT,
  parent_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- DreamSpaces persistent worlds
CREATE TABLE public.dreamspaces (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  scene_type TEXT NOT NULL DEFAULT 'quantum-nexus',
  scene_config JSONB DEFAULT '{}',
  is_public BOOLEAN DEFAULT false,
  visitors INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.nubi_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nubi_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.isabella_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.isabella_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.msr_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dreamspaces ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own wallet" ON public.nubi_wallets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own transactions" ON public.nubi_transactions FOR SELECT USING (wallet_id IN (SELECT id FROM public.nubi_wallets WHERE user_id = auth.uid()));
CREATE POLICY "Users can view own conversations" ON public.isabella_conversations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create conversations" ON public.isabella_conversations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own conversations" ON public.isabella_conversations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can view messages in own conversations" ON public.isabella_messages FOR SELECT USING (conversation_id IN (SELECT id FROM public.isabella_conversations WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert messages in own conversations" ON public.isabella_messages FOR INSERT WITH CHECK (conversation_id IN (SELECT id FROM public.isabella_conversations WHERE user_id = auth.uid()));
CREATE POLICY "Anyone can view MSR events (audit trail)" ON public.msr_events FOR SELECT USING (true);
CREATE POLICY "Users can view public dreamspaces" ON public.dreamspaces FOR SELECT USING (is_public = true OR auth.uid() = owner_id);
CREATE POLICY "Users can create dreamspaces" ON public.dreamspaces FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update own dreamspaces" ON public.dreamspaces FOR UPDATE USING (auth.uid() = owner_id);

-- Auto-create wallet on user signup
CREATE OR REPLACE FUNCTION public.create_wallet_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.nubi_wallets (user_id, balance)
  VALUES (NEW.id, 100.00); -- Initial bonus
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created_wallet
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.create_wallet_for_user();

-- Updated_at triggers
CREATE TRIGGER update_nubi_wallets_updated_at BEFORE UPDATE ON public.nubi_wallets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_isabella_conversations_updated_at BEFORE UPDATE ON public.isabella_conversations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_dreamspaces_updated_at BEFORE UPDATE ON public.dreamspaces FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();