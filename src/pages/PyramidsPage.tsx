import { motion } from 'framer-motion';
import SectionTitle from '../components/ui/SectionTitle';
import SacredGeometry from '../components/layout/SacredGeometry';

const pyramidFacts = [
  {
    title: 'Precision Beyond Tools',
    detail: 'The Great Pyramid\'s base is level to within 2.1 cm. The four sides are aligned to true north, south, east, and west within 3/60th of a degree — more precisely than the Greenwich Observatory.',
    icon: '📐',
  },
  {
    title: 'Encoded Mathematics',
    detail: 'The ratio of the pyramid\'s perimeter to twice its height approximates pi (π) to 5 decimal places. The speed of light in meters per second (299,792,458 m/s) matches the geographic coordinates of the Great Pyramid: 29.9792458° N.',
    icon: '🔢',
  },
  {
    title: 'Scale of Construction',
    detail: '2.3 million stone blocks, averaging 2.5 tonnes each, with some weighing up to 80 tonnes. To complete it in 20 years would require placing one block every 2 minutes, 24 hours a day, 365 days a year.',
    icon: '🏗️',
  },
  {
    title: 'Orion Correlation',
    detail: 'The three Giza pyramids align precisely with the three belt stars of Orion\'s constellation — and face the cardinal directions, not the Nile. The alignment dates the design to approximately 10,500 BCE, not 2,500 BCE.',
    icon: '⭐',
  },
  {
    title: 'Internal Chambers',
    detail: 'Unknown sealed chambers have been discovered using cosmic ray muon imaging (2017). What they contain has not been revealed. The Great Pyramid contains chambers we still cannot access.',
    icon: '🔬',
  },
  {
    title: 'Global Distribution',
    detail: 'Pyramid structures appear independently in Egypt, Sudan, Mexico, Guatemala, China, Cambodia, Peru, and Indonesia — many sharing identical angles, astronomical alignments, and construction periods. No known trade routes connect them.',
    icon: '🌍',
  },
  {
    title: 'The Missing Workers',
    detail: 'A workers\' village has been found — but it could house only 20,000–30,000 people. The labor force required is estimated at 100,000+. Where were the rest? How were they fed, housed, and paid? The logistics don\'t match the record.',
    icon: '👷',
  },
  {
    title: 'Acoustic Properties',
    detail: 'The King\'s Chamber resonates at 438 Hz — close to the A note in musical tuning. The granite coffer inside produces infrasound when struck. Was the structure designed as a sound machine, power plant, or initiation chamber?',
    icon: '🎵',
  },
];

const otherSites = [
  { name: 'Göbekli Tepe', location: 'Turkey', age: '~12,000 BCE', note: 'Pre-agricultural megastructure. Deliberately buried.' },
  { name: 'Puma Punku', location: 'Bolivia', age: '~15,000–500 BCE', note: 'H-shaped stone blocks with machine-precision holes and channels.' },
  { name: 'Sacsayhuamán', location: 'Peru', age: 'Unknown', note: '100-tonne stone blocks fitted without mortar. Some stones sourced 200 miles away.' },
  { name: 'Nan Madol', location: 'Micronesia', age: '~800 CE', note: 'Artificial island city built over a coral reef. Magnetic anomalies reported.' },
  { name: 'Yonaguni Monument', location: 'Japan', age: '~10,000 BCE', note: 'Submerged megalithic structure with right angles and terracing. Natural or constructed?' },
];

export default function PyramidsPage() {
  return (
    <>
    <SacredGeometry variant="sri-yantra" color="#c9a84c" opacity={0.3} />
    <div className="section-container">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <SectionTitle
            eyebrow="Pantheon Observatory"
            title="Pyramids & Ancient Structures"
            subtitle="The most precisely engineered structures in human history. Built by who, with what technology, and why — remains officially unanswered."
          />
        </motion.div>

        {/* Key Facts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-14">
          {pyramidFacts.map((fact, i) => (
            <motion.div
              key={fact.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="p-5 rounded bg-card"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{fact.icon}</span>
                <h3
                  className="font-bold"
                  style={{ fontFamily: 'Cinzel, Georgia, serif', color: '#ffffff' }}
                >
                  {fact.title}
                </h3>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
                {fact.detail}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Other Sites */}
        <div>
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1" style={{ background: 'rgba(201,168,76,0.2)' }} />
            <h2
              className="text-xl font-bold"
              style={{ fontFamily: 'Cinzel, Georgia, serif', color: '#c9a84c', flexShrink: 0 }}
            >
              Other Anomalous Sites
            </h2>
            <div className="h-px flex-1" style={{ background: 'rgba(201,168,76,0.2)' }} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherSites.map((site, i) => (
              <motion.div
                key={site.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="p-4 rounded"
                style={{
                  background: 'rgba(201,168,76,0.03)',
                  border: '1px solid rgba(201,168,76,0.12)',
                }}
              >
                <h4
                  className="font-bold mb-1"
                  style={{ fontFamily: 'Cinzel, Georgia, serif', color: '#ffffff' }}
                >
                  {site.name}
                </h4>
                <div className="flex gap-2 mb-2">
                  <span className="text-xs" style={{ color: '#c9a84c' }}>{site.location}</span>
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>•</span>
                  <span className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.4)' }}>{site.age}</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  {site.note}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
