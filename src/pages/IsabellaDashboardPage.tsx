import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import IsabellaChat from "@/components/isabella/IsabellaChat";
import ParticleField from "@/components/ParticleField";
import { Brain, Database, Network, Activity, Shield, Zap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const stats = [
  { label: "Interacciones Hoy", value: "1,247", icon: Activity, color: "text-electric" },
  { label: "Nivel de Memoria", value: "L3", icon: Brain, color: "text-isabella" },
  { label: "Nodos MSR Activos", value: "42", icon: Network, color: "text-anubis" },
  { label: "Registros BookPI", value: "8.3K", icon: Database, color: "text-green-400" },
];

const IsabellaDashboardPage = () => {
  const { user } = useAuth();

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
          <span className="text-isabella font-display text-sm tracking-widest uppercase">
            Dashboard Interactivo
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold mt-2">
            <span className="text-gradient-isabella">Isabella</span>{" "}
            <span className="text-foreground">AI NextGen™</span>
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Centro de control del Cerebro Semántico Unificado. Conversaciones con IA real,
            registro MSR inmutable y monitoreo emocional en tiempo real.
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

        {/* Capabilities Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-xl p-4 mb-8 border border-isabella/20"
        >
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-500" />
              <span className="text-muted-foreground">Guardian EOCT</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-electric" />
              <span className="text-muted-foreground">Lovable AI Gateway</span>
            </div>
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-isabella" />
              <span className="text-muted-foreground">MSR Ledger</span>
            </div>
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-anubis" />
              <span className="text-muted-foreground">5-Level Memory</span>
            </div>
          </div>
        </motion.div>

        {/* Main Chat Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <IsabellaChat />
        </motion.div>

        {/* Connection Status */}
        {!user && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 text-center"
          >
            <p className="text-sm text-muted-foreground">
              💡 Inicia sesión para persistir conversaciones y acceder al registro MSR completo
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default IsabellaDashboardPage;
