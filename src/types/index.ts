export type EvidenceGrade = 'DOCUMENTED' | 'CREDIBLE' | 'SPECULATIVE' | 'UNVERIFIED';

export type StarSeedId = 'pleiadian' | 'arcturian' | 'sirian' | 'lyran' | 'orion' | 'anunnaki';

export type SignalRating = 'GREEN' | 'YELLOW' | 'RED';

export type PantheonFilter = 'All' | 'Greek' | 'Norse' | 'Egyptian' | 'Hindu' | 'Anunnaki' | 'Starseed';

export interface God {
  id: string;
  name: string;
  pantheon: Exclude<PantheonFilter, 'All'>;
  domains: string[];
  archetypeRole: string;
  reflectionQuestion: string;
  atmosphericBg: string;
  atmosphericDesc: string;
  symbol: string;
}

export interface TimelineEvent {
  year: string;
  description: string;
}

export interface UAPCase {
  id: string;
  title: string;
  date: string;
  grade: EvidenceGrade;
  summary: string;
  officialExplanation: string;
  alternativeExplanation: string;
  sources: string[];
  timeline: TimelineEvent[];
  accuracyTracker?: string;
}

export interface ConsciousnessSection {
  id: string;
  title: string;
  subtitle: string;
  grade: EvidenceGrade;
  summary: string;
  keyFacts: string[];
  sourceNote: string;
}

export interface Creator {
  id: string;
  name: string;
  platform: string;
  description: string;
  rating: SignalRating;
  ratingNote: string;
}

export interface StarSeedArchetype {
  id: StarSeedId;
  name: string;
  subtitle: string;
  coreTraits: string[];
  missionStatement: string;
  symbol: string;
  cosmicBg: string;
  accentColor: string;
}

export interface QuizQuestion {
  id: number;
  text: string;
  options: QuizOption[];
}

export interface QuizOption {
  label: string;
  weights: Partial<Record<StarSeedId, number>>;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface Sighting {
  id: string;
  user_id: string;
  date: string;
  location: string;
  description: string;
  photo_url?: string;
  upvotes: number;
  created_at: string;
  profiles?: { username: string };
}

export interface Synchronicity {
  id: string;
  user_id: string;
  content: string;
  upvotes: number;
  created_at: string;
  profiles?: { username: string };
}

export interface ResearchThread {
  id: string;
  user_id: string;
  title: string;
  content: string;
  topic_tags: string[];
  created_at: string;
  profiles?: { username: string };
}
