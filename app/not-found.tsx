'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-deep-blue flex flex-col items-center justify-center text-center px-4 overflow-hidden relative">
      {/* Animated background orbs */}
      <motion.div
        animate={{ x: [0, 60, 0], y: [0, -40, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 left-1/4 w-72 h-72 bg-gold/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -50, 0], y: [0, 50, 0], scale: [1, 1.3, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl"
      />

      {/* 404 Text */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, type: 'spring' }}
        className="relative mb-6"
      >
        <h1
          className="text-[10rem] sm:text-[14rem] font-black leading-none"
          style={{
            WebkitTextStroke: '2px rgba(212,175,55,0.3)',
            color: 'transparent',
          }}
        >
          404
        </h1>
        <motion.div
          animate={{ rotate: [0, 10, -10, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl"
        >
          🤷‍♂️
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-3xl font-bold text-white mb-3">Oops! Page Not Found</h2>
        <p className="text-gray-400 mb-2 text-lg">
          E no concern you — this page just don vanish!
        </p>
        <p className="text-gray-500 mb-8 text-sm">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </motion.div>

      {/* Animated emojis */}
      <motion.div
        animate={{ y: [-5, 5, -5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-4xl mb-8"
      >
        🎟️ 🏆 🎰
      </motion.div>

      <Link href="/">
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(212,175,55,0.4)' }}
          whileTap={{ scale: 0.95 }}
          className="bg-gold text-deep-blue font-black text-lg px-10 py-4 rounded-2xl"
        >
          Back to Home 🏠
        </motion.button>
      </Link>
    </div>
  );
}
