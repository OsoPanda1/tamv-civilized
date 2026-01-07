import { motion } from "framer-motion";
import { Link2, ShieldCheck, Coins, RefreshCw } from "lucide-react";

const BlockchainSection = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-msr/5 via-transparent to-accent/5" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-msr font-display text-sm tracking-widest uppercase">
              La Sexta Red Mundial
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mt-4 mb-6">
              Blockchain{" "}
              <span className="text-gradient-gold">MSR</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              <span className="font-semibold text-accent">Memory, Security & Repair</span> — 
              Un ledger diseñado para la seguridad civilizatoria y la reparación ética.
              Garantiza que lo registrado sea verificable y reparable sin romper la inmutabilidad.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-msr/20 flex items-center justify-center flex-shrink-0">
                  <Link2 className="w-5 h-5 text-msr" />
                </div>
                <div>
                  <h4 className="font-display font-semibold mb-1">Tamvcrumbs</h4>
                  <p className="text-sm text-muted-foreground">
                    Historial comportamental cifrado para distinguir uso legítimo de patrones de abuso.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="font-display font-semibold mb-1">Smart Contracts MSR</h4>
                  <p className="text-sm text-muted-foreground">
                    Cláusulas de gobernanza que permiten congelar activos o emitir transacciones compensatorias.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Coins className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-display font-semibold mb-1">Interoperabilidad ALAMEXA</h4>
                  <p className="text-sm text-muted-foreground">
                    Conexión con redes para fortalecer economías locales y cadenas de suministro.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Animated blockchain visualization */}
            <div className="relative">
              <div className="glass rounded-3xl p-8 glow-gold">
                {/* Chain blocks */}
                <div className="flex flex-col gap-4">
                  {[1, 2, 3, 4].map((block) => (
                    <motion.div
                      key={block}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: block * 0.15 }}
                      className="flex items-center gap-4"
                    >
                      <div className="w-16 h-16 bg-gradient-gold rounded-xl flex items-center justify-center shadow-lg">
                        <span className="font-display font-bold text-primary-foreground">
                          #{block}
                        </span>
                      </div>
                      <div className="flex-1 h-12 glass rounded-lg flex items-center px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-msr animate-pulse" />
                          <span className="text-sm text-muted-foreground font-mono">
                            0x{Math.random().toString(16).slice(2, 10)}...
                          </span>
                        </div>
                      </div>
                      <RefreshCw className="w-5 h-5 text-accent animate-spin" style={{ animationDuration: '3s' }} />
                    </motion.div>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-border">
                  <div className="text-center">
                    <div className="font-display text-2xl font-bold text-accent">99.9%</div>
                    <div className="text-xs text-muted-foreground">Uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="font-display text-2xl font-bold text-primary">&lt;10ms</div>
                    <div className="text-xs text-muted-foreground">Latencia</div>
                  </div>
                  <div className="text-center">
                    <div className="font-display text-2xl font-bold text-msr">256-bit</div>
                    <div className="text-xs text-muted-foreground">Cifrado</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative */}
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-accent/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-msr/20 rounded-full blur-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BlockchainSection;
