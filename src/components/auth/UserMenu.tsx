import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, Settings, Shield, Crown, Sparkles, ChevronDown, Wallet } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const tierIcons = {
  citizen: User,
  architect: Sparkles,
  guardian: Shield,
  celestial: Crown,
};

const tierColors = {
  citizen: 'text-muted-foreground',
  architect: 'text-electric-cyan',
  guardian: 'text-isabella-purple',
  celestial: 'text-anubis-gold',
};

const tierLabels = {
  citizen: 'Citizen',
  architect: 'Architect',
  guardian: 'Guardian',
  celestial: 'Celestial',
};

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  if (!profile) return null;

  const TierIcon = tierIcons[profile.tier];
  const tierColor = tierColors[profile.tier];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg glass border border-border hover:border-electric-cyan/50 transition-colors"
      >
        <div className={`w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center`}>
          <TierIcon className={`w-4 h-4 text-primary-foreground`} />
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-semibold text-foreground">{profile.display_name}</p>
          <p className={`text-xs ${tierColor}`}>{tierLabels[profile.tier]}</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-64 glass rounded-xl border border-border overflow-hidden z-50"
            >
              {/* Header */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center`}>
                    <TierIcon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{profile.display_name}</p>
                    <p className={`text-xs ${tierColor}`}>{tierLabels[profile.tier]}</p>
                  </div>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                  <div>
                    <p className="text-xs text-muted-foreground">Karma</p>
                    <p className="font-display font-bold text-electric-cyan">{profile.karma_score}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">MSR</p>
                    <p className="font-display font-bold text-isabella-purple">{profile.msr_reputation}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Balance</p>
                    <p className="font-display font-bold text-anubis-gold">{profile.wallet_balance.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* DID */}
              <div className="p-3 border-b border-border">
                <p className="text-xs text-muted-foreground mb-1">Identificador Descentralizado</p>
                <p className="text-xs font-mono text-electric-cyan/80 truncate">{profile.did}</p>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                <Link
                  to="/hub"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Wallet className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Civilization Hub</span>
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Settings className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Configuración</span>
                </button>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-destructive/20 text-destructive transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Cerrar sesión</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserMenu;
