import type { EvidenceGrade } from '../../types';

interface Props {
  grade: EvidenceGrade;
  size?: 'sm' | 'md';
}

const config: Record<EvidenceGrade, { icon: string; label: string; bg: string; text: string; border: string }> = {
  DOCUMENTED: {
    icon: '🟢',
    label: 'DOCUMENTED',
    bg: 'rgba(22, 101, 52, 0.3)',
    text: '#86efac',
    border: 'rgba(34, 197, 94, 0.3)',
  },
  CREDIBLE: {
    icon: '🟡',
    label: 'CREDIBLE',
    bg: 'rgba(113, 63, 18, 0.3)',
    text: '#fde68a',
    border: 'rgba(234, 179, 8, 0.3)',
  },
  SPECULATIVE: {
    icon: '🟠',
    label: 'SPECULATIVE',
    bg: 'rgba(124, 45, 18, 0.3)',
    text: '#fed7aa',
    border: 'rgba(249, 115, 22, 0.3)',
  },
  UNVERIFIED: {
    icon: '🔴',
    label: 'UNVERIFIED',
    bg: 'rgba(127, 29, 29, 0.3)',
    text: '#fca5a5',
    border: 'rgba(239, 68, 68, 0.3)',
  },
};

export default function EvidenceBadge({ grade, size = 'md' }: Props) {
  const c = config[grade];
  const small = size === 'sm';

  return (
    <span
      className="inline-flex items-center gap-1 font-mono rounded"
      style={{
        background: c.bg,
        color: c.text,
        border: `1px solid ${c.border}`,
        fontSize: small ? '10px' : '11px',
        padding: small ? '1px 6px' : '2px 8px',
        letterSpacing: '0.08em',
        fontWeight: 600,
      }}
    >
      <span style={{ fontSize: small ? '9px' : '10px' }}>{c.icon}</span>
      {c.label}
    </span>
  );
}
