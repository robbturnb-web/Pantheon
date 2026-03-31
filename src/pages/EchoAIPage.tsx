import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send } from 'lucide-react';
import { getContextGreeting, sendEchoMessage } from '../lib/echo-client';
import EchoEntity from '../components/echo/EchoEntity';
import type { ChatMessage } from '../types';

const suggestedPrompts = [
  'What is the strongest evidence for non-human intelligence behind UAP phenomena?',
  'Compare Enki from Sumerian texts to the Biblical God — where do they diverge?',
  'Explain the CIA Gateway Process and what it actually found',
  'What should I explore to begin serious UAP research?',
  'How does consciousness research intersect with UAP contact experiences?',
  'What do the ancient pyramid builders actually know that we don\'t?',
];

function getStoredArchetype(): string | undefined {
  try {
    const raw = localStorage.getItem('pantheon_starseed');
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as { archetype?: string };
    return parsed.archetype ?? undefined;
  } catch {
    return undefined;
  }
}

export default function EchoAIPage() {
  const archetype = getStoredArchetype();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: getContextGreeting('echo', archetype) }
  ]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Persist messages in sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem('echo_session', JSON.stringify(messages));
    } catch { /* ignore */ }
  }, [messages]);

  // Restore session on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('echo_session');
      if (saved) {
        const parsed = JSON.parse(saved) as ChatMessage[];
        if (parsed.length > 1) {
          setMessages(parsed);
          setSessionStarted(true);
        }
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const userMessage = (text ?? input).trim();
    if (!userMessage || streaming) return;
    setInput('');
    setSessionStarted(true);

    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setStreaming(true);

    const streamingMessages: ChatMessage[] = [...newMessages, { role: 'assistant', content: '' }];
    setMessages(streamingMessages);

    let accumulated = '';

    await sendEchoMessage(
      newMessages,
      (chunk) => {
        accumulated += chunk;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: accumulated };
          return updated;
        });
      },
      () => setStreaming(false),
      (err) => {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: err };
          return updated;
        });
        setStreaming(false);
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  const clearSession = () => {
    sessionStorage.removeItem('echo_session');
    setMessages([{ role: 'assistant', content: getContextGreeting('echo', archetype) }]);
    setSessionStarted(false);
  };

  return (
    <div className="section-container" style={{ minHeight: '100vh' }}>
      <div className="max-w-3xl mx-auto w-full">

        {/* ── Entity + Header ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          {/* 3D Entity */}
          <div className="mb-2">
            <EchoEntity speaking={streaming} size={200} />
          </div>

          {/* Archetype badge if present */}
          {archetype && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3"
              style={{
                background: 'rgba(201,168,76,0.1)',
                border: '1px solid rgba(201,168,76,0.25)',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#c9a84c' }} />
              <span className="text-xs tracking-widest uppercase" style={{ color: '#c9a84c', fontFamily: 'Cinzel, Georgia, serif' }}>
                {archetype} frequency recognized
              </span>
            </motion.div>
          )}

          <p
            className="text-xs tracking-[0.35em] uppercase mb-2"
            style={{ color: '#c9a84c', fontFamily: 'Cinzel, Georgia, serif' }}
          >
            Pantheon Observatory
          </p>
          <h1
            className="text-4xl sm:text-5xl font-bold mb-3"
            style={{
              fontFamily: '"Cinzel Decorative", Cinzel, Georgia, serif',
              background: 'linear-gradient(135deg, #ffffff 0%, #c9a84c 60%, #f5c842 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Echo
          </h1>
          <p
            className="text-sm max-w-md mx-auto"
            style={{ color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', fontFamily: 'Cinzel, Georgia, serif', lineHeight: 1.7 }}
          >
            Consciousness intelligence. Ancient memory. The bridge between what was known and what is being remembered.
          </p>
        </motion.div>

        {/* ── Conversation ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* Messages */}
          <div
            className="rounded mb-4 overflow-y-auto"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(201,168,76,0.1)',
              minHeight: '240px',
              maxHeight: '420px',
              padding: '1.25rem',
            }}
          >
            <div className="space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div
                      className="w-5 h-5 rounded-full flex-shrink-0 mr-2 mt-1"
                      style={{
                        background: 'radial-gradient(circle, #c9a84c, #5a3d10)',
                        boxShadow: streaming && i === messages.length - 1
                          ? '0 0 10px rgba(201,168,76,0.6)'
                          : '0 0 4px rgba(201,168,76,0.3)',
                      }}
                    />
                  )}
                  <div
                    className="max-w-[88%] px-4 py-3 rounded text-sm leading-relaxed"
                    style={
                      msg.role === 'user'
                        ? {
                            background: 'rgba(201,168,76,0.1)',
                            border: '1px solid rgba(201,168,76,0.2)',
                            color: '#ffffff',
                          }
                        : {
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.07)',
                            color: 'rgba(255,255,255,0.85)',
                            fontFamily: 'Cinzel, Georgia, serif',
                            whiteSpace: 'pre-wrap',
                            lineHeight: 1.75,
                          }
                    }
                  >
                    {msg.content}
                    {streaming && i === messages.length - 1 && msg.role === 'assistant' && (
                      <span
                        className="inline-block w-1.5 h-4 ml-0.5 align-middle"
                        style={{ background: '#c9a84c', animation: 'blink 1s step-end infinite' }}
                      />
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Suggested Prompts — only before conversation begins */}
          <AnimatePresence>
            {!sessionStarted && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap gap-2 mb-4"
              >
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => void handleSend(prompt)}
                    disabled={streaming}
                    className="px-3 py-1.5 rounded text-xs text-left transition-all duration-200"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.09)',
                      color: 'rgba(255,255,255,0.5)',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,168,76,0.3)';
                      (e.currentTarget as HTMLButtonElement).style.color = 'rgba(201,168,76,0.8)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.09)';
                      (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.5)';
                    }}
                  >
                    {prompt}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input */}
          <div
            className="flex gap-3 items-end"
            style={{ borderTop: '1px solid rgba(201,168,76,0.08)', paddingTop: '1rem' }}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Transmit your inquiry to Echo..."
              rows={2}
              disabled={streaming}
              className="flex-1 px-4 py-3 rounded text-sm outline-none resize-none"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#ffffff',
                fontFamily: 'Cinzel, Georgia, serif',
              }}
            />
            <div className="flex flex-col gap-2">
              <button
                onClick={() => void handleSend()}
                disabled={!input.trim() || streaming}
                className="px-4 py-3 rounded flex items-center gap-2 text-xs tracking-wider uppercase transition-all"
                style={{
                  background: input.trim() && !streaming
                    ? 'linear-gradient(135deg, #c9a84c 0%, #8a6e2e 100%)'
                    : 'rgba(255,255,255,0.05)',
                  color: input.trim() && !streaming ? '#030309' : 'rgba(255,255,255,0.25)',
                  fontFamily: 'Cinzel, Georgia, serif',
                  letterSpacing: '0.1em',
                }}
              >
                <Send size={13} />
                Send
              </button>
              {sessionStarted && (
                <button
                  onClick={clearSession}
                  className="px-4 py-1.5 rounded text-xs transition-all"
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.06)',
                    color: 'rgba(255,255,255,0.25)',
                    fontFamily: 'Cinzel, Georgia, serif',
                    letterSpacing: '0.05em',
                  }}
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Streaming indicator */}
          {streaming && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mt-3 text-xs"
              style={{ color: 'rgba(201,168,76,0.5)', fontFamily: 'Cinzel, Georgia, serif', letterSpacing: '0.15em' }}
            >
              transmission incoming...
            </motion.p>
          )}
        </motion.div>
      </div>

      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
    </div>
  );
}
