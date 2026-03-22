'use client';
import { useState, useEffect } from 'react';

export default function LiveDrawCountdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 14, minutes: 32, seconds: 45 });

  useEffect(() => {
    // Next draw: 3 days from now
    const target = new Date();
    target.setDate(target.getDate() + 3);
    target.setHours(21, 0, 0, 0);

    const timer = setInterval(() => {
      const now = new Date();
      const diff = target.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Mins', value: timeLeft.minutes },
    { label: 'Secs', value: timeLeft.seconds },
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-deep-blue via-blue-900 to-deep-blue">
      <div className="container mx-auto px-4 text-center">
        <p className="text-gold text-sm font-bold uppercase tracking-widest mb-4">Next Mega Draw In</p>
        <div className="flex justify-center gap-4 sm:gap-6 mb-8">
          {units.map((u, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="bg-gold/10 border border-gold/30 rounded-xl w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
                <span className="text-2xl sm:text-3xl font-black text-white">{String(u.value).padStart(2, '0')}</span>
              </div>
              <span className="text-gold/70 text-xs mt-2 font-medium">{u.label}</span>
            </div>
          ))}
        </div>
        <div className="text-white text-xl sm:text-2xl font-bold mb-6">
          🎰 <span className="text-gold">₦50,000,000</span> Jackpot
        </div>
        <a
          href="/campaigns"
          className="inline-block bg-gold hover:bg-yellow-500 text-deep-blue font-bold px-10 py-4 rounded-full transition-colors text-lg"
        >
          Enter Now — ₦500/ticket
        </a>
      </div>
    </section>
  );
}
