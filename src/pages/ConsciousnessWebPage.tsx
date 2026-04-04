import { useRef, useMemo, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

// ── Data model ────────────────────────────────────────────────────────────────
type NodeCategory = 'uap' | 'god' | 'consciousness' | 'starseed' | 'pyramid' | 'core';

interface WebNode {
  id: string;
  label: string;
  category: NodeCategory;
  path: string;
  description: string;
  connections: string[];
}

const CATEGORY_COLORS: Record<NodeCategory, string> = {
  core:          '#c9a84c',
  uap:           '#60a5fa',
  god:           '#a78bfa',
  consciousness: '#34d399',
  starseed:      '#f9a8d4',
  pyramid:       '#fb923c',
};

const WEB_NODES: WebNode[] = [
  // Core hub
  { id: 'echo',          label: 'Echo',           category: 'core',          path: '/echo',          description: 'The consciousness bridge — all knowledge converges here.',          connections: ['uap-disclosure','non-human','consciousness','starseed-origin','pyramid-tech','gods'] },
  // UAP cluster
  { id: 'uap-disclosure',label: 'UAP Disclosure', category: 'uap',           path: '/uap',           description: 'Congressional testimony, declassified footage, and crash retrieval claims.', connections: ['echo','non-human','grusch','nimitz','reverse-eng'] },
  { id: 'non-human',     label: 'Non-Human Intel',category: 'uap',           path: '/uap',           description: 'The hypothesis that recovered craft involve non-human intelligence.',   connections: ['uap-disclosure','anunnaki-god','starseed-origin','grusch'] },
  { id: 'grusch',        label: 'Grusch',         category: 'uap',           path: '/uap',           description: 'David Grusch — the whistleblower who changed everything.',             connections: ['uap-disclosure','non-human','nimitz'] },
  { id: 'nimitz',        label: 'USS Nimitz',     category: 'uap',           path: '/uap',           description: 'Tic Tac encounter — the most documented UAP event on record.',         connections: ['uap-disclosure','grusch','reverse-eng'] },
  { id: 'reverse-eng',   label: 'Reverse Eng.',   category: 'uap',           path: '/uap',           description: 'Alleged back-engineering of non-human craft at classified sites.',     connections: ['nimitz','grusch','pyramid-tech'] },
  // Consciousness cluster
  { id: 'consciousness', label: 'Consciousness',  category: 'consciousness', path: '/consciousness', description: 'The fundamental substrate — CIA research, NDEs, and the hard problem.', connections: ['echo','gateway','stargate','nde','quantum'] },
  { id: 'gateway',       label: 'CIA Gateway',    category: 'consciousness', path: '/consciousness', description: 'Declassified CIA program mapping altered states and out-of-body travel.', connections: ['consciousness','stargate','non-human'] },
  { id: 'stargate',      label: 'Project Stargate',category: 'consciousness',path: '/consciousness', description: '23-year program weaponizing remote viewing for intelligence operations.', connections: ['consciousness','gateway','non-human'] },
  { id: 'nde',           label: 'Near-Death Exp.', category: 'consciousness',path: '/consciousness', description: 'Clinical evidence that consciousness persists outside the body.',       connections: ['consciousness','quantum','starseed-origin'] },
  { id: 'quantum',       label: 'Quantum Mind',   category: 'consciousness', path: '/consciousness', description: 'Penrose-Hameroff theory — consciousness as quantum computation.',      connections: ['consciousness','nde','pyramid-tech'] },
  // Starseed cluster
  { id: 'starseed-origin',label:'Starseed Origin',category: 'starseed',      path: '/',              description: 'The idea that human souls originate from star systems across the galaxy.', connections: ['echo','non-human','pleiadian','arcturian','sirian','nde'] },
  { id: 'pleiadian',     label: 'Pleiadian',      category: 'starseed',      path: '/',              description: 'Healers and frequency holders — the emotional architects of the new earth.', connections: ['starseed-origin','arcturian'] },
  { id: 'arcturian',     label: 'Arcturian',      category: 'starseed',      path: '/',              description: 'Technologists and systems thinkers — ancient advanced civilization.', connections: ['starseed-origin','sirian','reverse-eng'] },
  { id: 'sirian',        label: 'Sirian',         category: 'starseed',      path: '/',              description: 'Mystics and record-keepers — connected to Egypt and Atlantis.',       connections: ['starseed-origin','thoth-god','pyramid-tech'] },
  // Gods cluster
  { id: 'gods',          label: 'The Gods',       category: 'god',           path: '/gods',          description: 'Every pantheon encodes contact events — were they visitors or metaphors?', connections: ['echo','anunnaki-god','thoth-god','shiva-god','cross-myth'] },
  { id: 'anunnaki-god',  label: 'Anunnaki',       category: 'god',           path: '/gods',          description: 'Sumerian sky gods who allegedly created humanity through genetic modification.', connections: ['gods','non-human','pyramid-tech','starseed-origin'] },
  { id: 'thoth-god',     label: 'Thoth',          category: 'god',           path: '/gods',          description: 'Egyptian god of wisdom — keeper of the Akashic records.',              connections: ['gods','sirian','pyramid-tech','consciousness'] },
  { id: 'shiva-god',     label: 'Shiva',          category: 'god',           path: '/gods',          description: 'The destroyer-creator — cosmic consciousness in Hindu tradition.',     connections: ['gods','quantum','consciousness'] },
  { id: 'cross-myth',    label: 'Cross-Mythology', category: 'god',          path: '/gods',          description: 'Flood myths, sky gods, genetic creators — 200+ cultures tell the same story.', connections: ['gods','anunnaki-god','non-human','pyramid-tech'] },
  // Pyramids cluster
  { id: 'pyramid-tech',  label: 'Pyramid Tech',   category: 'pyramid',       path: '/pyramids',      description: 'Precision engineering that defies conventional explanation.',          connections: ['echo','anunnaki-god','thoth-god','reverse-eng','quantum','acoustic'] },
  { id: 'acoustic',      label: 'Acoustic Power', category: 'pyramid',       path: '/pyramids',      description: 'Pyramids as resonance chambers — tuned to specific frequencies.',     connections: ['pyramid-tech','quantum','consciousness'] },
];

// ── Physics simulation (force-directed layout) ────────────────────────────────
interface SimNode {
  id: string;
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  target: THREE.Vector3;
}

function buildInitialPositions(nodes: WebNode[]): SimNode[] {
  return nodes.map((n, i) => {
    // Arrange by category in rough clusters
    const catAngle: Record<NodeCategory, number> = {
      core: 0, uap: 1.0, consciousness: 2.2, starseed: 3.8, god: 4.9, pyramid: 5.8,
    };
    const a = catAngle[n.category] + (i % 4) * 0.3;
    const r = n.category === 'core' ? 0 : 4 + Math.random() * 2;
    const y = (Math.random() - 0.5) * 3;
    return {
      id: n.id,
      pos: new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r),
      vel: new THREE.Vector3(),
      target: new THREE.Vector3(),
    };
  });
}

