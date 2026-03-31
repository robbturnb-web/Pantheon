import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { uapCases } from '../data/uap-cases';
import { gods } from '../data/gods';
import { consciousnessSections } from '../data/consciousness';
import { creators } from '../data/creators';
import { timelineEntries } from '../data/timeline';

type ResultCategory = 'uap' | 'gods' | 'consciousness' | 'creators' | 'timeline';

interface SearchResult {
  id: string;
  category: ResultCategory;
  title: string;
  subtitle: string;
  excerpt: string;
  path: string;
}

const CATEGORY_META: Record<ResultCategory, { label: string; color: string; emoji: string }> = {
  uap:           { label: 'UAP Case',    color: '#c9a84c', emoji: '🛸' },
  gods:          { label: 'Deity',       color: '#a78bfa', emoji: '⚡' },
  consciousness: { label: 'Consciousness', color: '#34d399', emoji: '🧠' },
  creators:      { label: 'Signal',      color: '#60a5fa', emoji: '📡' },
  timeline:      { label: 'Timeline',    color: '#f97316', emoji: '📅' },
};

function buildIndex(): SearchResult[] {
  const results: SearchResult[] = [];

  for (const c of uapCases) {
    results.push({
      id: c.id,
      category: 'uap',
      title: c.title,
      subtitle: `${c.date} · ${c.grade}`,
      excerpt: c.summary.slice(0, 120) + '…',
      path: '/uap',
    });
  }

  for (const g of gods) {
    results.push({
      id: g.id,
      category: 'gods',
      title: g.name,
      subtitle: `${g.pantheon} · ${g.domains.slice(0, 3).join(', ')}`,
      excerpt: g.archetypeRole,
      path: '/gods',
    });
  }

  for (const s of consciousnessSections) {
    results.push({
      id: s.id,
      category: 'consciousness',
      title: s.title,
      subtitle: s.subtitle,
      excerpt: s.summary.slice(0, 120) + '…',
      path: '/consciousness',
    });
  }

  for (const cr of creators) {
    results.push({
      id: cr.id,
      category: 'creators',
      title: cr.name,
      subtitle: `${cr.platform} · ${cr.rating}`,
      excerpt: cr.ratingNote,
      path: '/signals',
    });
  }

  for (const ev of timelineEntries) {
    results.push({
      id: ev.id,
      category: 'timeline',
      title: ev.title,
      subtitle: `${ev.year} · ${ev.era}`,
      excerpt: ev.description.slice(0, 120) + '…',
      path: '/timeline',
    });
  }

  return results;
}

const ALL_RESULTS = buildIndex();

