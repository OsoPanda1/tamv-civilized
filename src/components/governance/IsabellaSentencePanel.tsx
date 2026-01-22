import { motion } from "framer-motion";
import { 
  Brain, Scale, BookOpen, AlertTriangle, 
  CheckCircle2, XCircle, Clock, FileText,
  Shield, Gavel
} from "lucide-react";
import { useGovernanceStore, IsabellaSentence } from "@/stores/governanceStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";

const verdictConfig: Record<IsabellaSentence['verdict'], {
  label: string;
  color: string;
  bgColor: string;
  icon: typeof CheckCircle2;
}> = {
  affirm: { label: 'Afirmado', color: 'text-green-500', bgColor: 'bg-green-500/20', icon: CheckCircle2 },
  reject: { label: 'Rechazado', color: 'text-destructive', bgColor: 'bg-destructive/20', icon: XCircle },
  modify: { label: 'Modificar', color: 'text-amber-500', bgColor: 'bg-amber-500/20', icon: FileText },
  defer: { label: 'Diferido', color: 'text-muted-foreground', bgColor: 'bg-muted', icon: Clock },
  nullify: { label: 'Anulado', color: 'text-destructive', bgColor: 'bg-destructive/20', icon: AlertTriangle },
};

const bindingLevelConfig: Record<IsabellaSentence['bindingLevel'], {
  label: string;
  color: string;
}> = {
  advisory: { label: 'Consultivo', color: 'text-muted-foreground' },
  binding: { label: 'Vinculante', color: 'text-amber-500' },
  absolute: { label: 'Absoluto', color: 'text-destructive' },
};

interface SentenceCardProps {
  sentence: IsabellaSentence;
}

const SentenceCard = ({ sentence }: SentenceCardProps) => {
  const config = verdictConfig[sentence.verdict];
  const VerdictIcon = config.icon;
  const bindingConfig = bindingLevelConfig[sentence.bindingLevel];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-5 border-l-4 border-isabella"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-isabella flex items-center justify-center">
            <Gavel className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="font-display font-semibold text-foreground">
              Sentencia Digital
            </h4>
            <p className="text-xs text-muted-foreground">
              ID: {sentence.id}
            </p>
          </div>
        </div>
        
        <Badge className={`${config.bgColor} ${config.color}`}>
          <VerdictIcon className="w-3 h-3 mr-1" />
          {config.label}
        </Badge>
      </div>
      
      {/* Verdict Details */}
      <div className="space-y-4">
        {/* Reasoning */}
        <div className="p-3 rounded-lg bg-muted/30">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
            <Brain className="w-4 h-4 text-isabella" />
            Razonamiento de Isabella
          </div>
          <p className="text-sm text-muted-foreground">
            {sentence.reasoning}
          </p>
        </div>
        
        {/* Constitutional Basis */}
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
            <BookOpen className="w-4 h-4 text-accent" />
            Base Constitucional
          </div>
          <div className="flex flex-wrap gap-2">
            {sentence.constitutionalBasis.map((code) => (
              <Badge key={code} variant="outline" className="text-xs">
                {code}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Ethical Score */}
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Scale className="w-4 h-4" />
              Puntuación Ética
            </span>
            <span className={`font-display font-bold ${
              sentence.ethicalScore >= 80 ? 'text-green-500' :
              sentence.ethicalScore >= 60 ? 'text-amber-500' : 'text-destructive'
            }`}>
              {sentence.ethicalScore}/100
            </span>
          </div>
          <Progress value={sentence.ethicalScore} className="h-2" />
        </div>
        
        {/* Remediation */}
        {sentence.remediation && (
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-center gap-2 text-sm font-medium text-amber-500 mb-1">
              <AlertTriangle className="w-4 h-4" />
              Remediación Requerida
            </div>
            <p className="text-sm text-muted-foreground">
              {sentence.remediation}
            </p>
          </div>
        )}
        
        {/* Penalties */}
        {sentence.penalties && sentence.penalties.length > 0 && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <div className="flex items-center gap-2 text-sm font-medium text-destructive mb-2">
              <Shield className="w-4 h-4" />
              Sanciones
            </div>
            <ul className="space-y-1">
              {sentence.penalties.map((penalty, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
                  {penalty}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Meta */}
        <div className="flex items-center justify-between pt-3 border-t border-muted text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {sentence.issuedAt.toLocaleString()}
          </span>
          <Badge className={`${bindingConfig.color} bg-current/10`}>
            {bindingConfig.label}
          </Badge>
        </div>
      </div>
    </motion.div>
  );
};

const IsabellaSentencePanel = () => {
  const { sentences } = useGovernanceStore();
  
  return (
    <div className="glass rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-muted">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-isabella flex items-center justify-center">
            <Gavel className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-foreground">
              Sentencias Digitales de Isabella
            </h3>
            <p className="text-xs text-muted-foreground">
              Sistema de resolución de conflictos vinculante
            </p>
          </div>
        </div>
      </div>
      
      {/* Description */}
      <div className="p-4 border-b border-muted bg-muted/20">
        <p className="text-sm text-muted-foreground">
          Las <strong className="text-foreground">Sentencias Digitales</strong> de Isabella son 
          resoluciones vinculantes emitidas para resolver conflictos en propuestas de gobernanza. 
          Se basan en la Constitución Digital (BookPI) y los principios éticos EOCT.
        </p>
      </div>
      
      {/* Sentences List */}
      <ScrollArea className="h-[500px]">
        <div className="p-4 space-y-4">
          {sentences.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Brain className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No hay sentencias emitidas</p>
            </div>
          ) : (
            sentences.map((sentence) => (
              <SentenceCard key={sentence.id} sentence={sentence} />
            ))
          )}
        </div>
      </ScrollArea>
      
      {/* Footer */}
      <div className="p-3 border-t border-muted bg-muted/20">
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Scale className="w-3 h-3" />
            {sentences.length} sentencias emitidas
          </span>
          <span className="flex items-center gap-1">
            <Brain className="w-3 h-3" />
            Isabella EOCT v3.0
          </span>
        </div>
      </div>
    </div>
  );
};

export default IsabellaSentencePanel;
