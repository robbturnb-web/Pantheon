import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, Send, LogOut } from 'lucide-react';
import SectionTitle from '../components/ui/SectionTitle';
import CommentThread from '../components/community/CommentThread';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import type { Sighting, Synchronicity, ResearchThread } from '../types';

// ── Auth Form ─────────────────────────────────────────────────────────────────
function AuthForm() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error: err } = mode === 'signin'
      ? await signIn(email, password)
      : await signUp(email, password, username);

    if (err) setError(err.message);
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto"
    >
      <div
        className="p-8 rounded"
        style={{
          background: 'linear-gradient(135deg, #0a0a1a 0%, #12122a 100%)',
          border: '1px solid rgba(201,168,76,0.2)',
        }}
      >
        <div className="text-center mb-8">
          <div className="text-3xl mb-3">🔭</div>
          <h2
            className="text-2xl font-bold mb-2"
            style={{ fontFamily: 'Cinzel, Georgia, serif', color: '#ffffff' }}
          >
            Join the Observatory
          </h2>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}>
            Share sightings, synchronicities, and research with the community.
          </p>
        </div>

        {/* Mode toggle */}
        <div className="flex mb-6 rounded overflow-hidden" style={{ border: '1px solid rgba(201,168,76,0.2)' }}>
          {(['signin', 'signup'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="flex-1 py-2 text-xs tracking-wider uppercase transition-all"
              style={{
                background: mode === m ? 'rgba(201,168,76,0.15)' : 'transparent',
                color: mode === m ? '#c9a84c' : 'rgba(255,255,255,0.4)',
                fontFamily: 'Cinzel, Georgia, serif',
              }}
            >
              {m === 'signin' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 rounded text-sm outline-none"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#ffffff',
              }}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded text-sm outline-none"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#ffffff',
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded text-sm outline-none"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#ffffff',
            }}
          />

          {error && (
            <p className="text-xs" style={{ color: '#fca5a5' }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-sm tracking-wider uppercase rounded transition-all"
            style={{
              background: 'linear-gradient(135deg, #c9a84c 0%, #8a6e2e 100%)',
              color: '#030309',
              fontFamily: 'Cinzel, Georgia, serif',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Loading...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </motion.div>
  );
}

// ── Sightings Feed ─────────────────────────────────────────────────────────────
function SightingsFeed({ userId, user }: { userId: string; user: import('@supabase/supabase-js').User }) {
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [form, setForm] = useState({ date: '', location: '', description: '', photo_url: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase
      .from('sightings')
      .select('*, profiles(username)')
      .order('created_at', { ascending: false })
      .then(({ data }) => setSightings((data as Sighting[]) ?? []));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { data } = await supabase
      .from('sightings')
      .insert({ ...form, user_id: userId })
      .select('*, profiles(username)')
      .single();
    if (data) setSightings([data as Sighting, ...sightings]);
    setForm({ date: '', location: '', description: '', photo_url: '' });
    setSubmitting(false);
  };

  const handleUpvote = async (id: string) => {
    await supabase.rpc('increment_upvotes', { row_id: id, table_name: 'sightings' });
    setSightings(sightings.map((s) => s.id === id ? { ...s, upvotes: s.upvotes + 1 } : s));
  };

  return (
    <div className="space-y-6">
      {/* Submit Form */}
      <form
        onSubmit={handleSubmit}
        className="p-5 rounded space-y-3"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,76,0.15)' }}
      >
        <h3 className="text-sm tracking-wider uppercase" style={{ color: '#c9a84c', fontFamily: 'Cinzel, Georgia, serif' }}>
          Report a Sighting
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
            className="px-3 py-2 rounded text-sm outline-none"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff' }}
          />
          <input
            type="text"
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            required
            className="px-3 py-2 rounded text-sm outline-none"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff' }}
          />
        </div>
        <textarea
          placeholder="Describe what you observed..."
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
          rows={3}
          className="w-full px-3 py-2 rounded text-sm outline-none resize-none"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff' }}
        />
        <input
          type="url"
          placeholder="Photo URL (optional)"
          value={form.photo_url}
          onChange={(e) => setForm({ ...form, photo_url: e.target.value })}
          className="w-full px-3 py-2 rounded text-sm outline-none"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff' }}
        />
        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-2 px-4 py-2 rounded text-xs tracking-wider uppercase"
          style={{
            background: 'rgba(201,168,76,0.15)',
            border: '1px solid rgba(201,168,76,0.3)',
            color: '#c9a84c',
            fontFamily: 'Cinzel, Georgia, serif',
          }}
        >
          <Send size={12} />
          {submitting ? 'Submitting...' : 'Submit Sighting'}
        </button>
      </form>

      {/* Sightings List */}
      {sightings.map((s) => (
        <div
          key={s.id}
          className="p-4 rounded"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
              <span style={{ color: '#c9a84c' }}>{s.profiles?.username ?? 'Anonymous'}</span>
              <span>•</span>
              <span>{s.location}</span>
              <span>•</span>
              <span>{s.date}</span>
            </div>
            <button
              onClick={() => handleUpvote(s.id)}
              className="flex items-center gap-1 text-xs transition-colors"
              style={{ color: 'rgba(255,255,255,0.3)' }}
            >
              <ThumbsUp size={12} />
              {s.upvotes}
            </button>
          </div>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>{s.description}</p>
          {s.photo_url && (
            <img
              src={s.photo_url}
              alt="Sighting"
              className="mt-3 rounded max-h-40 object-cover"
            />
          )}
          <CommentThread parentType="sighting" parentId={s.id} user={user} />
        </div>
      ))}
    </div>
  );
}

// ── Synchronicity Journal ──────────────────────────────────────────────────────
function SynchronicityJournal({ userId, user }: { userId: string; user: import('@supabase/supabase-js').User }) {
  const [entries, setEntries] = useState<Synchronicity[]>([]);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase
      .from('synchronicities')
      .select('*, profiles(username)')
      .order('created_at', { ascending: false })
      .then(({ data }) => setEntries((data as Synchronicity[]) ?? []));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    const { data } = await supabase
      .from('synchronicities')
      .insert({ content, user_id: userId })
      .select('*, profiles(username)')
      .single();
    if (data) setEntries([data as Synchronicity, ...entries]);
    setContent('');
    setSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit}
        className="p-5 rounded space-y-3"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(147,51,234,0.2)' }}
      >
        <h3 className="text-sm tracking-wider uppercase" style={{ color: '#c084fc', fontFamily: 'Cinzel, Georgia, serif' }}>
          Share a Synchronicity
        </h3>
        <textarea
          placeholder="Describe your synchronicity — a meaningful coincidence, repeated number pattern, or moment where the universe seemed to respond..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={4}
          className="w-full px-3 py-2 rounded text-sm outline-none resize-none"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff' }}
        />
        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-2 px-4 py-2 rounded text-xs tracking-wider uppercase"
          style={{
            background: 'rgba(147,51,234,0.15)',
            border: '1px solid rgba(147,51,234,0.3)',
            color: '#c084fc',
            fontFamily: 'Cinzel, Georgia, serif',
          }}
        >
          <Send size={12} />
          {submitting ? 'Sharing...' : 'Share'}
        </button>
      </form>

      {entries.map((entry) => (
        <div
          key={entry.id}
          className="p-4 rounded"
          style={{ background: 'rgba(147,51,234,0.04)', border: '1px solid rgba(147,51,234,0.12)' }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs" style={{ color: '#c084fc' }}>{entry.profiles?.username ?? 'Anonymous'}</span>
            <button
              onClick={async () => {
                await supabase.rpc('increment_upvotes', { row_id: entry.id, table_name: 'synchronicities' });
                setEntries(entries.map((e) => e.id === entry.id ? { ...e, upvotes: e.upvotes + 1 } : e));
              }}
              className="flex items-center gap-1 text-xs"
              style={{ color: 'rgba(255,255,255,0.3)' }}
            >
              <ThumbsUp size={12} />
              {entry.upvotes}
            </button>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>{entry.content}</p>
          <CommentThread parentType="synchronicity" parentId={entry.id} user={user} />
        </div>
      ))}
    </div>
  );
}

// ── Research Threads ───────────────────────────────────────────────────────────
function ResearchThreads({ userId, user }: { userId: string; user: import('@supabase/supabase-js').User }) {
  const [threads, setThreads] = useState<ResearchThread[]>([]);
  const [form, setForm] = useState({ title: '', content: '', topic_tags: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase
      .from('research_threads')
      .select('*, profiles(username)')
      .order('created_at', { ascending: false })
      .then(({ data }) => setThreads((data as ResearchThread[]) ?? []));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const tags = form.topic_tags.split(',').map((t) => t.trim()).filter(Boolean);
    const { data } = await supabase
      .from('research_threads')
      .insert({ ...form, topic_tags: tags, user_id: userId })
      .select('*, profiles(username)')
      .single();
    if (data) setThreads([data as ResearchThread, ...threads]);
    setForm({ title: '', content: '', topic_tags: '' });
    setSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit}
        className="p-5 rounded space-y-3"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(96,165,250,0.2)' }}
      >
        <h3 className="text-sm tracking-wider uppercase" style={{ color: '#60a5fa', fontFamily: 'Cinzel, Georgia, serif' }}>
          Start a Research Thread
        </h3>
        <input
          type="text"
          placeholder="Thread title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
          className="w-full px-3 py-2 rounded text-sm outline-none"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff' }}
        />
        <textarea
          placeholder="Share your research, evidence, questions, or counter-arguments..."
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          required
          rows={4}
          className="w-full px-3 py-2 rounded text-sm outline-none resize-none"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff' }}
        />
        <input
          type="text"
          placeholder="Tags (comma separated): UAP, Consciousness, Ancient"
          value={form.topic_tags}
          onChange={(e) => setForm({ ...form, topic_tags: e.target.value })}
          className="w-full px-3 py-2 rounded text-sm outline-none"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff' }}
        />
        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-2 px-4 py-2 rounded text-xs tracking-wider uppercase"
          style={{
            background: 'rgba(96,165,250,0.1)',
            border: '1px solid rgba(96,165,250,0.3)',
            color: '#60a5fa',
            fontFamily: 'Cinzel, Georgia, serif',
          }}
        >
          <Send size={12} />
          {submitting ? 'Posting...' : 'Post Thread'}
        </button>
      </form>

      {threads.map((thread) => (
        <div
          key={thread.id}
          className="p-4 rounded"
          style={{ background: 'rgba(96,165,250,0.03)', border: '1px solid rgba(96,165,250,0.1)' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs" style={{ color: '#60a5fa' }}>{thread.profiles?.username ?? 'Anonymous'}</span>
          </div>
          <h4 className="font-bold mb-2" style={{ fontFamily: 'Cinzel, Georgia, serif', color: '#ffffff' }}>
            {thread.title}
          </h4>
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.7)' }}>
            {thread.content}
          </p>
          {thread.topic_tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-1">
              {thread.topic_tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded"
                  style={{ background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.2)', color: '#60a5fa' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <CommentThread parentType="thread" parentId={thread.id} user={user} />
        </div>
      ))}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
const tabs = ['Sightings Feed', 'Synchronicity Journal', 'Research Threads'] as const;
type Tab = typeof tabs[number];

export default function CommunityPage() {
  const { user, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('Sightings Feed');

  if (loading) {
    return (
      <div className="section-container flex items-center justify-center">
        <div className="text-center" style={{ color: 'rgba(255,255,255,0.4)' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="section-container">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <SectionTitle
            eyebrow="Pantheon Observatory"
            title="Community"
            subtitle="Share sightings, synchronicities, and collaborative research with fellow seekers."
          />
        </motion.div>

        <AnimatePresence mode="wait">
          {!user ? (
            <motion.div
              key="auth"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AuthForm />
            </motion.div>
          ) : (
            <motion.div
              key="community"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* User Bar */}
              <div
                className="flex items-center justify-between mb-6 p-3 rounded"
                style={{ background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.1)' }}
              >
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Signed in as <span style={{ color: '#c9a84c' }}>{user.email}</span>
                </span>
                <button
                  onClick={signOut}
                  className="flex items-center gap-1.5 text-xs transition-colors"
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                >
                  <LogOut size={12} />
                  Sign Out
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 mb-6 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="px-4 py-2 text-xs tracking-wider uppercase rounded whitespace-nowrap transition-all"
                    style={{
                      background: activeTab === tab ? 'rgba(201,168,76,0.12)' : 'rgba(255,255,255,0.04)',
                      border: activeTab === tab ? '1px solid rgba(201,168,76,0.4)' : '1px solid rgba(255,255,255,0.07)',
                      color: activeTab === tab ? '#c9a84c' : 'rgba(255,255,255,0.5)',
                      fontFamily: 'Cinzel, Georgia, serif',
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'Sightings Feed' && <SightingsFeed userId={user.id} user={user} />}
                  {activeTab === 'Synchronicity Journal' && <SynchronicityJournal userId={user.id} user={user} />}
                  {activeTab === 'Research Threads' && <ResearchThreads userId={user.id} user={user} />}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
