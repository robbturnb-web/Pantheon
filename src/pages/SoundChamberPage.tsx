import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ── Frequency definitions ─────────────────────────────────────────────────────
interface FrequencyTrack {
  id: string;
  name: string;
  hz: number;
  subtitle: string;
  description: string;
  color: string;
  geometry: 'icosahedron' | 'torus' | 'octahedron' | 'dodecahedron' | 'sphere' | 'torusknot';
  binauralBeat?: number; // optional binaural beat offset in hz
}

const FREQUENCIES: FrequencyTrack[] = [
  {
    id: 'schumann',    name: 'Schumann Resonance', hz: 7.83,   binauralBeat: 7.83,
    subtitle:          'Earth\'s heartbeat',
    description:       'The electromagnetic resonance of the Earth\'s ionosphere. Associated with deep relaxation, theta brainwave states, and grounding.',
    color:             '#34d399',  geometry: 'sphere',
  },
  {
    id: 'solfeggio-174', name: '174 Hz',           hz: 174,
    subtitle:          'Foundation frequency',
    description:       'Lowest Solfeggio frequency. Reduces physical and energetic pain, promotes feelings of safety and love.',
    color:             '#f97316',  geometry: 'icosahedron',
  },
  {
    id: 'solfeggio-285', name: '285 Hz',           hz: 285,
    subtitle:          'Tissue regeneration',
    description:       'Signals cells to restructure and repair. Associated with healing wounds and restoring damaged tissue fields.',
    color:             '#fb923c',  geometry: 'octahedron',
  },
  {
    id: 'solfeggio-396', name: '396 Hz',           hz: 396,
    subtitle:          'Liberation from fear',
    description:       'Turns grief into joy. Liberates guilt and fear. Clears energetic blocks rooted in trauma.',
    color:             '#c084fc',  geometry: 'icosahedron',
  },
  {
    id: 'solfeggio-432', name: '432 Hz',           hz: 432,   binauralBeat: 10,
    subtitle:          'Universal harmony',
    description:       'The "Verdi tuning" — mathematically consistent with the universe. Promotes clarity, reduces anxiety, aligns with natural frequencies.',
    color:             '#c9a84c',  geometry: 'dodecahedron',
  },
  {
    id: 'solfeggio-528', name: '528 Hz',           hz: 528,
    subtitle:          'DNA repair — the love frequency',
    description:       'Used in clinical research to repair DNA. Known as the miracle tone. Associated with transformation and the center of the Solfeggio scale.',
    color:             '#f9a8d4',  geometry: 'torusknot',
  },
  {
    id: 'solfeggio-639', name: '639 Hz',           hz: 639,
    subtitle:          'Connection & relationships',
    description:       'Enhances communication, understanding, and love. Enables reconnection with harmonious interpersonal relationships.',
    color:             '#7dd3fc',  geometry: 'torus',
  },
  {
    id: 'solfeggio-741', name: '741 Hz',           hz: 741,
    subtitle:          'Awakening intuition',
    description:       'Cleans the cells of toxins. Leads to a pure, stable, spiritual life. Opens the channel to intuitive expression.',
    color:             '#a78bfa',  geometry: 'octahedron',
  },
  {
    id: 'solfeggio-852', name: '852 Hz',           hz: 852,
    subtitle:          'Third eye activation',
    description:       'Awakens intuition and returns the mind to spiritual order. Allows the third eye to see clearly through illusion.',
    color:             '#818cf8',  geometry: 'icosahedron',
  },
  {
    id: 'solfeggio-963', name: '963 Hz',           hz: 963,   binauralBeat: 40,
    subtitle:          'Crown — divine connection',
    description:       'The frequency of the gods. Awakens the crown chakra. Creates room for oneness and the experience of returning to origin.',
    color:             '#fde68a',  geometry: 'dodecahedron',
  },
];

// ── 3D reactive sacred geometry ───────────────────────────────────────────────
interface GeometrySceneProps {
  track: FrequencyTrack;
  playing: boolean;
  volume: number;
}

