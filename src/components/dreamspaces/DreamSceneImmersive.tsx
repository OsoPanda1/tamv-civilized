import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { 
  OrbitControls, 
  Sphere, 
  MeshDistortMaterial, 
  Stars,
  Float,
  Environment,
  Text,
  PerspectiveCamera,
  useTexture,
  Sparkles,
  Cloud,
  Sky,
  PositionalAudio,
  Html
} from "@react-three/drei";
import * as THREE from "three";

// Scene types for TAMV worlds
type SceneType = 'quantum-nexus' | 'sanctuary' | 'metropolis' | 'concert-hall' | 'academy' | 'dream-realm';

interface SceneConfig {
  name: string;
  ambientColor: string;
  primaryColor: string;
  secondaryColor: string;
  particleCount: number;
  fogDensity: number;
}

const SCENE_CONFIGS: Record<SceneType, SceneConfig> = {
  'quantum-nexus': {
    name: 'Quantum Nexus',
    ambientColor: '#1a0a2e',
    primaryColor: '#c084fc',
    secondaryColor: '#00d4ff',
    particleCount: 3000,
    fogDensity: 0.02,
  },
  'sanctuary': {
    name: 'Sanctuary',
    ambientColor: '#0a1a2e',
    primaryColor: '#ffd700',
    secondaryColor: '#ff6b35',
    particleCount: 2000,
    fogDensity: 0.01,
  },
  'metropolis': {
    name: 'Metropolis',
    ambientColor: '#1a1a2e',
    primaryColor: '#00ff88',
    secondaryColor: '#ff0080',
    particleCount: 5000,
    fogDensity: 0.03,
  },
  'concert-hall': {
    name: 'Concert Hall',
    ambientColor: '#2e0a1a',
    primaryColor: '#ff4d6d',
    secondaryColor: '#ffd700',
    particleCount: 4000,
    fogDensity: 0.015,
  },
  'academy': {
    name: 'Academy',
    ambientColor: '#0a2e1a',
    primaryColor: '#4ade80',
    secondaryColor: '#3b82f6',
    particleCount: 1500,
    fogDensity: 0.008,
  },
  'dream-realm': {
    name: 'Dream Realm',
    ambientColor: '#2e1a2e',
    primaryColor: '#e879f9',
    secondaryColor: '#22d3ee',
    particleCount: 6000,
    fogDensity: 0.025,
  },
};

// Quantum Core - Central structure
const QuantumCore = ({ config }: { config: SceneConfig }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <group>
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
        <Sphere ref={meshRef} args={[2, 128, 128]} position={[0, 0, 0]}>
          <MeshDistortMaterial
            color={config.primaryColor}
            distort={0.4}
            speed={3}
            roughness={0.1}
            metalness={0.9}
            emissive={config.primaryColor}
            emissiveIntensity={0.3}
          />
        </Sphere>
      </Float>

      {/* Energy Rings */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[4, 0.05, 16, 100]} />
        <meshStandardMaterial 
          color={config.secondaryColor} 
          emissive={config.secondaryColor}
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
        />
      </mesh>

      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[5, 0.03, 16, 100]} />
        <meshStandardMaterial 
          color={config.primaryColor} 
          emissive={config.primaryColor}
          emissiveIntensity={0.3}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
};

// Floating Platforms/Nodes
const FloatingNode = ({ position, color, label }: { position: [number, number, number]; color: string; label: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.3;
    }
  });

  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={0.2}>
        <mesh 
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <dodecahedronGeometry args={[0.8, 0]} />
          <meshStandardMaterial 
            color={color}
            emissive={color}
            emissiveIntensity={hovered ? 0.8 : 0.3}
            metalness={0.7}
            roughness={0.2}
          />
        </mesh>
        {hovered && (
          <Html center distanceFactor={10}>
            <div className="bg-background/90 backdrop-blur px-3 py-1 rounded-lg border border-muted text-sm whitespace-nowrap">
              {label}
            </div>
          </Html>
        )}
      </Float>
    </group>
  );
};

