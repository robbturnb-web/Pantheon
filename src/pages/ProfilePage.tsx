import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { User, Star, Eye, BookOpen, MessageSquare, LogOut, Edit2, Check, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

interface Profile {
  id: string;
  username: string | null;
  starseed_archetype: string | null;
  bio: string | null;
  created_at: string;
}

interface ActivityStats {
  sightings: number;
  synchronicities: number;
  threads: number;
  comments: number;
}

const ARCHETYPE_SYMBOLS: Record<string, string> = {
  pleiadian: '✦',
  arcturian: '◈',
  sirian: '⬟',
  lyran: '⚡',
  orion: '⊕',
  anunnaki: '𒀭',
};

const ARCHETYPE_COLORS: Record<string, string> = {
  pleiadian: '#7dd3fc',
  arcturian: '#a78bfa',
  sirian: '#6ee7b7',
  lyran: '#fcd34d',
  orion: '#f97316',
  anunnaki: '#c9a84c',
};

export default function ProfilePage() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<ActivityStats>({ sightings: 0, synchronicities: 0, threads: 0, comments: 0 });
  const [editingBio, setEditingBio] = useState(false);
  const [editingUsername, setEditingUsername] = useState(false);
  const [bioInput, setBioInput] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [saving, setSaving] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/community');
    }
  }, [user, loading, navigate]);

  // Load profile
  useEffect(() => {
    if (!user) return;

    const load = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setProfile(data as Profile);
        setBioInput(data.bio ?? '');
        setUsernameInput(data.username ?? '');
      }

      // Load activity counts
      const [sightingsRes, syncRes, threadsRes, commentsRes] = await Promise.all([
        supabase.from('sightings').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('synchronicities').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('research_threads').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('comments').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      ]);

      setStats({
        sightings: sightingsRes.count ?? 0,
        synchronicities: syncRes.count ?? 0,
        threads: threadsRes.count ?? 0,
        comments: commentsRes.count ?? 0,
      });
    };

    void load();
  }, [user]);

  const saveBio = async () => {
    if (!user) return;
    setSaving(true);
    await supabase.from('profiles').upsert({ id: user.id, bio: bioInput });
    setProfile((p) => p ? { ...p, bio: bioInput } : p);
    setEditingBio(false);
    setSaving(false);
  };

  const saveUsername = async () => {
    if (!user) return;
    setSaving(true);
    await supabase.from('profiles').upsert({ id: user.id, username: usernameInput });
    setProfile((p) => p ? { ...p, username: usernameInput } : p);
    setEditingUsername(false);
    setSaving(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading || !user) return null;

  const archetype = profile?.starseed_archetype?.toLowerCase();
  const archetypeColor = archetype ? (ARCHETYPE_COLORS[archetype] ?? '#c9a84c') : '#c9a84c';
  const archetypeSymbol = archetype ? (ARCHETYPE_SYMBOLS[archetype] ?? '✦') : null;

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    : '';

  return (
    <div className="section-container">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color: '#c9a84c', fontFamily: 'Cinzel, Georgia, serif' }}>
            Pantheon Observatory
          </p>
          <h1
            className="text-4xl font-bold"
            style={{
              fontFamily: '"Cinzel Decorative", Cinzel, Georgia, serif',
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.7) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Your Profile
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* ── Left Column: Identity ──────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-1 space-y-4"
          >
            {/* Avatar circle */}
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto md:mx-0"
              style={{
                background: `radial-gradient(circle at 35% 35%, ${archetypeColor}30, rgba(3,3,9,0.8))`,
                border: `1px solid ${archetypeColor}50`,
                boxShadow: `0 0 30px ${archetypeColor}20`,
              }}
            >
              {archetypeSymbol ? (
                <span className="text-3xl" style={{ color: archetypeColor }}>
                  {archetypeSymbol}
                </span>
              ) : (
                <User size={36} style={{ color: 'rgba(255,255,255,0.4)' }} />
              )}
            </div>

            {/* Username */}
            <div>
              {editingUsername ? (
                <div className="flex items-center gap-2">
                  <input
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded text-sm outline-none"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(201,168,76,0.3)', color: '#fff' }}
                    autoFocus
                  />
                  <button onClick={saveUsername} disabled={saving} style={{ color: '#c9a84c' }}>
                    <Check size={16} />
                  </button>
                  <button onClick={() => setEditingUsername(false)} style={{ color: 'rgba(255,255,255,0.4)' }}>
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <p className="text-lg font-semibold" style={{ fontFamily: 'Cinzel, Georgia, serif', color: '#fff' }}>
                    {profile?.username ?? 'Anonymous'}
                  </p>
                  <button onClick={() => setEditingUsername(true)} style={{ color: 'rgba(255,255,255,0.3)' }}>
                    <Edit2 size={13} />
                  </button>
                </div>
              )}
              <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
                {user.email}
              </p>
              {memberSince && (
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.25)', fontFamily: 'Cinzel, Georgia, serif' }}>
                  Member since {memberSince}
                </p>
              )}
            </div>

            {/* Starseed archetype */}
            {archetype ? (
              <div
                className="p-3 rounded"
                style={{ background: `${archetypeColor}10`, border: `1px solid ${archetypeColor}25` }}
              >
                <p className="text-xs tracking-widest uppercase mb-1" style={{ color: archetypeColor, fontFamily: 'Cinzel, Georgia, serif' }}>
                  Starseed Origin
                </p>
                <p className="text-sm font-semibold capitalize" style={{ color: archetypeColor }}>
                  {archetypeSymbol} {archetype}
                </p>
              </div>
            ) : (
              <Link
                to="/"
                className="block p-3 rounded text-center text-xs transition-all"
                style={{
                  background: 'rgba(201,168,76,0.05)',
                  border: '1px dashed rgba(201,168,76,0.2)',
                  color: 'rgba(201,168,76,0.6)',
                  fontFamily: 'Cinzel, Georgia, serif',
                  letterSpacing: '0.1em',
                }}
              >
                Discover your Starseed origin →
              </Link>
            )}

            {/* Sign out */}
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 py-2 rounded text-xs tracking-wider uppercase transition-all"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.4)',
                fontFamily: 'Cinzel, Georgia, serif',
              }}
            >
              <LogOut size={13} />
              Sign Out
            </button>
          </motion.div>

          {/* ── Right Column: Activity + Bio ──────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-2 space-y-5"
          >
            {/* Activity stats */}
            <div
              className="p-5 rounded"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <p className="text-xs tracking-widest uppercase mb-4" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Cinzel, Georgia, serif' }}>
                Observatory Activity
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Sightings', value: stats.sightings, icon: Eye, color: '#c9a84c' },
                  { label: 'Synchronicities', value: stats.synchronicities, icon: Star, color: '#c084fc' },
                  { label: 'Threads', value: stats.threads, icon: BookOpen, color: '#60a5fa' },
                  { label: 'Comments', value: stats.comments, icon: MessageSquare, color: '#34d399' },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div
                    key={label}
                    className="p-3 rounded text-center"
                    style={{ background: `${color}08`, border: `1px solid ${color}15` }}
                  >
                    <Icon size={16} className="mx-auto mb-1" style={{ color }} />
                    <p className="text-xl font-bold" style={{ color, fontFamily: 'Cinzel, Georgia, serif' }}>
                      {value}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bio */}
            <div
              className="p-5 rounded"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Cinzel, Georgia, serif' }}>
                  Your Signal
                </p>
                {!editingBio && (
                  <button onClick={() => setEditingBio(true)} style={{ color: 'rgba(255,255,255,0.3)' }}>
                    <Edit2 size={13} />
                  </button>
                )}
              </div>

              {editingBio ? (
                <div className="space-y-2">
                  <textarea
                    value={bioInput}
                    onChange={(e) => setBioInput(e.target.value)}
                    rows={4}
                    placeholder="Share what you're researching, what you believe, or where you're from..."
                    className="w-full px-3 py-2 rounded text-sm outline-none resize-none"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(201,168,76,0.25)',
                      color: '#fff',
                      fontFamily: 'Cinzel, Georgia, serif',
                    }}
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={saveBio}
                      disabled={saving}
                      className="px-4 py-1.5 rounded text-xs tracking-wider"
                      style={{
                        background: 'rgba(201,168,76,0.15)',
                        border: '1px solid rgba(201,168,76,0.3)',
                        color: '#c9a84c',
                        fontFamily: 'Cinzel, Georgia, serif',
                      }}
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => { setEditingBio(false); setBioInput(profile?.bio ?? ''); }}
                      className="px-4 py-1.5 rounded text-xs"
                      style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Cinzel, Georgia, serif' }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p
                  className="text-sm leading-relaxed"
                  style={{
                    color: profile?.bio ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.25)',
                    fontFamily: 'Cinzel, Georgia, serif',
                    fontStyle: profile?.bio ? 'normal' : 'italic',
                  }}
                >
                  {profile?.bio ?? 'Add a bio — share your focus, your frequency, your seeking...'}
                </p>
              )}
            </div>

            {/* Quick links */}
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/community"
                className="p-4 rounded text-center transition-all"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)', fontFamily: 'Cinzel, Georgia, serif', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase' }}
              >
                Community Hub
              </Link>
              <Link
                to="/echo"
                className="p-4 rounded text-center transition-all"
                style={{ background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.15)', color: 'rgba(201,168,76,0.7)', fontFamily: 'Cinzel, Georgia, serif', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase' }}
              >
                Talk to Echo
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
