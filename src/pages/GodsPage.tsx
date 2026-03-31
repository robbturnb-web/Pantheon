import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gods } from '../data/gods';
import type { God, PantheonFilter } from '../types';

const filters: PantheonFilter[] = ['All', 'Greek', 'Norse', 'Egyptian', 'Hindu', 'Anunnaki', 'Starseed'];

interface GodCardProps {
  god: God;
  isSelected: boolean;
  onClick: () => void;
  onAskEcho: (god: God) => void;
}

function GodCard({ god, isSelected, onClick, onAskEcho }: GodCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="rounded overflow-hidden cursor-pointer transition-all duration-300"
      style={{
        background: isSelected ? god.atmosphericBg : 'linear-gradient(135deg, #0a0a1a 0%, #12122a 100%)',
        border: isSelected ? '1px solid rgba(201,168,76,0.5)' : '1px solid rgba(201,168,76,0.1)',
        boxShadow: isSelected ? '0 0 40px rgba(201,168,76,0.15)' : 'none',
      }}
      onClick={onClick}
      whileHover={{ y: -4 }}
    >
      {/* Card Header */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{god.symbol}</span>
              <span
                className="text-xs tracking-widest uppercase px-2 py-0.5 rounded-full"
                style={{
                  background: 'rgba(201,168,76,0.1)',
                  color: '#c9a84c',
                  border: '1px solid rgba(201,168,76,0.2)',
                  fontFamily: 'Georgia, serif',
                }}
              >
                {god.pantheon}
              </span>
            </div>
            <h3
              className="text-xl font-bold"
              style={{ fontFamily: 'Georgia, serif', color: '#ffffff' }}
            >
              {god.name}
            </h3>
          </div>
        </div>

        {/* Domain Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {god.domains.map((domain) => (
            <span
              key={domain}
              className="text-xs px-2 py-0.5 rounded"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.5)',
              }}
            >
              {domain}
            </span>
          ))}
        </div>

        {/* Archetype Role */}
        <p
          className="text-xs leading-relaxed mb-3"
          style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Georgia, serif' }}
        >
          {god.archetypeRole}
        </p>

        {/* Atmospheric Description (shown when selected) */}
        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-3"
            >
              <p
                className="text-xs leading-relaxed italic"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                {god.atmosphericDesc}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reflection Question */}
        <div
          className="p-3 rounded mb-4"
          style={{ background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.1)' }}
        >
          <p
            className="text-xs leading-relaxed italic"
            style={{ color: 'rgba(201,168,76,0.85)', fontFamily: 'Georgia, serif' }}
          >
            "{god.reflectionQuestion}"
          </p>
        </div>

        {/* Ask Echo Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAskEcho(god);
          }}
          className="w-full py-2 text-xs tracking-wider uppercase rounded transition-all duration-200"
          style={{
            background: 'rgba(147,51,234,0.1)',
            border: '1px solid rgba(147,51,234,0.3)',
            color: '#c084fc',
            fontFamily: 'Georgia, serif',
          }}
        >
          Ask Echo About {god.name}
        </button>
      </div>
    </motion.div>
  );
}

export default function GodsPage() {
  const [filter, setFilter] = useState<PantheonFilter>('All');
  const [selectedGod, setSelectedGod] = useState<string | null>(null);

  const filteredGods = filter === 'All' ? gods : gods.filter((g) => g.pantheon === filter);
  const currentGod = selectedGod ? gods.find((g) => g.id === selectedGod) : null;

  const handleAskEcho = (god: God) => {
    // Dispatch event to open Echo AI with context
    window.dispatchEvent(new CustomEvent('open-echo', {
      detail: { context: `gods`, prompt: `Tell me about ${god.name} — their domain, archetype role, and what ancient peoples believed about them. Also explore the cross-cultural parallels with similar deities.` }
    }));
  };

  return (
    <div className="section-container">
      {/* Atmospheric background overlay when a god is selected */}
      <AnimatePresence>
        {currentGod && (
          <motion.div
            key={currentGod.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none"
            style={{
              background: currentGod.atmosphericBg,
              zIndex: 1,
              mixBlendMode: 'soft-light',
            }}
          />
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <p
            className="text-xs tracking-[0.3em] uppercase mb-3"
            style={{ color: '#c9a84c', fontFamily: 'Georgia, serif' }}
          >
            Pantheon Observatory
          </p>
          <h1
            className="text-4xl sm:text-5xl font-bold mb-4"
            style={{
              fontFamily: 'Georgia, serif',
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
            style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
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
                fontFamily: 'Georgia, serif',
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* God Cards Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          <AnimatePresence>
            {filteredGods.map((god) => (
              <GodCard
                key={god.id}
                god={god}
                isSelected={selectedGod === god.id}
                onClick={() => setSelectedGod(selectedGod === god.id ? null : god.id)}
                onAskEcho={handleAskEcho}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
