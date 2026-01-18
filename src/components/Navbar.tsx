import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import UserMenu from "@/components/auth/UserMenu";

const navLinks = [
  { name: "Ecosistema", href: "/#ecosystem" },
  { name: "Isabella AI", href: "/isabella" },
  { name: "DreamSpaces", href: "/dreamspaces" },
  { name: "Civilization Hub", href: "/hub" },
  { name: "Gobernanza", href: "/#governance" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="glass border-b border-border">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="/" className="font-display text-xl font-bold">
              <span className="text-gradient-primary">TAMV</span>
            </a>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                link.href.startsWith('/') && !link.href.startsWith('/#') ? (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                ) : (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </a>
                )
              ))}
              
              {/* Auth Button / User Menu */}
              {!loading && (
                user ? (
                  <UserMenu />
                ) : (
                  <Link
                    to="/auth"
                    className="bg-gradient-primary text-primary-foreground font-display text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Acceder
                  </Link>
                )
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-foreground"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden glass border-b border-border"
          >
            <div className="container mx-auto px-6 py-4 space-y-4">
              {navLinks.map((link) => (
                link.href.startsWith('/') && !link.href.startsWith('/#') ? (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="block text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                ) : (
                  <a
                    key={link.name}
                    href={link.href}
                    className="block text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </a>
                )
              ))}
              
              {/* Mobile Auth */}
              {!loading && (
                user ? (
                  <div className="pt-2 border-t border-border">
                    <UserMenu />
                  </div>
                ) : (
                  <Link
                    to="/auth"
                    className="block w-full bg-gradient-primary text-primary-foreground font-display text-sm font-semibold px-4 py-2 rounded-lg text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Acceder
                  </Link>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
