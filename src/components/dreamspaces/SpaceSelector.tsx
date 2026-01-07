import { motion } from "framer-motion";
import { Sparkles, Music, Palette, Users, Briefcase, GraduationCap } from "lucide-react";

interface Space {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
  tier: string;
}

const spaces: Space[] = [
  {
    id: "quantum-nexus",
    name: "Quantum Nexus",
    description: "Centro de meditación y conexión cuántica",
    icon: Sparkles,
    gradient: "from-isabella to-purple-900",
    tier: "L2 Architect",
  },
  {
    id: "kaos-arena",
    name: "KAOS Arena",
    description: "Experiencias de audio espacial 3D/4D",
    icon: Music,
    gradient: "from-electric to-blue-900",
    tier: "L2 Architect",
  },
  {
    id: "creation-forge",
    name: "Creation Forge",
    description: "Taller de arte digital y NFTs",
    icon: Palette,
    gradient: "from-anubis to-yellow-900",
    tier: "L2 Architect",
  },
  {
    id: "agora-prime",
    name: "Ágora Prime",
    description: "Plaza de encuentro y networking",
    icon: Users,
    gradient: "from-green-500 to-emerald-900",
    tier: "L1 Citizen",
  },
  {
    id: "trade-hub",
    name: "Trade Hub",
    description: "Centro de comercio y trueque TR01",
    icon: Briefcase,
    gradient: "from-orange-500 to-red-900",
    tier: "L1 Citizen",
  },
  {
    id: "academy-tamv",
    name: "Academia TAMV",
    description: "Universidad digital inmersiva",
    icon: GraduationCap,
    gradient: "from-pink-500 to-rose-900",
    tier: "L3 Guardian",
  },
];

interface SpaceSelectorProps {
  selectedSpace: string;
  onSelectSpace: (id: string) => void;
}

const SpaceSelector = ({ selectedSpace, onSelectSpace }: SpaceSelectorProps) => {
  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="font-display text-lg font-semibold text-foreground mb-4">
        DreamSpaces™ Disponibles
      </h3>
      
      <div className="grid gap-3">
        {spaces.map((space, index) => (
          <motion.button
            key={space.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelectSpace(space.id)}
            className={`w-full p-4 rounded-xl text-left transition-all ${
              selectedSpace === space.id
                ? 'bg-gradient-to-r ' + space.gradient + ' text-white'
                : 'bg-muted/30 hover:bg-muted/50'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${
                selectedSpace === space.id 
                  ? 'bg-white/20' 
                  : 'bg-gradient-to-r ' + space.gradient
              }`}>
                <space.icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={`font-semibold truncate ${
                  selectedSpace === space.id ? 'text-white' : 'text-foreground'
                }`}>
                  {space.name}
                </h4>
                <p className={`text-xs mt-0.5 truncate ${
                  selectedSpace === space.id ? 'text-white/80' : 'text-muted-foreground'
                }`}>
                  {space.description}
                </p>
                <span className={`inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full ${
                  selectedSpace === space.id 
                    ? 'bg-white/20 text-white' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {space.tier}
                </span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default SpaceSelector;
