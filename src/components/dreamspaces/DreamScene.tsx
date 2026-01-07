import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { 
  OrbitControls, 
  Sphere, 
  MeshDistortMaterial, 
  Stars,
  Float,
  Text3D,
  Center,
  Environment
} from "@react-three/drei";
import * as THREE from "three";

const QuantumOrb = ({ position, color, speed = 1 }: { position: [number, number, number]; color: string; speed?: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2 * speed;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3 * speed;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere ref={meshRef} args={[1, 64, 64]} position={position}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
};

const ParticleRing = () => {
  const ringRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const count = 2000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 8 + Math.random() * 2;
      const height = (Math.random() - 0.5) * 2;
      
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      
      // Isabella purple to electric cyan gradient
      const t = i / count;
      colors[i * 3] = 0.5 + t * 0.3;     // R
      colors[i * 3 + 1] = 0.2 + t * 0.6;  // G
      colors[i * 3 + 2] = 0.8 + t * 0.2;  // B
    }
    
    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <points ref={ringRef}>
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
        size={0.05}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
};

const EnergyBeams = () => {
  const beamsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (beamsRef.current) {
      beamsRef.current.rotation.y = state.clock.elapsedTime * 0.2;
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
          <cylinderGeometry args={[0.02, 0.02, 20, 8]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? "#c084fc" : "#00d4ff"}
            transparent
            opacity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
};

const FloatingPlatform = () => {
  return (
    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.5}>
      <mesh position={[0, -3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[4, 5, 64]} />
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.9}
          roughness={0.1}
          emissive="#c084fc"
          emissiveIntensity={0.1}
        />
      </mesh>
    </Float>
  );
};

const Scene = () => {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#c084fc" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00d4ff" />
      <spotLight
        position={[0, 10, 0]}
        angle={0.3}
        penumbra={1}
        intensity={1}
        color="#ffd700"
      />

      <Stars radius={100} depth={50} count={5000} factor={4} fade speed={1} />

      <QuantumOrb position={[0, 0, 0]} color="#c084fc" speed={1} />
      <QuantumOrb position={[4, 1, -2]} color="#00d4ff" speed={0.8} />
      <QuantumOrb position={[-3, -1, 2]} color="#ffd700" speed={1.2} />

      <ParticleRing />
      <EnergyBeams />
      <FloatingPlatform />

      <Environment preset="night" />
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        maxDistance={20}
        minDistance={5}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
};

const DreamScene = () => {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 2, 12], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
};

export default DreamScene;
