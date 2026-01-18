import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthForm from '@/components/auth/AuthForm';
import ParticleField from '@/components/ParticleField';
import { useAuth } from '@/hooks/useAuth';

const Auth = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/hub');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-2 border-electric-cyan border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-deep-space-900">
        <ParticleField />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <a href="/" className="font-display text-3xl font-bold">
              <span className="text-gradient-primary">TAMV</span>
              <span className="text-muted-foreground"> Online</span>
            </a>
            <p className="text-sm text-muted-foreground mt-2">
              La Civilización Digital Constitucional
            </p>
          </motion.div>

          {/* Auth Form */}
          <AuthForm />

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-xs text-muted-foreground mt-8"
          >
            Al continuar, aceptas la <span className="text-electric-cyan">Constitución Digital</span> y 
            el <span className="text-electric-cyan">Principio DINN</span> de TAMV.
          </motion.p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
