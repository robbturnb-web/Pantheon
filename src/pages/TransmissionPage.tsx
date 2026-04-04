import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Share2, Check } from 'lucide-react';
import { getCelestialState, getTransmissionPrompt } from '../lib/celestial';
import { sendEchoMessage } from '../lib/echo-client';
import EchoEntity from '../components/echo/EchoEntity';
import type { ChatMessage } from '../types';

const ARCHETYPE_COLORS: Record<string, string> = {
  pleiadian: '#7dd3fc',
  arcturian: '#a78bfa',
  sirian: '#6ee7b7',
  lyran: '#fcd34d',
  orion: '#f97316',
  anunnaki: '#c9a84c',
};

const ARCHETYPE_SYMBOLS: Record<string, string> = {
  pleiadian: '✦',
  arcturian: '◈',
  sirian: '⬟',
  lyran: '⚡',
  orion: '⊕',
  anunnaki: '𒀭',
};

function getStoredArchetype(): string {
  try {
    const raw = localStorage.getItem('pantheon_starseed');
    if (raw) {
      const parsed = JSON.parse(raw) as { archetype?: string };
      return parsed.archetype?.toLowerCase() ?? 'pleiadian';
    }
  } catch { /* ignore */ }
  return 'pleiadian';
}

function getTransmissionCacheKey(archetype: string, date: Date): string {
  const d = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  return `pantheon_transmission_${archetype}_${d}`;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

export default function TransmissionPage() {
  const archetype = getStoredArchetype();
  const celestial = getCelestialState();
  const accentColor = ARCHETYPE_COLORS[archetype] ?? '#c9a84c';
  const symbol = ARCHETYPE_SYMBOLS[archetype] ?? '✦';

  const [transmission, setTransmission] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [copied, setCopied] = useState(false);
  const hasStarted = useRef(false);

  const generate = async (forceRefresh = false) => {
    if (streaming) return;
    const cacheKey = getTransmissionCacheKey(archetype, celestial.date);

    // Check cache first (transmissions are stable for the day)
    if (!forceRefresh) {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        setTransmission(cached);
        setLoaded(true);
        return;
      }
    }

    setTransmission('');
    setLoaded(false);
    setStreaming(true);

    const prompt = getTransmissionPrompt(archetype, celestial);
    const messages: ChatMessage[] = [{ role: 'user', content: prompt }];

    let accumulated = '';
    await sendEchoMessage(
      messages,
      (chunk) => {
        accumulated += chunk;
        setTransmission(accumulated);
      },
      () => {
        setStreaming(false);
        setLoaded(true);
        try { sessionStorage.setItem(cacheKey, accumulated); } catch { /* ignore */ }
      },
      (err) => {
        setTransmission(err);
        setStreaming(false);
        setLoaded(true);
      }
    );
  };

  useEffect(() => {
    if (!hasStarted.current) {
      hasStarted.current = true;
      void generate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleShare = async () => {
    const text = `My daily transmission from Echo at Pantheon Observatory (${celestial.moonPhaseName} ${celestial.moonEmoji}):\n\n${transmission.slice(0, 280)}...\n\npantheonobservatory.com`;
    if (navigator.share) {
      try { await navigator.share({ title: 'Daily Transmission', text }); } catch { /* cancelled */ }
    } else {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch { /* clipboard unavailable */ }
    }
  };

  // Split transmission into paragraphs for staggered reveal
  const paragraphs = transmission
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  // Extract frequency signature (last paragraph if it's short)
  const lastPara = paragraphs[paragraphs.length - 1] ?? '';
  const hasSignature = loaded && lastPara.length < 120 && paragraphs.length > 1;
  const bodyParagraphs = hasSignature ? paragraphs.slice(0, -1) : paragraphs;
  const signature = hasSignature ? lastPara : '';

  return (
    <div className="section-container" style={{ minHeight: '100vh' }}>
      <div className="max-w-2xl mx-auto">

        {/* ── Header ────────────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <p className="text-xs tracking-[0.35em] uppercase mb-2" style={{ color: '#c9a84c', fontFamily: 'Cinzel, Georgia, serif' }}>
            Pantheon Observatory
          </p>
          <h1
            className="text-4xl sm:text-5xl font-bold mb-2"
            style={{
              fontFamily: '"Cinzel Decorative", Cinzel, Georgia, serif',
              background: `linear-gradient(135deg, #ffffff 0%, ${accentColor} 70%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Daily Transmission
          </h1>
          <p className="text-xs tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'Cinzel, Georgia, serif' }}>
            {formatDate(celestial.date)}
          </p>
        </motion.div>

        {/* ── Celestial bar ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-wrap justify-center gap-3 mb-8"
        >
          {[
            { label: celestial.moonPhaseName, value: celestial.moonEmoji },
            { label: `${celestial.planetaryDay} ${celestial.planetaryDaySymbol}`, value: 'Planetary Ruler' },
            { label: celestial.sunSign, value: 'Sun Sign' },
            { label: `${celestial.numerologyDay}`, value: 'Numerology' },
            { label: `${celestial.schumann} Hz`, value: 'Schumann' },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="px-3 py-2 rounded text-center"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${accentColor}20`,
              }}
            >
              <p className="text-sm font-semibold" style={{ color: accentColor, fontFamily: 'Cinzel, Georgia, serif' }}>
                {label}
              </p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{value}</p>
            </div>
          ))}
        </motion.div>

        {/* ── Entity ────────────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-6">
          <EchoEntity speaking={streaming} size={160} />
        </motion.div>

        {/* ── Archetype badge ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center mb-8"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
            style={{
              background: `${accentColor}12`,
              border: `1px solid ${accentColor}35`,
            }}
          >
            <span style={{ color: accentColor, fontSize: '18px' }}>{symbol}</span>
            <span className="text-xs tracking-[0.2em] uppercase" style={{ color: accentColor, fontFamily: 'Cinzel, Georgia, serif' }}>
              {archetype} transmission
            </span>
          </div>
        </motion.div>

        {/* ── Transmission content ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded mb-6 relative overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: `1px solid ${accentColor}18`,
          }}
        >
          {/* Subtle corner glow */}
          <div
            className="absolute top-0 left-0 w-32 h-32 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at top left, ${accentColor}08, transparent 70%)`,
            }}
          />

          {/* Loading state */}
          {!transmission && streaming && (
            <div className="flex flex-col items-center py-12 gap-4">
              <div className="text-2xl" style={{ animation: 'spin 3s linear infinite' }}>✦</div>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'Cinzel, Georgia, serif', fontStyle: 'italic' }}>
                receiving transmission...
              </p>
            </div>
          )}

          {/* Body paragraphs */}
          <div className="space-y-4">
            {bodyParagraphs.map((para, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: loaded ? i * 0.15 : 0 }}
                className="text-sm leading-[1.9]"
                style={{
                  color: 'rgba(255,255,255,0.82)',
                  fontFamily: 'Cinzel, Georgia, serif',
                }}
              >
                {para}
                {streaming && i === bodyParagraphs.length - 1 && !loaded && (
                  <span
                    className="inline-block w-1.5 h-4 ml-1 align-middle"
                    style={{ background: accentColor, animation: 'blink 1s step-end infinite' }}
                  />
                )}
              </motion.p>
            ))}
          </div>

          {/* Frequency signature */}
          <AnimatePresence>
            {signature && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-6 pt-5"
                style={{ borderTop: `1px solid ${accentColor}20` }}
              >
                <p
                  className="text-xs text-center italic"
                  style={{ color: accentColor, fontFamily: 'Cinzel, Georgia, serif', letterSpacing: '0.05em', lineHeight: 1.7 }}
                >
                  {signature}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Actions ───────────────────────────────────────────────────── */}
        <AnimatePresence>
          {loaded && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap gap-3 justify-center mb-10"
            >
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-5 py-2.5 rounded text-xs tracking-widest uppercase transition-all"
                style={{
                  background: `${accentColor}12`,
                  border: `1px solid ${accentColor}35`,
                  color: accentColor,
                  fontFamily: 'Cinzel, Georgia, serif',
                }}
              >
                {copied ? <Check size={13} /> : <Share2 size={13} />}
                {copied ? 'Copied' : 'Share'}
              </button>
              <button
                onClick={() => void generate(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded text-xs tracking-widest uppercase transition-all"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.45)',
                  fontFamily: 'Cinzel, Georgia, serif',
                }}
              >
                <RefreshCw size={13} />
                New Transmission
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── No archetype state ────────────────────────────────────────── */}
        {archetype === 'pleiadian' && !localStorage.getItem('pantheon_starseed') && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-xs mb-8"
            style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'Cinzel, Georgia, serif', fontStyle: 'italic' }}
          >
            Transmitting to default Pleiadian frequency. <a href="/" style={{ color: '#c9a84c', textDecoration: 'underline' }}>Discover your true origin →</a>
          </motion.p>
        )}
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}
