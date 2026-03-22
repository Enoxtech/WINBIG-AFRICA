'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

interface User { id: string; name: string; email: string; role: string; }

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password || !confirmPassword) { setError('Please fill in all fields.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setError('');
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise((r) => setTimeout(r, 800));
      // Mock successful registration — in production this calls your auth API
      const mockUser: User = { id: '1', name: username, email, role: 'user' };
      const mockToken = 'mock_jwt_token_' + Date.now();
      login(mockToken, mockUser);
      router.push('/dashboard');
    } catch { setError('Registration failed. Please try again.'); }
    finally { setLoading(false); }
  };

  const handleSocialLogin = (provider: string) => {
    alert(`🚀 ${provider} login is coming soon! Stay tuned.`);
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT: Brand Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col relative overflow-hidden bg-deep-blue">
        <div className="absolute inset-0 bg-gradient-to-br from-deep-blue via-deep-blue/95 to-matte-black" />
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full border border-gold/10" />
        <div className="absolute -bottom-40 -right-20 w-[500px] h-[500px] rounded-full border border-gold/5" />
        <div className="absolute top-1/3 right-10 w-40 h-40 rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute bottom-1/4 left-10 w-60 h-60 rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-gold/10 to-transparent transform skew-x-12" />

        <div className="relative z-10 flex flex-col h-full p-12 xl:p-16">
          <div className="flex items-center gap-3 mb-16">
            <div className="mb-8">
              <div className="text-6xl xl:text-7xl mb-6">🎁</div>
              <h1 className="text-4xl xl:text-5xl font-black text-white leading-tight mb-4">
                Your Dreams Start With One Ticket
              </h1>
              <p className="text-gray-400 text-lg max-w-md leading-relaxed">
                Create your free account and get your first ticket. Over ₦2.5 billion already won by our community.
              </p>
            </div>

            <div className="space-y-4 mt-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-gold text-sm">✓</span>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Free to join</p>
                  <p className="text-gray-500 text-xs">No registration fees — start playing instantly</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-gold text-sm">✓</span>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Instant withdrawals</p>
                  <p className="text-gray-500 text-xs">Win and withdraw your prize within 24 hours</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-gold text-sm">✓</span>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Fair & transparent</p>
                  <p className="text-gray-500 text-xs">Blockchain-verified draws, publicly auditable</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-8 border-t border-white/10">
            <p className="text-gray-500 text-sm">© 2025 WINBIG AFRICA. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* RIGHT: Form Panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-light-gray">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gold flex items-center justify-center shadow-lg shadow-gold/30">
              <span className="text-deep-blue font-black text-lg">W</span>
            </div>
            <span className="text-deep-blue font-black text-lg">WINBIG <span className="text-gold">AFRICA</span></span>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-white rounded-2xl shadow-card p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-black text-deep-blue mb-1">Create your account</h2>
                <p className="text-gray-500 text-sm">Join 25,000+ players already winning big</p>
              </div>

              {/* Social Login Buttons - Feature 13 */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => handleSocialLogin('Google')}
                  className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border-2 border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all font-semibold text-gray-700 text-sm group"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <button
                  onClick={() => handleSocialLogin('WhatsApp')}
                  className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border-2 border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all font-semibold text-gray-700 text-sm group"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span>Continue with WhatsApp</span>
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 font-medium">or register with email</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="yourname"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all text-sm placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all text-sm placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all text-sm placeholder:text-gray-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all text-sm placeholder:text-gray-400"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-3">{error}</div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gold text-deep-blue font-bold rounded-xl hover:bg-yellow-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-lg shadow-gold/30"
                >
                  {loading ? 'Creating account...' : 'Create Free Account'}
                </button>
              </form>

              <p className="text-center text-sm text-gray-500 mt-6">
                Already have an account?{' '}
                <Link href="/login" className="text-gold font-semibold hover:underline">Sign in</Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
