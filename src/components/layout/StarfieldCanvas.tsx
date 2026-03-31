import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  z: number;
  prevX: number;
  prevY: number;
}

const NUM_STARS = 400;
const FOV = 400;
const SPEED = 0.0015;

function randomStar(): Star {
  return {
    x: (Math.random() - 0.5) * 2,
    y: (Math.random() - 0.5) * 2,
    z: Math.random(),
    prevX: 0,
    prevY: 0,
  };
}

export default function StarfieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    starsRef.current = Array.from({ length: NUM_STARS }, randomStar);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener('mousemove', handleMouseMove);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const parallaxX = mouseRef.current.x * 15;
      const parallaxY = mouseRef.current.y * 15;

      ctx.fillStyle = 'rgba(3, 3, 9, 0.25)';
      ctx.fillRect(0, 0, w, h);

      for (const star of starsRef.current) {
        star.prevX = (star.x / star.z) * FOV + cx + parallaxX;
        star.prevY = (star.y / star.z) * FOV + cy + parallaxY;

        star.z -= SPEED;

        if (star.z <= 0.01) {
          star.x = (Math.random() - 0.5) * 2;
          star.y = (Math.random() - 0.5) * 2;
          star.z = 1;
          star.prevX = (star.x / star.z) * FOV + cx + parallaxX;
          star.prevY = (star.y / star.z) * FOV + cy + parallaxY;
          continue;
        }

        const sx = (star.x / star.z) * FOV + cx + parallaxX;
        const sy = (star.y / star.z) * FOV + cy + parallaxY;

        if (sx < 0 || sx > w || sy < 0 || sy > h) {
          star.x = (Math.random() - 0.5) * 2;
          star.y = (Math.random() - 0.5) * 2;
          star.z = 1;
          continue;
        }

        const radius = Math.max(0.1, (1 - star.z) * 2.5);
        const alpha = Math.min(1, (1 - star.z) * 1.5);

        // Draw trail
        ctx.beginPath();
        ctx.moveTo(star.prevX, star.prevY);
        ctx.lineTo(sx, sy);
        ctx.strokeStyle = `rgba(255, 255, 240, ${alpha * 0.4})`;
        ctx.lineWidth = radius * 0.5;
        ctx.stroke();

        // Draw star dot
        ctx.beginPath();
        ctx.arc(sx, sy, radius, 0, Math.PI * 2);

        // Color: mostly white, occasional gold/purple tint
        const rand = (star.x + star.y + 1) * 100 % 10;
        if (rand < 1) {
          ctx.fillStyle = `rgba(201, 168, 76, ${alpha})`;
        } else if (rand < 2) {
          ctx.fillStyle = `rgba(147, 51, 234, ${alpha * 0.7})`;
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        }
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, backgroundColor: '#030309' }}
    />
  );
}
