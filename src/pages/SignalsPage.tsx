import { motion } from 'framer-motion';
import SectionTitle from '../components/ui/SectionTitle';
import { creators } from '../data/creators';
import type { SignalRating } from '../types';

const ratingConfig: Record<SignalRating, { icon: string; label: string; bg: string; text: string; border: string }> = {
  GREEN: {
    icon: '🟢',
    label: 'GREEN SIGNAL',
    bg: 'rgba(22, 101, 52, 0.2)',
    text: '#86efac',
    border: 'rgba(34, 197, 94, 0.3)',
  },
  YELLOW: {
    icon: '🟡',
    label: 'YELLOW SIGNAL',
    bg: 'rgba(113, 63, 18, 0.2)',
    text: '#fde68a',
    border: 'rgba(234, 179, 8, 0.3)',
  },
  RED: {
    icon: '🔴',
    label: 'RED SIGNAL',
    bg: 'rgba(127, 29, 29, 0.2)',
    text: '#fca5a5',
    border: 'rgba(239, 68, 68, 0.3)',
  },
};

function SignalBadge({ rating }: { rating: SignalRating }) {
  const c = ratingConfig[rating];
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-mono rounded px-2 py-1"
      style={{
        background: c.bg,
        color: c.text,
        border: `1px solid ${c.border}`,
        letterSpacing: '0.06em',
        fontWeight: 600,
      }}
    >
      <span>{c.icon}</span>
      {c.label}
    </span>
  );
}

export default function SignalsPage() {
  const green = creators.filter((c) => c.rating === 'GREEN');
  const yellow = creators.filter((c) => c.rating === 'YELLOW');
  const red = creators.filter((c) => c.rating === 'RED');

  const groups = [
    { label: 'High Credibility', creators: green, rating: 'GREEN' as SignalRating },
    { label: 'Credible — Speculative Elements', creators: yellow, rating: 'YELLOW' as SignalRating },
    { label: 'Entertainment Value', creators: red, rating: 'RED' as SignalRating },
  ];

  return (
    <div className="section-container">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <SectionTitle
            eyebrow="Pantheon Observatory"
            title="Creator Signals"
            subtitle="Navigating the information landscape. Who applies evidence standards, who entertains, and who to verify before trusting."
          />
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-3 justify-center mb-10 p-4 rounded"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <SignalBadge rating="GREEN" />
          <SignalBadge rating="YELLOW" />
          <SignalBadge rating="RED" />
        </motion.div>

        <div className="space-y-10">
          {groups.map(({ label, creators: group, rating }) => (
            <div key={rating}>
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px flex-1" style={{ background: `${ratingConfig[rating].border}` }} />
                <span
                  className="text-xs tracking-wider uppercase"
                  style={{ color: ratingConfig[rating].text, fontFamily: 'Georgia, serif', flexShrink: 0 }}
                >
                  {label}
                </span>
                <div className="h-px flex-1" style={{ background: `${ratingConfig[rating].border}` }} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {group.map((creator, i) => (
                  <motion.div
                    key={creator.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="p-5 rounded"
                    style={{
                      background: 'linear-gradient(135deg, #0a0a1a 0%, #12122a 100%)',
                      border: `1px solid ${ratingConfig[rating].border}`,
                    }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h3
                          className="font-bold text-base"
                          style={{ fontFamily: 'Georgia, serif', color: '#ffffff' }}
                        >
                          {creator.name}
                        </h3>
                        <p
                          className="text-xs"
                          style={{ color: 'rgba(255,255,255,0.4)' }}
                        >
                          {creator.platform}
                        </p>
                      </div>
                      <SignalBadge rating={creator.rating} />
                    </div>

                    <p
                      className="text-sm leading-relaxed mb-3"
                      style={{ color: 'rgba(255,255,255,0.65)' }}
                    >
                      {creator.description}
                    </p>

                    <div
                      className="p-3 rounded text-xs leading-relaxed mb-3"
                      style={{
                        background: `${ratingConfig[rating].bg}`,
                        border: `1px solid ${ratingConfig[rating].border}`,
                        color: ratingConfig[rating].text,
                      }}
                    >
                      {creator.ratingNote}
                    </div>

                    <button
                      onClick={() => window.dispatchEvent(new CustomEvent('open-echo', {
                        detail: {
                          context: 'signals',
                          prompt: `Help me evaluate ${creator.name} as an information source. What do they get right, where should I be skeptical, and how do I verify their claims independently?`,
                        }
                      }))}
                      className="w-full py-2 text-xs tracking-wider uppercase rounded transition-all duration-200"
                      style={{
                        background: 'rgba(147,51,234,0.08)',
                        border: '1px solid rgba(147,51,234,0.25)',
                        color: '#c084fc',
                        fontFamily: 'Georgia, serif',
                      }}
                    >
                      Ask Echo About {creator.name.split(' ')[0]}
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
