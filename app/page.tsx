'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import dynamic from 'next/dynamic';

const Confetti = dynamic(() => import('canvas-confetti'), { ssr: false });

function AnimatedCounter({ end, suffix = '', prefix = '' }: { end: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

function ConfettiTrigger() {
  const [fired, setFired] = useState(false);
  useEffect(() => {
    if (fired || typeof window === 'undefined') return;
    setTimeout(() => {
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0, colors: ['#D4AF37', '#0B1F3A', '#ffffff', '#FFD700', '#FFC125'] };
      function shoot() {
        confetti({ ...defaults, particleCount: 50, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount: 50, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }
      function randomInRange(min: number, max: number) { return Math.random() * (max - min) + min; }
      const myConfetti = (window as any).confetti;
      if (myConfetti) { myConfetti.shoot = shoot; myConfetti(); setFired(true); }
    }, 500);
  }, [fired]);
  return null;
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const stats = [
    { value: 5000000, prefix: '₦', suffix: '+', label: 'Total Won', icon: '💰' },
    { value: 25000, suffix: '+', label: 'Active Players', icon: '👥' },
    { value: 120, suffix: '+', label: 'Campaigns Completed', icon: '🎯' },
    { value: 98, suffix: '%', label: 'Payout Rate', icon: '✅' },
  ];

  const steps = [
    { num: '01', icon: '📋', title: 'Sign Up', desc: 'Create your free account in seconds. No hidden fees.' },
    { num: '02', icon: '🎟️', title: 'Buy a Ticket', desc: 'Pick a campaign and purchase your raffle ticket(s).' },
    { num: '03', icon: '🎉', title: 'Wait for Draw', desc: 'Live draws happen weekly. Your name could be next!' },
    { num: '04', icon: '🏆', title: 'Win & Celebrate', desc: 'Winners are announced instantly. Withdraw winnings fast!' },
  ];

  const testimonials = [
    { name: 'Chioma A.', city: 'Lagos', text: 'I won ₦500,000 on my third ticket! The thrill is unreal. Already planning my next entry 😍', avatar: 'C' },
    { name: 'Emeka N.', city: 'Abuja', text: 'Toyota Camry winner here! I still can\'t believe it. The process was smooth from start to finish. 🚗', avatar: 'E' },
    { name: 'Funke O.', city: 'Ibadan', text: 'Been playing for 6 months and finally won the ₦1M weekly draw. Thank you WINBIG! 🙌', avatar: 'F' },
  ];

  return (
    <div className="relative overflow-hidden">
      {mounted && <ConfettiTrigger />}

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-deep-blue" />
        <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.4) 0%, transparent 60%)' }} />
        {/* Animated orbs */}
        <motion.div
          animate={{ x: [0, 60, 0], y: [0, -40, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/4 w-72 h-72 bg-gold/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl"
        />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          {/* Badge */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-8"
          >
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 bg-gold rounded-full"
            />
            <span className="text-gold text-sm font-medium">Live Draws Every Week</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="text-5xl sm:text-7xl font-black text-white leading-tight mb-4"
          >
            Your Dreams Start
            <br />
            <span className="bg-gradient-to-r from-gold via-yellow-300 to-gold bg-clip-text text-transparent bg-[length:200%_auto] animate-pulse">
              With One Ticket
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto mb-10"
          >
            Nigeria&apos;s most trusted lottery platform. Win life-changing prizes from as little as ₦100. New winners every week.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.65, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/campaigns">
              <motion.button
                whileHover={{ scale: 1.06, boxShadow: '0 0 40px rgba(212,175,55,0.5)' }}
                whileTap={{ scale: 0.96 }}
                className="relative bg-gold text-deep-blue font-black text-base px-10 py-4 rounded-2xl overflow-hidden group"
              >
                <span className="relative z-10">Enter a Campaign</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-gold to-yellow-300"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  style={{ width: '100%', backgroundSize: '200% 100%' }}
                />
              </motion.button>
            </Link>
            <Link href="/about">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                className="border-2 border-white/30 text-white font-semibold text-base px-10 py-4 rounded-2xl hover:border-gold hover:text-gold transition-all"
              >
                How It Works
              </motion.button>
            </Link>
          </motion.div>

          {/* Trust signals */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-gray-500 text-sm mt-6"
          >
            🔒 Secured by Supabase &nbsp;|&nbsp; ⚡ Instant Payouts &nbsp;|&nbsp; 🇳🇬 Made in Nigeria
          </motion.p>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-3 bg-gold rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div className="text-3xl mb-1">{stat.icon}</div>
                <div className="text-3xl sm:text-4xl font-black text-deep-blue">
                  <AnimatedCounter end={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </div>
                <div className="text-gray-500 text-sm font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIVE CAMPAIGNS ── */}
      <section id="campaigns" className="bg-light-gray py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-gold font-semibold text-sm uppercase tracking-wider">Act Now</span>
            <h2 className="section-title mt-2">Live Campaigns</h2>
            <p className="text-gray-500 mt-2 max-w-xl mx-auto">Grab your ticket before time runs out. Every draw is live and transparent.</p>
          </motion.div>

          <CampaignCards />

          <div className="text-center mt-10">
            <Link href="/campaigns">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                className="bg-deep-blue text-white font-semibold px-8 py-3 rounded-xl hover:bg-deep-blue/90 transition-colors"
              >
                View All Campaigns →
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="bg-deep-blue py-20">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-gold font-semibold text-sm uppercase tracking-wider">Simple Process</span>
            <h2 className="text-4xl font-bold text-white mt-2">How It Works</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-colors"
              >
                <div className="text-5xl mb-4">{step.icon}</div>
                <div className="text-gold font-black text-sm mb-2">{step.num}</div>
                <h3 className="text-white font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WINNERS TICKER ── */}
      <WinnerTicker />

      {/* ── TESTIMONIALS ── */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-gold font-semibold text-sm uppercase tracking-wider">Real Winners</span>
            <h2 className="section-title mt-2">What Winners Say</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-light-gray rounded-2xl p-6 border border-gray-100"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center text-deep-blue font-bold text-sm">{t.avatar}</div>
                  <div>
                    <div className="font-semibold text-deep-blue text-sm">{t.name}</div>
                    <div className="text-gray-400 text-xs">{t.city}</div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <div className="text-gold text-sm mt-3">★★★★★</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="bg-deep-blue py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
              Ready to Try Your Luck?
            </h2>
            <p className="text-gray-400 text-lg mb-8">Join 25,000+ players who are already winning big. Your turn is next.</p>
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.06, boxShadow: '0 0 40px rgba(212,175,55,0.5)' }}
                whileTap={{ scale: 0.96 }}
                className="bg-gold text-deep-blue font-black text-lg px-12 py-4 rounded-2xl"
              >
                Create Free Account
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// ── Campaign Cards ──
function CampaignCards() {
  const [campaigns, setCampaigns] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/campaigns')
      .then(r => r.json())
      .then(d => setCampaigns(Array.isArray(d) ? d.slice(0, 3) : []))
      .catch(() => {});
  }, []);

  if (!campaigns.length) return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-gray-100" />
      ))}
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {campaigns.map((c, i) => {
        const pct = Math.round((c.sold_tickets / c.total_tickets) * 100);
        const ends = new Date(c.end_date);
        const days = Math.max(0, Math.ceil((ends.getTime() - Date.now()) / 86400000));
        return (
          <motion.div
            key={c.id}
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-shadow"
          >
            <div className="h-44 bg-gray-200 relative overflow-hidden">
              <img src={c.image_url} alt={c.title} className="w-full h-full object-cover" />
              {c.status === 'active' && (
                <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  🔴 LIVE
                </span>
              )}
              {pct > 85 && (
                <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  Almost Full!
                </span>
              )}
            </div>
            <div className="p-5">
              <h3 className="font-bold text-deep-blue text-base mb-1">{c.title}</h3>
              <p className="text-gray-400 text-xs mb-3">{pct}% tickets sold · {days}d left</p>
              {/* Progress bar */}
              <div className="w-full h-2 bg-gray-100 rounded-full mb-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                  className="h-full bg-gradient-to-r from-gold to-yellow-400 rounded-full"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Ticket: <strong className="text-deep-blue">₦{c.ticket_price.toLocaleString()}</strong></span>
                <Link href={`/campaigns/${c.id}`}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gold text-deep-blue font-semibold text-xs px-4 py-2 rounded-xl"
                  >
                    Enter →
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ── Winner Ticker ──
function WinnerTicker() {
  const winners = [
    { name: 'Chioma A.', prize: '₦500,000', city: 'Lagos', time: '2h ago' },
    { name: 'Emeka N.', prize: 'Toyota Camry 2025', city: 'Abuja', time: '5h ago' },
    { name: 'Funke O.', prize: '₦1,000,000', city: 'Ibadan', time: '1d ago' },
    { name: 'Segun K.', prize: 'iPhone 16 Pro Max', city: 'Port Harcourt', time: '1d ago' },
    { name: 'Aisha M.', prize: '₦250,000', city: 'Kano', time: '2d ago' },
    { name: 'Olumide T.', prize: '₦5,000,000', city: 'Lagos', time: '3d ago' },
  ];

  return (
    <div className="bg-gold/10 border-y border-gold/20 py-6 overflow-hidden">
      <div className="flex gap-8 animate-[scroll_30s_linear_infinite] whitespace-nowrap">
        {[...winners, ...winners].map((w, i) => (
          <span key={i} className="inline-flex items-center gap-2 text-deep-blue font-medium text-sm">
            🏆 <strong>{w.name}</strong> from {w.city} won <strong>{w.prize}</strong>
            <span className="text-gray-400 text-xs">· {w.time}</span>
            <span className="mx-4 text-gold">✦</span>
          </span>
        ))}
      </div>
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
