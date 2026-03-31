import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type GeometryVariant = 'flower-of-life' | 'metatron' | 'sri-yantra' | 'vesica' | 'icosahedron-field';

interface SceneProps {
  variant: GeometryVariant;
  color: string;
}

// ── Shared: rotating ring system ──────────────────────────────────────────────
function RingSystem({ color, count, baseRadius, speed }: { color: string; count: number; baseRadius: number; speed: number }) {
  const group = useRef<THREE.Group>(null!);
  const c = new THREE.Color(color);

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.z += delta * speed;
    }
  });

  const rings = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const radius = baseRadius + i * 0.6;
      const geo = new THREE.TorusGeometry(radius, 0.008, 4, 80);
      return { geo, offset: (i / count) * Math.PI * 2 };
    });
  }, [count, baseRadius]);

  return (
    <group ref={group}>
      {rings.map(({ geo, offset }, i) => (
        <mesh key={i} rotation={[offset * 0.3, 0, offset]}>
          <primitive object={geo} />
          <meshBasicMaterial color={c} transparent opacity={0.15 - i * 0.015} />
        </mesh>
      ))}
    </group>
  );
}

// ── Petal ring (Flower of Life approximation) ─────────────────────────────────
function FlowerOfLife({ color }: { color: string }) {
  const group = useRef<THREE.Group>(null!);
  const c = new THREE.Color(color);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.z += delta * 0.04;
  });

  const circles = useMemo(() => {
    const positions: [number, number][] = [[0, 0]];
    const r = 1.4;
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      positions.push([Math.cos(angle) * r, Math.sin(angle) * r]);
    }
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 + Math.PI / 6;
      positions.push([Math.cos(angle) * r * 2, Math.sin(angle) * r * 2]);
    }
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      positions.push([Math.cos(angle) * r * 2, Math.sin(angle) * r * 2]);
    }
    return positions;
  }, []);

  return (
    <group ref={group}>
      {circles.map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0]}>
          <torusGeometry args={[1.4, 0.012, 4, 64]} />
          <meshBasicMaterial color={c} transparent opacity={0.12} />
        </mesh>
      ))}
    </group>
  );
}

// ── Metatron's Cube — overlapping circles + star lines ────────────────────────
function MetatronsCube({ color }: { color: string }) {
  const group = useRef<THREE.Group>(null!);
  const c = new THREE.Color(color);

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.z += delta * 0.025;
      group.current.rotation.x += delta * 0.01;
    }
  });

  const lines = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * 2.5, Math.sin(a) * 2.5, 0));
    }
    const segs: [THREE.Vector3, THREE.Vector3][] = [];
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        segs.push([pts[i], pts[j]]);
      }
    }
    return segs;
  }, []);

  return (
    <group ref={group}>
      {/* Outer ring */}
      <mesh>
        <torusGeometry args={[2.5, 0.012, 4, 80]} />
        <meshBasicMaterial color={c} transparent opacity={0.25} />
      </mesh>
      {/* Middle ring */}
      <mesh>
        <torusGeometry args={[1.5, 0.01, 4, 64]} />
        <meshBasicMaterial color={c} transparent opacity={0.18} />
      </mesh>
      {/* Inner circle */}
      <mesh>
        <torusGeometry args={[0.7, 0.009, 4, 48]} />
        <meshBasicMaterial color={c} transparent opacity={0.22} />
      </mesh>
      {/* Star lines */}
      {lines.map(([a, b], i) => {
        const points = [a, b];
        const geo = new THREE.BufferGeometry().setFromPoints(points);
        return (
          <line key={i}>
            <primitive object={geo} attach="geometry" />
            <lineBasicMaterial color={c} transparent opacity={0.1} />
          </line>
        );
      })}
    </group>
  );
}

// ── Sri Yantra — nested triangles approximation ───────────────────────────────
function SriYantra({ color }: { color: string }) {
  const group = useRef<THREE.Group>(null!);
  const c = new THREE.Color(color);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.z += delta * 0.018;
  });

  return (
    <group ref={group}>
      {[3, 2.2, 1.6, 1.1, 0.7].map((r, i) => (
        <group key={i} rotation={[0, 0, i % 2 === 0 ? 0 : Math.PI / 3]}>
          {/* Triangle via 3-segment torus workaround — use ring */}
          <mesh>
            <torusGeometry args={[r, 0.01, 3, 3]} />
            <meshBasicMaterial color={c} transparent opacity={0.18 - i * 0.02} wireframe />
          </mesh>
        </group>
      ))}
      <mesh>
        <torusGeometry args={[3.5, 0.015, 4, 80]} />
        <meshBasicMaterial color={c} transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

// ── Icosahedron field ─────────────────────────────────────────────────────────
function IcosahedronField({ color }: { color: string }) {
  const group = useRef<THREE.Group>(null!);
  const c = new THREE.Color(color);

  const positions = useMemo<[number, number, number][]>(() => [
    [0, 0, 0],
    [-3.5, 1.5, -2], [3.2, -1.8, -3], [-2, -3, -4], [2.8, 2.5, -5],
    [-4, -1, -6], [1, 4, -7],
  ], []);

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.06;
      group.current.rotation.x += delta * 0.03;
    }
  });

  return (
    <group ref={group}>
      {positions.map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <icosahedronGeometry args={[0.6 + i * 0.15, 0]} />
          <meshBasicMaterial color={c} transparent opacity={0.12} wireframe />
        </mesh>
      ))}
    </group>
  );
}

function Scene({ variant, color }: SceneProps) {
  return (
    <>
      {variant === 'flower-of-life' && <FlowerOfLife color={color} />}
      {variant === 'metatron' && <MetatronsCube color={color} />}
      {variant === 'sri-yantra' && <SriYantra color={color} />}
      {variant === 'vesica' && <RingSystem color={color} count={5} baseRadius={1.5} speed={0.03} />}
      {variant === 'icosahedron-field' && <IcosahedronField color={color} />}
    </>
  );
}

interface SacredGeometryProps {
  variant: GeometryVariant;
  color?: string;
  opacity?: number;
}

export default function SacredGeometry({ variant, color = '#c9a84c', opacity = 0.6 }: SacredGeometryProps) {
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1, opacity }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: false, alpha: true }}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
      >
        <Scene variant={variant} color={color} />
      </Canvas>
    </div>
  );
}
