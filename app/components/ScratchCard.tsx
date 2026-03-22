'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScratchCardProps {
  prizeText?: string;
  prizeEmoji?: string;
  bgColor?: string;
  width?: number;
  height?: number;
}

export default function ScratchCard({
  prizeText = 'YOU WON ₦500,000!',
  prizeEmoji = '🎉',
  bgColor = '#D4AF37',
  width = 320,
  height = 200,
}: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scratched, setScratched] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [scratchCount, setScratchCount] = useState(0);
  const isDrawing = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Draw scratch overlay
    const drawOverlay = () => {
      // Gold gradient background for scratch layer
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#D4AF37');
      gradient.addColorStop(0.5, '#B8960C');
      gradient.addColorStop(1, '#D4AF37');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Add texture pattern
      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      for (let i = 0; i < 60; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        ctx.beginPath();
        ctx.arc(x, y, Math.random() * 3 + 1, 0, Math.PI * 2);
        ctx.fill();
      }

      // Text
      ctx.fillStyle = 'rgba(11, 31, 58, 0.7)';
      ctx.font = 'bold 22px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('💨 Scratch to reveal!', width / 2, height / 2);

      // Subtext
      ctx.font = '12px system-ui, sans-serif';
      ctx.fillStyle = 'rgba(11, 31, 58, 0.5)';
      ctx.fillText('Reveal your prize below', width / 2, height / 2 + 24);
    };

    drawOverlay();
  }, [width, height]);

  const getCanvasCoordinates = (canvas: HTMLCanvasElement, e: MouseEvent | TouchEvent) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    let clientX: number, clientY: number;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const scratch = (canvas: HTMLCanvasElement, x: number, y: number) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 28, 0, Math.PI * 2);
    ctx.fill();

    // Also scratch a trail between last and current position
    if (lastPos.current.x && lastPos.current.y) {
      ctx.lineWidth = 40;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    lastPos.current = { x, y };
    setScratchCount((c) => c + 1);
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (scratched || revealed) return;
    e.preventDefault();
    isDrawing.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const coords = getCanvasCoordinates(canvas, e.nativeEvent as MouseEvent | TouchEvent);
    scratch(canvas, coords.x, coords.y);
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current || scratched || revealed) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const coords = getCanvasCoordinates(canvas, e.nativeEvent as MouseEvent | TouchEvent);
    scratch(canvas, coords.x, coords.y);
  };

  const handleEnd = () => {
    isDrawing.current = false;
    lastPos.current = { x: 0, y: 0 };

    // Check if enough is scratched
    const canvas = canvasRef.current;
    if (!canvas || revealed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparent = 0;
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] < 128) transparent++;
    }
    const percent = (transparent / (pixels.length / 4)) * 100;

    if (percent > 60) {
      setScratched(true);
      setTimeout(() => setRevealed(true), 600);
    }
  };

  return (
    <div className="relative inline-block" style={{ width, maxWidth: '100%' }}>
      {/* Prize reveal area */}
      <div
        className="rounded-2xl flex flex-col items-center justify-center border-2 border-gold/30"
        style={{
          width,
          height,
          maxWidth: '100%',
          background: 'linear-gradient(135deg, #0B1F3A 0%, #1a3a5c 100%)',
        }}
      >
        <AnimatePresence>
          {revealed ? (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center px-4"
            >
              <div className="text-5xl mb-2">{prizeEmoji}</div>
              <div className="text-gold font-black text-lg leading-tight">{prizeText}</div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center px-4"
            >
              <div className="text-4xl mb-2">🍀</div>
              <div className="text-white font-bold text-sm">Scratch the card above!</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scratch canvas overlay */}
      {!revealed && (
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            borderRadius: '1rem',
            cursor: 'crosshair',
            width: '100%',
            height: '100%',
          }}
          className="touch-none"
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        />
      )}

      {/* Scratch progress hint */}
      {!scratched && !revealed && (
        <div className="text-center mt-2">
          <span className="text-xs text-gray-400">
            {scratchCount === 0 ? 'Hover and drag to scratch' : `Keep scratching...`}
          </span>
        </div>
      )}

      {/* Auto-reveal button */}
      {!revealed && (
        <button
          onClick={() => { setScratched(true); setTimeout(() => setRevealed(true), 600); }}
          className="mt-2 text-xs text-gold/60 hover:text-gold underline"
        >
          Reveal prize
        </button>
      )}
    </div>
  );
}
