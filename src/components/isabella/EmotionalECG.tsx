import { motion } from "framer-motion";
import { useIsabellaStore } from "@/stores/isabellaStore";
import { Heart, Brain, Zap, Shield, Sparkles } from "lucide-react";

const MetricBar = ({ 
  label, 
  value, 
  icon: Icon, 
  color 
}: { 
  label: string; 
  value: number; 
  icon: React.ElementType; 
  color: string;
}) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="text-muted-foreground">{label}</span>
      </div>
      <span className="font-mono text-foreground">{(value * 100).toFixed(0)}%</span>
    </div>
    <div className="h-2 bg-muted rounded-full overflow-hidden">
      <motion.div
        className={`h-full rounded-full ${color.replace('text-', 'bg-')}`}
        initial={{ width: 0 }}
        animate={{ width: `${value * 100}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>
  </div>
);

const ECGWave = () => {
  const { emotionalState } = useIsabellaStore();
  
  // Generate ECG-like path based on emotional state
  const generatePath = () => {
    const amplitude = emotionalState.engagement * 30;
    const frequency = 1 + emotionalState.stress * 2;
    let path = "M 0 50";
    
    for (let x = 0; x <= 300; x += 5) {
      const baseWave = Math.sin(x * 0.05 * frequency) * amplitude;
      const spike = x % 60 < 10 ? Math.sin((x % 60) * 0.3) * 40 : 0;
      const y = 50 - baseWave - spike;
      path += ` L ${x} ${y}`;
    }
    
    return path;
  };

  return (
    <div className="relative h-24 w-full overflow-hidden rounded-xl bg-gradient-to-r from-isabella/10 to-electric/10 border border-isabella/20">
      <svg 
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 300 100"
        preserveAspectRatio="none"
      >
        <motion.path
          d={generatePath()}
          fill="none"
          stroke="url(#ecgGradient)"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        <defs>
          <linearGradient id="ecgGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--isabella))" />
            <stop offset="50%" stopColor="hsl(var(--electric))" />
            <stop offset="100%" stopColor="hsl(var(--isabella))" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Scanning line effect */}
      <motion.div
        className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-isabella to-transparent"
        animate={{ x: [0, 300, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />
      
      <div className="absolute top-2 left-3 text-xs font-mono text-isabella/70">
        ECG EMOCIONAL
      </div>
      <div className="absolute bottom-2 right-3 text-xs font-mono text-electric/70">
        {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

const EmotionalECG = () => {
  const { emotionalState, memoryLevel } = useIsabellaStore();

  const memoryLevels = [
    { key: 'sensorial', label: 'Sensorial', desc: 'Buffer inmediato' },
    { key: 'contextual', label: 'Contextual', desc: 'ECG Emocional' },
    { key: 'episodica', label: 'Episódica', desc: 'Historia compartida' },
    { key: 'institucional', label: 'Institucional', desc: 'Guardrails EOCT' },
    { key: 'historica', label: 'Histórica', desc: 'Anclaje MSR' },
  ];

  return (
    <div className="glass rounded-2xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-foreground">
          Estado Emocional
        </h3>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-muted-foreground">En línea</span>
        </div>
      </div>

      <ECGWave />

      <div className="space-y-4">
        <MetricBar
          label="Nivel de Estrés"
          value={emotionalState.stress}
          icon={Zap}
          color="text-orange-400"
        />
        <MetricBar
          label="Carga Cognitiva"
          value={emotionalState.cognitiveLoad}
          icon={Brain}
          color="text-electric"
        />
        <MetricBar
          label="Engagement"
          value={emotionalState.engagement}
          icon={Heart}
          color="text-isabella"
        />
        <MetricBar
          label="Nivel de Confianza"
          value={emotionalState.trust}
          icon={Shield}
          color="text-anubis"
        />
        <MetricBar
          label="Armonía"
          value={emotionalState.harmony}
          icon={Sparkles}
          color="text-green-400"
        />
      </div>

      {/* Memory Levels */}
      <div className="pt-4 border-t border-muted">
        <h4 className="text-sm font-semibold text-muted-foreground mb-3">
          Nivel de Memoria Activo
        </h4>
        <div className="flex flex-wrap gap-2">
          {memoryLevels.map((level, index) => (
            <motion.div
              key={level.key}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                memoryLevel === level.key
                  ? 'bg-isabella text-white'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              L{index + 1}: {level.label}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmotionalECG;