function ReactiveGeometry({ track, playing, volume }: GeometrySceneProps) {
  const meshRef  = useRef<THREE.Mesh>(null!);
  const ring1Ref = useRef<THREE.Mesh>(null!);
  const ring2Ref = useRef<THREE.Mesh>(null!);
  const pointsRef = useRef<THREE.Points>(null!);
  const timeRef  = useRef(0);
  const color    = new THREE.Color(track.color);

  useFrame((_, delta) => {
    timeRef.current += delta;
    const t = timeRef.current;
    const amplitude = playing ? volume : 0.15;
    const pulse = 1 + Math.sin(t * (track.hz / 100)) * amplitude * 0.12;
    const speed = playing ? 1 + amplitude * 1.5 : 0.3;

    if (meshRef.current) {
      meshRef.current.rotation.x += delta * speed * 0.4;
      meshRef.current.rotation.y += delta * speed * 0.6;
      meshRef.current.scale.setScalar(pulse);
      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = playing ? 0.8 + amplitude * 1.5 : 0.3;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * speed * 0.5;
      ring1Ref.current.rotation.x = Math.sin(t * 0.3) * 0.5;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y += delta * speed * 0.35;
      ring2Ref.current.rotation.z = Math.cos(t * 0.4) * 0.4;
      const scale = 1 + Math.sin(t * 2.5) * amplitude * 0.06;
      ring2Ref.current.scale.setScalar(scale);
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * speed * 0.1;
      const mat = pointsRef.current.material as THREE.PointsMaterial;
      mat.size = playing ? 0.04 + amplitude * 0.03 : 0.025;
      mat.opacity = playing ? 0.6 + amplitude * 0.3 : 0.25;
    }
  });

  const GeoComponent = useCallback(() => {
    switch (track.geometry) {
      case 'icosahedron':  return <icosahedronGeometry args={[0.8, 1]} />;
      case 'octahedron':   return <octahedronGeometry  args={[0.85]} />;
      case 'dodecahedron': return <dodecahedronGeometry args={[0.75]} />;
      case 'torusknot':    return <torusKnotGeometry    args={[0.5, 0.18, 100, 8]} />;
      case 'torus':        return <torusGeometry        args={[0.65, 0.22, 16, 60]} />;
      default:             return <sphereGeometry       args={[0.75, 32, 32]} />;
    }
  }, [track.geometry]);

  // Particle sphere
  const particlePositions = useRef<Float32Array>((() => {
    const arr = new Float32Array(300 * 3);
    for (let i = 0; i < 300; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const r = 2.2 + Math.random() * 0.8;
      arr[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  })());

  return (
    <group>
      {/* Particle cloud */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particlePositions.current, 3]} count={300} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial color={color} transparent opacity={0.25} size={0.025} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
      </points>

      {/* Outer ring */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[1.6, 0.012, 8, 80]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>

      {/* Inner ring */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1.2, 0.015, 8, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.45} />
      </mesh>

      {/* Core geometry */}
      <mesh ref={meshRef}>
        <GeoComponent />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          metalness={0.6}
          roughness={0.3}
          wireframe={track.geometry !== 'sphere' && track.geometry !== 'torusknot'}
          transparent
          opacity={0.85}
        />
      </mesh>

      <pointLight color={color} intensity={playing ? 2 + volume * 3 : 0.5} distance={5} />
      <ambientLight intensity={0.2} />
    </group>
  );
}

// ── Web Audio oscillator engine ────────────────────────────────────────────────
function useAudioEngine() {
  const ctxRef       = useRef<AudioContext | null>(null);
  const oscRef       = useRef<OscillatorNode | null>(null);
  const gainRef      = useRef<GainNode | null>(null);
  const binauralLRef = useRef<OscillatorNode | null>(null);
  const binauralRRef = useRef<OscillatorNode | null>(null);
  const mergerRef    = useRef<ChannelMergerNode | null>(null);

  const stop = useCallback(() => {
    try {
      oscRef.current?.stop();
      binauralLRef.current?.stop();
      binauralRRef.current?.stop();
    } catch { /* already stopped */ }
    try {
      oscRef.current?.disconnect();
      binauralLRef.current?.disconnect();
      binauralRRef.current?.disconnect();
      mergerRef.current?.disconnect();
    } catch { /* already disconnected */ }
    oscRef.current       = null;
    binauralLRef.current = null;
    binauralRRef.current = null;
    mergerRef.current    = null;
  }, []);

  const play = useCallback((track: FrequencyTrack, volume: number) => {
    stop();
    if (!ctxRef.current || ctxRef.current.state === 'closed') {
      gainRef.current?.disconnect();
      gainRef.current = null;
      ctxRef.current = new AudioContext();
    }
    const ctx = ctxRef.current;
    if (ctx.state === 'suspended') void ctx.resume();

    // Reuse gain node within same AudioContext; create once and connect once
    let gain = gainRef.current;
    if (!gain) {
      gain = ctx.createGain();
      gain.connect(ctx.destination);
      gainRef.current = gain;
    }
    gain.gain.setValueAtTime(volume * 0.15, ctx.currentTime);

    // Main tone (low-volume sine — audible foundation)
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = Math.min(track.hz, 800); // cap ultra-high to keep pleasant
    osc.connect(gain);
    osc.start();
    oscRef.current = osc;

    // Binaural beat (if defined)
    if (track.binauralBeat) {
      const merger = ctx.createChannelMerger(2);
      merger.connect(gain);

      const leftGain = ctx.createGain();  leftGain.gain.value  = 0.08;
      const rightGain = ctx.createGain(); rightGain.gain.value = 0.08;
      leftGain.connect(merger,  0, 0);
      rightGain.connect(merger, 0, 1);

      const bl = ctx.createOscillator(); bl.type = 'sine'; bl.frequency.value = 200;
      const br = ctx.createOscillator(); br.type = 'sine'; br.frequency.value = 200 + track.binauralBeat;
      bl.connect(leftGain);  bl.start(); binauralLRef.current = bl;
      br.connect(rightGain); br.start(); binauralRRef.current = br;
      mergerRef.current = merger;
    }
  }, [stop]);

  const setVolume = useCallback((v: number) => {
    if (gainRef.current && ctxRef.current) {
      gainRef.current.gain.setTargetAtTime(v * 0.15, ctxRef.current.currentTime, 0.05);
    }
  }, []);

  useEffect(() => () => stop(), [stop]);

  return { play, stop, setVolume };
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function SoundChamberPage() {
  const [activeTrack, setActiveTrack] = useState<FrequencyTrack>(FREQUENCIES[4]); // 432hz default
  const [playing, setPlaying]   = useState(false);
  const [volume, setVolume]     = useState(0.6);
  const { play, stop, setVolume: setEngineVolume } = useAudioEngine();

  const handleSelect = (track: FrequencyTrack) => {
    setActiveTrack(track);
    if (playing) play(track, volume);
  };

  const togglePlay = () => {
    if (playing) {
      stop();
      setPlaying(false);
    } else {
      play(activeTrack, volume);
      setPlaying(true);
    }
  };

  const handleVolume = (v: number) => {
    setVolume(v);
    setEngineVolume(v);
  };

  return (
    <div className="section-container" style={{ minHeight: '100vh' }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <p className="text-xs tracking-[0.35em] uppercase mb-2" style={{ color: '#c9a84c', fontFamily: 'Cinzel, Georgia, serif' }}>
            Pantheon Observatory
          </p>
          <h1
            className="text-4xl sm:text-5xl font-bold mb-3"
            style={{
              fontFamily: '"Cinzel Decorative", Cinzel, Georgia, serif',
              background: `linear-gradient(135deg, #ffffff 0%, ${activeTrack.color} 70%)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              transition: 'background 0.8s ease',
            }}
          >
            Sound Chamber
          </h1>
          <p className="text-sm max-w-md mx-auto" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Cinzel, Georgia, serif', fontStyle: 'italic' }}>
            Sacred frequencies. Reactive sacred geometry. Use headphones for binaural effect.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* ── Left: 3D Visualizer ──────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            {/* Canvas */}
            <div
              className="rounded mb-5 relative overflow-hidden"
              style={{
                height: 340,
                background: 'rgba(3,3,9,0.7)',
                border: `1px solid ${activeTrack.color}25`,
                boxShadow: playing ? `0 0 40px ${activeTrack.color}15` : 'none',
                transition: 'border-color 0.5s, box-shadow 0.5s',
              }}
            >
              <Canvas camera={{ position: [0, 0, 5], fov: 50 }} gl={{ antialias: true, alpha: true }} style={{ width: '100%', height: '100%' }}>
                <ReactiveGeometry track={activeTrack} playing={playing} volume={volume} />
              </Canvas>

              {/* Frequency display overlay */}
              <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
                <span
                  className="text-4xl font-bold"
                  style={{
                    fontFamily: '"Cinzel Decorative", Cinzel, Georgia, serif',
                    color: activeTrack.color,
                    textShadow: `0 0 20px ${activeTrack.color}60`,
                    opacity: 0.9,
                  }}
                >
                  {activeTrack.hz} Hz
                </span>
              </div>
            </div>

            {/* Track info */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTrack.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="p-4 rounded mb-4"
                style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${activeTrack.color}18` }}
              >
                <p className="text-xs tracking-widest uppercase mb-1" style={{ color: activeTrack.color, fontFamily: 'Cinzel, Georgia, serif' }}>
                  {activeTrack.subtitle}
                </p>
                <h2 className="text-xl font-bold mb-2" style={{ color: '#fff', fontFamily: 'Cinzel, Georgia, serif' }}>
                  {activeTrack.name}
                </h2>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'Cinzel, Georgia, serif' }}>
                  {activeTrack.description}
                </p>
                {activeTrack.binauralBeat && (
                  <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'Cinzel, Georgia, serif', fontStyle: 'italic' }}>
                    ↯ Binaural beat: {activeTrack.binauralBeat} Hz — use headphones
                  </p>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                style={{
                  background: playing
                    ? `linear-gradient(135deg, ${activeTrack.color}, ${activeTrack.color}88)`
                    : 'rgba(255,255,255,0.06)',
                  border: `1px solid ${activeTrack.color}50`,
                  boxShadow: playing ? `0 0 20px ${activeTrack.color}40` : 'none',
                }}
              >
                {playing ? (
                  <svg width="18" height="18" viewBox="0 0 18 18" fill={playing ? '#030309' : activeTrack.color}>
                    <rect x="3" y="2" width="4" height="14" rx="1" />
                    <rect x="11" y="2" width="4" height="14" rx="1" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 18 18" fill={activeTrack.color}>
                    <polygon points="4,2 16,9 4,16" />
                  </svg>
                )}
              </button>

              {/* Volume */}
              <div className="flex-1 flex items-center gap-3">
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Vol</span>
                <input
                  type="range" min="0" max="1" step="0.01" value={volume}
                  onChange={(e) => handleVolume(parseFloat(e.target.value))}
                  className="flex-1"
                  style={{ accentColor: activeTrack.color }}
                />
                <span className="text-xs w-8 text-right" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  {Math.round(volume * 100)}%
                </span>
              </div>
            </div>
          </motion.div>

          {/* ── Right: Frequency selector ────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <p className="text-xs tracking-[0.2em] uppercase mb-4" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'Cinzel, Georgia, serif' }}>
              Select Frequency
            </p>
            {FREQUENCIES.map((track) => (
              <button
                key={track.id}
                onClick={() => handleSelect(track)}
                className="w-full text-left p-3 rounded transition-all"
                style={{
                  background: activeTrack.id === track.id ? `${track.color}12` : 'rgba(255,255,255,0.02)',
                  border: activeTrack.id === track.id ? `1px solid ${track.color}45` : '1px solid rgba(255,255,255,0.06)',
                  boxShadow: activeTrack.id === track.id && playing ? `0 0 12px ${track.color}20` : 'none',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{
                      background: track.color,
                      boxShadow: activeTrack.id === track.id ? `0 0 8px ${track.color}` : 'none',
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold" style={{ color: activeTrack.id === track.id ? track.color : '#fff', fontFamily: 'Cinzel, Georgia, serif' }}>
                        {track.name}
                      </span>
                      <span className="text-xs flex-shrink-0" style={{ color: 'rgba(255,255,255,0.3)' }}>
                        {track.hz} Hz
                      </span>
                    </div>
                    <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      {track.subtitle}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
