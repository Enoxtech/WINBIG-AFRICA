'use client';
import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: string | Date;
  className?: string;
  onExpire?: () => void;
}

export default function CountdownTimer({ targetDate, className = '', onExpire }: CountdownTimerProps) {
  const [diff, setDiff] = useState(0);

  useEffect(() => {
    const target = new Date(targetDate).getTime();
    const tick = () => {
      const now = Date.now();
      const d = target - now;
      setDiff(d > 0 ? d : 0);
      if (d <= 0 && onExpire) onExpire();
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate, onExpire]);

  if (diff <= 0) return <span className={className}>Ended</span>;

  const totalSec = Math.floor(diff / 1000);
  const d = Math.floor(totalSec / 86400);
  const h = Math.floor((totalSec % 86400) / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;

  if (d > 0) return <span className={className}>{d}d {h}h {m}m</span>;
  if (h > 0) return <span className={className}>{h}h {m}m {s}s</span>;
  if (m > 0) return <span className={className}>{m}m {s}s</span>;
  return <span className={className}>{s}s</span>;
}
