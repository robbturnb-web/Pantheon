import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Share2, RefreshCw, Check } from 'lucide-react';
import type { StarSeedArchetype } from '../../types';
import { supabase } from '../../lib/supabase';

interface Props {
  archetype: StarSeedArchetype;
  onRetake: () => void;
  onClose: () => void;
}

export default function StarSeedResult({ archetype, onRetake, onClose }: Props) {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // Always persist to localStorage so Echo can greet by archetype
  useEffect(() => {
    try {
      localStorage.setItem('pantheon_starseed', JSON.stringify({ archetype: archetype.name }));
    } catch { /* ignore */ }
  }, [archetype.name]);

  const handleSaveToProfile = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('profiles')
        .upsert({ id: user.id, starseed_archetype: archetype.id });
      setSaved(true);
    } else {
      alert('Sign in via the Community section to save your archetype to your profile.');
    }
    setSaving(false);
  };

  const handleShare = async () => {
    const text = `I discovered my Starseed archetype at Pantheon Observatory:\n\n${archetype.name} — ${archetype.subtitle}\n\n"${archetype.missionStatement}"\n\nDiscover yours: ${window.location.origin}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'My Starseed Archetype', text });
      } catch {
        // User cancelled or share failed
      }
    } else {
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard! Share your archetype.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="max-w-lg mx-auto w-full px-4"
    >
      {/* Result Card */}
      <div
        className="rounded-lg overflow-hidden"
        style={{
          background: archetype.cosmicBg,
          border: `2px solid ${archetype.accentColor}44`,
          boxShadow: `0 0 60px ${archetype.accentColor}22, 0 0 120px ${archetype.accentColor}11`,
        }}
      >
        {/* Card Header */}
        <div
          className="p-8 text-center"
          style={{ borderBottom: `1px solid ${archetype.accentColor}22` }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="text-5xl mb-4"
          >
            {archetype.symbol}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xs tracking-[0.3em] uppercase mb-2"
            style={{ color: archetype.accentColor, fontFamily: 'Cinzel, Georgia, serif' }}
          >
            Your Archetype
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-4xl font-bold mb-1"
            style={{
              fontFamily: 'Cinzel, Georgia, serif',
              color: '#ffffff',
              textShadow: `0 0 30px ${archetype.accentColor}44`,
            }}
          >
            {archetype.name}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-base"
            style={{ color: archetype.accentColor, fontFamily: 'Cinzel, Georgia, serif', fontStyle: 'italic' }}
          >
            {archetype.subtitle}
          </motion.p>
        </div>

        {/* Core Traits */}
        <div className="px-8 py-6" style={{ borderBottom: `1px solid ${archetype.accentColor}22` }}>
          <p
            className="text-xs tracking-widest uppercase mb-4"
            style={{ color: archetype.accentColor, fontFamily: 'Cinzel, Georgia, serif' }}
          >
            Core Traits
          </p>
          <ul className="space-y-2">
            {archetype.coreTraits.map((trait, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.08 }}
                className="flex items-start gap-2 text-sm"
                style={{ color: 'rgba(255,255,255,0.8)' }}
              >
                <span style={{ color: archetype.accentColor, marginTop: '2px', flexShrink: 0 }}>›</span>
                {trait}
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Mission Statement */}
        <div className="px-8 py-6">
          <p
            className="text-xs tracking-widest uppercase mb-4"
            style={{ color: archetype.accentColor, fontFamily: 'Cinzel, Georgia, serif' }}
          >
            Your Mission
          </p>
          <p
            className="text-sm leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.75)', fontFamily: 'Cinzel, Georgia, serif', fontStyle: 'italic' }}
          >
            "{archetype.missionStatement}"
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-2 py-3 rounded text-sm tracking-wider uppercase transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, #c9a84c 0%, #8a6e2e 100%)',
            color: '#030309',
            fontFamily: 'Cinzel, Georgia, serif',
            letterSpacing: '0.1em',
          }}
        >
          <Share2 size={14} />
          Share
        </button>
        <button
          onClick={() => void handleSaveToProfile()}
          disabled={saving || saved}
          className="flex items-center justify-center gap-2 py-3 rounded text-sm tracking-wider uppercase transition-all duration-300"
          style={{
            background: saved ? 'rgba(74,222,128,0.15)' : 'rgba(147,51,234,0.15)',
            border: saved ? '1px solid rgba(74,222,128,0.4)' : '1px solid rgba(147,51,234,0.4)',
            color: saved ? '#4ade80' : '#c084fc',
            fontFamily: 'Cinzel, Georgia, serif',
            letterSpacing: '0.1em',
          }}
        >
          {saved ? <Check size={14} /> : null}
          {saved ? 'Saved' : saving ? 'Saving...' : 'Save to Profile'}
        </button>
        <button
          onClick={onRetake}
          className="flex items-center justify-center gap-2 py-3 rounded text-sm transition-all duration-300"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.6)',
          }}
        >
          <RefreshCw size={14} />
          Retake
        </button>
        <button
          onClick={onClose}
          className="flex items-center justify-center gap-2 py-3 rounded text-sm transition-all duration-300"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.6)',
          }}
        >
          Close
        </button>
      </div>
    </motion.div>
  );
}
