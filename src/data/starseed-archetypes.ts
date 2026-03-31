import type { StarSeedArchetype, QuizQuestion } from '../types';

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    text: 'What pulls you toward the unknown?',
    options: [
      {
        label: 'Truth & Justice',
        weights: { orion: 3, sirian: 2 },
      },
      {
        label: 'Healing & Light',
        weights: { pleiadian: 3, sirian: 1 },
      },
      {
        label: 'Ancient Wisdom',
        weights: { sirian: 3, anunnaki: 2 },
      },
      {
        label: 'Technology & Logic',
        weights: { arcturian: 3, orion: 1 },
      },
      {
        label: 'Cosmic Connection',
        weights: { pleiadian: 2, lyran: 2, arcturian: 1 },
      },
      {
        label: 'All of the Above',
        weights: { pleiadian: 1, arcturian: 1, sirian: 1, lyran: 1, orion: 1, anunnaki: 1 },
      },
    ],
  },
  {
    id: 2,
    text: 'How do you process the world?',
    options: [
      {
        label: 'Through feelings and intuition',
        weights: { pleiadian: 3, sirian: 1 },
      },
      {
        label: 'Through patterns and data',
        weights: { arcturian: 3, orion: 2 },
      },
      {
        label: 'Through ancient stories',
        weights: { anunnaki: 3, sirian: 2 },
      },
      {
        label: 'Through direct experience',
        weights: { lyran: 3, pleiadian: 1 },
      },
      {
        label: 'Through questioning everything',
        weights: { orion: 3, arcturian: 1 },
      },
    ],
  },
  {
    id: 3,
    text: 'What is your primary mission on Earth?',
    options: [
      {
        label: 'Expose the truth',
        weights: { orion: 3, sirian: 1 },
      },
      {
        label: 'Heal and nurture',
        weights: { pleiadian: 3, sirian: 1 },
      },
      {
        label: 'Build and create',
        weights: { anunnaki: 3, arcturian: 2 },
      },
      {
        label: 'Seek and discover',
        weights: { lyran: 3, arcturian: 1 },
      },
      {
        label: 'Unite and inspire',
        weights: { pleiadian: 2, lyran: 2, sirian: 1 },
      },
    ],
  },
];