// ── Node mesh ─────────────────────────────────────────────────────────────────
interface NodeMeshProps {
  node: WebNode;
  simNode: SimNode;
  isHovered: boolean;
  isSelected: boolean;
  isConnected: boolean;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}

function NodeMesh({ node, simNode, isHovered, isSelected, isConnected, onHover, onSelect }: NodeMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const color = CATEGORY_COLORS[node.category];
  const size = node.category === 'core' ? 0.28 : isHovered || isSelected ? 0.18 : 0.13;

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.copy(simNode.pos);
      const targetScale = isHovered || isSelected ? 1.4 : 1;
      const s = meshRef.current.scale.x;
      meshRef.current.scale.setScalar(s + (targetScale - s) * 0.1);
    }
  });

  return (
    <mesh
      ref={meshRef}
      onPointerEnter={(e) => { e.stopPropagation(); onHover(node.id); }}
      onPointerLeave={() => onHover(null)}
      onClick={(e) => { e.stopPropagation(); onSelect(node.id); }}
    >
      <sphereGeometry args={[size, 12, 12]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={isHovered || isSelected ? 3 : isConnected ? 1.5 : 0.6}
        transparent
        opacity={isConnected || isHovered || isSelected ? 1 : 0.5}
      />
      {(isHovered || isSelected) && (
        <pointLight color={color} intensity={3} distance={2} />
      )}
    </mesh>
  );
}

