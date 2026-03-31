import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface Comment {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles?: { username: string };
}

interface Props {
  parentType: 'sighting' | 'synchronicity' | 'thread';
  parentId: string;
  user: User | null;
}

export default function CommentThread({ parentType, parentId, user }: Props) {
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const load = async () => {
    if (loaded) return;
    const { data } = await supabase
      .from('comments')
      .select('*, profiles(username)')
      .eq('parent_type', parentType)
      .eq('parent_id', parentId)
      .order('created_at', { ascending: true });
    setComments((data as Comment[]) ?? []);
    setLoaded(true);
  };

  useEffect(() => {
    if (open) void load();
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;
    setSubmitting(true);
    const { data } = await supabase
      .from('comments')
      .insert({ parent_type: parentType, parent_id: parentId, content, user_id: user.id })
      .select('*, profiles(username)')
      .single();
    if (data) setComments([...comments, data as Comment]);
    setContent('');
    setSubmitting(false);
  };

  return (
    <div className="mt-3">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-xs transition-colors"
        style={{ color: 'rgba(255,255,255,0.35)' }}
      >
        <MessageCircle size={12} />
        {comments.length > 0 || loaded
          ? `${comments.length} comment${comments.length !== 1 ? 's' : ''}`
          : 'Reply'}
        {open ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-2 pl-3" style={{ borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
              {comments.map((c) => (
                <div key={c.id} className="text-xs">
                  <span style={{ color: '#c9a84c' }}>{c.profiles?.username ?? 'Anonymous'}</span>
                  <span style={{ color: 'rgba(255,255,255,0.25)' }}> · </span>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>{c.content}</span>
                </div>
              ))}

              {user ? (
                <form onSubmit={(e) => void handleSubmit(e)} className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Add a reply..."
                    className="flex-1 px-2 py-1.5 rounded text-xs outline-none"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: '#ffffff',
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!content.trim() || submitting}
                    className="px-2 py-1.5 rounded transition-all"
                    style={{
                      background: content.trim() ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.04)',
                      color: content.trim() ? '#c9a84c' : 'rgba(255,255,255,0.2)',
                    }}
                  >
                    <Send size={11} />
                  </button>
                </form>
              ) : (
                <p className="text-xs pt-1" style={{ color: 'rgba(255,255,255,0.25)', fontStyle: 'italic' }}>
                  Sign in to reply
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
