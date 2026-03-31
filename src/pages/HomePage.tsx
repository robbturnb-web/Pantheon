import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, Telescope, Globe, Zap, Eye, Brain, Radio, Users } from 'lucide-react';
import OriginChamber from '../components/starseed/OriginChamber';

const sections = [
  { icon: Globe, label: 'River of Ages', path: '/timeline', desc: 'Suppressed history from 300,000 BCE to now' },
  { icon: Zap, label: 'UAP', path: '/uap', desc: 'Evidence-graded cases, witnesses, and disclosure' },
  { icon: Eye, label: 'The Gods', path: '/gods', desc: 'Deities across cultures — myth or memory?' },
  { icon: Telescope, label: 'Pyramids', path: '/pyramids', desc: 'The most precise structures ever built' },
  { icon: Brain, label: 'Consciousness', path: '/consciousness', desc: 'CIA Gateway, remote viewing, the science of mind' },
  { icon: Radio, label: 'Creator Signals', path: '/signals', desc: 'Who to trust in the information landscape' },
  { icon: Users, label: 'Community', path: '/community', desc: 'Sightings, synchronicities, research threads' },
];

export default function HomePage() {
  const [chamberOpen, setChamberOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-screen text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="max-w-4xl mx-auto"
        >
          {/* Observatory insignia */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="flex justify-center mb-8"
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                border: '2px solid rgba(201,168,76,0.5)',
                boxShadow: '0 0 40px rgba(201,168,76,0.15), inset 0 0 20px rgba(201,168,76,0.05)',
              }}
            >
              <Telescope size={32} style={{ color: '#c9a84c' }} />
            </div>
          </motion.div>

          {/* Main title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="font-bold tracking-[0.2em] uppercase mb-6"
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: 'clamp(2rem, 6vw, 5rem)',
              background: 'linear-gradient(135deg, #f5c842 0%, #c9a84c 50%, #8a6e2e 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: 1.1,
            }}
          >
            Pantheon<br />Observatory
          </motion.h1>

          {/* Separator */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="flex items-center justify-center gap-4 mb-6"
          >
            <div className="h-px w-16" style={{ background: 'rgba(201,168,76,0.4)' }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#c9a84c' }} />
            <div className="h-px w-16" style={{ background: 'rgba(201,168,76,0.4)' }} />
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-12"
            style={{
              color: 'rgba(255,255,255,0.7)',
              lineHeight: 1.7,
              letterSpacing: '0.05em',
              fontFamily: 'Georgia, serif',
              fontStyle: 'italic',
            }}
          >
            "Illuminating the Suppressed. Questioning the Accepted. Exploring the Unknown."
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => {
                document.getElementById('sections-grid')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-3.5 text-sm tracking-widest uppercase font-medium transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #c9a84c 0%, #8a6e2e 100%)',
                color: '#030309',
                borderRadius: '2px',
                fontFamily: 'Georgia, serif',
                letterSpacing: '0.15em',
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.boxShadow = '0 0 30px rgba(201,168,76,0.5)';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.boxShadow = 'none';
              }}
            >
              Enter the Observatory
            </button>
            <button
              onClick={() => setChamberOpen(true)}
              className="w-full sm:w-auto px-8 py-3.5 text-sm tracking-widest uppercase font-medium transition-all duration-300"
              style={{
                background: 'transparent',
                color: '#c9a84c',
                border: '1px solid rgba(201,168,76,0.5)',
                borderRadius: '2px',
                fontFamily: 'Georgia, serif',
                letterSpacing: '0.15em',
              }}
              onMouseEnter={(e) => {
                const btn = e.currentTarget;
                btn.style.borderColor = '#c9a84c';
                btn.style.boxShadow = '0 0 20px rgba(201,168,76,0.2)';
              }}
              onMouseLeave={(e) => {
                const btn = e.currentTarget;
                btn.style.borderColor = 'rgba(201,168,76,0.5)';
                btn.style.boxShadow = 'none';
              }}
            >
              Find Your Origin
            </button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer scroll-indicator"
          onClick={() => document.getElementById('sections-grid')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <span className="text-xs tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'Georgia, serif' }}>
            Explore
          </span>
          <ChevronDown size={18} style={{ color: 'rgba(201,168,76,0.5)' }} />
        </motion.div>
      </section>

      {/* Sections Grid */}
      <section id="sections-grid" className="section-container">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p
              className="text-xs tracking-[0.3em] uppercase mb-4"
              style={{ color: '#c9a84c', fontFamily: 'Georgia, serif' }}
            >
              The Observatory
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold mb-4"
              style={{
                fontFamily: 'Georgia, serif',
                background: 'linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.7) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Where Would You Like to Begin?
            </h2>
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-12" style={{ background: 'rgba(201,168,76,0.3)' }} />
              <div className="w-1 h-1 rounded-full" style={{ background: 'rgba(201,168,76,0.6)' }} />
              <div className="h-px w-12" style={{ background: 'rgba(201,168,76,0.3)' }} />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sections.map((section, i) => (
              <motion.button
                key={section.path}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
                onClick={() => navigate(section.path)}
                className="group text-left p-6 rounded transition-all duration-300 bg-card"
                style={{ cursor: 'pointer' }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-8 h-8 rounded flex items-center justify-center"
                    style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)' }}
                  >
                    <section.icon size={16} style={{ color: '#c9a84c' }} />
                  </div>
                  <span
                    className="text-sm font-semibold tracking-wider uppercase"
                    style={{ color: '#c9a84c', fontFamily: 'Georgia, serif' }}
                  >
                    {section.label}
                  </span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  {section.desc}
                </p>
              </motion.button>
            ))}

            {/* Origin Chamber card */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: sections.length * 0.07, duration: 0.5 }}
              onClick={() => setChamberOpen(true)}
              className="group text-left p-6 rounded transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(147,51,234,0.15) 0%, rgba(107,33,168,0.1) 100%)',
                border: '1px solid rgba(147,51,234,0.3)',
                cursor: 'pointer',
              }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-8 h-8 rounded flex items-center justify-center"
                  style={{ background: 'rgba(147,51,234,0.15)', border: '1px solid rgba(147,51,234,0.3)' }}
                >
                  <span style={{ fontSize: '16px' }}>✨</span>
                </div>
                <span
                  className="text-sm font-semibold tracking-wider uppercase"
                  style={{ color: '#c084fc', fontFamily: 'Georgia, serif' }}
                >
                  Origin Chamber
                </span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Discover your Starseed archetype through the cosmic quiz
              </p>
            </motion.button>
          </div>
        </div>
      </section>

      {/* Origin Chamber Modal */}
      {chamberOpen && <OriginChamber onClose={() => setChamberOpen(false)} />}
    </>
  );
}
