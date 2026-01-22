import { motion } from "framer-motion";
import { 
  Shield, AlertTriangle, Lock, Eye, Brain, 
  Activity, Clock, CheckCircle2, XOctagon,
  Zap, Heart, AlertCircle
} from "lucide-react";
import { useMSRLedgerStore, TimeUpState } from "@/stores/msrLedgerStore";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

const timeUpColors: Record<TimeUpState, { bg: string; text: string; label: string }> = {
  NORMAL: { bg: 'bg-green-500/20', text: 'text-green-500', label: 'Normal' },
  SOFT_LIMIT: { bg: 'bg-amber-500/20', text: 'text-amber-500', label: 'Límite Suave' },
  HARD_LIMIT: { bg: 'bg-orange-500/20', text: 'text-orange-500', label: 'Límite Duro' },
  SILENCE_MODE: { bg: 'bg-purple-500/20', text: 'text-purple-500', label: 'Modo Silencio' },
  LOCKDOWN: { bg: 'bg-destructive/20', text: 'text-destructive', label: 'Bloqueo' },
  PERMANENT_RESTRICTION: { bg: 'bg-destructive/20', text: 'text-destructive', label: 'Restricción Permanente' },
};

const SafetyMonitor = () => {
  const { safetyState, updateSafetyState, triggerTimeUp, addEvent } = useMSRLedgerStore();
  const timeUpConfig = timeUpColors[safetyState.timeUpStatus];

  const handleSimulateRisk = () => {
    const newThreatLevel = Math.min(100, safetyState.threatLevel + 25);
    updateSafetyState({ threatLevel: newThreatLevel });
    
    if (newThreatLevel > 75) {
      triggerTimeUp('HARD_LIMIT', 'Nivel de amenaza crítico detectado');
    } else if (newThreatLevel > 50) {
      triggerTimeUp('SOFT_LIMIT', 'Nivel de amenaza elevado');
    }
  };

  const handleReset = () => {
    updateSafetyState({
      timeUpStatus: 'NORMAL',
      threatLevel: 5,
      contentClassification: 'safe',
      behavioralScore: 95,
    });
    
    addEvent({
      type: 'SECURITY_EVENT',
      actor: 'did:tamv:system:safety',
      payloadHash: 'reset_' + Date.now(),
      constitutionVersion: '3.4.1',
      signature: 'ed25519:safety_reset',
      description: 'Reset manual del sistema Safety',
      severity: 'info',
    });
  };

  return (
    <div className="glass rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-muted">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-destructive to-amber-500 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground">Safety Monitor</h3>
              <p className="text-xs text-muted-foreground">TIME UP & Anubis Sentinel</p>
            </div>
          </div>
          
          <Badge className={`${timeUpConfig.bg} ${timeUpConfig.text}`}>
            {timeUpConfig.label}
          </Badge>
        </div>
      </div>

      {/* Main Metrics */}
      <div className="p-4 space-y-4">
        {/* Threat Level */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Nivel de Amenaza
            </span>
            <span className={`font-display font-bold ${
              safetyState.threatLevel > 75 ? 'text-destructive' :
              safetyState.threatLevel > 50 ? 'text-amber-500' : 'text-green-500'
            }`}>
              {safetyState.threatLevel}%
            </span>
          </div>
          <Progress 
            value={safetyState.threatLevel} 
            className="h-2"
          />
        </div>

        {/* Behavioral Score */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Score Comportamental
            </span>
            <span className={`font-display font-bold ${
              safetyState.behavioralScore > 80 ? 'text-green-500' :
              safetyState.behavioralScore > 50 ? 'text-amber-500' : 'text-destructive'
            }`}>
              {safetyState.behavioralScore}%
            </span>
          </div>
          <Progress 
            value={safetyState.behavioralScore} 
            className="h-2"
          />
        </div>

        {/* Content Classification */}
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
          <span className="text-sm text-muted-foreground flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Clasificación Contenido
          </span>
          <Badge className={
            safetyState.contentClassification === 'safe' ? 'bg-green-500/20 text-green-500' :
            safetyState.contentClassification === 'review' ? 'bg-amber-500/20 text-amber-500' :
            'bg-destructive/20 text-destructive'
          }>
            {safetyState.contentClassification === 'safe' ? 'Seguro' :
             safetyState.contentClassification === 'review' ? 'En revisión' : 'Bloqueado'}
          </Badge>
        </div>

        {/* Active Protocols */}
        <div className="p-3 bg-muted/30 rounded-lg">
          <span className="text-sm text-muted-foreground flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4" />
            Protocolos Activos
          </span>
          <div className="flex flex-wrap gap-2">
            {safetyState.activeProtocols.map((protocol) => (
              <Badge key={protocol} variant="outline" className="text-xs">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                {protocol}
              </Badge>
            ))}
          </div>
        </div>

        {/* TIME UP States */}
        <div className="grid grid-cols-3 gap-2">
          {(['NORMAL', 'SOFT_LIMIT', 'HARD_LIMIT', 'SILENCE_MODE', 'LOCKDOWN', 'PERMANENT_RESTRICTION'] as TimeUpState[]).map((state) => {
            const config = timeUpColors[state];
            const isActive = safetyState.timeUpStatus === state;
            
            return (
              <motion.div
                key={state}
                className={`p-2 rounded-lg text-center text-[10px] ${config.bg} ${config.text} ${
                  isActive ? 'ring-2 ring-current' : 'opacity-40'
                }`}
                animate={{ scale: isActive ? 1.05 : 1 }}
              >
                {config.label}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-muted flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1 text-xs"
          onClick={handleSimulateRisk}
        >
          <AlertCircle className="w-3 h-3 mr-1" />
          Simular Riesgo
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1 text-xs"
          onClick={handleReset}
        >
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Reset
        </Button>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-muted bg-muted/20">
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Último audit: {safetyState.lastAudit.toLocaleTimeString()}
          </span>
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3" />
            Dekateotl™ Active
          </span>
        </div>
      </div>
    </div>
  );
};

export default SafetyMonitor;
