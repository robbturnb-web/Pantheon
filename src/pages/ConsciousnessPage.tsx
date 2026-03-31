import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import EvidenceBadge from '../components/ui/EvidenceBadge';
import SectionTitle from '../components/ui/SectionTitle';
import { consciousnessSections } from '../data/consciousness';
import type { ConsciousnessSection } from '../types';

function SubsectionCard({ section }: { section: ConsciousnessSection }) {
  const [expanded, setExpanded] = useState(false);

  const handleAskEcho = () => {
    window.dispatchEvent(new CustomEvent('open-echo', {
      detail: {
        context: 'consciousness',
        prompt: `I want to understand ${section.title}. What does the evidence actually say, what are the scientific debates, and what should someone research to form their own informed view?`,
      }
    }));
  };

  return (
    <motion.div
      layout
      className="rounded overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0a0a1a 0%, #12122a 100%)',
        border: '1px solid rgba(201,168,76,0.15)',
      }}
    >
      <button
        className="w-full text-left p-5 flex items-start justify-between gap-4"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <EvidenceBadge grade={section.grade} />
          </div>
          <h3
            className="text-lg font-bold mb-0.5"
            style={{ fontFamily: 'Cinzel, Georgia, serif', color: '#ffffff' }}
          >
            {section.title}
          </h3>
          <p
            className="text-xs"
            style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Cinzel, Georgia, serif', fontStyle: 'italic' }}
          >
            {section.subtitle}
          </p>
        </div>
        <div style={{ color: 'rgba(201,168,76,0.6)', flexShrink: 0, marginTop: '6px' }}>
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div
              className="px-5 pb-5 space-y-4"
              style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
            >
              <p className="pt-4 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
                {section.summary}
              </p>

              {/* Key Facts */}
              <div>
                <p
                  className="text-xs tracking-wider uppercase mb-3"
                  style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'Cinzel, Georgia, serif' }}
                >
                  Key Facts
                </p>
                <ul className="space-y-2">
                  {section.keyFacts.map((fact, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
                      <span style={{ color: '#c9a84c', marginTop: '2px', flexShrink: 0 }}>›</span>
                      {fact}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Source Note */}
              <div
                className="p-3 rounded text-xs leading-relaxed"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  color: 'rgba(255,255,255,0.4)',
                  fontStyle: 'italic',
                }}
              >
                {section.sourceNote}
              </div>

              {/* Ask Echo */}
              <button
                onClick={handleAskEcho}
                className="w-full py-2.5 text-xs tracking-wider uppercase rounded transition-all duration-200"
                style={{
                  background: 'rgba(147,51,234,0.1)',
                  border: '1px solid rgba(147,51,234,0.3)',
                  color: '#c084fc',
                  fontFamily: 'Cinzel, Georgia, serif',
                }}
              >
                Ask Echo About This
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ConsciousnessPage() {
  return (
    <div className="section-container">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <SectionTitle
            eyebrow="Pantheon Observatory"
            title="Consciousness"
            subtitle="Where science and spirituality collide. Documented programs, declassified research, and the hardest questions about the nature of mind."
          />
        </motion.div>

        <div className="space-y-4">
          {consciousnessSections.map((section, i) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <SubsectionCard section={section} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
