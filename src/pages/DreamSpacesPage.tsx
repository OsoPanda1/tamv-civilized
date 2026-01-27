import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import DreamSceneImmersive from "@/components/dreamspaces/DreamSceneImmersive";
import SpaceSelector from "@/components/dreamspaces/SpaceSelector";
import SpaceInfo from "@/components/dreamspaces/SpaceInfo";
import { Loader2, Volume2, VolumeX, Maximize2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  const handleFullscreen = () => {
    const elem = document.documentElement;
    if (!isFullscreen) {
      elem.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  const sceneType: SceneType = SCENE_MAP[selectedSpace] || 'quantum-nexus';

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <Navbar />

      <main className="h-screen pt-16">
        <div className="h-full grid lg:grid-cols-[1fr_380px] gap-0">
          {/* 3D Scene */}
          <div className="relative h-full min-h-[400px] lg:min-h-0">
            <Suspense fallback={<LoadingFallback />}>
              <DreamSceneImmersive sceneType={sceneType} />
            </Suspense>
            
            {/* Overlay Controls */}
            <div className="absolute top-4 right-4 flex gap-2">
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-6 left-6 right-6 lg:right-auto"
            >
              <div className="glass rounded-2xl p-4 max-w-md">
                <span className="text-isabella font-display text-xs tracking-widest uppercase">
                  Omniverso 3D/4D
                </span>
                <h2 className="font-display text-2xl font-bold mt-1">
                  <span className="text-gradient-isabella">DreamSpaces</span>™
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Mundos persistentes donde cada objeto es un Token MSR. 
                  Arrastra para rotar, scroll para zoom, click en nodos para interactuar.
                </p>
              </div>
            </motion.div>

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
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <SpaceSelector 
                selectedSpace={selectedSpace} 
                onSelectSpace={setSelectedSpace} 
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <SpaceInfo spaceId={selectedSpace} />
            </motion.div>

            {/* Audio Visualizer */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-2xl p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-foreground">Audio KAOS 3D™</span>
                <span className={`w-2 h-2 rounded-full ${audioEnabled ? 'bg-green-500 animate-pulse' : 'bg-muted'}`} />
              </div>
              <div className="h-8 flex items-end gap-0.5">
                {Array.from({ length: 32 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-isabella to-electric rounded-t"
                    animate={{
                      height: audioEnabled ? `${20 + Math.random() * 80}%` : '10%',
                    }}
                    transition={{
                      duration: 0.15,
                      repeat: audioEnabled ? Infinity : 0,
                      repeatType: "reverse",
                      delay: i * 0.02,
                    }}
                  />
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground mt-2">
                {audioEnabled 
                  ? 'Frecuencia sincronizada con ECG Emocional' 
                  : 'Click en el icono de audio para activar'}
              </p>
            </motion.div>

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
                  { label: 'Visitantes', value: '1,247' },
                  { label: 'Nodos MSR', value: '42' },
                  { label: 'Tokens', value: '8.3K' },
                  { label: 'Eventos/h', value: '156' },
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
