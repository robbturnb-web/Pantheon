interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}

export default function SectionTitle({ eyebrow, title, subtitle }: Props) {
  return (
    <div className="text-center mb-12">
      {eyebrow && (
        <p
          className="text-xs tracking-[0.3em] uppercase mb-3"
          style={{ color: '#c9a84c', fontFamily: 'Georgia, serif' }}
        >
          {eyebrow}
        </p>
      )}
      <h1
        className="text-4xl sm:text-5xl font-bold mb-4"
        style={{
          fontFamily: 'Georgia, serif',
          background: 'linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.7) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          className="text-sm max-w-xl mx-auto"
          style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
