import { useState, Suspense, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import DreamSceneImmersive from "@/components/dreamspaces/DreamSceneImmersive";
import DreamSpacesList from "@/components/dreamspaces/DreamSpacesList";
import SpaceInfo from "@/components/dreamspaces/SpaceInfo";
import KaosPlayer from "@/components/kaos/KaosPlayer";
import { Loader2, Volume2, VolumeX, Maximize2, Settings, List, Grid3X3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDreamSpacesStore, DreamSpace } from "@/stores/dreamspacesStore";
import { useAuth } from "@/hooks/useAuth";

type SceneType = 'quantum-nexus' | 'sanctuary' | 'metropolis' | 'concert-hall' | 'academy' | 'dream-realm';

const SCENE_MAP: Record<string, SceneType> = {
  'quantum-nexus': 'quantum-nexus',
  'sanctuary': 'sanctuary',
  'metropolis': 'metropolis',
  'concert-hall': 'concert-hall',
  'academy': 'academy',
  'dream-realm': 'dream-realm',
};

const LoadingFallback = () => (
  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-deep-space to-cosmic">
    <div className="text-center">
      <Loader2 className="w-12 h-12 text-isabella animate-spin mx-auto mb-4" />
      <p className="text-muted-foreground">Cargando DreamSpace™...</p>
      <p className="text-xs text-muted-foreground mt-1">Inicializando HyperRender Engine 4D</p>
    </div>
  </div>
);

const DreamSpacesPage = () => {
  const [selectedSpace, setSelectedSpace] = useState<string>("quantum-nexus");
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<'immersive' | 'grid'>('immersive');
  const { user } = useAuth();
  const { 
    spaces, 
    currentSpace, 
    currentInstance,
    enterSpace, 
    exitSpace, 
    setCurrentSpace,
    fetchSpaces 
  } = useDreamSpacesStore();

  useEffect(() => {
    fetchSpaces();
  }, []);

  const handleFullscreen = () => {
    const elem = document.documentElement;
    if (!isFullscreen) {
      elem.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleSelectSpace = (space: DreamSpace) => {
    setSelectedSpace(space.scene_type);
    setCurrentSpace(space);
    
    // If user is logged in, enter the space
    if (user) {
      enterSpace(space.id);
    }
  };

  const sceneType: SceneType = SCENE_MAP[selectedSpace] || 'quantum-nexus';

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <Navbar />

      <main className="h-screen pt-16">
        <div className="h-full grid lg:grid-cols-[1fr_420px] gap-0">
          {/* 3D Scene or Grid View */}
          <div className="relative h-full min-h-[400px] lg:min-h-0">
            {viewMode === 'immersive' ? (
              <Suspense fallback={<LoadingFallback />}>
                <DreamSceneImmersive sceneType={sceneType} />
              </Suspense>
            ) : (
              <div className="h-full overflow-y-auto p-6 bg-gradient-to-br from-deep-space/50 to-cosmic/50">
                <DreamSpacesList 
                  onSelectSpace={handleSelectSpace}
                  selectedSpaceId={currentSpace?.id}
                />
              </div>
            )}
            
            {/* Overlay Controls */}
            <div className="absolute top-4 right-4 flex gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="glass"
                onClick={() => setViewMode(viewMode === 'immersive' ? 'grid' : 'immersive')}
              >
                {viewMode === 'immersive' ? <Grid3X3 className="w-4 h-4" /> : <List className="w-4 h-4" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="glass"
                onClick={() => setAudioEnabled(!audioEnabled)}
              >
                {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="glass"
                onClick={handleFullscreen}
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="glass">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Overlay Info */}
            {viewMode === 'immersive' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-6 left-6 right-6 lg:right-auto"
              >
                <div className="glass rounded-2xl p-4 max-w-md">
                  <span className="text-isabella font-display text-xs tracking-widest uppercase">
                    {currentSpace?.role_civilizatorio || 'Omniverso 3D/4D'}
                  </span>
                  <h2 className="font-display text-2xl font-bold mt-1">
                    <span className="text-gradient-isabella">{currentSpace?.title || 'DreamSpaces'}</span>™
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {currentSpace?.description || 'Mundos persistentes donde cada objeto es un Token MSR.'}
                  </p>
                  {currentInstance && (
                    <div className="mt-2 flex items-center gap-2 text-xs">
                      <span className="bg-primary/20 text-primary px-2 py-0.5 rounded">
                        Sesión: {currentInstance.session_id.slice(0, 8)}...
                      </span>
                      <span className="text-muted-foreground">
                        Emoción: {currentInstance.emotion_start}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Corner decorations */}
            <div className="absolute top-20 left-4 text-[10px] font-mono text-isabella/50">
              HYPERRENDER 4D v2.4
            </div>
            <div className="absolute top-20 right-20 text-[10px] font-mono text-electric/50">
              KAOS 3D™ {audioEnabled ? 'ACTIVE' : 'MUTED'}
            </div>
          </div>

          {/* Sidebar */}
          <div className="bg-background/80 backdrop-blur-xl border-l border-muted overflow-y-auto p-6 space-y-6">
            <Tabs defaultValue="spaces" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="spaces" className="flex-1">Espacios</TabsTrigger>
                <TabsTrigger value="audio" className="flex-1">KAOS Audio</TabsTrigger>
              </TabsList>
              
              <TabsContent value="spaces" className="space-y-4 mt-4">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <DreamSpacesList 
                    onSelectSpace={handleSelectSpace}
                    selectedSpaceId={currentSpace?.id}
                  />
                </motion.div>
              </TabsContent>
              
              <TabsContent value="audio" className="space-y-4 mt-4">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <KaosPlayer />
                </motion.div>
              </TabsContent>
            </Tabs>

            {/* Space Info */}
            {currentSpace && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <SpaceInfo spaceId={selectedSpace} />
              </motion.div>
            )}

            {/* Scene Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-2xl p-4"
            >
              <h4 className="text-sm font-semibold text-foreground mb-3">Estadísticas del Espacio</h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Visitantes', value: currentSpace?.visitors?.toLocaleString() || '0' },
                  { label: 'Tu Nivel', value: 'Ciudadano' },
                  { label: 'XP Sesión', value: currentInstance?.experience_points?.toString() || '0' },
                  { label: 'Fase', value: currentSpace?.phase?.toUpperCase() || 'ALPHA' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-muted/30 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-foreground">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DreamSpacesPage;
