'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import dynamic from 'next/dynamic';
import Particles from './components/Particles';
import UrgencyBanner from './components/UrgencyBanner';
import TrustBadges from './components/TrustBadges';
import AffiliateBanner from './components/AffiliateBanner';
import JackpotSpotlight from './components/JackpotSpotlight';
import HowItWorks from './components/HowItWorks';
import AppDownloadBanner from './components/AppDownloadBanner';
import ErrorBoundary from './components/ErrorBoundary';
import CampaignCard from './components/CampaignCard';
import { getCampaigns } from './api';

const Confetti = dynamic(() => import('canvas-confetti'), { ssr: false });
const RaffleDrum = dynamic(() => import('./components/RaffleDrum'), { ssr: false });

function normalizeCampaign(c: any) {
  const prizeAmount = (c.prizeAmount ?? c.prize_amount ?? 0);
  return {
    id: c.id,
    title: c.title,
    description: c.description,
    prize_amount: prizeAmount,
    ticket_price: (c.ticketPrice ?? c.ticket_price ?? 100),
    max_tickets: (c.maxTickets ?? c.max_tickets ?? 1000),
    sold_tickets: (c.soldTickets ?? c.sold_tickets ?? 0),
    draw_date: (c.drawDate ?? c.draw_date ?? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()),
    status: c.status ?? 'active',
    image_url: (c.imageUrl ?? c.image_url),
    jackpot: c.jackpot ?? ((c.title?.toLowerCase().includes('jackpot') || false) || prizeAmount >= 5_000_000),
  };
}

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

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    getCampaigns()
      .then(d => setCampaigns((d.campaigns || []).slice(0, 3).map((c: any) => normalizeCampaign(c))))
      .catch(() => {});
  }, []);

  const stats = [
    { value: 2500000000, prefix: '₦', suffix: '+', label: 'Total Won', icon: '🏆', formatFn: (n: number) => n >= 1e9 ? `₦${(n / 1e9).toFixed(1)}B+` : `₦${n.toLocaleString()}+` },
    { value: 25000, suffix: '+', label: 'Active Players', icon: '👥' },
    { value: 120, suffix: '+', label: 'Campaigns Completed', icon: '🎯' },
    { value: 98, suffix: '%', label: 'Payout Rate', icon: '⚡' },
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
      <ErrorBoundary>
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
      </ErrorBoundary>

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
            <h2 className="text-3xl sm:text-4xl font-black text-deep-blue mt-2 mb-3">Choose Your Dream Prize</h2>
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

      {/* LIVE CAMPAIGNS */}
      <section id="campaigns" className="bg-light-gray py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-gold font-semibold text-sm uppercase tracking-wider">Act Now</span>
            <h2 className="text-3xl sm:text-4xl font-black text-deep-blue mt-2 mb-3">Live Campaigns</h2>
            <p className="text-gray-500 mt-2 max-w-xl mx-auto">Grab your ticket before time runs out. Every draw is live and transparent.</p>
          </motion.div>

          {campaigns.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-2xl h-96 animate-pulse border border-gray-100" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {campaigns.map((campaign, i) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          )}

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
      <JackpotSpotlight />
      <HowItWorks />

      {/* RAFFLE DRUM DEMO */}
      <section className="bg-deep-blue py-20">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="text-gold font-semibold text-sm uppercase tracking-wider">Transparency</span>
            <h2 className="section-title mt-2 text-white">See the Draw in Action</h2>
            <p className="text-gray-400 mt-2 max-w-lg mx-auto">Every draw is completely random. Watch the drum mix the balls — no algorithms, no manipulation.</p>
          </motion.div>
          <div className="max-w-lg mx-auto">
            <RaffleDrum />
          </div>
        </div>
      </section>

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
            <h2 className="text-3xl sm:text-4xl font-black text-deep-blue mt-2 mb-3">What Winners Say</h2>
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
}
