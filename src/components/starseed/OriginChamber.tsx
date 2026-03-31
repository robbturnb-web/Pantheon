import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import QuizQuestion from './QuizQuestion';
import StarSeedResult from './StarSeedResult';
import { quizQuestions, starSeedArchetypes, calculateArchetype } from '../../data/starseed-archetypes';
import type { StarSeedId } from '../../types';

interface Props {
  onClose: () => void;
}

type Phase = 'intro' | 'quiz' | 'result';

export default function OriginChamber({ onClose }: Props) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<Record<number, string[]>>>({});
  const [resultId, setResultId] = useState<StarSeedId | null>(null);

  const handleAnswer = (optionLabel: string) => {
    const question = quizQuestions[currentQuestionIndex];
    const newAnswers = { ...answers, [question.id]: [optionLabel] };
    setAnswers(newAnswers);

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      const result = calculateArchetype(newAnswers);
      setResultId(result);
      setPhase('result');
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setResultId(null);
    setPhase('quiz');
  };

  const archetype = resultId ? starSeedArchetypes.find((a) => a.id === resultId) : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex: 100 }}
    >
      {/* Cosmic background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, #0d0020 0%, #030309 70%)',
        }}
      />

      {/* Galaxy animation overlay */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% 50%, rgba(147,51,234,0.15) 0%, transparent 60%),
            radial-gradient(circle at 20% 80%, rgba(201,168,76,0.08) 0%, transparent 40%),
            radial-gradient(circle at 80% 20%, rgba(96,165,250,0.06) 0%, transparent 40%)
          `,
        }}
      />

      {/* Rotating galaxy element */}
      <div
        className="absolute w-[800px] h-[800px] opacity-20 galaxy-rotate pointer-events-none"
        style={{
          background: 'conic-gradient(from 0deg, transparent 0%, rgba(147,51,234,0.3) 25%, transparent 50%, rgba(201,168,76,0.15) 75%, transparent 100%)',
          borderRadius: '50%',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full transition-colors"
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: 'rgba(255,255,255,0.6)',
          zIndex: 10,
        }}
      >
        <X size={18} />
      </button>

      {/* Content */}
      <div className="relative w-full max-h-screen overflow-y-auto py-16 px-4">
        <AnimatePresence mode="wait">
          {phase === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="max-w-lg mx-auto text-center"
            >
              <div className="text-5xl mb-6">✨</div>
              <p
                className="text-xs tracking-[0.3em] uppercase mb-4"
                style={{ color: '#c9a84c', fontFamily: 'Georgia, serif' }}
              >
                The Origin Chamber
              </p>
              <h2
                className="text-3xl sm:text-4xl font-bold mb-6"
                style={{ fontFamily: 'Georgia, serif', color: '#ffffff' }}
              >
                Discover Your<br />Starseed Origin
              </h2>
              <p
                className="text-sm leading-relaxed mb-10"
                style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
              >
                Three questions. Honest answers only.<br />
                The cosmos already knows who you are.
              </p>
              <button
                onClick={() => setPhase('quiz')}
                className="px-10 py-4 text-sm tracking-widest uppercase transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, rgba(147,51,234,0.4) 0%, rgba(107,33,168,0.4) 100%)',
                  border: '1px solid rgba(147,51,234,0.5)',
                  color: '#c084fc',
                  borderRadius: '2px',
                  fontFamily: 'Georgia, serif',
                  letterSpacing: '0.15em',
                  boxShadow: '0 0 30px rgba(147,51,234,0.15)',
                }}
              >
                Enter the Chamber
              </button>
            </motion.div>
          )}

          {phase === 'quiz' && (
            <AnimatePresence mode="wait">
              <QuizQuestion
                key={currentQuestionIndex}
                question={quizQuestions[currentQuestionIndex]}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={quizQuestions.length}
                onAnswer={handleAnswer}
              />
            </AnimatePresence>
          )}

          {phase === 'result' && archetype && (
            <StarSeedResult
              key="result"
              archetype={archetype}
              onRetake={handleRetake}
              onClose={onClose}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
