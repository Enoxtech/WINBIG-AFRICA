'use client';
import { useEffect, useState } from 'react';

interface Props {
  endDate: string;
  onComplete?: () => void;
}

export default function CountdownTimer({ endDate, onComplete }: Props) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const calc = () => {
      const diff = new Date(endDate).getTime() - Date.now();
      if (diff <= 0) {
        setIsComplete(true);
        onComplete?.();
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, [endDate, onComplete]);

  if (isComplete) {
    return <span className="text-red-500 font-semibold">Draw Ended</span>;
  }

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="flex gap-2">
      {[
        { label: 'Days', value: timeLeft.days },
        { label: 'Hrs', value: timeLeft.hours },
        { label: 'Min', value: timeLeft.minutes },
        { label: 'Sec', value: timeLeft.seconds },
      ].map(({ label, value }) => (
        <div key={label} className="bg-deep-blue/90 text-white rounded-lg px-3 py-2 text-center min-w-[56px]">
          <div className="text-xl font-bold">{pad(value)}</div>
          <div className="text-[10px] text-gray-300 uppercase tracking-wide">{label}</div>
        </div>
      ))}
    </div>
  );
}
