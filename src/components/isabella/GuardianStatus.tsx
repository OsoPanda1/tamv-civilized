import { motion } from "framer-motion";
import { Shield, CheckCircle2, AlertTriangle, Lock, Eye, Scale } from "lucide-react";

const GuardianStatus = () => {
  const guardrails = [
    { name: "Dekateotl™ Active", status: "active", icon: Shield },
    { name: "EOCT Compliance", status: "active", icon: CheckCircle2 },
    { name: "Privacy Filter", status: "active", icon: Lock },
    { name: "Ethical Audit", status: "active", icon: Scale },
    { name: "Bias Detection", status: "monitoring", icon: Eye },
    { name: "Content Safety", status: "active", icon: CheckCircle2 },
  ];

  return (
    <div className="glass rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-foreground">
          Guardian System
        </h3>
        <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">
          Protegido
        </div>
      </div>

      <div className="grid gap-3">
        {guardrails.map((guard, index) => (
          <motion.div
            key={guard.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <guard.icon className={`w-4 h-4 ${
                guard.status === 'active' ? 'text-green-400' : 'text-anubis'
              }`} />
              <span className="text-sm text-foreground">{guard.name}</span>
            </div>
            <div className={`w-2 h-2 rounded-full ${
              guard.status === 'active' ? 'bg-green-500' : 'bg-anubis animate-pulse'
            }`} />
          </motion.div>
        ))}
      </div>

      <div className="pt-4 border-t border-muted">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <AlertTriangle className="w-3 h-3 text-anubis" />
          <span>Última auditoría: hace 2 minutos</span>
        </div>
      </div>
    </div>
  );
};

export default GuardianStatus;
