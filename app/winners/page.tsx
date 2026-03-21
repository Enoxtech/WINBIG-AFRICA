'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const mockWinners = [
  { id: 1, name: 'Chioma Adeyemi', prize: 'N500,000 Cash', type: 'cash', city: 'Lagos', date: '2026-03-15', avatar: 'CA' },
  { id: 2, name: 'Emeka Nwosu', prize: 'Toyota Camry 2025', type: 'car', city: 'Abuja', date: '2026-03-10', avatar: 'EN' },
  { id: 3, name: 'Funke Olatunji', prize: 'N1,000,000 Weekly Draw', type: 'cash', city: 'Ibadan', date: '2026-03-08', avatar: 'FO' },
  { id: 4, name: 'Segun Kalejaiye', prize: 'iPhone 16 Pro Max', type: 'gadget', city: 'Port Harcourt', date: '2026-03-05', avatar: 'SK' },
  { id: 5, name: 'Aisha Mohammed', prize: 'N250,000 Cash', type: 'cash', city: 'Kano', date: '2026-03-01', avatar: 'AM' },
  { id: 6, name: 'Olumide Taiwo', prize: 'N5,000,000 Mega Jackpot', type: 'jackpot', city: 'Lagos', date: '2026-02-25', avatar: 'OT' },
  { id: 7, name: 'Blessing Eze', prize: 'MacBook Air M3', type: 'gadget', city: 'Enugu', date: '2026-02-20', avatar: 'BE' },
  { id: 8, name: 'Ibrahim Garba', prize: 'N750,000 Cash', type: 'cash', city: 'Kaduna', date: '2026-02-15', avatar: 'IG' },
  { id: 9, name: 'Ngozi Ibe', prize: 'Samsung 98" QLED TV', type: 'gadget', city: 'Anambra', date: '2026-02-10', avatar: 'NI' },
  { id: 10, name: 'Tunde Bakare', prize: 'N2,000,000 Super Draw', type: 'cash', city: 'Oyo', date: '2026-02-05', avatar: 'TB' },
  { id: 11, name: 'Halima Sanni', prize: 'Honda Accord 2024', type: 'car', city: 'Abuja', date: '2026-01-28', avatar: 'HS' },
  { id: 12, name: 'Chukwuemeka Obi', prize: 'N100,000 Daily Draw', type: 'cash', city: 'Delta', date: '2026-01-20', avatar: 'CO' },
];

const filters = [
  { key: 'all', label: '🏆 All Winners' },
  { key: 'cash', label: '💰 Cash Prizes' },
  { key: 'car', label: '🚗 Cars' },
  { key: 'gadget', label: '📱 Gadgets' },
  { key: 'jackpot', label: '🎯 Jackpots' },
];

const prizeColors: Record<string, string> = {
  cash: 'from-green-500 to-emerald-600',
  car: 'from-blue-500 to-indigo-600',
  gadget: 'from-purple-500 to-pink-600',
  jackpot: 'from-gold to-yellow-500',
};

export default function WinnersPage() {
  const [activeFilter, setActiveFilter] = useState('all');

  const filtered = activeFilter === 'all'
    ? mockWinners
    : mockWinners.filter(w => w.type === activeFilter);

  return (
    <div className="min-h-screen bg-light-gray">
      <Navbar />

      {/* Hero */}
      <section className="bg-deep-blue py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.5) 0%, transparent 60%)' }} />
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <span className="text-gold font-bold text-sm uppercase tracking-wider">Hall of Fame</span>
            <h1 className="text-4xl sm:text-5xl font-black text-white mt-3 mb-4">Our Winners</h1>
            <p className="text-gray-400 text-lg">Real people. Real wins. These winners prove that anyone can strike it lucky on WINBIG AFRICA.</p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-gray-100 sticky top-[65px] z-20">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {filters.map(f => (
              <motion.button
                key={f.key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter(f.key)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeFilter === f.key
                    ? 'bg-deep-blue text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f.label}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Winners Grid */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {filtered.map((w, i) => (
              <motion.div
                key={w.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${prizeColors[w.type]} text-white font-black text-lg mb-3`}>
                  {w.avatar}
                </div>
                <h3 className="font-bold text-deep-blue text-sm mb-1">{w.name}</h3>
                <p className="text-gold font-semibold text-sm mb-1">{w.prize}</p>
                <p className="text-gray-400 text-xs">{w.city} • {new Date(w.date).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">🔍</div>
            <p>No winners in this category yet.</p>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-deep-blue py-16 text-center">
        <h2 className="text-3xl font-bold text-white mb-3">Could You Be Next?</h2>
        <p className="text-gray-400 mb-6">Join thousands of lucky winners. Your name could be here soon!</p>
        <a href="/campaigns">
          <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }} className="bg-gold text-deep-blue font-black px-8 py-3 rounded-xl">
            Enter a Campaign →
          </motion.button>
        </a>
      </section>

      <Footer />
    </div>
  );
}