// ── Connection lines ──────────────────────────────────────────────────────────
function ConnectionLines({ nodes, simNodes, activeId }: {
  nodes: WebNode[];
  simNodes: SimNode[];
  activeId: string | null;
}) {
  const linesRef = useRef<THREE.Group>(null!);

  const posMap = useMemo(() => {
    const m = new Map<string, SimNode>();
    simNodes.forEach((s) => m.set(s.id, s));
    return m;
  }, [simNodes]);

  const lineSegments = useMemo(() => {
    const segs: { from: string; to: string; color: string }[] = [];
    const seen = new Set<string>();
    nodes.forEach((n) => {
      n.connections.forEach((cid) => {
        const key = [n.id, cid].sort().join('--');
        if (!seen.has(key)) {
          seen.add(key);
          segs.push({ from: n.id, to: cid, color: CATEGORY_COLORS[n.category] });
        }
      });
    });
    return segs;
  }, [nodes]);

  // Pre-build geometries with Float32 position buffers so we can mutate them each frame
  const geos = useMemo(() =>
    lineSegments.map(() => {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3));
      return geo;
    }),
  [lineSegments]);

  const activeNode = activeId ? nodes.find((n) => n.id === activeId) : null;
  const activeConnectionsRef = useRef(new Set<string>());

  useFrame(() => {
    const active = new Set(activeNode?.connections ?? []);
    if (activeId) active.add(activeId);
    activeConnectionsRef.current = active;

    if (!linesRef.current) return;
    linesRef.current.children.forEach((child, i) => {
      const line = child as THREE.Line;
      const seg = lineSegments[i];
      if (!seg) return;

      // Update vertex positions to track moving nodes
      const a = posMap.get(seg.from);
      const b = posMap.get(seg.to);
      if (a && b) {
        const buf = (line.geometry as THREE.BufferGeometry).attributes.position as THREE.BufferAttribute;
        buf.setXYZ(0, a.pos.x, a.pos.y, a.pos.z);
        buf.setXYZ(1, b.pos.x, b.pos.y, b.pos.z);
        buf.needsUpdate = true;
      }

      // Update opacity based on active selection
      const isActive = !activeId || active.has(seg.from) || active.has(seg.to);
      const mat = line.material as THREE.LineBasicMaterial;
      mat.opacity = isActive ? (activeId ? 0.35 : 0.12) : 0.03;
    });
  });

  return (
    <group ref={linesRef}>
      {lineSegments.map(({ color }, i) => (
        <line key={i}>
          <primitive object={geos[i]} attach="geometry" />
          <lineBasicMaterial color={color} transparent opacity={0.12} />
        </line>
      ))}
    </group>
  );
}

