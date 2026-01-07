import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import DreamScene from "@/components/dreamspaces/DreamScene";
import SpaceSelector from "@/components/dreamspaces/SpaceSelector";
import SpaceInfo from "@/components/dreamspaces/SpaceInfo";
import { Loader2 } from "lucide-react";

const LoadingFallback = () => (
  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-deep-space to-cosmic">
    <div className="text-center">
      <Loader2 className="w-12 h-12 text-isabella animate-spin mx-auto mb-4" />
      <p className="text-muted-foreground">Cargando DreamSpace™...</p>
      <p className="text-xs text-muted-foreground mt-1">Inicializando HyperRender Engine</p>
    </div>
  </div>
);

const DreamSpaces = () => {
  const [selectedSpace, setSelectedSpace] = useState("quantum-nexus");

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <Navbar />

      <main className="h-screen pt-16">
        <div className="h-full grid lg:grid-cols-[1fr_350px] gap-0">
          {/* 3D Scene */}
          <div className="relative h-full min-h-[400px] lg:min-h-0">
            <Suspense fallback={<LoadingFallback />}>
              <DreamScene />
            </Suspense>
            
            {/* Overlay Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-6 left-6 right-6 lg:right-auto"
            >
              <div className="glass rounded-2xl p-4 max-w-md">
                <span className="text-isabella font-display text-xs tracking-widest uppercase">
                  Experiencia XR Inmersiva
                </span>
                <h2 className="font-display text-2xl font-bold mt-1">
                  <span className="text-gradient-isabella">DreamSpaces</span>™
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Mundos persistentes donde cada objeto es un Token MSR. 
                  Arrastra para rotar, scroll para zoom.
                </p>
              </div>
            </motion.div>

            {/* Corner decorations */}
            <div className="absolute top-20 left-4 text-[10px] font-mono text-isabella/50">
              HYPERRENDER v2.4
            </div>
            <div className="absolute top-20 right-4 text-[10px] font-mono text-electric/50">
              KAOS 3D™ ACTIVE
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

            {/* KAOS Audio Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-2xl p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-foreground">Audio KAOS 3D™</span>
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              </div>
              <div className="h-8 flex items-end gap-0.5">
                {Array.from({ length: 32 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-isabella to-electric rounded-t"
                    animate={{
                      height: `${20 + Math.random() * 80}%`,
                    }}
                    transition={{
                      duration: 0.2,
                      repeat: Infinity,
                      repeatType: "reverse",
                      delay: i * 0.02,
                    }}
                  />
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground mt-2">
                Frecuencia sincronizada con ECG Emocional
              </p>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DreamSpaces;
