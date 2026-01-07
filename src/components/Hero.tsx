import { motion } from "framer-motion";
import { ChevronDown, Shield, Cpu, Globe } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt="TAMV Digital Universe"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-muted-foreground">
              La Civilización Digital Constitucional
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
          >
            <span className="text-gradient-primary">TAMV</span>{" "}
            <span className="text-foreground">ONLINE</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8"
          >
            Infraestructura digital soberana, auditable y multisensorial.
            <br />
            <span className="text-gradient-gold font-semibold">
              Poesía conceptual traducida en código.
            </span>
          </motion.p>

          {/* Key Principles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            <div className="flex items-center gap-2 glass px-4 py-2 rounded-lg">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm">Principio DINN</span>
            </div>
            <div className="flex items-center gap-2 glass px-4 py-2 rounded-lg">
              <Globe className="w-4 h-4 text-accent" />
              <span className="text-sm">Soberanía Digital</span>
            </div>
            <div className="flex items-center gap-2 glass px-4 py-2 rounded-lg">
              <Cpu className="w-4 h-4 text-isabella" />
              <span className="text-sm">Isabella AI NextGen™</span>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <button className="bg-gradient-primary text-primary-foreground font-display font-semibold px-8 py-4 rounded-lg glow-cyan hover:scale-105 transition-transform">
              Explorar Ecosistema
            </button>
            <button className="glass text-foreground font-display font-semibold px-8 py-4 rounded-lg hover:bg-secondary/50 transition-colors">
              Documentación
            </button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <ChevronDown className="w-8 h-8 text-muted-foreground" />
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
    </section>
  );
};

export default Hero;
