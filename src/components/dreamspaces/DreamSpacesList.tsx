import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, Users, Sparkles, Shield, Coins, 
  Globe, Lock, Zap, Crown, Gamepad2, Music, Building2, BookOpen
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDreamSpacesStore, DreamSpace } from '@/stores/dreamspacesStore';
import { cn } from '@/lib/utils';

interface DreamSpacesListProps {
  onSelectSpace: (space: DreamSpace) => void;
  selectedSpaceId?: string;
}

const SCENE_ICONS: Record<string, any> = {
  'quantum-nexus': Zap,
  'sanctuary': Sparkles,
  'metropolis': Building2,
  'concert-hall': Music,
  'academy': BookOpen,
  'dream-realm': Globe
};

const PHASE_COLORS: Record<string, string> = {
  'alpha': 'bg-muted text-muted-foreground border-border',
  'beta': 'bg-accent/20 text-accent-foreground border-accent/30',
  'live': 'bg-primary/20 text-primary border-primary/30',
  'legacy': 'bg-secondary text-secondary-foreground border-border'
};

const DreamSpacesList = ({ onSelectSpace, selectedSpaceId }: DreamSpacesListProps) => {
  const { spaces, userLevel, loading, fetchSpaces } = useDreamSpacesStore();

  useEffect(() => {
    fetchSpaces();
  }, []);

  const canAccessSpace = (space: DreamSpace) => {
    const levels = ['user', 'citizen', 'builder', 'governor', 'admin', 'dao_admin'];
    const userIdx = levels.indexOf(userLevel);
    const requiredIdx = levels.indexOf(space.min_level || 'user');
    return userIdx >= requiredIdx;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="glass animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-6 w-3/4 bg-muted rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-4 w-full bg-muted rounded mb-2" />
              <div className="h-4 w-2/3 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {spaces.map((space, index) => {
        const Icon = SCENE_ICONS[space.scene_type] || Globe;
        const hasAccess = canAccessSpace(space);
        const isSelected = selectedSpaceId === space.id;

        return (
          <motion.div
            key={space.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card 
              className={cn(
                "glass cursor-pointer transition-all duration-300 overflow-hidden group",
                isSelected && "ring-2 ring-isabella",
                !hasAccess && "opacity-60"
              )}
              onClick={() => hasAccess && onSelectSpace(space)}
            >
              {/* Cover Image or Gradient */}
              <div className="h-24 relative overflow-hidden">
                {space.cover_image_url ? (
                  <img 
                    src={space.cover_image_url} 
                    alt={space.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className={cn(
                    "w-full h-full bg-gradient-to-br from-isabella/30 to-electric/30"
                  )} />
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                
                {/* Phase Badge */}
                <Badge 
                  variant="outline" 
                  className={cn("absolute top-2 right-2", PHASE_COLORS[space.phase || 'alpha'])}
                >
                  {space.phase?.toUpperCase()}
                </Badge>
                
                {/* Lock for restricted access */}
                {!hasAccess && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
                    <div className="text-center">
                      <Lock className="h-8 w-8 mx-auto text-muted-foreground" />
                      <p className="text-xs text-muted-foreground mt-1">
                        Requiere nivel: {space.min_level}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <CardHeader className="pb-2 pt-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-isabella/20 to-electric/20">
                    <Icon className="h-5 w-5 text-isabella" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-display truncate">
                      {space.title}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Crown className="h-3 w-3" />
                      {space.role_civilizatorio || 'General'}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pb-3">
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {space.description}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {space.visitors?.toLocaleString() || 0}
                  </span>
                  {space.economic_loop?.type && (
                    <span className="flex items-center gap-1">
                      <Coins className="h-3 w-3" />
                      {space.economic_loop.type.replace(/_/g, ' ')}
                    </span>
                  )}
                </div>

                {/* Ethical Limits */}
                {space.ethical_limits && Object.keys(space.ethical_limits).length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(space.ethical_limits).slice(0, 3).map(([key, value]) => (
                      value && (
                        <Badge key={key} variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/30">
                          <Shield className="h-2.5 w-2.5 mr-1" />
                          {key.replace(/_/g, ' ')}
                        </Badge>
                      )
                    ))}
                  </div>
                )}

                {/* Enter Button */}
                {hasAccess && (
                  <Button 
                    className="w-full mt-3 bg-gradient-to-r from-isabella to-electric hover:opacity-90"
                    size="sm"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Entrar al DreamSpace
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default DreamSpacesList;
