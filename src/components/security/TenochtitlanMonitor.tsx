import { motion } from "framer-motion";
import { 
  Shield, 
  Eye, 
  AlertTriangle, 
  Lock, 
  Unlock, 
  Activity, 
  Zap,
  Brain,
  Radio,
  Layers,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { useTenochtitlanStore, type OntologicalState } from "@/stores/tenochtitlanStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const stateColors: Record<OntologicalState, string> = {
  NORMAL: 'text-green-400 bg-green-400/10 border-green-400/30',
  SOSPECHA: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  CONTENCION: 'text-orange-400 bg-orange-400/10 border-orange-400/30',
  AMENAZA_CIVILIZACIONAL: 'text-red-400 bg-red-400/10 border-red-400/30',
};

const stateDescriptions: Record<OntologicalState, string> = {
  NORMAL: 'Máxima apertura civilizatoria',
  SOSPECHA: 'Microsegmentación silenciosa activa',
  CONTENCION: 'Redirección a laberinto cognitivo',
  AMENAZA_CIVILIZACIONAL: 'Protocolo Aztek Gods activado',
};

const guardianIcons: Record<string, typeof Shield> = {
  anubis: Shield,
  horus: Eye,
  dekateotl: Brain,
  'aztek-gods': Zap,
  quetzalcoatl: Activity,
  'ojo-ra': Radio,
};

const TenochtitlanMonitor = () => {
  const { state, activateGuardian, deactivateGuardian, setOntologicalState } = useTenochtitlanStore();

  const threatPercentage = state.overallThreatScore * 100;
  const igaPercentage = state.iga * 100;

  return (
    <div className="space-y-6">
      {/* Estado Ontológico Principal */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className={`glass p-6 border ${stateColors[state.currentState]}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stateColors[state.currentState]}`}>
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-foreground">
                  TENOCHTITLAN CORE
                </h2>
                <p className="text-sm text-muted-foreground">
                  Sistema General de Protección TAMV
                </p>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-full text-sm font-medium ${stateColors[state.currentState]}`}>
              {state.currentState}
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            {stateDescriptions[state.currentState]}
          </p>

          {/* Estado Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-muted/30 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Nivel Seguridad</p>
              <p className="font-semibold text-foreground capitalize">{state.securityLevel}</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Ataques Bloqueados</p>
              <p className="font-semibold text-green-400">{state.attacksBlocked.toLocaleString()}</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Honeypods Capturados</p>
              <p className="font-semibold text-electric">{state.honeypodCaptures}</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Laberinto Infinito</p>
              <p className={`font-semibold ${state.cognitiveLabyrinth.active ? 'text-isabella' : 'text-muted-foreground'}`}>
                {state.cognitiveLabyrinth.active ? `${state.cognitiveLabyrinth.trappedEntities} atrapados` : 'Standby'}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* IGA & Threat Score */}
      <div className="grid md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass p-4 border-green-400/20">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <h3 className="font-semibold text-foreground">IGA (Índice de Ganancia por Ataque)</h3>
            </div>
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Sistema Antifrágil</span>
                <span className={`font-mono ${igaPercentage >= 70 ? 'text-green-400' : 'text-yellow-400'}`}>
                  {igaPercentage.toFixed(1)}%
                </span>
              </div>
              <Progress value={igaPercentage} className="h-3" />
            </div>
            <p className="text-xs text-muted-foreground">
              {igaPercentage >= 70 
                ? '✓ Sistema se fortalece con cada ataque'
                : '⚠ Requiere optimización antifrágil'}
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass p-4 border-red-400/20">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <h3 className="font-semibold text-foreground">Nivel de Amenaza</h3>
            </div>
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Score Agregado</span>
                <span className={`font-mono ${threatPercentage <= 20 ? 'text-green-400' : threatPercentage <= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {threatPercentage.toFixed(1)}%
                </span>
              </div>
              <Progress 
                value={threatPercentage} 
                className="h-3"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {state.threatIndicators.filter(t => !t.resolved).length} amenazas activas
            </p>
          </Card>
        </motion.div>
      </div>

      {/* Guardianes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="glass p-4">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-5 h-5 text-isabella" />
            <h3 className="font-semibold text-foreground">Guardianes del Sistema</h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {state.guardians.map((guardian, index) => {
              const Icon = guardianIcons[guardian.id] || Shield;
              const statusColors = {
                active: 'text-green-400 bg-green-400/10 border-green-400/30',
                standby: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
                activated: 'text-electric bg-electric/10 border-electric/30',
                offline: 'text-red-400 bg-red-400/10 border-red-400/30',
              };

              return (
                <motion.div
                  key={guardian.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className={`p-4 rounded-xl border ${statusColors[guardian.status]} bg-opacity-50`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="w-5 h-5" />
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-foreground">{guardian.name}</p>
                      <p className="text-xs text-muted-foreground">{guardian.layers} capas</p>
                    </div>
                    <span className={`w-2 h-2 rounded-full ${
                      guardian.status === 'active' || guardian.status === 'activated' 
                        ? 'bg-green-400 animate-pulse' 
                        : 'bg-yellow-400'
                    }`} />
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                    {guardian.description}
                  </p>

                  <div className="flex gap-2">
                    {guardian.status === 'standby' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex-1 text-xs"
                        onClick={() => activateGuardian(guardian.id)}
                      >
                        <Unlock className="w-3 h-3 mr-1" />
                        Activar
                      </Button>
                    )}
                    {(guardian.status === 'active' || guardian.status === 'activated') && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex-1 text-xs"
                        onClick={() => deactivateGuardian(guardian.id)}
                      >
                        <Lock className="w-3 h-3 mr-1" />
                        Standby
                      </Button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Card>
      </motion.div>

      {/* Cambio de Estado Manual (para demo) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="glass p-4">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-muted-foreground" />
            <h3 className="font-semibold text-foreground">Control de Estado Ontológico</h3>
            <span className="text-xs text-muted-foreground">(Demo)</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {(['NORMAL', 'SOSPECHA', 'CONTENCION', 'AMENAZA_CIVILIZACIONAL'] as OntologicalState[]).map((s) => (
              <Button
                key={s}
                size="sm"
                variant={state.currentState === s ? 'default' : 'outline'}
                className={state.currentState === s ? 'bg-gradient-primary' : ''}
                onClick={() => setOntologicalState(s)}
              >
                {s}
              </Button>
            ))}
          </div>

          <p className="text-xs text-muted-foreground mt-3">
            ⚠ En producción, los cambios de estado requieren aprobación del Consejo de Guardianes
          </p>
        </Card>
      </motion.div>

      {/* Amenazas Recientes */}
      {state.threatIndicators.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass p-4">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
              <h3 className="font-semibold text-foreground">Indicadores de Amenaza Recientes</h3>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {state.threatIndicators.slice(0, 10).map((threat, i) => (
                <div 
                  key={i}
                  className={`p-3 rounded-lg border ${threat.resolved ? 'bg-muted/20 border-muted' : 'bg-red-400/5 border-red-400/20'}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{threat.system}</p>
                      <p className="text-xs text-muted-foreground">{threat.description}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      threat.resolved ? 'bg-green-400/20 text-green-400' : 
                      threat.severity === 'critical' ? 'bg-red-400/20 text-red-400' :
                      threat.severity === 'high' ? 'bg-orange-400/20 text-orange-400' :
                      'bg-yellow-400/20 text-yellow-400'
                    }`}>
                      {threat.resolved ? 'Resuelto' : threat.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default TenochtitlanMonitor;
