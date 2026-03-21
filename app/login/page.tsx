'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { login } from '../api';
import Link from 'next/link';

export default function LoginPage() {
  const { login: authLogin } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const result = await login(formData.email, formData.password);
      if (result.error) {
        throw new Error(result.error);
      }
      
      authLogin(result.token, result.user);
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light-gray flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 p-8"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-deep-blue rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-gold font-bold text-lg">W</span>
          </div>
          <h2 className="text-2xl font-bold text-deep-blue">Welcome Back</h2>
          <p className="text-gray-500 mt-2">
            Sign in to your WINBIG AFRICA account
          </p>
        </div>
        
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-red-50 border-l-4 border-red-200 p-4 mb-6 rounded-r-lg"
          >
            <p className="text-red-600">{error}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-deep-blue mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              placeholder="you@example.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-deep-blue mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter your password"
              required
            />
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 text-gold focus:ring-gold border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 mt-0.5">
              <label htmlFor="remember" className="text-sm text-gray-600">
                Remember me
              </label>
            </div>
          </div>
          
          <div className="mt-2">
            <Link href="/forgot-password" className="text-sm text-gray-500 hover:text-gold">
              Forgot Password?
            </Link>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`btn-primary w-full py-3 ${loading ? 'opacity-70' : ''}`}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            Don&apos;t have an account?
            <Link href="/register" className="font-medium text-gold hover:text-deep-blue">
              Create Account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
