import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;       // 0→1, decreases each frame
  maxLife: number;
  size: number;
  hue: number;        // gold ~43, purple ~280
}

// Desktop-only: hides on touch devices via CSS, does nothing on touch
export default function CosmicCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const posRef = useRef({ x: -200, y: -200 });
  const rafRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const visibleRef = useRef(false);

  useEffect(() => {
    // Only enable on non-touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const cursor = cursorRef.current;
    const canvas = canvasRef.current;
    if (!cursor || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Size canvas
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (!visibleRef.current) {
        visibleRef.current = true;
        cursor.style.opacity = '1';
      }

      // Spawn 2-3 particles
      const count = 2 + Math.floor(Math.random() * 2);
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.5 + Math.random() * 1.5;
        particlesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.8,  // slight upward drift
          life: 1,
          maxLife: 0.025 + Math.random() * 0.03,  // life dec per frame (60fps → ~0.8s)
          size: 1.5 + Math.random() * 2.5,
          hue: Math.random() < 0.75 ? 43 : 280,   // 75% gold, 25% purple
        });
      }
    };

    const onLeave = () => {
      visibleRef.current = false;
      cursor.style.opacity = '0';
    };

    const onMouseOut = (event: MouseEvent) => {
      if (!event.relatedTarget) onLeave();
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseout', onMouseOut);

    // Animation loop
    const draw = () => {
      // Move crosshair dot
      const { x, y } = posRef.current;
      cursor.style.transform = `translate(${x - 12}px, ${y - 12}px)`;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update + draw particles
      particlesRef.current = particlesRef.current.filter((p) => p.life > 0);
      for (const p of particlesRef.current) {
        p.life -= p.maxLife;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04;  // slight gravity

        const alpha = p.life * 0.9;
        const radius = p.size * p.life;

        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.1, radius), 0, Math.PI * 2);

        // Gold or purple glow
        if (p.hue === 43) {
          ctx.fillStyle = `rgba(201, 168, 76, ${alpha})`;
        } else {
          ctx.fillStyle = `rgba(147, 51, 234, ${alpha * 0.85})`;
        }
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mouseout', onMouseOut);
    };
  }, []);

  return (
    <>
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 9999, mixBlendMode: 'screen' }}
      />

      {/* Gold crosshair dot */}
      <div
        ref={cursorRef}
        className="fixed pointer-events-none"
        style={{
          top: 0,
          left: 0,
          width: 24,
          height: 24,
          zIndex: 10000,
          opacity: 0,
          transition: 'opacity 0.2s',
        }}
      >
        {/* Center dot */}
        <div
          className="absolute"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: '#c9a84c',
            boxShadow: '0 0 6px 2px rgba(201,168,76,0.6)',
          }}
        />
        {/* Crosshair arms */}
        {/* Top */}
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 1, height: 8, background: 'rgba(201,168,76,0.7)' }} />
        {/* Bottom */}
        <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 1, height: 8, background: 'rgba(201,168,76,0.7)' }} />
        {/* Left */}
        <div style={{ position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)', width: 8, height: 1, background: 'rgba(201,168,76,0.7)' }} />
        {/* Right */}
        <div style={{ position: 'absolute', top: '50%', right: 0, transform: 'translateY(-50%)', width: 8, height: 1, background: 'rgba(201,168,76,0.7)' }} />
      </div>

      {/* Hide system cursor on desktop, but preserve cursor on text/interactive controls */}
      <style>{`
        @media (pointer: fine) {
          body,
          body *:not(input):not(textarea):not(button):not(select):not([role="textbox"]):not([contenteditable="true"]) {
            cursor: none !important;
          }
        }
      `}</style>
    </>
  );
}
