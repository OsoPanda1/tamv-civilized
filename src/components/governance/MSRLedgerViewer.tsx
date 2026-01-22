import { motion } from "framer-motion";
import { 
  Link2, Shield, Brain, Scale, Coins, FileText, 
  AlertTriangle, Lock, Clock, Hash, ChevronRight,
  Activity, CheckCircle2, XCircle
} from "lucide-react";
import { useMSRLedgerStore, MSREventType } from "@/stores/msrLedgerStore";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const eventIcons: Record<MSREventType, typeof Shield> = {
  SYSTEM_EVENT: Activity,
  SECURITY_EVENT: Shield,
  ETHICAL_EVENT: Scale,
  GOVERNANCE_EVENT: FileText,
  ECONOMIC_EVENT: Coins,
  FOUNDATIONAL_EVENT: Link2,
  AI_DECISION_EVENT: Brain,
  SANCTION_EVENT: AlertTriangle,
  CONSTITUTIONAL_CHANGE: FileText,
  TIME_UP_EVENT: Clock,
  IA_DIGNITY_ATTACK: AlertTriangle,
};

const eventColors: Record<MSREventType, string> = {
  SYSTEM_EVENT: 'text-muted-foreground',
  SECURITY_EVENT: 'text-destructive',
  ETHICAL_EVENT: 'text-isabella',
  GOVERNANCE_EVENT: 'text-accent',
  ECONOMIC_EVENT: 'text-msr',
  FOUNDATIONAL_EVENT: 'text-primary',
  AI_DECISION_EVENT: 'text-isabella',
  SANCTION_EVENT: 'text-destructive',
  CONSTITUTIONAL_CHANGE: 'text-accent',
  TIME_UP_EVENT: 'text-amber-500',
  IA_DIGNITY_ATTACK: 'text-destructive',
};

const severityColors = {
  info: 'bg-muted text-muted-foreground',
  warning: 'bg-amber-500/20 text-amber-500',
  critical: 'bg-destructive/20 text-destructive',
};

const MSRLedgerViewer = () => {
  const { events, ledgerHeight, currentVersion, verifyChainIntegrity, getLedgerStats } = useMSRLedgerStore();
  const stats = getLedgerStats();
  const isIntegrityValid = verifyChainIntegrity();

  return (
    <div className="glass rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-muted">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-msr flex items-center justify-center">
              <Link2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground">MSR Ledger</h3>
              <p className="text-xs text-muted-foreground">Meta-System Registry</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isIntegrityValid ? (
              <Badge className="bg-green-500/20 text-green-500 gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Íntegro
              </Badge>
            ) : (
              <Badge className="bg-destructive/20 text-destructive gap-1">
                <XCircle className="w-3 h-3" />
                Error
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-2 p-4 border-b border-muted">
        <div className="text-center">
          <p className="text-2xl font-display font-bold text-msr">{ledgerHeight}</p>
          <p className="text-[10px] text-muted-foreground">Altura</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-display font-bold text-primary">{currentVersion}</p>
          <p className="text-[10px] text-muted-foreground">Versión</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-display font-bold text-accent">{stats.totalEvents}</p>
          <p className="text-[10px] text-muted-foreground">Eventos</p>
        </div>
      </div>

      {/* Events List */}
      <ScrollArea className="h-[300px]">
        <div className="p-4 space-y-3">
          {[...events].reverse().map((event, index) => {
            const Icon = eventIcons[event.type];
            const colorClass = eventColors[event.type];
            
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group bg-muted/30 rounded-lg p-3 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg bg-background flex items-center justify-center ${colorClass}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-muted-foreground">
                        #{event.id.slice(0, 8)}
                      </span>
                      <Badge className={severityColors[event.severity]} variant="secondary">
                        {event.severity}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-foreground truncate">
                      {event.description}
                    </p>
                    
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Hash className="w-3 h-3" />
                        {event.payloadHash.slice(0, 16)}...
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {event.timestamp.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-muted bg-muted/20">
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3" />
            Append-only • Hash encadenado • Firmado Ed25519
          </span>
          <span>BookPI v{currentVersion}</span>
        </div>
      </div>
    </div>
  );
};

export default MSRLedgerViewer;
