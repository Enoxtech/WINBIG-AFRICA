'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="section-title mb-6">About WINBIG AFRICA</h1>
          <div className="prose prose-lg max-w-none">
            <div className="bg-light-gray rounded-2xl p-8 mb-8">
              <p className="text-gray-600 leading-relaxed text-lg">
                WINBIG AFRICA is Nigeria&apos;s most trusted lottery and raffle platform, launched in 2026. 
                We are building a transparent, fair, and exciting way for Nigerians to win incredible prizes 
                through affordable ticket-based campaigns.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-deep-blue mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-6">
              To democratize luck and opportunity. Every ticket gives every participant an equal chance — 
              and we make sure every draw is 100% transparent and verifiable.
            </p>

            <h2 className="text-2xl font-bold text-deep-blue mb-4">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {[
                { step: '01', title: 'Browse Campaigns', desc: 'Explore our curated selection of premium prizes.' },
                { step: '02', title: 'Buy Tickets', desc: 'Purchase tickets starting from as low as ₦500.' },
                { step: '03', title: 'Watch the Draw', desc: 'Random winner selection — every ticket equal.' },
                { step: '04', title: 'Win & Celebrate', desc: 'Public winner announcement. Your prize awaits!' },
              ].map((s) => (
                <div key={s.step} className="bg-light-gray rounded-xl p-5">
                  <div className="w-10 h-10 bg-deep-blue rounded-lg flex items-center justify-center mb-3">
                    <span className="text-gold font-bold">{s.step}</span>
                  </div>
                  <h3 className="font-semibold text-deep-blue mb-1">{s.title}</h3>
                  <p className="text-sm text-gray-500">{s.desc}</p>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold text-deep-blue mb-4">Contact Us</h2>
            <p className="text-gray-600 mb-4">
              Have questions or need help? Reach us at{' '}
              <span className="text-gold">support@winbigafrica.com</span>
            </p>

            <Link href="/campaigns" className="btn-primary inline-block mt-4">Browse Campaigns</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
