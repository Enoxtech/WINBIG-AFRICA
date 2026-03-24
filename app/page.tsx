'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Particles from './components/Particles';
import UrgencyBanner from './components/UrgencyBanner';
import TrustBadges from './components/TrustBadges';
import AffiliateBanner from './components/AffiliateBanner';
import JackpotSpotlight from './components/JackpotSpotlight';
import HowItWorks from './components/HowItWorks';
import AppDownloadBanner from './components/AppDownloadBanner';
import { getCampaigns } from '@/lib/mockData';

const Confetti = dynamic(() => import('canvas-confetti'), { ssr: false });

const blurDataURL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFhAJ/wlseKgAAAABJRU5ErkJggg==';

function AnimatedCounter({ end, suffix = '', prefix = '', formatFn }: { end: number; suffix?: string; prefix?: string; formatFn?: (n: number) => string }) {
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

  const display = formatFn ? formatFn(count) : `${prefix}${count.toLocaleString()}${suffix}`;
  return <span ref={ref}>{display}</span>;
}

function ConfettiTrigger() {
  const [fired, setFired] = useState(false);
  useEffect(() => {
    if (fired || typeof window === 'undefined') return;
    setTimeout(() => {
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0, colors: ['#D4AF37', '#0B1F3A', '#ffffff', '#FFD700', '#FFC125'] };
      function shoot() {
        (window as any).confetti?.({ ...defaults, particleCount: 50, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        (window as any).confetti?.({ ...defaults, particleCount: 50, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
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
    { value: 2500000000, prefix: '₦', suffix: '+', label: 'Total Won', icon: '🏆', formatFn: (n: number) => n >= 1e9 ? `₦${(n / 1e9).toFixed(1)}B+` : `₦${n.toLocaleString()}+` },
    { value: 25000, suffix: '+', label: 'Active Players', icon: '👥' },
    { value: 120, suffix: '+', label: 'Campaigns Completed', icon: '🎯' },
    { value: 98, suffix: '%', label: 'Payout Rate', icon: '⚡' },
  ];

  const steps = [
    { num: '01', icon: '👤', title: 'Sign Up', desc: 'Create your free account in seconds. No hidden fees.' },
    { num: '02', icon: '🎟', title: 'Buy a Ticket', desc: 'Pick a campaign and purchase your raffle ticket(s).' },
    { num: '03', icon: '⏳', title: 'Wait for Draw', desc: 'Live draws happen weekly. Your name could be next!' },
    { num: '04', icon: '🎉', title: 'Win & Celebrate', desc: 'Winners are announced instantly. Withdraw winnings fast!' },
  ];

  const testimonials = [
    { name: 'Chioma A.', city: 'Lagos', text: 'I won N500,000 on my third ticket! The thrill is unreal. Already planning my next entry!', avatar: 'C' },
    { name: 'Emeka N.', city: 'Abuja', text: 'Toyota Camry winner here! I still can\'t believe it. The process was smooth from start to finish.', avatar: 'E' },
    { name: 'Funke O.', city: 'Ibadan', text: 'Been playing for 6 months and finally won the N1M weekly draw. Thank you WINBIG!', avatar: 'F' },
  ];

  return (
    <div className="relative overflow-hidden">
      {mounted && <ConfettiTrigger />}
      <UrgencyBanner />
      <TrustBadges />
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <Particles />
        <div className="absolute inset-0 bg-deep-blue" />
        <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.4) 0%, transparent 60%)' }} />
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
            Nigeria&apos;s most trusted lottery platform. Win life-changing prizes from as little as N100. New winners every week.
          </motion.p>

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

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-gray-500 text-sm mt-6"
          >
            🔒 Secured by Supabase &nbsp;|&nbsp; ⚡ Instant Payouts &nbsp;|&nbsp; 🇳🇬 Made in Nigeria
          </motion.p>
        </div>

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

      {/* STATS BAR */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-xl sm:text-2xl font-black text-deep-blue leading-tight">
                  <AnimatedCounter end={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </div>
                <div className="text-gray-500 text-xs sm:text-sm font-medium mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRIZE TIER SHOWCASE */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="text-gold font-semibold text-sm uppercase tracking-wider">Explore by Category</span>
            <h2 className="section-title mt-2">Choose Your Dream Prize</h2>
            <p className="text-gray-500 mt-2 max-w-xl mx-auto">From life-changing jackpots to everyday tech — pick your prize and start winning.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/campaigns?filter=jackpot">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="bg-gradient-to-br from-deep-blue to-deep-blue/80 rounded-2xl p-8 border border-gold/20 hover:border-gold/50 hover:shadow-2xl hover:shadow-gold/10 cursor-pointer group"
              >
                <div className="text-5xl mb-4">🏆</div>
                <h3 className="text-xl font-black text-white mb-2">Mega Jackpots</h3>
                <p className="text-gray-400 text-sm mb-4">Prizes of ₦5M and above. Life-changing wins await!</p>
                <div className="flex items-center gap-2 text-gold font-semibold text-sm group-hover:gap-3 transition-all">
                  Browse Jackpots <span>→</span>
                </div>
              </motion.div>
            </Link>

            <Link href="/campaigns?filter=cars">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="bg-gradient-to-br from-gold/90 to-gold/70 rounded-2xl p-8 border border-gold/30 hover:shadow-2xl hover:shadow-gold/20 cursor-pointer group"
              >
                <div className="text-5xl mb-4">🚗</div>
                <h3 className="text-xl font-black text-deep-blue mb-2">Cars & Vehicles</h3>
                <p className="text-deep-blue/70 text-sm mb-4">Win your dream car — Toyota, Honda, SUVs and more!</p>
                <div className="flex items-center gap-2 text-deep-blue font-semibold text-sm group-hover:gap-3 transition-all">
                  Browse Cars <span>→</span>
                </div>
              </motion.div>
            </Link>

            <Link href="/campaigns?filter=tech">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 hover:border-gold/50 hover:shadow-2xl hover:shadow-gold/10 cursor-pointer group"
              >
                <div className="text-5xl mb-4">📱</div>
                <h3 className="text-xl font-black text-white mb-2">Tech & Electronics</h3>
                <p className="text-gray-400 text-sm mb-4">iPhones, MacBooks, gaming consoles, and gadgets!</p>
                <div className="flex items-center gap-2 text-gold font-semibold text-sm group-hover:gap-3 transition-all">
                  Browse Tech <span>→</span>
                </div>
              </motion.div>
            </Link>
          </div>
        </div>
      </section>

      {/* PRIZE TIER SHOWCASE */}
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
      <AffiliateBanner />

      <HowItWorks />

      {/* WINNERS TICKER */}
      <WinnerTicker />

      {/* TESTIMONIALS */}
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
                <div className="text-gold text-sm mt-3">⭐⭐⭐⭐⭐</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <AppDownloadBanner />

      {/* CTA BANNER */}
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
  <AppDownloadBanner />
}

// Campaign Cards with 3D Tilt + Countdown + Lazy Images
function CampaignCards() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [countdowns, setCountdowns] = useState<Record<number, { days: number; hours: number; mins: number; secs: number }>>({});
  const [tilt, setTilt] = useState<Record<number, { rotateX: number; rotateY: number }>>({});

  useEffect(() => {
    getCampaigns()
      .then(d => setCampaigns(Array.isArray(d) ? d.slice(0, 3) : []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const newCountdowns: Record<number, any> = {};
      campaigns.forEach(c => {
        const diff = new Date(c.end_date).getTime() - Date.now();
        if (diff <= 0) { newCountdowns[c.id] = { days: 0, hours: 0, mins: 0, secs: 0 }; return; }
        newCountdowns[c.id] = {
          days: Math.floor(diff / 86400000),
          hours: Math.floor((diff % 86400000) / 3600000),
          mins: Math.floor((diff % 3600000) / 60000),
          secs: Math.floor((diff % 60000) / 1000),
        };
      });
      setCountdowns(newCountdowns);
    }, 1000);
    return () => clearInterval(interval);
  }, [campaigns]);

  const handleMouseMove = (id: number, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt(prev => ({ ...prev, [id]: { rotateX: -y * 12, rotateY: x * 12 } }));
  };
  const handleMouseLeave = (id: number) => {
    setTilt(prev => ({ ...prev, [id]: { rotateX: 0, rotateY: 0 } }));
  };

  if (!campaigns.length) return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map(i => <div key={i} className="bg-white rounded-2xl h-96 animate-pulse border border-gray-100" />)}
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {campaigns.map((c, i) => {
        const pct = Math.round((c.sold_tickets / c.total_tickets) * 100);
        const cd = countdowns[c.id] || { days: 0, hours: 0, mins: 0, secs: 0 };
        const isExpired = new Date(c.end_date).getTime() <= Date.now();
        const t = tilt[c.id] || { rotateX: 0, rotateY: 0 };

        return (
          <div
            key={c.id}
            onMouseMove={(e) => handleMouseMove(c.id, e)}
            onMouseLeave={() => handleMouseLeave(c.id)}
            style={{ perspective: '800px' }}
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              animate={{ rotateX: t.rotateX, rotateY: t.rotateY }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-shadow origin-center"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="h-44 bg-gray-200 relative overflow-hidden">
                <Image
                  src={c.image_url || '/placeholder.jpg'}
                  alt={c.title}
                  fill
                  className="object-cover"
                  placeholder="blur"
                  blurDataURL={blurDataURL}
                />
                {c.status === 'active' && (
                  <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> LIVE
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

                {/* Countdown Timer */}
                {isExpired ? (
                  <div className="text-red-500 font-bold text-sm mb-2 animate-pulse">🎯 DRAW LIVE!</div>
                ) : (
                  <div className="flex gap-1 text-xs mb-2">
                    <span className="bg-deep-blue text-white px-1.5 py-0.5 rounded font-bold">{cd.days}d</span>
                    <span className="bg-deep-blue text-white px-1.5 py-0.5 rounded font-bold">{String(cd.hours).padStart(2,'0')}h</span>
                    <span className="bg-deep-blue text-white px-1.5 py-0.5 rounded font-bold">{String(cd.mins).padStart(2,'0')}m</span>
                    <span className="bg-gold text-deep-blue px-1.5 py-0.5 rounded font-bold">{String(cd.secs).padStart(2,'0')}s</span>
                  </div>
                )}

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
                  <span className="text-xs text-gray-500">Ticket: <strong className="text-deep-blue">N{c.ticket_price.toLocaleString()}</strong></span>
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
          </div>
        );
      })}
    </div>
  );
}

// Winner Ticker
function WinnerTicker() {
  const winners = [
    { name: 'Chioma A.', prize: 'N500,000', city: 'Lagos', time: '2h ago' },
    { name: 'Emeka N.', prize: 'Toyota Camry 2025', city: 'Abuja', time: '5h ago' },
    { name: 'Funke O.', prize: 'N1,000,000', city: 'Ibadan', time: '1d ago' },
    { name: 'Segun K.', prize: 'iPhone 16 Pro Max', city: 'Port Harcourt', time: '1d ago' },
    { name: 'Aisha M.', prize: 'N250,000', city: 'Kano', time: '2d ago' },
    { name: 'Olumide T.', prize: 'N5,000,000', city: 'Lagos', time: '3d ago' },
  ];

  return (
    <div className="bg-gold/10 border-y border-gold/20 py-6 overflow-hidden">
      <div className="flex gap-8 animate-[scroll_30s_linear_infinite] whitespace-nowrap">
        {[...winners, ...winners].map((w, i) => (
          <span key={i} className="inline-flex items-center gap-2 text-deep-blue font-medium text-sm">
            🎊 <strong>{w.name}</strong> from {w.city} won <strong>{w.prize}</strong>
            <span className="text-gray-400 text-xs">• {w.time}</span>
            <span className="mx-4 text-gold">⭐</span>
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
