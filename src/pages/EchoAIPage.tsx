import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Telescope } from 'lucide-react';
import { getContextGreeting, sendEchoMessage } from '../lib/echo-client';
import type { ChatMessage } from '../types';

const suggestedPrompts = [
  'What is the strongest evidence for non-human intelligence behind UAP phenomena?',
  'Compare Enki from Sumerian texts to the Biblical God — where do they diverge?',
  'Explain the CIA Gateway Process in plain language',
  'What should I watch / read to start researching UAP disclosure?',
  'What are the most credible unexplained ancient structures?',
];

export default function EchoAIPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: getContextGreeting('echo') }
  ]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const userMessage = (text ?? input).trim();
    if (!userMessage || streaming) return;
    setInput('');

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

  return (
    <div className="section-container flex flex-col" style={{ minHeight: '100vh' }}>
      <div className="max-w-3xl mx-auto w-full flex flex-col flex-1">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 pulse-gold"
            style={{
              background: 'rgba(201,168,76,0.1)',
              border: '1px solid rgba(201,168,76,0.4)',
            }}
          >
            <Telescope size={28} style={{ color: '#c9a84c' }} />
          </div>
          <p
            className="text-xs tracking-[0.3em] uppercase mb-2"
            style={{ color: '#c9a84c', fontFamily: 'Cinzel, Georgia, serif' }}
          >
            Pantheon Observatory
          </p>
          <h1
            className="text-4xl font-bold mb-3"
            style={{
              fontFamily: 'Cinzel, Georgia, serif',
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.7) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Echo AI
          </h1>
          <p
            className="text-sm max-w-md mx-auto"
            style={{ color: 'rgba(255,255,255,0.45)', fontStyle: 'italic', fontFamily: 'Cinzel, Georgia, serif' }}
          >
            Evidence-based exploration. Critical thinking guide. Multiple perspectives. Never one narrative.
          </p>
        </motion.div>

        {/* Messages */}
        <div
          className="flex-1 rounded p-5 mb-4 overflow-y-auto space-y-4"
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(201,168,76,0.12)',
            minHeight: '300px',
            maxHeight: '500px',
          }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className="max-w-[85%] px-4 py-3 rounded text-sm leading-relaxed"
                style={
                  msg.role === 'user'
                    ? {
                        background: 'rgba(201,168,76,0.12)',
                        border: '1px solid rgba(201,168,76,0.2)',
                        color: '#ffffff',
                      }
                    : {
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.07)',
                        color: 'rgba(255,255,255,0.85)',
                        fontFamily: 'Cinzel, Georgia, serif',
                        whiteSpace: 'pre-wrap',
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

        {/* Suggested Prompts */}
        {messages.length <= 1 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {suggestedPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => void handleSend(prompt)}
                disabled={streaming}
                className="px-3 py-1.5 rounded text-xs transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.55)',
                  textAlign: 'left',
                }}
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div
          className="flex gap-3 items-end"
          style={{ borderTop: '1px solid rgba(201,168,76,0.1)', paddingTop: '1rem' }}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Echo anything..."
            rows={2}
            disabled={streaming}
            className="flex-1 px-4 py-3 rounded text-sm outline-none resize-none"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#ffffff',
            }}
          />
          <button
            onClick={() => void handleSend()}
            disabled={!input.trim() || streaming}
            className="px-4 py-3 rounded flex items-center gap-2 text-sm tracking-wider uppercase transition-all"
            style={{
              background: input.trim() && !streaming ? 'linear-gradient(135deg, #c9a84c 0%, #8a6e2e 100%)' : 'rgba(255,255,255,0.06)',
              color: input.trim() && !streaming ? '#030309' : 'rgba(255,255,255,0.3)',
              fontFamily: 'Cinzel, Georgia, serif',
              letterSpacing: '0.1em',
            }}
          >
            <Send size={14} />
            Ask
          </button>
        </div>
      </div>

      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
    </div>
  );
}
