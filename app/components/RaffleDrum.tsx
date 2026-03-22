'use client';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Ball {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  number: number;
  size: number;
}

interface RaffleDrumProps {
  maxNumber?: number;
  containerSize?: number;
}

export default function RaffleDrum({ maxNumber = 40, containerSize = 400 }: RaffleDrumProps) {
  const [balls, setBalls] = useState<Ball[]>([]);
  const [isSpinning, setIsSpinning] = useState(true);
  const animationRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize balls
    const initialBalls: Ball[] = Array.from({ length: Math.min(maxNumber, 40) }, (_, i) => ({
      id: i,
      x: Math.random() * (containerSize - 60) + 10,
      y: Math.random() * (containerSize - 60) + 10,
      vx: (Math.random() - 0.5) * 6,
      vy: (Math.random() - 0.5) * 6,
      number: i + 1,
      size: 44 + Math.random() * 12,
    }));
    setBalls(initialBalls);

    const container = containerRef.current;
    if (!container) return;

    let frame = 0;
    const animate = () => {
      frame++;
      setBalls((prev) =>
        prev.map((ball) => {
          let { x, y, vx, vy } = ball;
          const r = ball.size / 2;

          // Apply velocity with friction
          vx *= 0.992;
          vy *= 0.992;

          // Add slight random turbulence
          if (frame % 8 === 0) {
            vx += (Math.random() - 0.5) * 0.4;
            vy += (Math.random() - 0.5) * 0.4;
          }

          x += vx;
          y += vy;

          // Bounce off walls
          if (x < r) { x = r; vx = Math.abs(vx) * 0.8; }
          if (x > containerSize - r) { x = containerSize - r; vx = -Math.abs(vx) * 0.8; }
          if (y < r) { y = r; vy = Math.abs(vy) * 0.8; }
          if (y > containerSize - r) { y = containerSize - r; vy = -Math.abs(vy) * 0.8; }

          return { ...ball, x, y, vx, vy };
        })
      );
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [maxNumber, containerSize]);

  const ballColors = [
    '#D4AF37', '#FFD700', '#FFA500', '#FF8C00', '#B8860B',
    '#DAA520', '#F0C040', '#E6B800', '#CC9900', '#B8860B',
  ];

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        ref={containerRef}
        style={{ width: containerSize, height: containerSize, maxWidth: '100%' }}
        className="relative rounded-full overflow-hidden"
      >
        {/* Drum background */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-deep-blue to-matte-black border-4 border-gold/40 shadow-2xl shadow-gold/10" />

        {/* Glass overlay */}
        <div className="absolute inset-0 rounded-full bg-white/5 backdrop-blur-[2px]" />

        {/* Spinning balls */}
        {balls.map((ball) => (
          <motion.div
            key={ball.id}
            className="absolute rounded-full flex items-center justify-center font-black text-deep-blue shadow-lg"
            style={{
              width: ball.size,
              height: ball.size,
              left: ball.x - ball.size / 2,
              top: ball.y - ball.size / 2,
              background: `radial-gradient(circle at 30% 30%, ${ballColors[ball.id % ballColors.length]}, ${ballColors[(ball.id + 3) % ballColors.length]})`,
              border: '2px solid rgba(255,255,255,0.3)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.4)',
              zIndex: Math.floor(ball.y),
            }}
            animate={{
              x: [0, 2, -2, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2 + (ball.id % 5) * 0.3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <span className="text-xs" style={{ fontSize: Math.max(8, ball.size * 0.28) }}>
              {ball.number}
            </span>
          </motion.div>
        ))}

        {/* Drum shine overlay */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsSpinning((s) => !s)}
          className="px-6 py-2.5 bg-gold text-deep-blue rounded-full font-bold text-sm hover:bg-yellow-400 transition-colors shadow-lg shadow-gold/30"
        >
          {isSpinning ? '⏸ Pause Drum' : '▶ Spin Drum'}
        </button>
        <span className="text-sm text-gray-400">
          {balls.length} balls mixing
        </span>
      </div>
    </div>
  );
}
