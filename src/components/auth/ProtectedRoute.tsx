import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredTier?: 'citizen' | 'architect' | 'guardian' | 'celestial';
}

const tierHierarchy = {
  citizen: 0,
  architect: 1,
  guardian: 2,
  celestial: 3,
};

const ProtectedRoute = ({ children, requiredTier }: ProtectedRouteProps) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

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

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (requiredTier && profile) {
    const userTierLevel = tierHierarchy[profile.tier];
    const requiredTierLevel = tierHierarchy[requiredTier];
    
    if (userTierLevel < requiredTierLevel) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="glass rounded-2xl p-8 border border-border text-center max-w-md">
            <h1 className="font-display text-2xl font-bold text-gradient-primary mb-4">
              Acceso Restringido
            </h1>
            <p className="text-muted-foreground mb-4">
              Necesitas ser <span className="text-electric-cyan font-semibold capitalize">{requiredTier}</span> o superior para acceder a esta sección.
            </p>
            <p className="text-sm text-muted-foreground">
              Tu tier actual: <span className="text-anubis-gold capitalize">{profile.tier}</span>
            </p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
