import { motion } from "framer-motion";
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  Database,
  Cpu,
  Globe,
  Shield,
  Zap,
  Eye
} from "lucide-react";
import { useCivilizationStore } from "@/stores/civilizationStore";

const statusColors = {
  healthy: 'text-green-400',
  warning: 'text-yellow-400',
  critical: 'text-red-400',
};

const statusBg = {
  healthy: 'bg-green-400/10',
  warning: 'bg-yellow-400/10',
  critical: 'bg-red-400/10',
};

const metricIcons: Record<string, typeof Activity> = {
  'MSR Nodes Active': Globe,
  'Isabella Latency': Cpu,
  'DreamSpaces Online': Eye,
  'Transacciones 24h': Zap,
  'Dekateotl™ Alerts': Shield,
  'Uptime EOCT': CheckCircle2,
};

const BookPIObservability = () => {
  const { systemMetrics } = useCivilizationStore();

  const healthyCount = systemMetrics.filter(m => m.status === 'healthy').length;
  const warningCount = systemMetrics.filter(m => m.status === 'warning').length;
  const criticalCount = systemMetrics.filter(m => m.status === 'critical').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-msr flex items-center justify-center">
            <Database className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-foreground">
              BookPI™ Observability
            </h2>
            <p className="text-sm text-muted-foreground">
              Auditoría y transparencia del ecosistema
            </p>
          </div>
        </div>

        {/* Status Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl p-3 bg-green-400/10 border border-green-400/20">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span className="text-xs text-muted-foreground">Saludable</span>
            </div>
            <p className="font-display text-2xl font-bold text-green-400">{healthyCount}</p>
          </div>
          <div className="rounded-xl p-3 bg-yellow-400/10 border border-yellow-400/20">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              <span className="text-xs text-muted-foreground">Advertencia</span>
            </div>
            <p className="font-display text-2xl font-bold text-yellow-400">{warningCount}</p>
          </div>
          <div className="rounded-xl p-3 bg-red-400/10 border border-red-400/20">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-xs text-muted-foreground">Crítico</span>
            </div>
            <p className="font-display text-2xl font-bold text-red-400">{criticalCount}</p>
          </div>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {systemMetrics.map((metric, index) => {
          const Icon = metricIcons[metric.name] || Activity;
          
          return (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`glass rounded-xl p-4 border ${statusBg[metric.status]} border-${metric.status === 'healthy' ? 'green' : metric.status === 'warning' ? 'yellow' : 'red'}-400/20`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${statusBg[metric.status]} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${statusColors[metric.status]}`} />
                </div>
                <span className={`w-2 h-2 rounded-full ${metric.status === 'healthy' ? 'bg-green-400' : metric.status === 'warning' ? 'bg-yellow-400 animate-pulse' : 'bg-red-400 animate-pulse'}`} />
              </div>
              
              <h3 className="font-semibold text-foreground text-sm mb-1">{metric.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className={`font-display text-2xl font-bold ${statusColors[metric.status]}`}>
                  {metric.value.toLocaleString()}
                </span>
                <span className="text-xs text-muted-foreground">{metric.unit}</span>
              </div>
              
              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{metric.timestamp.toLocaleTimeString()}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Live Feed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-2xl p-4"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Activity className="w-4 h-4 text-electric" />
            Log de Auditoría en Vivo
          </h3>
          <span className="flex items-center gap-1 text-xs text-green-400">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            En vivo
          </span>
        </div>
        
        <div className="space-y-2 font-mono text-xs">
          {[
            { time: '14:32:45', level: 'INFO', msg: '[ISABELLA] Sesión de chat iniciada - User TAMV-777-EOCT' },
            { time: '14:32:43', level: 'INFO', msg: '[MSR] Bloque #847293 confirmado - 12 transacciones' },
            { time: '14:32:40', level: 'WARN', msg: '[DEKATEOTL] Patrón inusual detectado - Análisis en progreso' },
            { time: '14:32:38', level: 'INFO', msg: '[DREAMSPACE] Nuevo mundo instanciado - Quantum Nexus' },
            { time: '14:32:35', level: 'INFO', msg: '[EOCT] Checkpoint de resiliencia completado' },
          ].map((log, i) => (
            <div key={i} className="flex gap-2 text-muted-foreground">
              <span className="text-muted-foreground/50">{log.time}</span>
              <span className={log.level === 'WARN' ? 'text-yellow-400' : 'text-green-400'}>
                [{log.level}]
              </span>
              <span className="text-foreground">{log.msg}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Footer note */}
      <div className="text-center text-xs text-muted-foreground">
        BookPI™ - Sistema de Observabilidad Civilizatoria TAMV Online
      </div>
    </div>
  );
};

export default BookPIObservability;
