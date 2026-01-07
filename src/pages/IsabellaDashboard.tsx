import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import ChatInterface from "@/components/isabella/ChatInterface";
import EmotionalECG from "@/components/isabella/EmotionalECG";
import GuardianStatus from "@/components/isabella/GuardianStatus";
import ParticleField from "@/components/ParticleField";
import { Brain, Database, Network, Activity } from "lucide-react";

const stats = [
  { label: "Interacciones Hoy", value: "1,247", icon: Activity, color: "text-electric" },
  { label: "Nivel de Memoria", value: "L3", icon: Brain, color: "text-isabella" },
  { label: "Nodos MSR Activos", value: "42", icon: Network, color: "text-anubis" },
  { label: "Registros BookPI", value: "8.3K", icon: Database, color: "text-green-400" },
];

const IsabellaDashboard = () => {
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
            Centro de control del Cerebro Semántico Unificado con monitoreo emocional en tiempo real 
            y sistema Guardian activo.
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

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chat - Takes 2 columns */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <ChatInterface />
          </motion.div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <EmotionalECG />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <GuardianStatus />
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default IsabellaDashboard;
