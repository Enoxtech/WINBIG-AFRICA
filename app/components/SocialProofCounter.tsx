'use client';
import { useState, useEffect, useRef } from 'react';

function AnimatedNumber({ end, duration = 2000 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setInView(true), { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

export default function SocialProofCounter() {
  return (
    <section className="py-16 bg-white border-y border-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { num: 25000, label: 'Nigerians Winning', suffix: '+', icon: '🇳🇬' },
            { num: 150, label: 'Campaigns Completed', suffix: '+', icon: '🎰' },
            { num: 500000000, label: 'Total Prizes Paid', suffix: '', prefix: '₦', icon: '💰' },
            { num: 99, label: 'Payout Rate', suffix: '%', icon: '✅' },
          ].map((stat, i) => (
            <div key={i} className="p-6">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl sm:text-3xl font-black text-deep-blue">
                {stat.prefix && <span className="text-gold">{stat.prefix}</span>}
                <AnimatedNumber end={stat.num} />
                <span className="text-gold">{stat.suffix}</span>
              </div>
              <div className="text-gray-500 text-sm mt-1 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
