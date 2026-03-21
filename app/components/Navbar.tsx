'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => { setHydrated(true); }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/#campaigns', label: 'Campaigns' },
    { href: '/#how-it-works', label: 'How It Works' },
    { href: '/about', label: 'About' },
  ];

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-deep-blue/95 backdrop-blur-md shadow-lg shadow-black/20 py-2'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center shadow-lg shadow-gold/30 group-hover:shadow-gold/50 transition-shadow"
            >
              <span className="text-deep-blue font-black text-lg">W</span>
            </motion.div>
            <span className="font-black text-xl text-white hidden sm:block">
              WIN<span className="text-gold">BIG</span> <span className="text-gold">AFRICA</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-300 hover:text-gold transition-colors text-sm font-medium relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {hydrated && user ? (
              <>
                <Link href="/dashboard">
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-gray-300 hover:text-gold transition-colors text-sm font-medium"
                  >
                    Dashboard
                  </motion.span>
                </Link>
                <span className="text-gray-600">|</span>
                <button
                  onClick={logout}
                  className="text-gray-300 hover:text-red-400 transition-colors text-sm font-medium"
                >
                  Logout
                </button>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-8 h-8 bg-gold rounded-full flex items-center justify-center text-deep-blue font-bold text-xs"
                >
                  {user.name?.[0]?.toUpperCase() || 'U'}
                </motion.div>
              </>
            ) : hydrated ? (
              <>
                <Link href="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-gray-300 hover:text-gold transition-colors text-sm font-medium"
                  >
                    Log In
                  </motion.button>
                </Link>
                <Link href="/register">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(212,175,55,0.4)' }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gold text-deep-blue font-semibold text-sm px-5 py-2 rounded-xl transition-all"
                  >
                    Sign Up
                  </motion.button>
                </Link>
              </>
            ) : null}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-white p-2"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <motion.span
                animate={mobileOpen ? { rotate: 45, y: 9 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full h-0.5 bg-white origin-center"
              />
              <motion.span
                animate={mobileOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full h-0.5 bg-white"
              />
              <motion.span
                animate={mobileOpen ? { rotate: -45, y: -9 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full h-0.5 bg-white origin-center"
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden overflow-hidden bg-deep-blue/95 backdrop-blur-md rounded-b-2xl mt-2"
            >
              <div className="px-4 py-6 space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block text-gray-300 hover:text-gold transition-colors font-medium"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="border-t border-gray-700 pt-4 space-y-3">
                  {hydrated && user ? (
                    <>
                      <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="block text-gold font-medium">Dashboard</Link>
                      <button onClick={() => { logout(); setMobileOpen(false); }} className="text-red-400 text-sm">Logout</button>
                    </>
                  ) : hydrated ? (
                    <>
                      <Link href="/login" onClick={() => setMobileOpen(false)} className="block text-gray-300 font-medium">Log In</Link>
                      <Link href="/register" onClick={() => setMobileOpen(false)} className="block bg-gold text-deep-blue font-semibold text-center py-2.5 rounded-xl">Sign Up</Link>
                    </>
                  ) : null}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
