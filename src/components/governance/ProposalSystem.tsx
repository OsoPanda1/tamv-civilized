import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Scale, Vote, Users, Clock, AlertTriangle,
  CheckCircle2, XCircle, Brain, Lock, ChevronRight,
  Plus, FileText, Shield
} from "lucide-react";
import { 
  useGovernanceStore, 
  GovernanceProposal, 
  ProposalCategory,
  TIER_WEIGHTS,
  DAO_BLOCKED_CATEGORIES 
} from "@/stores/governanceStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  draft: { label: 'Borrador', color: 'text-muted-foreground', icon: FileText },
  review: { label: 'En Revisión', color: 'text-amber-500', icon: Clock },
  voting: { label: 'Votación', color: 'text-accent', icon: Vote },
  passed: { label: 'Aprobada', color: 'text-green-500', icon: CheckCircle2 },
  rejected: { label: 'Rechazada', color: 'text-destructive', icon: XCircle },
  vetoed: { label: 'Vetada', color: 'text-destructive', icon: Lock },
  sentenced: { label: 'Sentenciada', color: 'text-isabella', icon: Brain },
  implemented: { label: 'Implementada', color: 'text-green-500', icon: CheckCircle2 },
  appealed: { label: 'Apelada', color: 'text-amber-500', icon: AlertTriangle },
};

const categoryLabels: Record<ProposalCategory, { label: string; blocked: boolean }> = {
  COMMUNITY: { label: 'Comunidad', blocked: false },
  OPERATIONAL: { label: 'Operacional', blocked: false },
  CULTURAL: { label: 'Cultural', blocked: false },
  ECONOMIC: { label: 'Económica', blocked: true },
  STRUCTURAL: { label: 'Estructural', blocked: true },
  CONSTITUTIONAL: { label: 'Constitucional', blocked: true },
  EMERGENCY: { label: 'Emergencia', blocked: true },
};

interface ProposalCardProps {
  proposal: GovernanceProposal;
  onVote: (proposalId: string, direction: 'for' | 'against') => void;
  onRequestSentence: (proposalId: string) => void;
}

