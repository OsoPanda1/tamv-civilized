import { motion } from "framer-motion";
import { MapPin, Mail, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative py-20 border-t border-border">
      <div className="container mx-auto px-6">
        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Únete a la{" "}
            <span className="text-gradient-primary">Civilización Digital</span>
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            La convicción de un individuo puede redefinir la era digital.
            Transformando cicatrices en escudos.
          </p>
          <button className="bg-gradient-primary text-primary-foreground font-display font-semibold px-8 py-4 rounded-lg glow-cyan hover:scale-105 transition-transform">
            Comenzar Ahora
          </button>
        </motion.div>

        {/* Footer content */}
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="font-display text-2xl font-bold mb-4">
              <span className="text-gradient-primary">TAMV</span> ONLINE
            </div>
            <p className="text-muted-foreground text-sm mb-4 max-w-md">
              Infraestructura digital soberana, auditable, emocional y multisensorial.
              Una señal desde Real del Monte que posiciona a Latinoamérica como protagonista
              de infraestructura civilizatoria.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 text-accent" />
              <span>Mineral del Monte, Hidalgo, México</span>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-semibold mb-4">Ecosistema</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Isabella AI</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">DreamSpaces™</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Blockchain MSR</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Universidad TAMV</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Marketplace</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">Recursos</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Documentación</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">API Blueprint</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Gobernanza</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Roadmap 2026</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            © 2025 TAMV Enterprise. Arquitecto: Edwin Oswaldo Castillo Trejo (Anubis Villaseñor)
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Mail className="w-5 h-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Background decorations */}
      <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-accent/5 rounded-full blur-3xl" />
    </footer>
  );
};

export default Footer;
