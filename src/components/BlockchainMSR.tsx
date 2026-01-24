import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { 
  Link2, 
  ShieldCheck, 
  Coins, 
  RefreshCw,
  Lock,
  Database,
  FileCheck,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Link2,
    title: "Tamvcrumbs™",
    description: "Historial comportamental cifrado para distinguir uso legítimo de patrones de abuso.",
    color: "msr",
  },
  {
    icon: ShieldCheck,
    title: "Smart Contracts MSR",
    description: "Cláusulas de gobernanza que permiten congelar activos o emitir transacciones compensatorias.",
    color: "accent",
  },
  {
    icon: Lock,
    title: "Firmas PQC",
    description: "CRYSTALS-Kyber/Dilithium para forward secrecy cuántica con HSM/MPC.",
    color: "primary",
  },
  {
    icon: Database,
    title: "BookPI Registry",
    description: "Ledger de auditoría inmutable (SSoT) con EvidenceHash y snapshots cada 10 min.",
    color: "isabella",
  },
];

const stats = [
  { label: "Uptime", value: "99.99%", icon: Zap },
  { label: "Latencia", value: "<10ms", icon: RefreshCw },
  { label: "Cifrado", value: "AES-256", icon: Lock },
  { label: "Firmas", value: "Ed25519", icon: FileCheck },
];

const BlockchainMSR = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [blocks, setBlocks] = useState<string[]>([]);

  // Generate random block hashes
  useEffect(() => {
    const generateHash = () => Math.random().toString(16).slice(2, 10);
    setBlocks([generateHash(), generateHash(), generateHash(), generateHash(), generateHash()]);
    
    const interval = setInterval(() => {
      setBlocks(prev => [...prev.slice(1), generateHash()]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={containerRef} className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-msr/5 via-transparent to-accent/5" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="text-msr font-display text-sm tracking-widest uppercase">
              La Sexta Blockchain Mundial
            </span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mt-4 mb-6">
              <span className="text-foreground">Blockchain</span>{" "}
              <span className="text-gradient-gold">MSR</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-4">
              <span className="font-semibold text-accent">Memory, Security & Repair</span> — 
              Un ledger diseñado para la seguridad civilizatoria y la reparación ética.
            </p>
            <p className="text-muted-foreground mb-8">
              Garantiza que lo registrado sea verificable y reparable sin romper la inmutabilidad.
              Desde Real del Monte para el mundo, la primera blockchain con conciencia ética integrada.
            </p>

            {/* Features */}
            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-start gap-4 group"
                >
                  <div className={`w-12 h-12 rounded-xl bg-${feature.color}/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`w-6 h-6 text-${feature.color}`} />
                  </div>
                  <div>
                    <h4 className="font-display font-semibold mb-1 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <Link to="/governance">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-gold text-primary-foreground font-display font-semibold px-8 py-4 rounded-xl glow-gold hover:shadow-xl transition-all"
              >
                Ver MSR Ledger
              </motion.button>
            </Link>
          </motion.div>

          {/* Right: Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative">
              {/* Blockchain Visualization */}
              <motion.div
                className="glass-heavy rounded-3xl p-8 glow-gold"
                whileHover={{ scale: 1.02 }}
              >
                {/* Chain Blocks */}
                <div className="space-y-4 mb-8">
                  {blocks.map((hash, index) => (
                    <motion.div
                      key={`${hash}-${index}`}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4"
                    >
                      <motion.div
                        className="w-14 h-14 bg-gradient-gold rounded-xl flex items-center justify-center shadow-lg"
                        animate={{ rotateY: [0, 360] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      >
                        <span className="font-display font-bold text-primary-foreground text-sm">
                          #{blocks.length - index}
                        </span>
                      </motion.div>
                      
                      <div className="flex-1 h-12 glass rounded-lg flex items-center px-4 overflow-hidden">
                        <div className="flex items-center gap-2 w-full">
                          <motion.div
                            className="w-2 h-2 rounded-full bg-msr"
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          />
                          <span className="text-sm text-muted-foreground font-mono truncate">
                            0x{hash}...
                          </span>
                        </div>
                      </div>
                      
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      >
                        <RefreshCw className="w-5 h-5 text-accent" />
                      </motion.div>
                    </motion.div>
                  ))}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-4 pt-6 border-t border-border">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="text-center"
                    >
                      <stat.icon className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                      <div className={`font-display text-lg font-bold ${
                        index === 0 ? 'text-accent' : 
                        index === 1 ? 'text-primary' : 
                        index === 2 ? 'text-msr' : 'text-isabella'
                      }`}>
                        {stat.value}
                      </div>
                      <div className="text-[10px] text-muted-foreground">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Live Indicator */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-green-500"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <span className="text-xs text-muted-foreground font-mono">LIVE</span>
                </div>
              </motion.div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-accent/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-msr/20 rounded-full blur-2xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BlockchainMSR;