function score(result: SearchResult, query: string): number {
  const q = query.toLowerCase();
  let s = 0;
  if (result.title.toLowerCase().includes(q)) s += 10;
  if (result.subtitle.toLowerCase().includes(q)) s += 5;
  if (result.excerpt.toLowerCase().includes(q)) s += 2;
  return s;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<ResultCategory | 'all'>('all');
  const navigate = useNavigate();

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return ALL_RESULTS
      .map((r) => ({ result: r, score: score(r, query) }))
      .filter(({ score: s }) => s > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ result }) => result)
      .filter((r) => activeCategory === 'all' || r.category === activeCategory);
  }, [query, activeCategory]);

  const categories = useMemo<ResultCategory[]>(() => {
    if (!query.trim()) return [];
    return [...new Set(results.map((r) => r.category))] as ResultCategory[];
  }, [query, results]);

  const handleResultClick = (result: SearchResult) => {
    navigate(result.path);
  };

  return (
    <div className="section-container">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color: '#c9a84c', fontFamily: 'Cinzel, Georgia, serif' }}>
            Pantheon Observatory
          </p>
          <h1
            className="text-4xl font-bold mb-2"
            style={{
              fontFamily: '"Cinzel Decorative", Cinzel, Georgia, serif',
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.7) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Search
          </h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Cinzel, Georgia, serif', fontStyle: 'italic' }}>
            Search across UAP cases, deities, consciousness research, creators, and the timeline.
          </p>
        </motion.div>

        {/* Search input */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative mb-6"
        >
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: 'rgba(255,255,255,0.3)' }}
          />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the observatory..."
            className="w-full pl-12 pr-12 py-4 rounded text-sm outline-none"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(201,168,76,0.2)',
              color: '#ffffff',
              fontFamily: 'Cinzel, Georgia, serif',
              fontSize: '15px',
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2"
              style={{ color: 'rgba(255,255,255,0.3)' }}
            >
              <X size={16} />
            </button>
          )}
        </motion.div>

        {/* Category filter pills */}
        <AnimatePresence>
          {categories.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-2 mb-6"
            >
              <button
                onClick={() => setActiveCategory('all')}
                className="px-3 py-1 rounded-full text-xs tracking-wider uppercase"
                style={{
                  background: activeCategory === 'all' ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.04)',
                  border: activeCategory === 'all' ? '1px solid rgba(201,168,76,0.4)' : '1px solid rgba(255,255,255,0.08)',
                  color: activeCategory === 'all' ? '#c9a84c' : 'rgba(255,255,255,0.4)',
                  fontFamily: 'Cinzel, Georgia, serif',
                }}
              >
                All ({results.length})
              </button>
              {categories.map((cat) => {
                const meta = CATEGORY_META[cat];
                const count = results.filter((r) => r.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className="px-3 py-1 rounded-full text-xs tracking-wider uppercase"
                    style={{
                      background: activeCategory === cat ? `${meta.color}18` : 'rgba(255,255,255,0.04)',
                      border: activeCategory === cat ? `1px solid ${meta.color}50` : '1px solid rgba(255,255,255,0.08)',
                      color: activeCategory === cat ? meta.color : 'rgba(255,255,255,0.4)',
                      fontFamily: 'Cinzel, Georgia, serif',
                    }}
                  >
                    {meta.emoji} {meta.label} ({count})
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence mode="wait">
          {query && results.length === 0 && (
            <motion.p
              key="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
              style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'Cinzel, Georgia, serif', fontStyle: 'italic' }}
            >
              No transmissions found for "{query}"
            </motion.p>
          )}

          {results.length > 0 && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              {results.map((result, i) => {
                const meta = CATEGORY_META[result.category];
                return (
                  <motion.button
                    key={result.id + result.category}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => handleResultClick(result)}
                    className="w-full text-left p-4 rounded transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.07)',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = `${meta.color}35`;
                      (e.currentTarget as HTMLButtonElement).style.background = `${meta.color}07`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.07)';
                      (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.02)';
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-lg flex-shrink-0 mt-0.5">{meta.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span
                            className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                            style={{
                              background: `${meta.color}12`,
                              color: meta.color,
                              border: `1px solid ${meta.color}25`,
                              fontFamily: 'Cinzel, Georgia, serif',
                            }}
                          >
                            {meta.label}
                          </span>
                          <span
                            className="font-semibold text-sm"
                            style={{ color: '#ffffff', fontFamily: 'Cinzel, Georgia, serif' }}
                          >
                            {result.title}
                          </span>
                        </div>
                        <p className="text-xs mb-1" style={{ color: meta.color, opacity: 0.7, fontFamily: 'Cinzel, Georgia, serif' }}>
                          {result.subtitle}
                        </p>
                        <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                          {result.excerpt}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          )}

          {!query && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <div className="text-4xl mb-4">🔭</div>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'Cinzel, Georgia, serif', fontStyle: 'italic' }}>
                Search across {ALL_RESULTS.length} records in the observatory
              </p>
              <div className="flex flex-wrap justify-center gap-3 mt-6">
                {(Object.entries(CATEGORY_META) as [ResultCategory, { label: string; color: string; emoji: string }][]).map(([cat, meta]) => (
                  <button
                    key={cat}
                    onClick={() => setQuery(meta.label)}
                    className="px-3 py-1.5 rounded text-xs"
                    style={{
                      background: `${meta.color}0a`,
                      border: `1px solid ${meta.color}20`,
                      color: `${meta.color}`,
                      fontFamily: 'Cinzel, Georgia, serif',
                    }}
                  >
                    {meta.emoji} {meta.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
