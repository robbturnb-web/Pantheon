import { motion } from 'framer-motion';
import SectionTitle from '../components/ui/SectionTitle';
import { timelineEntries } from '../data/timeline';

const categoryColors: Record<string, string> = {
  ancient: '#c9a84c',
  medieval: '#9333ea',
  modern: '#60a5fa',
  recent: '#4ade80',
};

export default function TimelinePage() {
  return (
    <div className="section-container">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <SectionTitle
            eyebrow="Pantheon Observatory"
            title="River of Ages"
            subtitle="A suppressed history of humanity — from the first anomalous structures to the disclosure era. What have we been told? What have we not been told?"
          />
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px"
            style={{
              background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.3) 5%, rgba(201,168,76,0.3) 95%, transparent)',
              transform: 'translateX(-0.5px)',
            }}
          />

          <div className="space-y-8">
            {timelineEntries.map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className={`relative flex gap-6 sm:gap-0 ${
                  i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'
                } pl-12 sm:pl-0`}
              >
                {/* Dot */}
                <div
                  className="absolute left-4 sm:left-1/2 w-3 h-3 rounded-full -translate-x-1.5 top-5"
                  style={{
                    background: categoryColors[entry.category] ?? '#c9a84c',
                    boxShadow: `0 0 10px ${categoryColors[entry.category] ?? '#c9a84c'}66`,
                  }}
                />

                {/* Content */}
                <div className={`sm:w-1/2 ${i % 2 === 0 ? 'sm:pr-10' : 'sm:pl-10'} w-full`}>
                  <div
                    className="p-5 rounded"
                    style={{
                      background: 'linear-gradient(135deg, #0a0a1a 0%, #12122a 100%)',
                      border: `1px solid ${categoryColors[entry.category] ?? '#c9a84c'}22`,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="text-xs font-mono font-bold"
                        style={{ color: categoryColors[entry.category] ?? '#c9a84c' }}
                      >
                        {entry.era}
                      </span>
                    </div>
                    <h3
                      className="font-bold mb-2"
                      style={{ fontFamily: 'Georgia, serif', color: '#ffffff' }}
                    >
                      {entry.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
                      {entry.description}
                    </p>
                  </div>
                </div>

                {/* Empty spacer for opposite side */}
                <div className="hidden sm:block sm:w-1/2" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
