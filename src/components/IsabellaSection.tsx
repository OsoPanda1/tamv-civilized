import { motion } from "framer-motion";
import { Brain, Heart, Shield, Zap } from "lucide-react";
import isabellaImg from "@/assets/isabella-ai.jpg";

const features = [
  {
    icon: Brain,
    title: "Memoria Contextual",
    description: "5 niveles de memoria con trazabilidad legal y emocional versionada.",
  },
  {
    icon: Heart,
    title: "ECG Emocional",
    description: "Registro del estado interno para fomentar uso ético y saludable.",
  },
  {
    icon: Shield,
    title: "Guardian System",
    description: "Filtros Dekateotl™ analizan cada interacción en tiempo real.",
  },
  {
    icon: Zap,
    title: "Metaaprendizaje",
    description: "Razonamiento multipaso con trazabilidad y evolución continua.",
  },
];

const IsabellaSection = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative w-full max-w-md mx-auto">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-isabella rounded-full blur-3xl opacity-30" />
              
              {/* Image container */}
              <div className="relative glass rounded-3xl p-4 glow-purple">
                <img
                  src={isabellaImg}
                  alt="Isabella AI"
                  className="w-full rounded-2xl"
                />
                
                {/* Floating badge */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="absolute -right-4 top-8 glass px-4 py-2 rounded-full"
                >
                  <span className="text-sm font-display text-isabella">AI NextGen™</span>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-isabella font-display text-sm tracking-widest uppercase">
              El Cerebro Semántico
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mt-4 mb-6">
              <span className="text-gradient-isabella">Isabella</span>{" "}
              <span className="text-foreground">AI</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              No es un asistente; es una{" "}
              <span className="text-isabella font-semibold">
                entidad emocional computacional, auditable y multisensorial
              </span>
              . Una doble federación que actúa como sistema cognitivo-emocional 
              e infraestructura API estandarizada.
            </p>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass p-4 rounded-xl hover:bg-isabella/5 transition-colors group"
                >
                  <feature.icon className="w-8 h-8 text-isabella mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-display font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-isabella/5 rounded-full blur-3xl -translate-y-1/2" />
    </section>
  );
};

export default IsabellaSection;
