'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { register } from '../api';

export default function RegisterPage() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
      const result = await register(formData.name, formData.email, formData.password);
      if (result.error) {
        throw new Error(result.error);
      }
      
      login(result.token, result.user);
      setSuccess('Registration successful! Redirecting...');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
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
          <h2 className="text-2xl font-bold text-deep-blue">Create Your Account</h2>
          <p className="text-gray-500 mt-2">
            Join WINBIG AFRICA and start winning amazing prizes
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
        
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-green-50 border-l-4 border-green-200 p-4 mb-6 rounded-r-lg"
          >
            <p className="text-green-600">{success}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-deep-blue mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter your full name"
              required
            />
          </div>
          
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
              placeholder="Create a strong password"
              required
              minLength={6}
            />
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <input
                type="checkbox"
                id="terms"
                className="h-4 w-4 text-gold focus:ring-gold border-gray-300 rounded"
                required
              />
            </div>
            <div className="ml-3 mt-0.5">
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the <a href="/legal/terms" className="text-gold hover:text-deep-blue">Terms & Conditions</a> and 
                <a href="/legal/privacy" className="text-gold hover:text-deep-blue">Privacy Policy</a>
              </label>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`btn-primary w-full py-3 ${loading ? 'opacity-70' : ''}`}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            Already have an account?
            <Link href="/login" className="font-medium text-gold hover:text-deep-blue">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
