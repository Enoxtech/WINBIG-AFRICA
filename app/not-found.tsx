'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Particles from '../components/Particles';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-deep-blue relative flex items-center justify-center overflow-hidden">
      <Particles />
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center px-4"
      >
        <motion.div
          animate={{ rotate: [0, -5, 5, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-gold to-yellow-600 mb-4"
          style={{ WebkitTextStroke: '2px #D4AF37' }}
        >
          404
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-white mb-3"
        >
          Oops! Page not found 😅
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="text-gray-400 max-w-md mx-auto mb-8"
        >
          E no concern you — even the best lottery players miss sometimes.
          Let&apos;s get you back to winning ways!
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.06, boxShadow: '0 0 40px rgba(212,175,55,0.5)' }}
              whileTap={{ scale: 0.96 }}
              className="bg-gold text-deep-blue font-black px-8 py-3 rounded-xl"
            >
              🏠 Back to Home
            </motion.button>
          </Link>
          <Link href="/campaigns">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="border-2 border-white/30 text-white font-semibold px-8 py-3 rounded-xl hover:border-gold hover:text-gold transition-colors"
            >
              🎟️ View Campaigns
            </motion.button>
          </Link>
        </motion.div>

        {/* Animated gold coins */}
        <div className="mt-12 flex justify-center gap-4">
          {['💰', '🪙', '🏆', '🎫', '⭐'].map((emoji, i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -15, 0], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
              className="text-3xl"
            >
              {emoji}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
