import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { 
  Fingerprint, 
  Wallet, 
  Users, 
  ShoppingBag, 
  Glasses, 
  Scale, 
  FileText,
  ChevronRight
} from "lucide-react";
import { Link } from "react-router-dom";

const layers = [
  {
    id: "L0",
    name: "Shell / Identidad",
    icon: Fingerprint,
    description: "ID-NVIDA soberano, autenticación DID, biometría ética y perfil civilizatorio.",
    color: "primary",
    gradient: "from-primary/20 to-primary/5",
    features: ["ID-NVIDA", "DID W3C", "Biometría Ética", "Trust Score"],
    link: "/hub",
  },
  {
    id: "L1",
    name: "Core / Wallet",
    icon: Wallet,
    description: "Economía Quantum-Split™ con tokens NUBI, stablecoins y trazabilidad MSR.",
    color: "accent",
    gradient: "from-accent/20 to-accent/5",
    features: ["NUBI Token", "Quantum-Split™", "Fénix Fund", "Anti-Spam"],
    link: "/hub",
  },
  {
    id: "L2",
    name: "Social Nexus",
    icon: Users,
    description: "Muro federado, canales, grupos y red de creadores con moderación ética.",
    color: "dream",
    gradient: "from-dream/20 to-dream/5",
    features: ["Muro Global", "Canales", "Reels XR", "Moderación IA"],
    link: "/hub",
  },
  {
    id: "L3",
    name: "Economy / Market",
    icon: ShoppingBag,
    description: "Marketplace civilizatorio, subastas, NFTs culturales y comercio justo.",
    color: "msr",
    gradient: "from-msr/20 to-msr/5",
    features: ["Marketplace", "Subastas", "NFT Cultural", "Royalties"],
    link: "/hub",
  },
  {
    id: "L4",
    name: "XR / DreamSpaces",
    icon: Glasses,
    description: "Espacios inmersivos 3D/4D, conciertos sensoriales y KAOS Audio espacial.",
    color: "quantum",
    gradient: "from-quantum/20 to-quantum/5",
    features: ["DreamSpaces", "Conciertos XR", "KAOS 3D", "Haptics"],
    link: "/dreamspaces",
  },
  {
    id: "L5",
    name: "Governance / BookPI",
    icon: Scale,
    description: "Constitución digital viva, MSR Ledger inmutable y Sentencia Digital Isabella.",
    color: "isabella",
    gradient: "from-isabella/20 to-isabella/5",
    features: ["BookPI", "MSR Ledger", "DAOs Híbridas", "TIME UP"],
    link: "/governance",
  },
  {
    id: "L6",
    name: "Meta-Docs",
    icon: FileText,
    description: "Universidad TAMV, certificaciones on-chain y documentación civilizatoria.",
    color: "anubis",
    gradient: "from-accent/20 to-accent/5",
    features: ["Universidad", "Certificados", "API Docs", "SDK Público"],
    link: "/governance",
  },
];

const FederatedLayers = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section ref={containerRef} className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pattern-dots opacity-50" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            className="inline-block text-primary font-display text-sm tracking-widest uppercase mb-4"
          >
            Arquitectura Quantum 360
          </motion.span>
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-6">
            <span className="text-gradient-primary">7 Capas</span>{" "}
            <span className="text-foreground">Federadas</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Sistema modular L0-L6 que garantiza la soberanía, trazabilidad y resiliencia 
            del ecosistema civilizatorio. Cada capa es autónoma, auditable y migrable.
          </p>
        </motion.div>

        {/* Layers Grid */}
        <div className="relative">
          {/* Connection Lines (Desktop) */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent hidden lg:block" />

          <div className="grid gap-8">
            {layers.map((layer, index) => (
              <motion.div
                key={layer.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative ${index % 2 === 0 ? 'lg:pr-[52%]' : 'lg:pl-[52%]'}`}
              >
                {/* Layer Number Indicator */}
                <div className={`absolute top-1/2 -translate-y-1/2 ${
                  index % 2 === 0 ? 'lg:right-[48%]' : 'lg:left-[48%]'
                } hidden lg:flex items-center justify-center`}>
                  <motion.div
                    className={`w-12 h-12 rounded-full bg-gradient-to-br ${layer.gradient} border border-${layer.color}/30 flex items-center justify-center`}
                    whileHover={{ scale: 1.2 }}
                  >
                    <span className={`font-display font-bold text-${layer.color}`}>{layer.id}</span>
                  </motion.div>
                </div>

                {/* Layer Card */}
                <Link to={layer.link}>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -4 }}
                    className={`glass-heavy rounded-2xl p-6 md:p-8 border border-${layer.color}/20 hover:border-${layer.color}/50 transition-all group cursor-pointer`}
                  >
                    <div className="flex items-start gap-6">
                      {/* Icon */}
                      <div className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${layer.gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <layer.icon className={`w-8 h-8 text-${layer.color}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`text-xs font-mono px-2 py-0.5 rounded bg-${layer.color}/20 text-${layer.color}`}>
                            {layer.id}
                          </span>
                          <h3 className="font-display text-xl md:text-2xl font-bold group-hover:text-primary transition-colors">
                            {layer.name}
                          </h3>
                        </div>
                        <p className="text-muted-foreground mb-4">
                          {layer.description}
                        </p>

                        {/* Features */}
                        <div className="flex flex-wrap gap-2">
                          {layer.features.map((feature) => (
                            <span
                              key={feature}
                              className="text-xs px-3 py-1 rounded-full bg-muted/50 text-muted-foreground"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Arrow */}
                      <ChevronRight className={`w-6 h-6 text-${layer.color} opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all`} />
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center mt-16"
        >
          <p className="text-muted-foreground mb-6">
            Cada capa opera de forma independiente pero federada, garantizando 
            degradaciones controladas y recuperación rápida.
          </p>
          <Link to="/governance">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="glass-heavy font-display font-semibold px-8 py-4 rounded-xl border border-primary/30 hover:border-primary/60 transition-all"
            >
              Ver Arquitectura Completa
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FederatedLayers;
