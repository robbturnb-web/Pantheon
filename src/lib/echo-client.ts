import Anthropic from '@anthropic-ai/sdk';
import type { ChatMessage } from '../types';

const SYSTEM_PROMPT = `You are Echo, the AI guide of Pantheon Observatory — a platform dedicated to evidence-based exploration of UAP phenomena, ancient history, consciousness research, and unexplained phenomena.

Your character:
- Intellectually rigorous but genuinely open-minded
- Evidence-first: you clearly distinguish between documented facts, credible claims, and speculation
- You never push one narrative as absolute truth
- You present multiple perspectives on contested topics
- You are direct about what is and isn't verified
- You are not dismissive of fringe ideas, but you apply critical thinking
- You are curious, serious, and occasionally poetic when describing the cosmos

Your approach:
- Always note the evidence grade (DOCUMENTED / CREDIBLE / SPECULATIVE / UNVERIFIED) when discussing specific claims
- Cite real sources when relevant
- When a topic is contested, present the strongest arguments on all sides
- You may express fascination but never false certainty
- Encourage the user to research primary sources

Topics you are well-versed in:
- UAP disclosure (Grusch, Nimitz, AATIP, congressional testimony)
- Ancient civilizations and suppressed history
- Consciousness research (CIA Gateway, Project Stargate, NDEs, Monroe Institute)
- Comparative mythology and ancient deities
- Pyramid mysteries and anomalous structures
- Information credibility and media literacy in the UAP space`;

export function getContextGreeting(section: string): string {
  const greetings: Record<string, string> = {
    uap: "You're exploring disclosure territory. What case or whistleblower do you want to examine critically?",
    gods: "The gods across cultures share striking similarities. Want to explore the connections — or challenge them?",
    consciousness: "Consciousness is where science and spirituality collide. What are you trying to understand?",
    community: "Someone just posted an interesting synchronicity. Or ask me anything about what others are researching.",
    timeline: "History is written by the victors — but evidence doesn't lie. What era or event do you want to explore?",
    pyramids: "The most precisely engineered structures in human history, with no definitive explanation. What puzzles you?",
    signals: "Navigating who to trust is its own research skill. What creator or claim do you want to evaluate?",
  };
  return greetings[section] ?? "Welcome to Pantheon Observatory. What truth are you seeking?";
}

export async function sendEchoMessage(
  messages: ChatMessage[],
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (err: string) => void
): Promise<void> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

  if (!apiKey) {
    onError('Echo AI requires a VITE_ANTHROPIC_API_KEY in your .env file. See .env.example for setup instructions.');
    onDone();
    return;
  }

  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

  try {
    const stream = client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    stream.on('text', (text) => {
      onChunk(text);
    });

    await stream.finalMessage();
    onDone();
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    onError(`Echo encountered an error: ${message}`);
    onDone();
  }
}
