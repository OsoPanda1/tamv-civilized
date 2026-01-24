import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, Shield, Cpu, Globe, Zap, Eye, Layers } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef } from "react";

const floatingOrbs = [
  { color: "primary", size: 200, x: "10%", y: "20%", delay: 0 },
  { color: "isabella", size: 150, x: "85%", y: "30%", delay: 0.5 },
  { color: "accent", size: 120, x: "15%", y: "70%", delay: 1 },
  { color: "dream", size: 180, x: "80%", y: "75%", delay: 1.5 },
  { color: "quantum", size: 100, x: "50%", y: "15%", delay: 2 },
];

const principles = [
  { icon: Shield, label: "Principio DINN", color: "primary" },
  { icon: Globe, label: "Soberanía Digital", color: "accent" },
  { icon: Cpu, label: "Isabella AI NextGen™", color: "isabella" },
  { icon: Zap, label: "Quantum Architecture", color: "quantum" },
  { icon: Eye, label: "Auditoría Inmutable", color: "msr" },
  { icon: Layers, label: "7 Capas Federadas", color: "dream" },
];

const QuantumHero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      {/* Cosmic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 pattern-hex opacity-30" />
        
        {/* Animated Grid */}
        <motion.div
          className="absolute inset-0 pattern-grid"
          style={{ opacity }}
        />
        
        {/* Floating Quantum Orbs */}
        {floatingOrbs.map((orb, index) => (
          <motion.div
            key={index}
            className={`absolute rounded-full blur-3xl`}
            style={{
              width: orb.size,
              height: orb.size,
              left: orb.x,
              top: orb.y,
              background: `hsl(var(--${orb.color}) / 0.15)`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 15, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              delay: orb.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Scan Line Effect */}
        <motion.div
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
          initial={{ top: 0 }}
          animate={{ top: "100%" }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Main Content */}
      <motion.div style={{ y }} className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Top Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-3 glass-heavy px-6 py-3 rounded-full mb-8"
          >
            <motion.span
              className="w-2.5 h-2.5 rounded-full bg-primary"
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-sm font-medium text-foreground/90">
              La Civilización Digital Constitucional · Real del Monte, México
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-display">
              2026
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative mb-6"
          >
            <h1 className="font-display text-6xl md:text-8xl lg:text-9xl font-black tracking-tight">
              <span className="text-gradient-primary">TAMV</span>
              <span className="text-foreground ml-4">MD-X4</span>
            </h1>
            
            {/* Glowing underline */}
            <motion.div
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 h-1 bg-gradient-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "60%" }}
              transition={{ delay: 0.8, duration: 0.8 }}
            />
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl lg:text-3xl text-muted-foreground max-w-4xl mx-auto mb-4"
          >
            Infraestructura digital soberana, auditable y multisensorial
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-lg md:text-xl max-w-3xl mx-auto mb-10"
          >
            <span className="text-gradient-gold font-semibold">
              "Poesía conceptual traducida en código — Una señal desde Latinoamérica"
            </span>
          </motion.p>

          {/* Principle Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {principles.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className={`flex items-center gap-2 glass px-4 py-2.5 rounded-xl hover:border-${item.color}/50 transition-all cursor-default`}
              >
                <item.icon className={`w-4 h-4 text-${item.color}`} />
                <span className="text-sm font-medium">{item.label}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link to="/hub">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-primary text-primary-foreground font-display font-semibold px-8 py-4 rounded-xl glow-cyan hover:shadow-xl transition-all text-lg"
              >
                Explorar Civilización
              </motion.button>
            </Link>
            <Link to="/governance">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="glass-heavy text-foreground font-display font-semibold px-8 py-4 rounded-xl hover:bg-secondary/50 transition-all text-lg border border-primary/20"
              >
                Gobernanza MSR
              </motion.button>
            </Link>
            <Link to="/isabella">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-isabella text-foreground font-display font-semibold px-8 py-4 rounded-xl glow-purple hover:shadow-xl transition-all text-lg"
              >
                Isabella AI
              </motion.button>
            </Link>
          </motion.div>

          {/* Founder Credit */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-12 text-sm text-muted-foreground"
          >
            <span className="font-display">CEO Fundador:</span>{" "}
            <span className="text-gradient-anubis font-semibold">
              Edwin Oswaldo Castillo Trejo (Anubis Villaseñor)
            </span>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-xs text-muted-foreground font-display tracking-wider">
              DESCUBRE
            </span>
            <ChevronDown className="w-6 h-6 text-primary" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Side Decorations */}
      <motion.div
        className="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
      >
        {[1, 2, 3, 4, 5, 6, 7].map((layer) => (
          <motion.div
            key={layer}
            className="w-1 h-8 rounded-full bg-gradient-to-b from-primary/50 to-transparent"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 2,
              delay: layer * 0.2,
              repeat: Infinity,
            }}
          />
        ))}
        <span className="text-xs font-display text-primary/50 -rotate-90 origin-center translate-x-4 mt-4">
          7 CAPAS
        </span>
      </motion.div>

      {/* Tech Stack Preview */}
      <motion.div
        className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-2 text-right"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 0.6, x: 0 }}
        transition={{ delay: 1.2 }}
      >
        <span className="text-[10px] font-mono text-muted-foreground">React 18</span>
        <span className="text-[10px] font-mono text-muted-foreground">TypeScript</span>
        <span className="text-[10px] font-mono text-muted-foreground">WebGPU/Three.js</span>
        <span className="text-[10px] font-mono text-muted-foreground">KAOS 3D Audio</span>
        <span className="text-[10px] font-mono text-muted-foreground">Blockchain MSR</span>
        <span className="text-[10px] font-mono text-primary">Isabella AI</span>
      </motion.div>
    </section>
  );
};

export default QuantumHero;
