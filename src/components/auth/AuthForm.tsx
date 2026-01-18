import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Sparkles, Shield, Crown, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

const signUpSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  displayName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
});

const signInSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

const tierInfo = [
  { tier: 'citizen', icon: User, label: 'Citizen', desc: 'Acceso básico al ecosistema', color: 'text-muted-foreground' },
  { tier: 'architect', icon: Sparkles, label: 'Architect', desc: 'Creación y DreamSpaces', color: 'text-electric-cyan' },
  { tier: 'guardian', icon: Shield, label: 'Guardian', desc: 'Gobernanza y arbitraje', color: 'text-isabella-purple' },
  { tier: 'celestial', icon: Crown, label: 'Celestial', desc: 'Soberanía total', color: 'text-anubis-gold' },
];

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { signUp, signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const validateForm = () => {
    try {
      if (isLogin) {
        signInSchema.parse({ email, password });
      } else {
        signUpSchema.parse({ email, password, displayName });
      }
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast({
              title: 'Error de autenticación',
              description: 'Credenciales inválidas. Verifica tu email y contraseña.',
              variant: 'destructive',
            });
          } else {
            toast({
              title: 'Error',
              description: error.message,
              variant: 'destructive',
            });
          }
          return;
        }
        toast({
          title: '¡Bienvenido de vuelta!',
          description: 'Has ingresado exitosamente a TAMV Online.',
        });
        navigate('/hub');
      } else {
        const { error } = await signUp(email, password, displayName);
        if (error) {
          if (error.message.includes('already registered')) {
            toast({
              title: 'Email ya registrado',
              description: 'Este email ya está en uso. ¿Quieres iniciar sesión?',
              variant: 'destructive',
            });
          } else {
            toast({
              title: 'Error',
              description: error.message,
              variant: 'destructive',
            });
          }
          return;
        }
        toast({
          title: '¡Identidad Soberana Creada!',
          description: 'Tu DID único ha sido generado. Bienvenido a la civilización digital.',
        });
        navigate('/hub');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-8 border border-border"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-primary rounded-xl flex items-center justify-center">
            <Star className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="font-display text-2xl font-bold text-gradient-primary mb-2">
            {isLogin ? 'Acceder a TAMV' : 'Crear Identidad Soberana'}
          </h1>
          <p className="text-muted-foreground text-sm">
            {isLogin 
              ? 'Ingresa a tu identidad digital única' 
              : 'Únete a la civilización digital constitucional'}
          </p>
        </div>

        {/* Tier Preview (only for signup) */}
        {!isLogin && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6 p-4 bg-muted/30 rounded-xl border border-border"
          >
            <p className="text-xs text-muted-foreground mb-3">Comenzarás como Citizen y podrás evolucionar:</p>
            <div className="grid grid-cols-2 gap-2">
              {tierInfo.map(({ tier, icon: Icon, label, color }) => (
                <div key={tier} className="flex items-center gap-2 text-xs">
                  <Icon className={`w-3 h-3 ${color}`} />
                  <span className={color}>{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="displayName" className="text-foreground">
                Nombre de Ciudadano
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="displayName"
                  type="text"
                  placeholder="Tu nombre en TAMV"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="pl-10 bg-background/50 border-border"
                />
              </div>
              {errors.displayName && (
                <p className="text-xs text-destructive">{errors.displayName}</p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-background/50 border-border"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">Contraseña</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 bg-background/50 border-border"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-primary hover:opacity-90 font-display font-semibold"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
              />
            ) : isLogin ? (
              'Ingresar'
            ) : (
              'Crear Identidad Soberana'
            )}
          </Button>
        </form>

        {/* Toggle */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            {isLogin ? '¿No tienes una identidad?' : '¿Ya tienes una identidad?'}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setErrors({});
              }}
              className="ml-1 text-electric-cyan hover:text-electric-cyan/80 font-semibold"
            >
              {isLogin ? 'Crear una' : 'Iniciar sesión'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthForm;
