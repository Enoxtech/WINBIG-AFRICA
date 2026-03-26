'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Login failed.'); return; }

      // Verify admin role
      if (data.user?.role !== 'admin') {
        setError('Access denied. Admin credentials required.');
        return;
      }

      localStorage.setItem('wb_token', data.token);
      localStorage.setItem('wb_user', JSON.stringify(data.user));
      router.push('/admin');
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-deep-blue relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-deep-blue via-[#0A1628] to-deep-blue" />
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full border border-gold/10 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full border border-gold/5 translate-y-1/2 -translate-x-1/2" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md px-4"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="text-3xl">🎰</span>
            <span className="text-white font-black text-2xl tracking-wide">
              WINBIG<span className="text-gold">AFRICA</span>
            </span>
          </Link>
          <p className="text-gray-400 text-sm mt-2">Admin Portal</p>
        </div>

        {/* Form Card */}
        <div className="bg-[#0B1F3A]/80 backdrop-blur-xl border border-gold/20 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">🔐</div>
            <h2 className="text-white font-bold text-xl">Admin Login</h2>
            <p className="text-gray-400 text-sm mt-1">Restricted access — authorized personnel only</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@winbig.africa"
                className="w-full px-4 py-3 rounded-xl bg-[#0A0A0A]/60 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-gold transition-colors text-sm"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-[#0A0A0A]/60 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-gold transition-colors text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-sm"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gold hover:bg-yellow-500 disabled:opacity-50 text-deep-blue font-bold rounded-xl transition-all text-sm"
            >
              {loading ? 'Signing in...' : 'Sign In to Admin'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/login" className="text-gray-400 hover:text-gold text-sm transition-colors">
              ← Back to user login
            </Link>
          </div>
        </div>

        <p className="text-center text-gray-600 text-xs mt-4">
          © 2026 WINBIG AFRICA. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