// Particle Field with scene-specific configuration
const ParticleSystem = ({ config }: { config: SceneConfig }) => {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(config.particleCount * 3);
    const colors = new Float32Array(config.particleCount * 3);
    const primaryColor = new THREE.Color(config.primaryColor);
    const secondaryColor = new THREE.Color(config.secondaryColor);
    
    for (let i = 0; i < config.particleCount; i++) {
      const radius = 15 + Math.random() * 35;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      const mixFactor = Math.random();
      const color = primaryColor.clone().lerp(secondaryColor, mixFactor);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    return { positions, colors };
  }, [config]);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particles.colors.length / 3}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// Energy Beams connecting nodes
const EnergyBeams = ({ config }: { config: SceneConfig }) => {
  const beamsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (beamsRef.current) {
      beamsRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={beamsRef}>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh
          key={i}
          position={[0, 0, 0]}
          rotation={[0, (i / 6) * Math.PI * 2, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.02, 0.02, 30, 8]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? config.primaryColor : config.secondaryColor}
            transparent
            opacity={0.2}
          />
        </mesh>
      ))}
    </group>
  );
};

// Audio Visualizer (Kaos 3D simulation)
const AudioVisualizer = ({ config }: { config: SceneConfig }) => {
  const barsRef = useRef<THREE.Group>(null);
  const [audioLevels, setAudioLevels] = useState<number[]>(new Array(32).fill(0));

  useEffect(() => {
    // Simulate audio reactive bars
    const interval = setInterval(() => {
      setAudioLevels(prev => prev.map(() => 0.2 + Math.random() * 0.8));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <group ref={barsRef} position={[0, -5, 0]} rotation={[0, 0, 0]}>
      {audioLevels.map((level, i) => {
        const angle = (i / audioLevels.length) * Math.PI * 2;
        const radius = 8;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              level * 3,
              Math.sin(angle) * radius
            ]}
          >
            <boxGeometry args={[0.3, level * 6, 0.3]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? config.primaryColor : config.secondaryColor}
              emissive={i % 2 === 0 ? config.primaryColor : config.secondaryColor}
              emissiveIntensity={level * 0.5}
            />
          </mesh>
        );
      })}
    </group>
  );
};

// Main Scene Component
const Scene = ({ sceneType }: { sceneType: SceneType }) => {
  const config = SCENE_CONFIGS[sceneType];
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 5, 20);
  }, [camera]);

  const nodePositions: { pos: [number, number, number]; label: string }[] = [
    { pos: [8, 2, -5], label: 'DreamSpace Portal' },
    { pos: [-7, 3, -3], label: 'Governance Hub' },
    { pos: [5, -2, 6], label: 'NUBI Exchange' },
    { pos: [-6, 1, 5], label: 'Isabella Nexus' },
    { pos: [0, 6, -8], label: 'Academy Tower' },
    { pos: [10, -1, 0], label: 'MSR Ledger' },
  ];

  return (
    <>
      <color attach="background" args={[config.ambientColor]} />
      <fog attach="fog" args={[config.ambientColor, 10, 80]} />
      
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} color={config.primaryColor} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color={config.secondaryColor} />
      <spotLight
        position={[0, 20, 0]}
        angle={0.3}
        penumbra={1}
        intensity={1}
        color="#ffffff"
      />

      <Stars radius={100} depth={50} count={5000} factor={4} fade speed={1} />
      <Sparkles count={200} scale={40} size={2} speed={0.5} color={config.primaryColor} />

      <QuantumCore config={config} />
      <ParticleSystem config={config} />
      <EnergyBeams config={config} />
      <AudioVisualizer config={config} />

      {nodePositions.map((node, i) => (
        <FloatingNode 
          key={i} 
          position={node.pos} 
          color={i % 2 === 0 ? config.primaryColor : config.secondaryColor}
          label={node.label}
        />
      ))}

      <Environment preset="night" />
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        maxDistance={50}
        minDistance={8}
        autoRotate
        autoRotateSpeed={0.3}
        maxPolarAngle={Math.PI * 0.8}
        minPolarAngle={Math.PI * 0.2}
      />
    </>
  );
};

interface DreamSceneImmersiveProps {
  sceneType?: SceneType;
}

const DreamSceneImmersive = ({ sceneType = 'quantum-nexus' }: DreamSceneImmersiveProps) => {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 5, 20], fov: 60 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
      >
        <Scene sceneType={sceneType} />
      </Canvas>
    </div>
  );
};

export default DreamSceneImmersive;
