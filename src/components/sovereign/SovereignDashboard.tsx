import { motion } from "framer-motion";
import { 
  Shield, 
  Star, 
  Fingerprint, 
  Activity, 
  TrendingUp,
  Award,
  Zap,
  Globe
} from "lucide-react";
import { useCivilizationStore } from "@/stores/civilizationStore";
import { Progress } from "@/components/ui/progress";

const tierColors = {
  citizen: 'text-muted-foreground',
  architect: 'text-electric',
  guardian: 'text-isabella',
  celestial: 'text-accent',
};

const tierLabels = {
  citizen: 'L1 Citizen',
  architect: 'L2 Architect',
  guardian: 'L3 Guardian',
  celestial: 'L4 Celestial',
};

const tierProgress = {
  citizen: 25,
  architect: 50,
  guardian: 75,
  celestial: 100,
};

const SovereignDashboard = () => {
  const { identity } = useCivilizationStore();

  if (!identity) return null;

  const stats = [
    { label: 'Karma Social', value: identity.karmaScore, icon: Star, color: 'text-accent' },
    { label: 'Reputación MSR', value: `${identity.msrReputation}%`, icon: Shield, color: 'text-electric' },
    { label: 'Balance Wallet', value: `${identity.walletBalance.toLocaleString()} QS`, icon: Zap, color: 'text-dream' },
    { label: 'Edad Soberana', value: '347 días', icon: Globe, color: 'text-isabella' },
  ];

  return (
    <div className="space-y-6">
      {/* Identity Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6 relative overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-isabella/10 via-transparent to-electric/10 pointer-events-none" />
        
        <div className="relative">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-isabella flex items-center justify-center">
                <Fingerprint className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 border-2 border-background flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-display text-xl font-bold text-foreground">
                  {identity.displayName}
                </h2>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full bg-muted ${tierColors[identity.tier]}`}>
                  {tierLabels[identity.tier]}
                </span>
              </div>
              
              <p className="text-xs font-mono text-muted-foreground mb-3 truncate max-w-xs">
                {identity.did}
              </p>

              {/* Tier Progress */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Progreso de Tier</span>
                  <span className={tierColors[identity.tier]}>{tierProgress[identity.tier]}%</span>
                </div>
                <Progress value={tierProgress[identity.tier]} className="h-2" />
              </div>
            </div>
          </div>

          {/* ID Badge */}
          <div className="mt-4 pt-4 border-t border-muted">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-accent" />
                <span className="font-mono text-sm text-foreground">{identity.id}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                Desde {identity.createdAt.toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass rounded-xl p-4 hover:bg-muted/20 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
            <p className={`font-display text-xl font-bold ${stat.color}`}>
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Activity Feed Mini */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-2xl p-4"
      >
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-electric" />
          <h3 className="font-semibold text-foreground">Actividad Reciente</h3>
        </div>
        <div className="space-y-3">
          {[
            { action: 'Ingreso a DreamSpace™ Quantum Nexus', time: 'Hace 5 min' },
            { action: 'Interacción con Isabella AI', time: 'Hace 23 min' },
            { action: 'Transacción MSR confirmada', time: 'Hace 1 hora' },
          ].map((activity, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="text-foreground">{activity.action}</span>
              <span className="text-xs text-muted-foreground">{activity.time}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button className="glass rounded-xl p-4 hover:bg-muted/20 transition-colors group text-left">
          <TrendingUp className="w-5 h-5 text-dream mb-2 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium text-foreground">Subir de Tier</span>
          <p className="text-xs text-muted-foreground">Ver requisitos</p>
        </button>
        <button className="glass rounded-xl p-4 hover:bg-muted/20 transition-colors group text-left">
          <Shield className="w-5 h-5 text-isabella mb-2 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium text-foreground">Seguridad</span>
          <p className="text-xs text-muted-foreground">Dilithium-5 activo</p>
        </button>
      </div>
    </div>
  );
};

export default SovereignDashboard;