const ProposalCard = ({ proposal, onVote, onRequestSentence }: ProposalCardProps) => {
  const config = statusConfig[proposal.status];
  const StatusIcon = config.icon;
  const totalVotes = proposal.weightedVotesFor + proposal.weightedVotesAgainst;
  const forPercentage = totalVotes > 0 ? (proposal.weightedVotesFor / totalVotes) * 100 : 50;
  const isBlocked = DAO_BLOCKED_CATEGORIES.includes(proposal.category);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-4 hover:bg-muted/20 transition-colors"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge className={`${config.color} bg-current/10 text-xs`}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {config.label}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {categoryLabels[proposal.category].label}
            </Badge>
            {isBlocked && (
              <Badge variant="outline" className="text-xs text-destructive border-destructive/50">
                <Lock className="w-3 h-3 mr-1" />
                DAO Bloqueado
              </Badge>
            )}
          </div>
          <h4 className="font-display font-semibold text-foreground">
            {proposal.title}
          </h4>
        </div>
        
        {proposal.isabellaVerdict && (
          <div className="p-2 rounded-lg bg-isabella/20">
            <Brain className="w-4 h-4 text-isabella" />
          </div>
        )}
      </div>
      
      {/* Description */}
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {proposal.description}
      </p>
      
      {/* Voting Progress */}
      {proposal.status === 'voting' && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span className="text-green-500">A Favor: {proposal.weightedVotesFor}</span>
            <span className="text-destructive">En Contra: {proposal.weightedVotesAgainst}</span>
          </div>
          <div className="h-2 rounded-full bg-destructive/30 overflow-hidden">
            <motion.div
              className="h-full bg-green-500"
              initial={{ width: 0 }}
              animate={{ width: `${forPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-1">
            <span>Quórum: {totalVotes}/{proposal.quorumRequired}</span>
            {proposal.quorumReached && (
              <Badge className="bg-green-500/20 text-green-500 text-[10px]">
                Quórum alcanzado
              </Badge>
            )}
          </div>
        </div>
      )}
      
      {/* Isabella Verdict */}
      {proposal.isabellaVerdict && (
        <div className="mb-4 p-3 rounded-lg bg-isabella/10 border border-isabella/20">
          <div className="flex items-center gap-2 text-isabella font-medium text-sm mb-1">
            <Brain className="w-4 h-4" />
            Sentencia de Isabella
          </div>
          <p className="text-xs text-muted-foreground">
            Veredicto: <span className="font-medium text-foreground">
              {proposal.isabellaVerdict.verdict.toUpperCase()}
            </span>
          </p>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {proposal.isabellaVerdict.reasoning}
          </p>
        </div>
      )}
      
      {/* Meta */}
      <div className="flex items-center gap-4 text-[10px] text-muted-foreground mb-3">
        <span className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          {proposal.votes.length} votos
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {proposal.createdAt.toLocaleDateString()}
        </span>
      </div>
      
      {/* Actions */}
      <div className="flex gap-2">
        {proposal.status === 'voting' && !isBlocked && (
          <>
            <Button
              size="sm"
              className="flex-1 bg-green-500/20 text-green-500 hover:bg-green-500/30"
              onClick={() => onVote(proposal.id, 'for')}
            >
              A Favor
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1 border-destructive/50 text-destructive hover:bg-destructive/10"
              onClick={() => onVote(proposal.id, 'against')}
            >
              En Contra
            </Button>
          </>
        )}
        
        {proposal.hasConflict && !proposal.isabellaVerdict && (
          <Button
            size="sm"
            className="w-full bg-isabella/20 text-isabella hover:bg-isabella/30"
            onClick={() => onRequestSentence(proposal.id)}
          >
            <Brain className="w-3 h-3 mr-1" />
            Solicitar Sentencia Isabella
          </Button>
        )}
        
        {proposal.status === 'voting' && isBlocked && (
          <div className="w-full p-2 rounded-lg bg-destructive/10 text-center">
            <p className="text-xs text-destructive">
              <Lock className="w-3 h-3 inline mr-1" />
              Solo Guardianes+ pueden votar en esta categoría
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const ProposalSystem = () => {
  const { toast } = useToast();
  const { 
    proposals, 
    castVote, 
    createProposal,
    requestIsabellaSentence,
    getProposalStats,
  } = useGovernanceStore();
  
  const [isCreating, setIsCreating] = useState(false);
  const [newProposal, setNewProposal] = useState({
    title: '',
    description: '',
    category: 'COMMUNITY' as ProposalCategory,
  });
  const [isRequestingSentence, setIsRequestingSentence] = useState(false);
  
  const stats = getProposalStats();
  
  const handleVote = (proposalId: string, direction: 'for' | 'against') => {
    const success = castVote(proposalId, {
      voterId: 'current-user',
      voterDid: 'did:tamv:quantum:current',
      voterTier: 'architect',
      proposalId,
      direction,
    });
    
    if (success) {
      toast({
        title: "Voto registrado",
        description: `Tu voto ha sido registrado en el MSR Ledger.`,
      });
    }
  };
  
  const handleRequestSentence = async (proposalId: string) => {
    setIsRequestingSentence(true);
    try {
      await requestIsabellaSentence(proposalId, 'Conflicto en la propuesta');
      toast({
        title: "Sentencia emitida",
        description: "Isabella ha emitido su veredicto.",
      });
    } finally {
      setIsRequestingSentence(false);
    }
  };
  
  const handleCreate = () => {
    if (!newProposal.title || !newProposal.description) return;
    
    createProposal({
      ...newProposal,
      proposerId: 'current-user',
      proposerDid: 'did:tamv:quantum:current',
      proposerTier: 'architect',
      quorumRequired: 100,
      hasConflict: false,
    });
    
    setNewProposal({ title: '', description: '', category: 'COMMUNITY' });
    setIsCreating(false);
    
    toast({
      title: "Propuesta creada",
      description: "Tu propuesta ha sido registrada y está pendiente de revisión.",
    });
  };
  
  return (
    <div className="space-y-6">
      {/* Stats Header */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Total', value: stats.total, icon: FileText, color: 'text-muted-foreground' },
          { label: 'Activas', value: stats.active, icon: Vote, color: 'text-accent' },
          { label: 'Aprobadas', value: stats.passed, icon: CheckCircle2, color: 'text-green-500' },
          { label: 'Rechazadas', value: stats.rejected, icon: XCircle, color: 'text-destructive' },
          { label: 'Sentenciadas', value: stats.sentenced, icon: Brain, color: 'text-isabella' },
        ].map((stat) => (
          <div key={stat.label} className="glass rounded-lg p-3">
            <div className={`flex items-center gap-2 ${stat.color}`}>
              <stat.icon className="w-4 h-4" />
              <span className="text-xs">{stat.label}</span>
            </div>
            <p className={`font-display text-xl font-bold mt-1 ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>
      
      {/* DAO Restriction Notice */}
      <div className="glass rounded-xl p-4 border-l-4 border-amber-500">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-amber-500 shrink-0" />
          <div>
            <h4 className="font-display font-semibold text-foreground">
              Restricciones DAO Híbrida
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              Las DAOs híbridas <strong>NO tienen poder</strong> sobre decisiones 
              <span className="text-destructive"> económicas</span>, 
              <span className="text-destructive"> estructurales</span>, ni 
              <span className="text-destructive"> constitucionales</span>. 
              Estas categorías requieren autorización Fundacional o Consejo Técnico.
            </p>
          </div>
        </div>
      </div>
      
      {/* Create Proposal Button */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogTrigger asChild>
          <Button className="bg-gradient-isabella hover:opacity-90">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Propuesta
          </Button>
        </DialogTrigger>
        <DialogContent className="glass">
          <DialogHeader>
            <DialogTitle className="font-display">Crear Propuesta</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Input
              placeholder="Título de la propuesta"
              value={newProposal.title}
              onChange={(e) => setNewProposal((p) => ({ ...p, title: e.target.value }))}
            />
            <Textarea
              placeholder="Descripción detallada..."
              value={newProposal.description}
              onChange={(e) => setNewProposal((p) => ({ ...p, description: e.target.value }))}
              rows={4}
            />
            <Select
              value={newProposal.category}
              onValueChange={(v) => setNewProposal((p) => ({ ...p, category: v as ProposalCategory }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(categoryLabels).map(([key, { label, blocked }]) => (
                  <SelectItem key={key} value={key} disabled={blocked}>
                    {label} {blocked && '(Bloqueado)'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button className="w-full" onClick={handleCreate}>
              Crear Propuesta
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Proposals Tabs */}
      <Tabs defaultValue="active">
        <TabsList className="bg-muted/30">
          <TabsTrigger value="active">En Votación</TabsTrigger>
          <TabsTrigger value="review">En Revisión</TabsTrigger>
          <TabsTrigger value="completed">Completadas</TabsTrigger>
          <TabsTrigger value="sentenced">Sentenciadas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="mt-4">
          <div className="grid md:grid-cols-2 gap-4">
            {proposals.filter((p) => p.status === 'voting').map((proposal) => (
              <ProposalCard
                key={proposal.id}
                proposal={proposal}
                onVote={handleVote}
                onRequestSentence={handleRequestSentence}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="review" className="mt-4">
          <div className="grid md:grid-cols-2 gap-4">
            {proposals.filter((p) => p.status === 'review' || p.status === 'draft').map((proposal) => (
              <ProposalCard
                key={proposal.id}
                proposal={proposal}
                onVote={handleVote}
                onRequestSentence={handleRequestSentence}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="completed" className="mt-4">
          <div className="grid md:grid-cols-2 gap-4">
            {proposals.filter((p) => ['passed', 'rejected', 'implemented'].includes(p.status)).map((proposal) => (
              <ProposalCard
                key={proposal.id}
                proposal={proposal}
                onVote={handleVote}
                onRequestSentence={handleRequestSentence}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="sentenced" className="mt-4">
          <div className="grid md:grid-cols-2 gap-4">
            {proposals.filter((p) => p.status === 'sentenced' || p.isabellaVerdict).map((proposal) => (
              <ProposalCard
                key={proposal.id}
                proposal={proposal}
                onVote={handleVote}
                onRequestSentence={handleRequestSentence}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProposalSystem;