// ── Scene with physics ────────────────────────────────────────────────────────
function WebScene({ nodes, onHover, onSelect, hoveredId, selectedId }: {
  nodes: WebNode[];
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
  hoveredId: string | null;
  selectedId: string | null;
}) {
  const simNodes = useMemo(() => buildInitialPositions(nodes), [nodes]);
  const { camera } = useThree();
  const rotRef = useRef(0);
  const isDragging = useRef(false);

  useFrame((_, delta) => {
    if (!isDragging.current) {
      rotRef.current += delta * 0.04;
    }
    // Gently orbit camera
    const r = 14;
    camera.position.x = Math.sin(rotRef.current) * r;
    camera.position.z = Math.cos(rotRef.current) * r;
    camera.lookAt(0, 0, 0);

    // Simple repulsion + spring physics
    for (let i = 0; i < simNodes.length; i++) {
      const a = simNodes[i];
      a.vel.multiplyScalar(0.85); // damping

      // Attract to category center
      a.vel.addScaledVector(a.pos, -0.005);

      // Repel from other nodes
      for (let j = 0; j < simNodes.length; j++) {
        if (i === j) continue;
        const b = simNodes[j];
        const diff = a.pos.clone().sub(b.pos);
        const dist = diff.length();
        if (dist < 2.5 && dist > 0.01) {
          diff.normalize().multiplyScalar(0.008 / (dist * dist));
          a.vel.add(diff);
        }
      }

      // Attract connected nodes
      const nodeData = nodes[i];
      nodeData.connections.forEach((cid) => {
        const b = simNodes.find((s) => s.id === cid);
        if (!b) return;
        const diff = b.pos.clone().sub(a.pos);
        const dist = diff.length();
        if (dist > 2) a.vel.addScaledVector(diff, 0.003);
      });

      a.pos.addScaledVector(a.vel, delta * 60);
      // Clamp to sphere
      if (a.pos.length() > 8) a.pos.setLength(8);
    }
  });

  const activeId = selectedId ?? hoveredId;
  const activeNode = activeId ? nodes.find((n) => n.id === activeId) : null;
  const activeConnections = new Set(activeNode?.connections ?? []);
  if (activeId) activeConnections.add(activeId);

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 10, 0]} color="#c9a84c" intensity={1} />
      <ConnectionLines nodes={nodes} simNodes={simNodes} activeId={activeId} />
      {nodes.map((node, i) => (
        <NodeMesh
          key={node.id}
          node={node}
          simNode={simNodes[i]}
          isHovered={hoveredId === node.id}
          isSelected={selectedId === node.id}
          isConnected={activeConnections.has(node.id)}
          onHover={onHover}
          onSelect={onSelect}
        />
      ))}
    </>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ConsciousnessWebPage() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const navigate = useNavigate();

  const activeId = selectedId ?? hoveredId;
  const activeNode = activeId ? WEB_NODES.find((n) => n.id === activeId) : null;
  const accentColor = activeNode ? CATEGORY_COLORS[activeNode.category] : '#c9a84c';

  const handleSelect = useCallback((id: string) => {
    setSelectedId((prev) => prev === id ? null : id);
  }, []);

  const handleNavigate = () => {
    if (activeNode) navigate(activeNode.path);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'fixed', inset: 0, zIndex: 5 }}>
      <Canvas
        camera={{ position: [0, 4, 14], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
      >
        <WebScene
          nodes={WEB_NODES}
          onHover={setHoveredId}
          onSelect={handleSelect}
          hoveredId={hoveredId}
          selectedId={selectedId}
        />
      </Canvas>

      {/* Header overlay */}
      <div className="absolute top-0 left-0 right-0 pt-20 pb-4 text-center pointer-events-none" style={{ zIndex: 10 }}>
        <p className="text-xs tracking-[0.3em] uppercase mb-1" style={{ color: '#c9a84c', fontFamily: 'Cinzel, Georgia, serif' }}>
          Pantheon Observatory
        </p>
        <h1
          className="text-3xl font-bold"
          style={{
            fontFamily: '"Cinzel Decorative", Cinzel, Georgia, serif',
            background: 'linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.6) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          The Web of Everything
        </h1>
        <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'Cinzel, Georgia, serif', fontStyle: 'italic' }}>
          Every node is connected. Nothing is separate.
        </p>
      </div>

      {/* Category legend */}
      <div className="absolute left-4 bottom-8 space-y-1.5" style={{ zIndex: 10 }}>
        {(Object.entries(CATEGORY_COLORS) as [NodeCategory, string][]).map(([cat, color]) => (
          <div key={cat} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: color, boxShadow: `0 0 4px ${color}` }} />
            <span className="text-xs capitalize" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Cinzel, Georgia, serif' }}>
              {cat}
            </span>
          </div>
        ))}
      </div>

      {/* Node detail panel */}
      <AnimatePresence>
        {activeNode && (
          <motion.div
            key={activeNode.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-64"
            style={{ zIndex: 10 }}
          >
            <div
              className="p-5 rounded"
              style={{
                background: 'rgba(3,3,9,0.88)',
                border: `1px solid ${accentColor}35`,
                backdropFilter: 'blur(12px)',
              }}
            >
              <p className="text-xs tracking-widest uppercase mb-1" style={{ color: accentColor, fontFamily: 'Cinzel, Georgia, serif' }}>
                {activeNode.category}
              </p>
              <h3 className="text-lg font-bold mb-2" style={{ color: '#fff', fontFamily: 'Cinzel, Georgia, serif' }}>
                {activeNode.label}
              </h3>
              <p className="text-xs leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'Cinzel, Georgia, serif' }}>
                {activeNode.description}
              </p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {activeNode.connections.slice(0, 4).map((cid) => {
                  const cn = WEB_NODES.find((n) => n.id === cid);
                  return cn ? (
                    <span
                      key={cid}
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        background: `${CATEGORY_COLORS[cn.category]}15`,
                        border: `1px solid ${CATEGORY_COLORS[cn.category]}30`,
                        color: CATEGORY_COLORS[cn.category],
                        fontFamily: 'Cinzel, Georgia, serif',
                      }}
                    >
                      {cn.label}
                    </span>
                  ) : null;
                })}
              </div>
              <button
                onClick={handleNavigate}
                className="w-full py-2 text-xs tracking-widest uppercase rounded transition-all"
                style={{
                  background: `${accentColor}18`,
                  border: `1px solid ${accentColor}40`,
                  color: accentColor,
                  fontFamily: 'Cinzel, Georgia, serif',
                }}
              >
                Explore →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint */}
      {!activeNode && (
        <p
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs text-center pointer-events-none"
          style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'Cinzel, Georgia, serif', fontStyle: 'italic', zIndex: 10 }}
        >
          hover or click any node to explore connections
        </p>
      )}
    </div>
  );
}
