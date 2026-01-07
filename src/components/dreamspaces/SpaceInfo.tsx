import { motion } from "framer-motion";
import { Users, Clock, Cpu, Volume2, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SpaceInfoProps {
  spaceId: string;
}

const spaceData: Record<string, {
  name: string;
  visitors: number;
  uptime: string;
  renderEngine: string;
  audioMode: string;
}> = {
  "quantum-nexus": {
    name: "Quantum Nexus",
    visitors: 127,
    uptime: "99.9%",
    renderEngine: "HyperRender v2.4",
    audioMode: "KAOS Ambient",
  },
  "kaos-arena": {
    name: "KAOS Arena",
    visitors: 312,
    uptime: "99.7%",
    renderEngine: "HyperRender v2.4",
    audioMode: "KAOS Spatial 4D",
  },
  "creation-forge": {
    name: "Creation Forge",
    visitors: 89,
    uptime: "99.8%",
    renderEngine: "HyperRender v2.4",
    audioMode: "KAOS Creative",
  },
  "agora-prime": {
    name: "Ágora Prime",
    visitors: 456,
    uptime: "99.9%",
    renderEngine: "HyperRender v2.4",
    audioMode: "KAOS Social",
  },
  "trade-hub": {
    name: "Trade Hub",
    visitors: 234,
    uptime: "99.9%",
    renderEngine: "HyperRender v2.4",
    audioMode: "KAOS Commerce",
  },
  "academy-tamv": {
    name: "Academia TAMV",
    visitors: 178,
    uptime: "99.8%",
    renderEngine: "HyperRender v2.4",
    audioMode: "KAOS Learning",
  },
};

const SpaceInfo = ({ spaceId }: SpaceInfoProps) => {
  const data = spaceData[spaceId] || spaceData["quantum-nexus"];

  return (
    <div className="glass rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-foreground">
          {data.name}
        </h3>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Maximize2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-3 rounded-xl bg-muted/30"
        >
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
            <Users className="w-3 h-3" />
            <span>Visitantes</span>
          </div>
          <p className="font-display font-bold text-electric">{data.visitors}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="p-3 rounded-xl bg-muted/30"
        >
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
            <Clock className="w-3 h-3" />
            <span>Uptime</span>
          </div>
          <p className="font-display font-bold text-green-400">{data.uptime}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="p-3 rounded-xl bg-muted/30"
        >
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
            <Cpu className="w-3 h-3" />
            <span>Render Engine</span>
          </div>
          <p className="font-display font-bold text-isabella text-sm">{data.renderEngine}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="p-3 rounded-xl bg-muted/30"
        >
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
            <Volume2 className="w-3 h-3" />
            <span>Audio Mode</span>
          </div>
          <p className="font-display font-bold text-anubis text-sm">{data.audioMode}</p>
        </motion.div>
      </div>

      <div className="pt-4 border-t border-muted space-y-2">
        <Button className="w-full bg-gradient-isabella hover:opacity-90 text-white">
          Entrar al Espacio
        </Button>
        <Button variant="outline" className="w-full border-electric/30 text-electric hover:bg-electric/10">
          Vista Previa VR
        </Button>
      </div>
    </div>
  );
};

export default SpaceInfo;
