import { motion } from 'framer-motion';
import type { QuizQuestion as QuizQuestionType } from '../../types';

interface Props {
  question: QuizQuestionType;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (optionLabel: string) => void;
}

export default function QuizQuestion({ question, questionNumber, totalQuestions, onAnswer }: Props) {
  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="max-w-2xl mx-auto w-full px-4"
    >
      {/* Progress */}
      <div className="flex items-center gap-3 justify-center mb-10">
        {Array.from({ length: totalQuestions }).map((_, i) => (
          <div
            key={i}
            className="h-1 rounded-full transition-all duration-500"
            style={{
              width: i < questionNumber ? '32px' : '20px',
              background: i < questionNumber
                ? '#c9a84c'
                : i === questionNumber - 1
                  ? 'rgba(201,168,76,0.6)'
                  : 'rgba(255,255,255,0.15)',
            }}
          />
        ))}
      </div>

      {/* Question */}
      <h2
        className="text-2xl sm:text-3xl text-center mb-10 font-medium"
        style={{
          fontFamily: 'Cinzel, Georgia, serif',
          color: 'rgba(255,255,255,0.95)',
          lineHeight: 1.4,
          textShadow: '0 0 30px rgba(201,168,76,0.2)',
        }}
      >
        {question.text}
      </h2>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {question.options.map((option, i) => (
          <motion.button
            key={option.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            onClick={() => onAnswer(option.label)}
            className="group px-5 py-4 rounded text-left transition-all duration-200"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(201,168,76,0.15)',
              color: 'rgba(255,255,255,0.8)',
              fontFamily: 'Cinzel, Georgia, serif',
            }}
            whileHover={{
              background: 'rgba(201,168,76,0.1)',
              borderColor: 'rgba(201,168,76,0.5)',
              color: '#ffffff',
            }}
          >
            <span className="text-sm leading-relaxed">{option.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
