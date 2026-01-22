import { motion } from "framer-motion";
import { 
  Brain, Cpu, Shield, Scale, FileText, 
  Zap, Activity, Sparkles, Network, Eye
} from "lucide-react";
import { useIsabellaStore } from "@/stores/isabellaStore";
import { useMSRLedgerStore } from "@/stores/msrLedgerStore";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Isabella Core Components as per architecture
const coreModules = [
  { id: 'intent-parser', name: 'Intent Parser', icon: Brain, status: 'active' },
  { id: 'context-builder', name: 'Context Builder', icon: Network, status: 'active' },
  { id: 'ethical-evaluator', name: 'Ethical Evaluator', icon: Scale, status: 'active' },
  { id: 'risk-scoring', name: 'Risk Scoring', icon: Shield, status: 'active' },
  { id: 'policy-interpreter', name: 'Policy Interpreter', icon: FileText, status: 'active' },
  { id: 'action-planner', name: 'Action Planner', icon: Zap, status: 'active' },
];

const IsabellaCore = () => {
  const { emotionalState, memoryLevel, isProcessing } = useIsabellaStore();
  const { safetyState } = useMSRLedgerStore();

  const memoryLevels = [
    { id: 'sensorial', label: 'Sensorial', description: 'Percepción inmediata' },
    { id: 'contextual', label: 'Contextual', description: 'Sesión actual' },
    { id: 'episodica', label: 'Episódica', description: 'Memorias individuales' },
    { id: 'institucional', label: 'Institucional', description: 'Patrones colectivos' },
    { id: 'historica', label: 'Histórica', description: 'Registro permanente' },
  ];

  return (
    <div className="glass rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-muted">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div 
              className="w-12 h-12 rounded-xl bg-gradient-isabella flex items-center justify-center"
              animate={{ 
                boxShadow: isProcessing 
                  ? ['0 0 20px rgba(168, 85, 247, 0.4)', '0 0 40px rgba(168, 85, 247, 0.6)', '0 0 20px rgba(168, 85, 247, 0.4)']
                  : '0 0 20px rgba(168, 85, 247, 0.3)'
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Brain className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h3 className="font-display font-semibold text-foreground">Isabella Core</h3>
              <p className="text-xs text-muted-foreground">Cerebro Semántico NextGen™</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-isabella animate-pulse" />
            <Badge className="bg-isabella/20 text-isabella">
              EOCT Active
            </Badge>
          </div>
        </div>
      </div>

      {/* Core Pipeline Flow */}
      <div className="p-4 border-b border-muted">
        <div className="text-xs text-muted-foreground mb-3 flex items-center gap-2">
          <Cpu className="w-4 h-4" />
          Pipeline de Procesamiento
        </div>
        
        <div className="flex items-center gap-1 overflow-x-auto pb-2">
          {['Input', 'Safety', 'Context', 'Ethics', 'Constitution', 'Decision', 'Event', 'Execution'].map((stage, index) => (
            <motion.div
              key={stage}
              className={`flex-shrink-0 px-2 py-1 rounded text-[10px] font-mono ${
                index <= 5 ? 'bg-isabella/20 text-isabella' : 'bg-muted text-muted-foreground'
              }`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {stage}
              {index < 7 && <span className="ml-1 text-muted-foreground">→</span>}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Core Modules Grid */}
      <div className="p-4 border-b border-muted">
        <div className="text-xs text-muted-foreground mb-3 flex items-center gap-2">
          <Network className="w-4 h-4" />
          Módulos Internos
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {coreModules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg"
            >
              <div className="w-6 h-6 rounded-md bg-isabella/20 flex items-center justify-center">
                <module.icon className="w-3.5 h-3.5 text-isabella" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-foreground truncate">{module.name}</p>
              </div>
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Memory Levels */}
      <div className="p-4 border-b border-muted">
        <div className="text-xs text-muted-foreground mb-3 flex items-center gap-2">
          <Eye className="w-4 h-4" />
          Niveles de Memoria (5 Capas)
        </div>
        
        <div className="space-y-2">
          {memoryLevels.map((level, index) => {
            const isActive = memoryLevel === level.id;
            
            return (
              <motion.div
                key={level.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center justify-between p-2 rounded-lg transition-all ${
                  isActive ? 'bg-isabella/20 ring-1 ring-isabella' : 'bg-muted/30'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-5 h-5 rounded-full text-[10px] font-display font-bold flex items-center justify-center ${
                    isActive ? 'bg-isabella text-white' : 'bg-muted text-muted-foreground'
                  }`}>
                    {index + 1}
                  </span>
                  <div>
                    <p className={`text-xs font-medium ${isActive ? 'text-isabella' : 'text-foreground'}`}>
                      {level.label}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{level.description}</p>
                  </div>
                </div>
                {isActive && <Activity className="w-4 h-4 text-isabella animate-pulse" />}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Emotional State Summary */}
      <div className="p-4">
        <div className="text-xs text-muted-foreground mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Estado Emocional
        </div>
        
        <div className="grid grid-cols-5 gap-2">
          {[
            { key: 'stress', label: 'Stress', color: 'bg-destructive' },
            { key: 'cognitiveLoad', label: 'Carga', color: 'bg-amber-500' },
            { key: 'engagement', label: 'Engage', color: 'bg-green-500' },
            { key: 'trust', label: 'Trust', color: 'bg-primary' },
            { key: 'harmony', label: 'Harmony', color: 'bg-isabella' },
          ].map(({ key, label, color }) => (
            <div key={key} className="text-center">
              <div className="h-16 bg-muted/30 rounded-lg overflow-hidden relative">
                <motion.div
                  className={`absolute bottom-0 left-0 right-0 ${color}`}
                  initial={{ height: 0 }}
                  animate={{ height: `${emotionalState[key as keyof typeof emotionalState] * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer - Restrictions */}
      <div className="p-3 border-t border-muted bg-muted/20">
        <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-green-500" />
            Safety OK requerido
          </span>
          <span className="flex items-center gap-1">
            <FileText className="w-3 h-3 text-amber-500" />
            MSR obligatorio
          </span>
          <span className="flex items-center gap-1">
            <Scale className="w-3 h-3 text-isabella" />
            BookPI read-only
          </span>
        </div>
      </div>
    </div>
  );
};

export default IsabellaCore;
