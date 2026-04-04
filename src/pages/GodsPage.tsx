import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft } from 'lucide-react';
import { gods } from '../data/gods';
import type { God, PantheonFilter } from '../types';

const filters: PantheonFilter[] = ['All', 'Greek', 'Norse', 'Egyptian', 'Hindu', 'Anunnaki', 'Starseed'];

// ── Cinematic full-screen takeover ────────────────────────────────────────────
function GodCinematic({ god, onClose, onAskEcho }: { god: God; onClose: () => void; onAskEcho: () => void }) {
  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const askEcho = () => {
    onAskEcho();
  };

  // Precompute dust particle seeds once so positions are stable across re-renders
  const dustParticles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        width: Math.random() * 3 + 1,
        height: Math.random() * 3 + 1,
        color: i % 3 === 0 ? '#c9a84c' : i % 3 === 1 ? '#9333ea' : '#ffffff',
        left: Math.random() * 100,
        top: Math.random() * 100,
        yDrift: 30 + Math.random() * 60,
        duration: 3 + Math.random() * 4,
        delay: Math.random() * 5,
      })),
    []
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden"
    >
      {/* Atmospheric BG — fills screen */}
      <motion.div
        className="absolute inset-0"
        style={{ background: god.atmosphericBg }}
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />

      {/* Dark vignette overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(3,3,9,0.3) 0%, rgba(3,3,9,0.85) 100%)',
        }}
      />

      {/* Floating dust particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {dustParticles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${p.width}px`,
              height: `${p.height}px`,
              background: p.color,
              left: `${p.left}%`,
              top: `${p.top}%`,
              opacity: 0.6,
            }}
            animate={{
              y: [0, -p.yDrift],
              opacity: [0, 0.7, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
        style={{
          background: 'rgba(3,3,9,0.6)',
          border: '1px solid rgba(255,255,255,0.15)',
          color: 'rgba(255,255,255,0.6)',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,168,76,0.6)'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.15)'; }}
      >
        <X size={16} />
      </button>

      {/* Back label */}
      <button
        onClick={onClose}
        aria-label="Return to The Gods"
        className="absolute top-6 left-6 z-10 flex items-center gap-1.5 transition-all duration-200"
        style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', letterSpacing: '0.1em' }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#c9a84c'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.4)'; }}
      >
        <ChevronLeft size={14} />
        <span style={{ fontFamily: 'Cinzel, Georgia, serif', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.15em' }}>
          The Gods
        </span>
      </button>

      {/* Content */}
      <div className="relative z-10 max-w-2xl w-full mx-6 text-center">
        {/* Symbol */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.7, ease: 'backOut' }}
          className="text-6xl mb-6"
          style={{ filter: 'drop-shadow(0 0 30px rgba(201,168,76,0.6))' }}
        >
          {god.symbol}
        </motion.div>

        {/* Pantheon tag */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="text-xs tracking-[0.35em] uppercase mb-4"
          style={{ color: '#c9a84c', fontFamily: 'Cinzel, Georgia, serif' }}
        >
          {god.pantheon} Deity
        </motion.p>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.8, ease: 'easeOut' }}
          className="font-bold mb-3"
          style={{
            fontFamily: '"Cinzel Decorative", Cinzel, Georgia, serif',
            fontSize: 'clamp(2.8rem, 8vw, 5.5rem)',
            lineHeight: 1,
            background: 'linear-gradient(135deg, #ffffff 0%, #c9a84c 60%, #f5c842 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: 'none',
            filter: 'drop-shadow(0 0 40px rgba(201,168,76,0.25))',
          }}
        >
          {god.name}
        </motion.h1>

        {/* Archetype role */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-base mb-6"
          style={{
            fontFamily: 'Cinzel, Georgia, serif',
            color: 'rgba(255,255,255,0.75)',
            fontStyle: 'italic',
            lineHeight: 1.6,
          }}
        >
          {god.archetypeRole}
        </motion.p>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex items-center justify-center gap-4 mb-6"
        >
          <div className="h-px w-24" style={{ background: 'rgba(201,168,76,0.4)' }} />
          <div className="w-1 h-1 rounded-full" style={{ background: '#c9a84c' }} />
          <div className="h-px w-24" style={{ background: 'rgba(201,168,76,0.4)' }} />
        </motion.div>

        {/* Domain tags */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-2 mb-6"
        >
          {god.domains.map((d) => (
            <span
              key={d}
              className="text-xs px-3 py-1 rounded-full"
              style={{
                background: 'rgba(201,168,76,0.1)',
                border: '1px solid rgba(201,168,76,0.25)',
                color: 'rgba(255,255,255,0.65)',
                fontFamily: 'Cinzel, Georgia, serif',
                letterSpacing: '0.05em',
              }}
            >
              {d}
            </span>
          ))}
        </motion.div>

        {/* Atmospheric description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="text-sm leading-relaxed mb-8"
          style={{
            color: 'rgba(255,255,255,0.55)',
            fontFamily: 'Cinzel, Georgia, serif',
            fontStyle: 'italic',
            maxWidth: '480px',
            margin: '0 auto 2rem',
          }}
        >
          {god.atmosphericDesc}
        </motion.p>

        {/* Reflection question */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.6 }}
          className="p-5 rounded mb-8 mx-auto"
          style={{
            background: 'rgba(3,3,9,0.5)',
            border: '1px solid rgba(201,168,76,0.2)',
            backdropFilter: 'blur(8px)',
            maxWidth: '440px',
          }}
        >
          <p
            className="text-sm leading-relaxed italic"
            style={{ color: 'rgba(201,168,76,0.9)', fontFamily: 'Cinzel, Georgia, serif' }}
          >
            "{god.reflectionQuestion}"
          </p>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <button
            onClick={askEcho}
            className="px-8 py-3 text-xs tracking-widest uppercase rounded transition-all duration-200"
            style={{
              background: 'linear-gradient(135deg, rgba(147,51,234,0.3) 0%, rgba(107,33,168,0.2) 100%)',
              border: '1px solid rgba(147,51,234,0.5)',
              color: '#c084fc',
              fontFamily: 'Cinzel, Georgia, serif',
              letterSpacing: '0.15em',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(147,51,234,0.4)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'linear-gradient(135deg, rgba(147,51,234,0.3) 0%, rgba(107,33,168,0.2) 100%)'; }}
          >
            Ask Echo About {god.name}
          </button>
          <button
            onClick={onClose}
            className="px-8 py-3 text-xs tracking-widest uppercase rounded transition-all duration-200"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.5)',
              fontFamily: 'Cinzel, Georgia, serif',
              letterSpacing: '0.15em',
            }}
          >
            Return to the Pantheon
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ── Compact grid card ─────────────────────────────────────────────────────────
function GodCard({ god, onClick }: { god: God; onClick: () => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="rounded overflow-hidden cursor-pointer group"
      style={{
        background: 'linear-gradient(135deg, #0a0a1a 0%, #12122a 100%)',
        border: '1px solid rgba(201,168,76,0.1)',
      }}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
      tabIndex={0}
      role="button"
      aria-label={`Open ${god.name} cinematic view`}
      whileHover={{ y: -4, borderColor: 'rgba(201,168,76,0.4)', transition: { duration: 0.2 } }}
    >
      {/* Atmospheric preview strip */}
      <div
        className="h-1.5 w-full"
        style={{ background: god.atmosphericBg }}
      />

      <div className="p-5">
        {/* Symbol + pantheon */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl" style={{ filter: 'drop-shadow(0 0 8px rgba(201,168,76,0.4))' }}>
            {god.symbol}
          </span>
          <span
            className="text-xs tracking-widest uppercase px-2 py-0.5 rounded-full"
            style={{
              background: 'rgba(201,168,76,0.08)',
              color: '#c9a84c',
              border: '1px solid rgba(201,168,76,0.18)',
              fontFamily: 'Cinzel, Georgia, serif',
            }}
          >
            {god.pantheon}
          </span>
        </div>

        <h3
          className="text-lg font-bold mb-1"
          style={{ fontFamily: 'Cinzel, Georgia, serif', color: '#ffffff' }}
        >
          {god.name}
        </h3>

        <p
          className="text-xs leading-relaxed mb-3"
          style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Cinzel, Georgia, serif', fontStyle: 'italic' }}
        >
          {god.archetypeRole}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {god.domains.slice(0, 3).map((d) => (
            <span
              key={d}
              className="text-xs px-2 py-0.5 rounded"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.4)',
              }}
            >
              {d}
            </span>
          ))}
        </div>

        <div
          className="mt-4 flex items-center gap-1.5 text-xs"
          style={{ color: 'rgba(201,168,76,0.5)', fontFamily: 'Cinzel, Georgia, serif', letterSpacing: '0.1em' }}
        >
          <span className="text-[10px] tracking-widest uppercase">Enter</span>
          <span>→</span>
        </div>
      </div>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function GodsPage() {
  const [filter, setFilter] = useState<PantheonFilter>('All');
  const [activeGod, setActiveGod] = useState<God | null>(null);
  const prevOverflowRef = useRef<string>('');
  const echoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filteredGods = filter === 'All' ? gods : gods.filter((g) => g.pantheon === filter);

  const handleOpen = useCallback((god: God) => {
    prevOverflowRef.current = document.body.style.overflow;
    setActiveGod(god);
    document.body.style.overflow = 'hidden';
  }, []);

  const handleClose = useCallback(() => {
    setActiveGod(null);
    document.body.style.overflow = prevOverflowRef.current;
  }, []);

  // Restore overflow if the component unmounts while an overlay is open
  useEffect(() => {
    return () => {
      document.body.style.overflow = prevOverflowRef.current;
      if (echoTimerRef.current !== null) clearTimeout(echoTimerRef.current);
    };
  }, []);

  // Move askEcho dispatch to the parent so the timer survives GodCinematic unmount
  const handleAskEcho = useCallback((godName: string) => {
    handleClose();
    echoTimerRef.current = setTimeout(() => {
      window.dispatchEvent(new CustomEvent('open-echo', {
        detail: {
          context: 'gods',
          prompt: `Tell me about ${godName} — their domain, archetype role, and what ancient peoples believed about them. Explore the cross-cultural parallels with similar deities.`,
        },
      }));
    }, 400);
  }, [handleClose]);

  return (
    <div className="section-container">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <p
            className="text-xs tracking-[0.3em] uppercase mb-3"
            style={{ color: '#c9a84c', fontFamily: 'Cinzel, Georgia, serif' }}
          >
            Pantheon Observatory
          </p>
          <h1
            className="text-4xl sm:text-5xl font-bold mb-4"
            style={{
              fontFamily: '"Cinzel Decorative", Cinzel, Georgia, serif',
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.7) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            The Gods
          </h1>
          <p
            className="text-sm max-w-xl mx-auto"
            style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'Cinzel, Georgia, serif', fontStyle: 'italic' }}
          >
            Myth, memory, or contact? Explore the deities that shaped human civilization across every culture.
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-4 py-2 text-xs tracking-wider uppercase rounded transition-all duration-200"
              style={{
                background: filter === f ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.04)',
                border: filter === f ? '1px solid rgba(201,168,76,0.5)' : '1px solid rgba(255,255,255,0.08)',
                color: filter === f ? '#c9a84c' : 'rgba(255,255,255,0.5)',
                fontFamily: 'Cinzel, Georgia, serif',
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* God Cards Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {filteredGods.map((god) => (
              <GodCard key={god.id} god={god} onClick={() => handleOpen(god)} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Cinematic Overlay */}
      <AnimatePresence>
        {activeGod && (
          <GodCinematic
            god={activeGod}
            onClose={handleClose}
            onAskEcho={() => handleAskEcho(activeGod.name)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
