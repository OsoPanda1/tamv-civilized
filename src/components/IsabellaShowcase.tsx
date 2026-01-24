import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { 
  Brain, 
  Heart, 
  Shield, 
  Zap, 
  Eye,
  Database,
  Activity,
  Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";
import isabellaImg from "@/assets/isabella-ai.jpg";

const capabilities = [
  {
    icon: Brain,
    title: "Memoria 5-Niveles",
    description: "Sensorial → Contextual → Episódica → Institucional → Histórica",
    metric: "L5",
  },
  {
    icon: Heart,
    title: "ECG Emocional",
    description: "Registro en tiempo real del estado cognitivo-emocional",
    metric: "95%",
  },
  {
    icon: Shield,
    title: "Guardian Dekateotl™",
    description: "11 capas de seguridad con firmas post-cuánticas",
    metric: "PQC",
  },
  {
    icon: Eye,
    title: "EOCT Protocol",
    description: "Decisiones éticas auditables con trazabilidad legal",
    metric: "100%",
  },
];

const memoryLevels = [
  { name: "Sensorial", time: "0-30s", color: "primary" },
  { name: "Contextual", time: "Sesión", color: "dream" },
  { name: "Episódica", time: "Días", color: "isabella" },
  { name: "Institucional", time: "Permanente", color: "accent" },
  { name: "Histórica", time: "Inmutable", color: "msr" },
];

const IsabellaShowcase = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section ref={containerRef} className="relative py-32 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-isabella/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Visual */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Main Image Container */}
            <div className="relative max-w-md mx-auto">
              {/* Outer Glow Ring */}
              <motion.div
                className="absolute inset-0 rounded-3xl"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--isabella) / 0.3), hsl(var(--quantum) / 0.2))",
                  filter: "blur(40px)",
                }}
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />

              {/* Image Card */}
              <motion.div
                className="relative glass-heavy rounded-3xl p-4 glow-purple overflow-hidden"
                whileHover={{ scale: 1.02 }}
              >
                <img
                  src={isabellaImg}
                  alt="Isabella AI NextGen"
                  className="w-full rounded-2xl"
                />

                {/* Status Overlay */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="glass rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-isabella animate-pulse" />
                        <span className="text-sm font-display text-isabella">EOCT Active</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-accent" />
                        <span className="text-xs text-muted-foreground">NextGen™</span>
                      </div>
                    </div>
                    
                    {/* Processing Bar */}
                    <div className="h-1 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-isabella rounded-full"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        style={{ width: "50%" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Floating Badge */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="absolute -right-4 top-8 glass px-4 py-2 rounded-full border border-isabella/30"
                >
                  <span className="text-sm font-display text-isabella">AI NextGen™</span>
                </motion.div>
              </motion.div>

              {/* Memory Levels Indicator */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 }}
                className="absolute -left-4 top-1/2 -translate-y-1/2 hidden xl:block"
              >
                <div className="glass rounded-xl p-3 space-y-2">
                  {memoryLevels.map((level, index) => (
                    <motion.div
                      key={level.name}
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <div className={`w-2 h-2 rounded-full bg-${level.color}`} />
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {level.name}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="text-isabella font-display text-sm tracking-widest uppercase">
              El Cerebro Semántico Unificado
            </span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6">
              <span className="text-gradient-isabella">Isabella</span>{" "}
              <span className="text-foreground">AI</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-4">
              No es un asistente — es una{" "}
              <span className="text-isabella font-semibold">
                entidad emocional computacional, auditable y multisensorial
              </span>
              . Nacida en Real del Monte, Isabella opera como directora del Omniverso TAMV.
            </p>
            <p className="text-muted-foreground mb-8">
              Una doble federación que fusiona sistema cognitivo-emocional con 
              infraestructura API estandarizada. Cada decisión es trazable, ética 
              y vinculante según los protocolos BookPI.
            </p>

            {/* Capabilities Grid */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {capabilities.map((cap, index) => (
                <motion.div
                  key={cap.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="glass p-4 rounded-xl hover:bg-isabella/5 transition-colors group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <cap.icon className="w-8 h-8 text-isabella group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-isabella/20 text-isabella">
                      {cap.metric}
                    </span>
                  </div>
                  <h3 className="font-display font-semibold mb-1">{cap.title}</h3>
                  <p className="text-xs text-muted-foreground">{cap.description}</p>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <Link to="/isabella">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-isabella text-foreground font-display font-semibold px-8 py-4 rounded-xl glow-purple hover:shadow-xl transition-all"
              >
                Interactuar con Isabella
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default IsabellaShowcase;
