'use client';
import { useEffect, useRef, useState } from 'react';

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; opacity: number; size: number; dx: number; dy: number }[] = [];
    const MAX = 25;

    function onMove(e: MouseEvent) {
      for (let i = 0; i < 3; i++) {
        particles.push({
          x: e.clientX,
          y: e.clientY,
          opacity: 1,
          size: Math.random() * 4 + 2,
          dx: (Math.random() - 0.5) * 2,
          dy: (Math.random() - 0.5) * 2,
        });
      }
      while (particles.length > MAX) particles.shift();
    }

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.x += p.dx;
        p.y += p.dy;
        p.opacity -= 0.035;
        if (p.opacity <= 0) { particles.splice(i, 1); return; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212,175,55,${p.opacity})`;
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }

    window.addEventListener('mousemove', onMove);
    draw();
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  if (!mounted) return null;
  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
