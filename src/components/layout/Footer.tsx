import { Telescope } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      className="relative z-10 border-t py-10 px-6"
      style={{ borderColor: 'rgba(201,168,76,0.15)', background: 'rgba(3,3,9,0.9)' }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Logo + tagline */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="flex items-center gap-2">
            <Telescope size={18} style={{ color: '#c9a84c' }} />
            <span
              className="text-sm tracking-widest uppercase"
              style={{ color: '#c9a84c', fontFamily: 'Georgia, serif' }}
            >
              Pantheon Observatory
            </span>
          </div>
          <p className="text-xs text-center max-w-md" style={{ color: 'rgba(255,255,255,0.4)' }}>
            "Open Inquiry. Critical Thinking. Evidence-Based Exploration. Respect for Mystery."
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6 text-xs mb-8" style={{ color: 'rgba(255,255,255,0.4)' }}>
          <a href="#community-guidelines" className="hover:text-gold transition-colors" style={{ color: 'inherit' }}>
            Community Guidelines
          </a>
          <a href="#evidence-standards" className="hover:text-gold transition-colors" style={{ color: 'inherit' }}>
            Evidence Standards
          </a>
          <a href="#about" className="hover:text-gold transition-colors" style={{ color: 'inherit' }}>
            About
          </a>
          <a href="#contact" className="hover:text-gold transition-colors" style={{ color: 'inherit' }}>
            Contact
          </a>
        </div>

        {/* Social icons */}
        <div className="flex justify-center gap-4 mb-8">
          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X (Twitter)"
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            style={{ border: '1px solid rgba(201,168,76,0.3)', color: 'rgba(255,255,255,0.5)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a
            href="https://reddit.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Reddit"
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            style={{ border: '1px solid rgba(201,168,76,0.3)', color: 'rgba(255,255,255,0.5)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
            </svg>
          </a>
        </div>

        <p className="text-center text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
          Pantheon Observatory © 2026
        </p>
      </div>
    </footer>
  );
}
