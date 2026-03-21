'use client';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const PARTICLE_COUNT = 28;

export default function Particles() {
  const containerRef = useRef<HTMLDivElement>(null);

  const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1.5,
    duration: Math.random() * 6 + 5,
    delay: Math.random() * 5,
    dx: (Math.random() - 0.5) * 30,
    dy: (Math.random() - 0.5) * 30,
  }));

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          animate={{
            x: [p.x + '%', `calc(${p.x}% + ${p.dx}px)`, p.x + '%'],
            y: [p.y + '%', `calc(${p.y}% + ${p.dy}px)`, p.y + '%'],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: '#D4AF37',
            boxShadow: '0 0 6px rgba(212,175,55,0.5)',
          }}
        />
      ))}
    </div>
  );
}
