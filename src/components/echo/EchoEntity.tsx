import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface EntityProps {
  speaking: boolean;
}

// ── Core sacred geometry entity ───────────────────────────────────────────────
function EntityCore({ speaking }: EntityProps) {
  const outerRef = useRef<THREE.Mesh>(null!);
  const innerRef = useRef<THREE.Mesh>(null!);
  const ring1Ref = useRef<THREE.Mesh>(null!);
  const ring2Ref = useRef<THREE.Mesh>(null!);
  const ring3Ref = useRef<THREE.Mesh>(null!);
  const glowRef  = useRef<THREE.Mesh>(null!);
  const timeRef  = useRef(0);

  useFrame((_, delta) => {
    timeRef.current += delta;
    const t = timeRef.current;
    const speed = speaking ? 2.2 : 0.55;
    const pulse = speaking
      ? 1 + Math.sin(t * 6) * 0.07
      : 1 + Math.sin(t * 1.2) * 0.025;

    // Outer wireframe icosahedron
    if (outerRef.current) {
      outerRef.current.rotation.x = t * speed * 0.31;
      outerRef.current.rotation.y = t * speed * 0.47;
      outerRef.current.scale.setScalar(pulse);
    }
    // Inner solid icosahedron — counter-rotate
    if (innerRef.current) {
      innerRef.current.rotation.x = -t * speed * 0.22;
      innerRef.current.rotation.y = t * speed * 0.35;
      innerRef.current.rotation.z = t * speed * 0.18;
    }
    // Rings orbit on different axes
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * speed * 0.6;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = t * speed * 0.45;
      ring2Ref.current.rotation.z = t * speed * 0.2;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = -t * speed * 0.35;
      ring3Ref.current.rotation.z = t * speed * 0.5;
    }
    // Glow breathing
    if (glowRef.current) {
      const glowScale = speaking
        ? 1.6 + Math.sin(t * 5) * 0.25
        : 1.4 + Math.sin(t * 1.5) * 0.08;
      glowRef.current.scale.setScalar(glowScale);
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = speaking
        ? 0.12 + Math.sin(t * 5) * 0.06
        : 0.06 + Math.sin(t * 1.5) * 0.03;
    }
  });

  return (
    <group>
      {/* Ambient glow sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="#c9a84c" transparent opacity={0.06} side={THREE.BackSide} />
      </mesh>

      {/* Inner solid icosahedron */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[0.55, 1]} />
        <meshStandardMaterial
          color="#c9a84c"
          emissive="#8a5a10"
          emissiveIntensity={speaking ? 1.8 : 0.8}
          metalness={0.7}
          roughness={0.2}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Outer wireframe icosahedron */}
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[0.95, 1]} />
        <meshBasicMaterial
          color="#c9a84c"
          wireframe
          transparent
          opacity={speaking ? 0.55 : 0.28}
        />
      </mesh>

      {/* Ring 1 — gold torus */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1.15, 0.018, 8, 64]} />
        <meshBasicMaterial color="#c9a84c" transparent opacity={0.7} />
      </mesh>

      {/* Ring 2 — purple torus */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[1.35, 0.014, 8, 64]} />
        <meshBasicMaterial color="#9333ea" transparent opacity={0.55} />
      </mesh>

      {/* Ring 3 — soft white torus */}
      <mesh ref={ring3Ref}>
        <torusGeometry args={[1.55, 0.01, 8, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
      </mesh>

      {/* Dynamic point lights */}
      <pointLight
        color="#c9a84c"
        intensity={speaking ? 4 : 1.5}
        distance={6}
      />
      <pointLight
        color="#9333ea"
        intensity={speaking ? 2 : 0.6}
        distance={4}
        position={[0, 0, -1]}
      />
    </group>
  );
}

// ── Orbiting particle cloud ───────────────────────────────────────────────────
function ParticleCloud({ speaking }: EntityProps) {
  const ref = useRef<THREE.Points>(null!);
  const timeRef = useRef(0);

  const { positions, colors } = useMemo(() => {
    const count = 320;
    const positions = new Float32Array(count * 3);
    const colors    = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Fibonacci sphere distribution
      const phi   = Math.acos(1 - (2 * i) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 2.2 + (Math.random() - 0.5) * 1.2;

      positions[i3]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = r * Math.cos(phi);

      const rand = Math.random();
      if (rand < 0.6) {
        // gold
        colors[i3] = 0.79; colors[i3 + 1] = 0.66; colors[i3 + 2] = 0.3;
      } else if (rand < 0.8) {
        // purple
        colors[i3] = 0.58; colors[i3 + 1] = 0.2; colors[i3 + 2] = 0.92;
      } else {
        // white
        colors[i3] = 0.9; colors[i3 + 1] = 0.9; colors[i3 + 2] = 1.0;
      }
    }
    return { positions, colors };
  }, []);

  useFrame((_, delta) => {
    timeRef.current += delta;
    if (ref.current) {
      const speed = speaking ? 0.4 : 0.1;
      ref.current.rotation.y += delta * speed;
      ref.current.rotation.x += delta * speed * 0.3;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={positions.length / 3} itemSize={3} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} count={colors.length / 3} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={speaking ? 0.045 : 0.03}
        vertexColors
        transparent
        opacity={speaking ? 0.9 : 0.55}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ── Exported component ────────────────────────────────────────────────────────
interface EchoEntityProps {
  speaking: boolean;
  size?: number;
}

export default function EchoEntity({ speaking, size = 240 }: EchoEntityProps) {
  return (
    <div
      style={{ width: size, height: size, margin: '0 auto' }}
      className="relative"
    >
      {/* Soft radial glow behind the canvas */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: speaking
            ? 'radial-gradient(ellipse at center, rgba(201,168,76,0.18) 0%, rgba(147,51,234,0.08) 50%, transparent 70%)'
            : 'radial-gradient(ellipse at center, rgba(201,168,76,0.08) 0%, transparent 60%)',
          transition: 'background 0.6s ease',
        }}
      />
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <EntityCore speaking={speaking} />
        <ParticleCloud speaking={speaking} />
      </Canvas>
    </div>
  );
}
