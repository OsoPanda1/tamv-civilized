import { motion } from "framer-motion";
import { Scale, Building2, ShoppingBag } from "lucide-react";

const federations = [
  {
    icon: Scale,
    title: "Federación Constitucional",
    description: "Principios civilizatorios e irreversibles de derechos humanos digitales.",
    gradient: "bg-gradient-primary",
    delay: 0,
  },
  {
    icon: Building2,
    title: "Federación de Plataforma",
    description: "Reglas operativas para identidad DID, moderación y cumplimiento GDPR/AI Act 2024.",
    gradient: "bg-gradient-isabella",
    delay: 0.15,
  },
  {
    icon: ShoppingBag,
    title: "Federación de Dominio",
    description: "Normas específicas para Marketplace, Universidad TAMV y Banco TAMV.",
    gradient: "bg-gradient-gold",
    delay: 0.3,
  },
];

const GovernanceSection = () => {
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
          <span className="text-accent font-display text-sm tracking-widest uppercase">
            Marco Legal y Ético
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-4 mb-6">
            Gobernanza{" "}
            <span className="text-gradient-gold">Trinidad Federada</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Fusión del rigor jurídico con protocolos automatizados.
            Una gobernanza híbrida que protege la dignidad digital humana.
          </p>
        </motion.div>

        {/* Federation Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {federations.map((fed, index) => (
            <motion.div
              key={fed.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: fed.delay }}
              className="relative group"
            >
              {/* Card */}
              <div className="glass rounded-2xl p-8 h-full border border-border hover:border-accent/30 transition-all">
                {/* Icon with gradient */}
                <div className={`w-16 h-16 ${fed.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <fed.icon className="w-8 h-8 text-foreground" />
                </div>
                
                <h3 className="font-display text-xl font-semibold mb-4">
                  {fed.title}
                </h3>
                <p className="text-muted-foreground">
                  {fed.description}
                </p>
              </div>

              {/* Connector lines (visible on md+) */}
              {index < federations.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 border-t-2 border-dashed border-accent/30" />
              )}
            </motion.div>
          ))}
        </div>

        {/* Additional info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-2xl p-8 max-w-4xl mx-auto"
        >
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-display text-lg font-semibold mb-3 text-isabella">
                Resolución de Conflictos
              </h4>
              <p className="text-sm text-muted-foreground">
                Los usuarios aceptan la <span className="text-isabella">Sentencia Digital de Isabella</span> como 
                vinculante para disputas internas, renunciando a litigios físicos en primera instancia.
              </p>
            </div>
            <div>
              <h4 className="font-display text-lg font-semibold mb-3 text-accent">
                Propiedad Intelectual
              </h4>
              <p className="text-sm text-muted-foreground">
                Todas las marcas (Isabella™, Kaos™, Anubis™) son propiedad irrevocable de 
                TAMV Enterprise y su CEO fundador.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GovernanceSection;
