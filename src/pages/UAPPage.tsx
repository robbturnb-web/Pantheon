import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import EvidenceBadge from '../components/ui/EvidenceBadge';
import SectionTitle from '../components/ui/SectionTitle';
import { uapCases } from '../data/uap-cases';
import type { UAPCase } from '../types';

function CaseCard({ uapCase }: { uapCase: UAPCase }) {
  const [expanded, setExpanded] = useState(false);

  const handleAskEcho = () => {
    window.dispatchEvent(new CustomEvent('open-echo', {
      detail: {
        context: 'uap',
        prompt: `Tell me about the ${uapCase.title} case. What evidence exists, what are the strongest arguments for and against it being non-human technology, and what do the primary sources actually say?`,
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
      {/* Card Header */}
      <button
        className="w-full text-left p-5 flex items-start justify-between gap-4"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <EvidenceBadge grade={uapCase.grade} />
            <span
              className="text-xs"
              style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'Cinzel, Georgia, serif' }}
            >
              {uapCase.date}
            </span>
          </div>
          <h3
            className="text-lg font-bold"
            style={{ fontFamily: 'Cinzel, Georgia, serif', color: '#ffffff' }}
          >
            {uapCase.title}
          </h3>
          <p
            className="text-sm mt-1 leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.6)' }}
          >
            {uapCase.summary.substring(0, 120)}...
          </p>
        </div>
        <div style={{ color: 'rgba(201,168,76,0.6)', flexShrink: 0, marginTop: '4px' }}>
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {/* Expanded Content */}
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
              className="px-5 pb-5 space-y-5"
              style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
            >
              {/* Full Summary */}
              <div className="pt-4">
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
                  {uapCase.summary}
                </p>
              </div>

              {/* Official vs Alternative */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div
                  className="p-4 rounded"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <p
                    className="text-xs tracking-wider uppercase mb-2"
                    style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'Cinzel, Georgia, serif' }}
                  >
                    Official Explanation
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    {uapCase.officialExplanation}
                  </p>
                </div>
                <div
                  className="p-4 rounded"
                  style={{ background: 'rgba(201,168,76,0.03)', border: '1px solid rgba(201,168,76,0.1)' }}
                >
                  <p
                    className="text-xs tracking-wider uppercase mb-2"
                    style={{ color: '#c9a84c', fontFamily: 'Cinzel, Georgia, serif' }}
                  >
                    Alternative Explanation
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    {uapCase.alternativeExplanation}
                  </p>
                </div>
              </div>

              {/* Timeline */}
              {uapCase.timeline.length > 0 && (
                <div>
                  <p
                    className="text-xs tracking-wider uppercase mb-3"
                    style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'Cinzel, Georgia, serif' }}
                  >
                    Timeline
                  </p>
                  <div className="space-y-2">
                    {uapCase.timeline.map((event, i) => (
                      <div key={i} className="flex gap-3">
                        <div
                          className="text-xs font-mono pt-0.5 shrink-0"
                          style={{ color: '#c9a84c', minWidth: '120px' }}
                        >
                          {event.year}
                        </div>
                        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
                          {event.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Accuracy Tracker */}
              {uapCase.accuracyTracker && (
                <div
                  className="p-3 rounded text-sm"
                  style={{
                    background: 'rgba(249,115,22,0.06)',
                    border: '1px solid rgba(249,115,22,0.2)',
                    color: '#fed7aa',
                  }}
                >
                  <span className="font-semibold">Accuracy Tracker: </span>
                  {uapCase.accuracyTracker}
                </div>
              )}

              {/* Sources */}
              <div>
                <p
                  className="text-xs tracking-wider uppercase mb-2"
                  style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'Cinzel, Georgia, serif' }}
                >
                  Sources
                </p>
                <ul className="space-y-1">
                  {uapCase.sources.map((source, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
                      <ExternalLink size={11} style={{ marginTop: '2px', flexShrink: 0 }} />
                      {source}
                    </li>
                  ))}
                </ul>
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
                Ask Echo About This Case
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function UAPPage() {
  return (
    <div className="section-container">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <SectionTitle
            eyebrow="Pantheon Observatory"
            title="UAP Disclosure"
            subtitle="Evidence-graded cases, whistleblower testimony, and the long road to disclosure. Every claim rated by its evidentiary standard."
          />
        </motion.div>

        {/* Evidence Grade Legend */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-3 justify-center mb-10 p-4 rounded"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          {(['DOCUMENTED', 'CREDIBLE', 'SPECULATIVE', 'UNVERIFIED'] as const).map((grade) => (
            <div key={grade} className="flex items-center gap-2">
              <EvidenceBadge grade={grade} size="sm" />
            </div>
          ))}
        </motion.div>

        <div className="space-y-4">
          {uapCases.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <CaseCard uapCase={c} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
