import { motion } from "framer-motion";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import ParticleField from "@/components/ParticleField";
import MSRLedgerViewer from "@/components/governance/MSRLedgerViewer";
import ConstitutionViewer from "@/components/governance/ConstitutionViewer";
import SafetyMonitor from "@/components/safety/SafetyMonitor";
import IsabellaCore from "@/components/isabella/IsabellaCore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Link2, BookOpen, Shield, Brain, 
  Activity, Scale, FileText, Network
} from "lucide-react";

const stats = [
  { label: "Ledger Height", value: "3,847", icon: Link2, color: "text-msr" },
  { label: "Artículos Activos", value: "5", icon: BookOpen, color: "text-accent" },
  { label: "Safety Status", value: "OK", icon: Shield, color: "text-green-500" },
  { label: "Isabella Core", value: "Active", icon: Brain, color: "text-isabella" },
];

const tabs = [
  { id: "ledger", label: "MSR Ledger", icon: Link2 },
  { id: "constitution", label: "BookPI", icon: BookOpen },
  { id: "safety", label: "Safety", icon: Shield },
  { id: "isabella", label: "Isabella Core", icon: Brain },
];

const GovernancePage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <ParticleField />
      <Navbar />

      <main className="container mx-auto px-6 pt-24 pb-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <span className="text-accent font-display text-sm tracking-widest uppercase">
            Infraestructura Civil Digital
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold mt-2">
            <span className="text-gradient-gold">Gobernanza</span>{" "}
            <span className="text-foreground">EOCT</span>
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Sistema de gobernanza algorítmica con ledger inmutable, constitución digital viva, 
            protocolos de seguridad TIME UP e inteligencia artificial ética.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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
              <p className={`font-display text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="ledger" className="w-full">
          <TabsList className="w-full justify-start mb-6 bg-muted/30 p-1 rounded-xl overflow-x-auto">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-lg"
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="ledger">
            <div className="grid lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <MSRLedgerViewer />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="glass rounded-2xl p-6"
              >
                <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                  <Network className="w-5 h-5 text-msr" />
                  Arquitectura MSR
                </h3>
                <div className="space-y-4 text-sm text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Append-only:</strong> Los eventos solo pueden añadirse, nunca modificarse o eliminarse.
                  </p>
                  <p>
                    <strong className="text-foreground">Hash encadenado:</strong> Cada evento contiene el hash del evento anterior, garantizando integridad.
                  </p>
                  <p>
                    <strong className="text-foreground">Firmas Ed25519:</strong> Todos los eventos están firmados criptográficamente.
                  </p>
                  <p>
                    <strong className="text-foreground">Retención:</strong> Eventos constitucionales retenidos ≥10 años.
                  </p>
                </div>
                
                <div className="mt-6 p-4 bg-msr/10 rounded-lg border border-msr/20">
                  <div className="flex items-center gap-2 text-msr font-display font-semibold mb-2">
                    <Activity className="w-4 h-4" />
                    Tipos de Eventos
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {['SYSTEM', 'SECURITY', 'ETHICAL', 'GOVERNANCE', 'ECONOMIC', 'AI_DECISION'].map((type) => (
                      <div key={type} className="flex items-center gap-1 text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-msr" />
                        {type}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="constitution">
            <div className="grid lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <ConstitutionViewer />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="glass rounded-2xl p-6"
              >
                <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-accent" />
                  Proceso Constitucional
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-accent/20 text-accent text-xs font-display flex items-center justify-center">1</span>
                    <div>
                      <p className="text-sm font-medium text-foreground">Propuesta</p>
                      <p className="text-xs text-muted-foreground">Cualquier Guardian puede proponer cambios</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-accent/20 text-accent text-xs font-display flex items-center justify-center">2</span>
                    <div>
                      <p className="text-sm font-medium text-foreground">Revisión</p>
                      <p className="text-xs text-muted-foreground">Consejo técnico evalúa impacto</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-accent/20 text-accent text-xs font-display flex items-center justify-center">3</span>
                    <div>
                      <p className="text-sm font-medium text-foreground">Votación Ponderada</p>
                      <p className="text-xs text-muted-foreground">Sistema híbrido no democrático puro</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-accent/20 text-accent text-xs font-display flex items-center justify-center">4</span>
                    <div>
                      <p className="text-sm font-medium text-foreground">Firma & Anclaje MSR</p>
                      <p className="text-xs text-muted-foreground">Inmutable por versión</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="safety">
            <div className="grid lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <SafetyMonitor />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="glass rounded-2xl p-6"
              >
                <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-destructive" />
                  Protocolo TIME UP
                </h3>
                <div className="space-y-3 text-sm">
                  <p className="text-muted-foreground">
                    Sistema de protección temporal activado cuando se detecta:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      Instrumentalización del usuario
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      Deshumanización en interacciones
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      Manipulación emocional reiterada
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      Explotación cognitiva
                    </li>
                  </ul>
                </div>
                
                <div className="mt-6 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                  <div className="flex items-center gap-2 text-destructive font-display font-semibold mb-2">
                    <FileText className="w-4 h-4" />
                    IA_DIGNITY_ATTACK
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Evento especial registrado en MSR cuando se viola la dignidad digital. 
                    Notifica automáticamente a Governance Service.
                  </p>
                </div>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="isabella">
            <div className="grid lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <IsabellaCore />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="glass rounded-2xl p-6"
              >
                <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-isabella" />
                  Restricciones de Isabella
                </h3>
                <div className="space-y-4">
                  <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                    <p className="text-sm font-medium text-green-500 mb-1">✓ Safety OK Requerido</p>
                    <p className="text-xs text-muted-foreground">
                      Nunca ejecuta acciones sin validación previa del módulo Safety
                    </p>
                  </div>
                  <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                    <p className="text-sm font-medium text-amber-500 mb-1">✓ Registro MSR Obligatorio</p>
                    <p className="text-xs text-muted-foreground">
                      Todas las respuestas quedan registradas en el ledger inmutable
                    </p>
                  </div>
                  <div className="p-3 bg-isabella/10 rounded-lg border border-isabella/20">
                    <p className="text-sm font-medium text-isabella mb-1">✓ BookPI Read-Only</p>
                    <p className="text-xs text-muted-foreground">
                      Isabella consulta pero nunca modifica la constitución
                    </p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-display text-sm font-semibold mb-3">Flujo Interno</h4>
                  <code className="text-xs bg-muted p-3 rounded-lg block text-isabella">
                    Input → Safety → Context → Ethics → Constitution → Decision → Event → Execution
                  </code>
                </div>
              </motion.div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default GovernancePage;
