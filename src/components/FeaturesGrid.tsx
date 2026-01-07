import { motion } from "framer-motion";
import { 
  Layers, 
  Lock, 
  Sparkles, 
  Database, 
  Network, 
  Eye 
} from "lucide-react";

const features = [
  {
    icon: Layers,
    title: "QuantumPods™",
    description: "Microservicios autónomos con orquestación Kubernetes y Zero Trust.",
    color: "primary",
  },
  {
    icon: Lock,
    title: "Seguridad Cuántica",
    description: "Firmas pos-cuánticas Dilithium-5 y cifrado híbrido ECC + Kyber.",
    color: "accent",
  },
  {
    icon: Sparkles,
    title: "DreamSpaces™",
    description: "Espacios inmersivos para cocreación, arte y comercio multisensorial.",
    color: "dream",
  },
  {
    icon: Database,
    title: "Resiliencia Sistémica",
    description: "Snapshots cada 10 minutos con rollback instantáneo (RTO/RPO < 10 min).",
    color: "msr",
  },
  {
    icon: Network,
    title: "KAOS 3D™",
    description: "Audio espacial y respuesta háptica para experiencias inmersivas 4D.",
    color: "isabella",
  },
  {
    icon: Eye,
    title: "ANUBIS Sentinel™",
    description: "Observabilidad total con Grafana, Prometheus y auditoría en tiempo real.",
    color: "accent",
  },
];

const colorClasses: Record<string, string> = {
  primary: "text-primary bg-primary/10 border-primary/20",
  accent: "text-accent bg-accent/10 border-accent/20",
  dream: "text-dream bg-dream/10 border-dream/20",
  msr: "text-msr bg-msr/10 border-msr/20",
  isabella: "text-isabella bg-isabella/10 border-isabella/20",
};

const FeaturesGrid = () => {
  return (
    <section className="relative py-24">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-display text-sm tracking-widest uppercase">
            Arquitectura Quantum 360
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-4 mb-6">
            Infraestructura de{" "}
            <span className="text-gradient-primary">Nueva Era</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Sistema diseñado para escalar desde prototipo hasta millones de usuarios,
            con resiliencia y seguridad de nivel civilizatorio.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass p-6 rounded-2xl border border-border hover:border-primary/30 transition-all group"
            >
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 border ${colorClasses[feature.color]}`}
              >
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
