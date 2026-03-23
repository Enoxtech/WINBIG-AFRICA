'use client';
import { useState, useEffect } from 'react';

export default function JackpotSpotlight() {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Next Friday at 9:00 PM WAT (UTC+1)
    const target = new Date();
    const dayOfWeek = target.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
    const daysUntilFriday = (5 - dayOfWeek + 7) % 7 || 7;
    target.setDate(target.getDate() + daysUntilFriday);
    target.setHours(21, 0, 0, 0);

    const timer = setInterval(() => {
      const now = new Date();
      const diff = target.getTime() - now.getTime();
      if (diff <= 0) { clearInterval(timer); return; }
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 bg-deep-blue relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-400 rounded-full blur-3xl" />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-10">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-block bg-gold text-deep-blue text-xs font-black px-4 py-1 rounded-full mb-4">
              🎰 MEGA JACKPOT
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4">
              ₦50,000,000
            </h2>
            <p className="text-gray-300 text-lg mb-6">This Friday&apos;s guaranteed jackpot. Don&apos;t miss your chance to change your life forever.</p>
            <a href="/campaigns" className="inline-block bg-gold hover:bg-yellow-400 text-deep-blue font-black px-10 py-4 rounded-full transition-colors text-lg">
              Enter Now
            </a>
          </div>
          <div className="flex-shrink-0">
            <p className="text-gold text-sm font-bold uppercase tracking-widest text-center mb-4">Draw Starts In</p>
            <div className="grid grid-cols-4 gap-3">
              {[
                { v: countdown.days, l: 'Days' },
                { v: countdown.hours, l: 'Hours' },
                { v: countdown.minutes, l: 'Mins' },
                { v: countdown.seconds, l: 'Secs' },
              ].map((u, i) => (
                <div key={i} className="text-center">
                  <div className="bg-white/10 border border-white/20 rounded-xl w-16 h-16 flex items-center justify-center">
                    <span className="text-2xl font-black text-white">{String(u.v).padStart(2, '0')}</span>
                  </div>
                  <span className="text-gray-400 text-xs mt-1 block">{u.l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
