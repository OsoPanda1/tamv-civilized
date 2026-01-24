import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Scale, Building2, ShoppingBag, Shield, AlertTriangle, Gavel } from "lucide-react";
import { Link } from "react-router-dom";

const federations = [
  {
    icon: Scale,
    title: "Federación Constitucional",
    description: "Principios civilizatorios irreversibles. Derechos humanos digitales inmutables.",
    gradient: "bg-gradient-primary",
    color: "primary",
    items: ["Principio DINN", "Ley Cero", "Dignidad Digital"],
  },
  {
    icon: Building2,
    title: "Federación de Plataforma",
    description: "Reglas operativas: identidad DID, moderación ética, cumplimiento GDPR/AI Act 2024.",
    gradient: "bg-gradient-isabella",
    color: "isabella",
    items: ["ID-NVIDA", "GDPR Compliant", "AI Act 2024"],
  },
  {
    icon: ShoppingBag,
    title: "Federación de Dominio",
    description: "Normas específicas para Marketplace, Universidad TAMV y servicios sectoriales.",
    gradient: "bg-gradient-gold",
    color: "accent",
    items: ["Marketplace", "Universidad", "Banco TAMV"],
  },
];

const protections = [
  {
    icon: Shield,
    title: "Sentencia Digital Isabella",
    description: "Resolución vinculante para disputas internas. Los usuarios aceptan la sentencia como primera instancia.",
    color: "isabella",
  },
  {
    icon: AlertTriangle,
    title: "Protocolo TIME UP",
    description: "Sistema de escalación de 5 niveles para protección contra riesgos psicológicos y de seguridad.",
    color: "destructive",
  },
  {
    icon: Gavel,
    title: "DAOs Híbridas Limitadas",
    description: "Las DAOs NO tienen poder sobre decisiones económicas, estructurales ni pilares constitucionales.",
    color: "msr",
  },
];

const GovernancePreview = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section ref={containerRef} className="relative py-32">
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-accent font-display text-sm tracking-widest uppercase">
            Marco Legal y Ético Automatizado
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6">
            <span className="text-foreground">Gobernanza</span>{" "}
            <span className="text-gradient-gold">Trinidad Federada</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Fusión del rigor jurídico con protocolos automatizados.
            Una gobernanza híbrida que protege la dignidad digital humana sin compromisos.
          </p>
        </motion.div>

        {/* Federations */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {federations.map((fed, index) => (
            <motion.div
              key={fed.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.15 }}
              className="relative group"
            >
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                className="glass-heavy rounded-2xl p-8 h-full border border-border hover:border-primary/30 transition-all"
              >
                <div className={`w-16 h-16 ${fed.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <fed.icon className="w-8 h-8 text-foreground" />
                </div>
                
                <h3 className="font-display text-xl font-semibold mb-3">
                  {fed.title}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {fed.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {fed.items.map((item) => (
                    <span
                      key={item}
                      className={`text-xs px-3 py-1 rounded-full bg-${fed.color}/10 text-${fed.color} border border-${fed.color}/20`}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Connector (desktop) */}
              {index < federations.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 border-t-2 border-dashed border-accent/30" />
              )}
            </motion.div>
          ))}
        </div>

        {/* Protection Systems */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="glass-heavy rounded-2xl p-8 max-w-5xl mx-auto"
        >
          <h3 className="font-display text-2xl font-bold text-center mb-8">
            Sistemas de Protección Civilizatoria
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            {protections.map((protection, index) => (
              <motion.div
                key={protection.title}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="text-center"
              >
                <div className={`w-12 h-12 mx-auto rounded-xl bg-${protection.color}/20 flex items-center justify-center mb-4`}>
                  <protection.icon className={`w-6 h-6 text-${protection.color}`} />
                </div>
                <h4 className="font-display font-semibold mb-2">{protection.title}</h4>
                <p className="text-sm text-muted-foreground">{protection.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Warning Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7 }}
          className="mt-12 max-w-3xl mx-auto"
        >
          <div className="glass border border-accent/30 rounded-xl p-6 flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-display font-semibold text-accent mb-1">
                Propiedad Intelectual Protegida
              </h4>
              <p className="text-sm text-muted-foreground">
                Todas las marcas (Isabella™, Kaos™, Anubis™, TAMV™, DreamSpaces™, BookPI™) son 
                propiedad irrevocable de TAMV Enterprise y su CEO fundador Edwin Oswaldo Castillo Trejo.
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <Link to="/governance">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-gold text-primary-foreground font-display font-semibold px-8 py-4 rounded-xl glow-gold hover:shadow-xl transition-all"
            >
              Explorar Gobernanza Completa
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default GovernancePreview;
