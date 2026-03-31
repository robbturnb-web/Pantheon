import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Telescope } from 'lucide-react';
import { useSection } from '../../hooks/useSection';
import { getContextGreeting, sendEchoMessage } from '../../lib/echo-client';
import type { ChatMessage } from '../../types';

interface OpenEchoEvent extends CustomEvent {
  detail: { context?: string; prompt?: string };
}

export default function EchoAI() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const section = useSection();

  // Initialize with context greeting when first opened
  useEffect(() => {
    if (open && !initialized) {
      const greeting = getContextGreeting(section);
      setMessages([{ role: 'assistant', content: greeting }]);
      setInitialized(true);
    }
  }, [open, initialized, section]);

  // Reset greeting when section changes and chat is closed
  useEffect(() => {
    if (!open) {
      setInitialized(false);
    }
  }, [section, open]);

  // Listen for external open-echo events (from "Ask Echo" buttons)
  useEffect(() => {
    const handler = (e: Event) => {
      const event = e as OpenEchoEvent;
      const { prompt } = event.detail;
      setOpen(true);
      if (prompt) {
        setInput(prompt);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    };
    window.addEventListener('open-echo', handler);
    return () => window.removeEventListener('open-echo', handler);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || streaming) return;
    const userMessage = input.trim();
    setInput('');

    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setStreaming(true);

    // Add empty assistant message for streaming
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

  return (
    <>
      {/* Floating Button */}
      <motion.button
        className="fixed bottom-6 right-4 sm:right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center pulse-gold fixed-bottom-safe"
        style={{
          background: 'linear-gradient(135deg, #c9a84c 0%, #8a6e2e 100%)',
          boxShadow: '0 4px 24px rgba(201,168,76,0.4)',
          border: '1px solid rgba(201,168,76,0.6)',
        }}
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open Echo AI"
      >
        {open
          ? <X size={20} style={{ color: '#030309' }} />
          : <Telescope size={20} style={{ color: '#030309' }} />
        }
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 right-3 sm:right-6 z-50 flex flex-col echo-panel-mobile"
            style={{
              width: 'min(380px, calc(100vw - 1.5rem))',
              height: 'min(480px, calc(100dvh - 8rem))',
              background: 'linear-gradient(135deg, #0a0a1a 0%, #12122a 100%)',
              border: '1px solid rgba(201,168,76,0.3)',
              borderRadius: '12px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 30px rgba(201,168,76,0.08)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-3 px-4 py-3"
              style={{ borderBottom: '1px solid rgba(201,168,76,0.12)' }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)' }}
              >
                <Telescope size={14} style={{ color: '#c9a84c' }} />
              </div>
              <div>
                <p
                  className="text-sm font-semibold"
                  style={{ fontFamily: 'Georgia, serif', color: '#c9a84c' }}
                >
                  Echo
                </p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  Pantheon Observatory AI
                </p>
              </div>
              <button
                className="ml-auto"
                onClick={() => setOpen(false)}
                style={{ color: 'rgba(255,255,255,0.3)' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className="max-w-[85%] px-3 py-2 rounded text-sm leading-relaxed"
                    style={
                      msg.role === 'user'
                        ? {
                            background: 'rgba(201,168,76,0.15)',
                            border: '1px solid rgba(201,168,76,0.2)',
                            color: '#ffffff',
                          }
                        : {
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            color: 'rgba(255,255,255,0.85)',
                            fontFamily: 'Georgia, serif',
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

            {/* Input */}
            <div
              className="px-3 py-3"
              style={{ borderTop: '1px solid rgba(201,168,76,0.12)' }}
            >
              <div className="flex gap-2 items-end">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Echo anything..."
                  rows={1}
                  disabled={streaming}
                  className="flex-1 px-3 py-2 rounded text-sm outline-none resize-none"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#ffffff',
                    maxHeight: '80px',
                    overflowY: 'auto',
                  }}
                />
                <button
                  onClick={() => void handleSend()}
                  disabled={!input.trim() || streaming}
                  className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0 transition-all"
                  style={{
                    background: input.trim() && !streaming ? '#c9a84c' : 'rgba(255,255,255,0.1)',
                    color: input.trim() && !streaming ? '#030309' : 'rgba(255,255,255,0.3)',
                  }}
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
    </>
  );
}
