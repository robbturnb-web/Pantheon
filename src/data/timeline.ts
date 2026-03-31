export interface TimelineEntry {
  id: string;
  era: string;
  year: string;
  title: string;
  description: string;
  category: 'ancient' | 'medieval' | 'modern' | 'recent';
  significance: 'high' | 'medium' | 'low';
}

export const timelineEntries: TimelineEntry[] = [
  {
    id: '1',
    era: '~300,000 BCE',
    year: '-300000',
    title: 'Anatomically Modern Humans',
    description: 'Homo sapiens emerge in Africa. Archaeological record shows sudden cognitive leap — abstract art, symbolic thinking, complex language.',
    category: 'ancient',
    significance: 'high',
  },
  {
    id: '2',
    era: '~12,000 BCE',
    year: '-12000',
    title: 'Göbekli Tepe',
    description: 'The world\'s oldest known megastructure is built in modern-day Turkey — 6,000 years before Stonehenge. Carved pillars depict animals and symbols. No city, no agriculture found nearby. Who built it, and why?',
    category: 'ancient',
    significance: 'high',
  },
  {
    id: '3',
    era: '~10,500 BCE',
    year: '-10500',
    title: 'The Younger Dryas Impact Event',
    description: 'Evidence of a cosmic impact or series of impacts triggers 1,200 years of rapid cooling, megafauna extinction, and possibly the end of an advanced pre-flood civilization — preserved in flood myths across every culture.',
    category: 'ancient',
    significance: 'high',
  },
  {
    id: '4',
    era: '~3100 BCE',
    year: '-3100',
    title: 'Sumerian Civilization',
    description: 'The first known writing system, legal code, astronomy, mathematics, and cosmology emerge simultaneously in Sumer. The Enuma Elish describes the creation of humans by the Anunnaki. Cuneiform tablets describe planetary knowledge requiring telescopes to verify.',
    category: 'ancient',
    significance: 'high',
  },
  {
    id: '5',
    era: '~2560 BCE',
    year: '-2560',
    title: 'Great Pyramid of Giza',
    description: 'The most precisely engineered structure in human history is completed. Aligned to true north within 3/60th of a degree. The pi relationship, the speed of light, and the dimensions of Earth are encoded in its mathematics. No tool marks, no workers\' village matching scale.',
    category: 'ancient',
    significance: 'high',
  },
  {
    id: '6',
    era: '1440s',
    year: '1440',
    title: 'Gutenberg Press & Suppressed Knowledge',
    description: 'The printing press democratizes information — and immediately triggers systematic book burning, inquisition, and control of the narrative by the Church. What was destroyed before copies could be made?',
    category: 'medieval',
    significance: 'medium',
  },
  {
    id: '7',
    era: '1947',
    year: '1947',
    title: 'Roswell and the Birth of Secrecy',
    description: 'A crash near Roswell triggers the modern UFO era. Within 24 hours, the U.S. military retracts its own press release. The National Security Act of 1947 creates the CIA and establishes the framework for compartmentalized secret programs.',
    category: 'modern',
    significance: 'high',
  },
  {
    id: '8',
    era: '1952',
    year: '1952',
    title: 'Washington D.C. UFO Flap',
    description: 'UFOs fly directly over the U.S. Capitol, tracked on multiple radar systems, witnessed by pilots and air traffic controllers. The Air Force holds its largest press conference since WWII. Topic immediately classified.',
    category: 'modern',
    significance: 'high',
  },
  {
    id: '9',
    era: '1972–1995',
    year: '1972',
    title: 'Project Stargate',
    description: 'The U.S. government funds a 23-year classified program to weaponize psychic abilities. Remote viewers produce operationally actionable intelligence on Soviet nuclear facilities and more.',
    category: 'modern',
    significance: 'high',
  },
  {
    id: '10',
    era: '2017',
    year: '2017',
    title: 'Pentagon UAP Disclosure Begins',
    description: 'The New York Times publishes the first mainstream acknowledgment of a secret Pentagon UAP program (AATIP). The era of official denial ends. Three declassified videos confirm encounters that defy known physics.',
    category: 'recent',
    significance: 'high',
  },
  {
    id: '11',
    era: '2023',
    year: '2023',
    title: 'Congressional UAP Hearings',
    description: 'David Grusch testifies under oath that the U.S. government possesses non-human intelligence craft and biologics. Three credentialed witnesses testify before the House Oversight Committee. The UAP Disclosure Act is introduced in the Senate.',
    category: 'recent',
    significance: 'high',
  },
];
