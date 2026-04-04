import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ── Star field (warp tunnel on mount, then gentle drift) ──────────────────────
function Stars() {
  const pointsRef = useRef<THREE.Points>(null!);
  const warpRef = useRef({ speed: 4.5, elapsed: 0 });
  const mouseRef = useRef({ x: 0, y: 0 });

  // Mouse parallax
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // Build 2,200 random star positions in a long tunnel (-150 → +50 on Z)
  const { positions, colors } = useMemo(() => {
    const count = 2200;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Distribute in a wide cylinder
      const r = Math.random() * 80 + 2;
      const theta = Math.random() * Math.PI * 2;
      positions[i3]     = Math.cos(theta) * r;
      positions[i3 + 1] = Math.sin(theta) * r;
      positions[i3 + 2] = (Math.random() - 0.2) * 160 - 30;

      // Color: mostly white, ~8% gold, ~4% purple
      const rand = Math.random();
      if (rand < 0.04) {
        // purple
        colors[i3] = 0.58; colors[i3 + 1] = 0.2; colors[i3 + 2] = 0.92;
      } else if (rand < 0.12) {
        // gold
        colors[i3] = 0.99; colors[i3 + 1] = 0.78; colors[i3 + 2] = 0.3;
      } else {
        // white-blue
        const b = 0.85 + Math.random() * 0.15;
        colors[i3] = b * 0.9; colors[i3 + 1] = b * 0.93; colors[i3 + 2] = b;
      }
    }
    return { positions, colors };
  }, []);

  useFrame((_, delta) => {
    const pts = pointsRef.current;
    if (!pts) return;
    const w = warpRef.current;
    w.elapsed += delta;

    // Decelerate warp over first 2.2 s → settle to cruise
    const t = Math.min(w.elapsed / 2.2, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    w.speed = 4.5 * (1 - eased) + 0.06 * eased;

    // Advance all stars toward viewer
    const pos = pts.geometry.attributes.position;
    const arr = pos.array as Float32Array;
    for (let i = 0; i < arr.length; i += 3) {
      arr[i + 2] += w.speed;
      // Recycle star at back when it passes camera
      if (arr[i + 2] > 55) {
        const r = Math.random() * 80 + 2;
        const theta = Math.random() * Math.PI * 2;
        arr[i]     = Math.cos(theta) * r;
        arr[i + 1] = Math.sin(theta) * r;
        arr[i + 2] = -150 + Math.random() * 20;
      }
    }
    pos.needsUpdate = true;

    // Parallax tilt
    pts.rotation.y += (mouseRef.current.x * 0.04 - pts.rotation.y) * 0.03;
    pts.rotation.x += (-mouseRef.current.y * 0.04 - pts.rotation.x) * 0.03;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
          count={colors.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.28}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ── Nebula cloud — a few large additive-blended particle clusters ─────────────
function NebulaClouds() {
  const ref = useRef<THREE.Points>(null!);

  const { positions, colors } = useMemo(() => {
    const count = 420;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    // Three clusters: left-purple, right-gold, far-blue
    const clusters = [
      { cx: -40, cy: 18, cz: -60, r: 28, col: [0.45, 0.1, 0.75] as [number,number,number] },
      { cx: 38,  cy: -12, cz: -80, r: 24, col: [0.8, 0.55, 0.15] as [number,number,number] },
      { cx: 5,   cy: 30, cz: -110, r: 35, col: [0.15, 0.35, 0.8] as [number,number,number] },
    ];

    let idx = 0;
    for (const cl of clusters) {
      const perCluster = Math.floor(count / clusters.length);
      for (let i = 0; i < perCluster && idx < count; i++, idx++) {
        const i3 = idx * 3;
        positions[i3]     = cl.cx + (Math.random() - 0.5) * cl.r;
        positions[i3 + 1] = cl.cy + (Math.random() - 0.5) * cl.r;
        positions[i3 + 2] = cl.cz + (Math.random() - 0.5) * cl.r;
        const brightness = 0.3 + Math.random() * 0.5;
        colors[i3]     = cl.col[0] * brightness;
        colors[i3 + 1] = cl.col[1] * brightness;
        colors[i3 + 2] = cl.col[2] * brightness;
      }
    }
    return { positions, colors };
  }, []);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.008;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
          count={colors.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={3.5}
        vertexColors
        transparent
        opacity={0.18}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ── Scene camera at the tunnel entrance ───────────────────────────────────────
function Scene() {
  return (
    <>
      <Stars />
      <NebulaClouds />
    </>
  );
}

export default function StarfieldCanvas() {
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, backgroundColor: '#030309' }}
    >
      <Canvas
        camera={{ position: [0, 0, 50], fov: 75, near: 0.1, far: 300 }}
        gl={{ antialias: false, alpha: false }}
        style={{ width: '100%', height: '100%' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
