'use client';
import { useEffect, useRef, useState } from 'react';

interface TrailPoint { x: number; y: number; id: number; opacity: number }

export default function CursorTrail() {
  const [points, setPoints] = useState<TrailPoint[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      idRef.current++;
      setPoints(prev => {
        const next = [...prev, { x: e.clientX, y: e.clientY, id: idRef.current, opacity: 1 }];
        return next.slice(-20);
      });
    };

    const fade = setInterval(() => {
      setPoints(prev =>
        prev
          .map(p => ({ ...p, opacity: p.opacity - 0.12 }))
          .filter(p => p.opacity > 0)
      );
    }, 50);

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      clearInterval(fade);
    };
  }, []);

  if (typeof window === 'undefined') return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9998]" aria-hidden>
      {points.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: p.x,
            top: p.y,
            transform: 'translate(-50%, -50%)',
            opacity: p.opacity,
            width: Math.max(4, p.opacity * 10),
            height: Math.max(4, p.opacity * 10),
            borderRadius: '50%',
            background: '#D4AF37',
            boxShadow: `0 0 ${p.opacity * 8}px #D4AF37`,
            transition: 'opacity 0.05s',
          }}
        />
      ))}
    </div>
  );
}
