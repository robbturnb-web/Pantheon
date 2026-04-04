import { useRef, useState, useMemo, type MutableRefObject } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { EvidenceGrade } from '../../types';

// ── Lat/lon → 3D cartesian ────────────────────────────────────────────────────
function latLonToVec3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi   = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
     radius * Math.cos(phi),
     radius * Math.sin(phi) * Math.sin(theta),
  );
}

const GRADE_COLORS: Record<EvidenceGrade, string> = {
  DOCUMENTED:  '#c9a84c',
  CREDIBLE:    '#60a5fa',
  SPECULATIVE: '#f97316',
  UNVERIFIED:  '#9ca3af',
};

export interface GlobePin {
  id: string;
  title: string;
  date: string;
  lat: number;
  lon: number;
  grade: EvidenceGrade;
}

interface PinMeshProps {
  pin: GlobePin;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
  isHovered: boolean;
}

function PinMesh({ pin, onHover, onSelect, isHovered }: PinMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const pos = useMemo(() => latLonToVec3(pin.lat, pin.lon, 2.57), [pin.lat, pin.lon]);
  const color = GRADE_COLORS[pin.grade];

  useFrame((_, delta) => {
    if (meshRef.current) {
      const target = isHovered ? 1.7 : 1.0;
      const current = meshRef.current.scale.x;
      const next = current + (target - current) * Math.min(delta * 8, 1);
      meshRef.current.scale.setScalar(next);
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={pos}
      onPointerEnter={(e) => { e.stopPropagation(); onHover(pin.id); }}
      onPointerLeave={() => onHover(null)}
      onClick={(e) => { e.stopPropagation(); onSelect(pin.id); }}
    >
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={isHovered ? 3 : 1.2}
      />
      {isHovered && (
        <pointLight color={color} intensity={4} distance={1.5} />
      )}
    </mesh>
  );
}

// ── Globe body + lat/lon grid ─────────────────────────────────────────────────
function GlobeMesh({ isDragging }: { isDragging: MutableRefObject<boolean> }) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.06;
    }
  });

  // Grid lines — latitude bands + longitude meridians
  const gridLines = useMemo(() => {
    const lines: THREE.BufferGeometry[] = [];
    const R = 2.515;

    // Latitude lines every 30°
    for (let lat = -60; lat <= 60; lat += 30) {
      const pts: THREE.Vector3[] = [];
      for (let lon = 0; lon <= 360; lon += 4) {
        pts.push(latLonToVec3(lat, lon - 180, R));
      }
      lines.push(new THREE.BufferGeometry().setFromPoints(pts));
    }
    // Longitude meridians every 30°
    for (let lon = 0; lon < 360; lon += 30) {
      const pts: THREE.Vector3[] = [];
      for (let lat = -90; lat <= 90; lat += 3) {
        pts.push(latLonToVec3(lat, lon - 180, R));
      }
      lines.push(new THREE.BufferGeometry().setFromPoints(pts));
    }
    return lines;
  }, []);

  return (
    <group ref={groupRef}>
      {/* Core dark sphere */}
      <mesh>
        <sphereGeometry args={[2.5, 48, 48]} />
        <meshStandardMaterial
          color="#050510"
          emissive="#0a0520"
          emissiveIntensity={0.4}
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* Atmospheric glow shell */}
      <mesh>
        <sphereGeometry args={[2.56, 32, 32]} />
        <meshBasicMaterial color="#1a0a3a" transparent opacity={0.12} side={THREE.BackSide} />
      </mesh>

      {/* Grid lines */}
      {gridLines.map((geo, i) => (
        <line key={i}>
          <primitive object={geo} attach="geometry" />
          <lineBasicMaterial color="#c9a84c" transparent opacity={0.08} />
        </line>
      ))}
    </group>
  );
}

// ── Full scene ────────────────────────────────────────────────────────────────
interface SceneProps {
  pins: GlobePin[];
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}

function Scene({ pins, hoveredId, onHover, onSelect }: SceneProps) {
  const isDragging = useRef(false);

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[8, 8, 8]} color="#c9a84c" intensity={1.5} />
      <pointLight position={[-8, -4, -8]} color="#9333ea" intensity={0.8} />
      <GlobeMesh isDragging={isDragging} />
      {pins.map((pin) => (
        <PinMesh
          key={pin.id}
          pin={pin}
          onHover={onHover}
          onSelect={onSelect}
          isHovered={hoveredId === pin.id}
        />
      ))}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.5}
        minPolarAngle={Math.PI * 0.2}
        maxPolarAngle={Math.PI * 0.8}
        onStart={() => { isDragging.current = true; }}
        onEnd={() => { isDragging.current = false; }}
      />
    </>
  );
}

// ── Tooltip overlay ───────────────────────────────────────────────────────────
interface TooltipProps {
  pin: GlobePin | null;
}

function Tooltip({ pin }: TooltipProps) {
  if (!pin) return null;
  const color = GRADE_COLORS[pin.grade];
  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 bottom-4 pointer-events-none z-10 text-center"
      style={{ animation: 'fadeIn 0.2s ease' }}
    >
      <div
        className="inline-block px-4 py-2 rounded"
        style={{
          background: 'rgba(3,3,9,0.9)',
          border: `1px solid ${color}40`,
          backdropFilter: 'blur(8px)',
        }}
      >
        <p className="text-xs font-semibold mb-0.5" style={{ color: '#fff', fontFamily: 'Cinzel, Georgia, serif' }}>
          {pin.title}
        </p>
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{pin.date}</span>
          <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: `${color}20`, color, border: `1px solid ${color}40`, fontFamily: 'Cinzel, Georgia, serif', fontSize: '10px' }}>
            {pin.grade}
          </span>
        </div>
        <p className="text-xs mt-1" style={{ color: 'rgba(201,168,76,0.6)', fontFamily: 'Cinzel, Georgia, serif' }}>
          click to view case →
        </p>
      </div>
    </div>
  );
}

// ── Exported component ────────────────────────────────────────────────────────
interface UAPGlobeProps {
  pins: GlobePin[];
  onSelectCase: (id: string) => void;
}

export default function UAPGlobe({ pins, onSelectCase }: UAPGlobeProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const hoveredPin = pins.find((p) => p.id === hoveredId) ?? null;

  return (
    <div className="relative w-full" style={{ height: 340 }}>
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
      >
        <Scene
          pins={pins}
          hoveredId={hoveredId}
          onHover={setHoveredId}
          onSelect={onSelectCase}
        />
      </Canvas>
      <Tooltip pin={hoveredPin} />

      {/* Legend */}
      <div className="absolute top-3 right-3 space-y-1">
        {(Object.entries(GRADE_COLORS) as [EvidenceGrade, string][]).map(([grade, color]) => (
          <div key={grade} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: color, boxShadow: `0 0 4px ${color}` }} />
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Cinzel, Georgia, serif', fontSize: '10px', letterSpacing: '0.05em' }}>
              {grade}
            </span>
          </div>
        ))}
      </div>

      <style>{`@keyframes fadeIn { from { opacity:0; transform: translateX(-50%) translateY(4px); } to { opacity:1; transform: translateX(-50%) translateY(0); } }`}</style>
    </div>
  );
}