export const starSeedArchetypes: StarSeedArchetype[] = [
  {
    id: 'pleiadian',
    name: 'Pleiadian',
    subtitle: 'The Healer',
    coreTraits: [
      'Deeply empathic — you feel others\' pain as your own',
      'Driven by love and emotional truth',
      'Here to heal humanity at a collective level',
      'Sensitive to environments and energies',
      'Naturally drawn to spiritual and healing arts',
    ],
    missionStatement: 'You are a bridge between cosmic love and human suffering. Your presence alone raises the vibrational frequency of every room you enter. Your mission is not to save everyone — it is to model unconditional compassion.',
    symbol: '✨',
    cosmicBg: 'linear-gradient(135deg, #001a3d 0%, #003380 40%, #0a1a4d 100%)',
    accentColor: '#60a5fa',
  },
  {
    id: 'arcturian',
    name: 'Arcturian',
    subtitle: 'The Architect',
    coreTraits: [
      'Logic-dominant, systems thinker',
      'Drawn to technology, mathematics, and higher mind',
      'Here to build new systems that serve all of humanity',
      'May struggle with emotional expression',
      'Natural engineer of consciousness and civilization',
    ],
    missionStatement: 'You are not here to fit into the old world — you are here to design the next one. Your mind operates at a frequency that sees the underlying code of reality. Trust the systems you are being shown.',
    symbol: '⬡',
    cosmicBg: 'linear-gradient(135deg, #001a00 0%, #003300 40%, #0a2a1a 100%)',
    accentColor: '#4ade80',
  },
  {
    id: 'sirian',
    name: 'Sirian',
    subtitle: 'The Guardian',
    coreTraits: [
      'Strong sense of justice and protection',
      'Keeper of ancient wisdom and sacred knowledge',
      'Loyal, steadfast, willing to stand alone for truth',
      'Natural guardian of people, places, and sacred traditions',
      'Connection to Sirius and ancient Egypt',
    ],
    missionStatement: 'You came to guard what cannot be allowed to disappear. Ancient knowledge, sacred sites, the rights of the vulnerable — these are your domain. You are the sentinel between what was and what must continue.',
    symbol: '🌟',
    cosmicBg: 'linear-gradient(135deg, #1a0d00 0%, #3d2200 40%, #2a1500 100%)',
    accentColor: '#fbbf24',
  },
  {
    id: 'lyran',
    name: 'Lyran',
    subtitle: 'The Pioneer',
    coreTraits: [
      'Bold, independent, freedom-oriented',
      'First to explore new territory — physical and metaphysical',
      'Creative fire burns hot; difficulty with routine',
      'Natural leader when a cause ignites them',
      'One of the oldest soul lineages in the galaxy',
    ],
    missionStatement: 'You are from the first — the original explorers who seeded life across star systems. Routine suffocates you because you were built for frontiers. Your mission is to go where others won\'t and bring back what matters.',
    symbol: '🔥',
    cosmicBg: 'linear-gradient(135deg, #1a0000 0%, #3d0a00 40%, #2a0500 100%)',
    accentColor: '#f97316',
  },
  {
    id: 'orion',
    name: 'Orion',
    subtitle: 'The Seeker',
    coreTraits: [
      'Obsessive truth-hunter; cannot stop asking why',
      'Exceptional pattern recognition',
      'Drawn to disclosure, suppressed history, hidden knowledge',
      'May struggle with trust — truth has been weaponized against you',
      'The most relentless investigator in the cosmos',
    ],
    missionStatement: 'The truth is not a destination — it is a practice. You were born with a lie detector for the universe itself. Your mission is not to find the final answer but to never stop asking the question, even when it costs you.',
    symbol: '🔭',
    cosmicBg: 'linear-gradient(135deg, #1a001a 0%, #3d003d 40%, #200020 100%)',
    accentColor: '#c084fc',
  },
  {
    id: 'anunnaki',
    name: 'Anunnaki Legacy',
    subtitle: 'The Builder',
    coreTraits: [
      'Aware of ancient bloodlines and their implications',
      'Structural power — sees how civilizations rise and fall',
      'Uncomfortable with surface-level explanations',
      'Drawn to ancient Sumerian and pre-Flood civilizations',
      'Feels the weight of consequence across generations',
    ],
    missionStatement: 'You carry the blueprint. Something in you recognizes structures — of power, of civilization, of DNA itself — that others walk past blindly. The Anunnaki Legacy is not a burden: it is access. Use what you know to build something worthy of the next 10,000 years.',
    symbol: '🏛️',
    cosmicBg: 'linear-gradient(135deg, #1a1000 0%, #3d2a00 40%, #2a1a00 100%)',
    accentColor: '#d97706',
  },
];

import type { StarSeedId } from '../types';

export function calculateArchetype(answers: Partial<Record<number, string[]>>): StarSeedId {
  const scores: Record<StarSeedId, number> = {
    pleiadian: 0,
    arcturian: 0,
    sirian: 0,
    lyran: 0,
    orion: 0,
    anunnaki: 0,
  };

  for (const question of quizQuestions) {
    const selected = answers[question.id] ?? [];
    for (const optionLabel of selected) {
      const option = question.options.find((o) => o.label === optionLabel);
      if (option) {
        for (const [archetype, weight] of Object.entries(option.weights) as [StarSeedId, number][]) {
          scores[archetype] += weight;
        }
      }
    }
  }

  const top = (Object.entries(scores) as [StarSeedId, number][]).sort((a, b) => b[1] - a[1]);
  return top[0][0];
}
