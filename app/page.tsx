'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { getCampaigns } from './api';
import CountdownTimer from './components/CountdownTimer';
import CampaignCard from './components/CampaignCard';

export default function HomePage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      const data = await getCampaigns();
      setCampaigns(data.filter((c: any) => c.status === 'active') || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-deep-blue via-deep-blue to-matte-black text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gold rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative">
          <motion.div
            initial="hidden"
            animate="show"
            variants={container}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={item} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
              <span className="w-2 h-2 bg-gold rounded-full animate-pulse"></span>
              <span className="text-sm text-gray-300">Nigeria&apos;s Trusted Raffle Platform</span>
            </motion.div>
            
            <motion.h1 variants={item} className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
              Win <span className="text-gradient-gold">Big</span> with<br />Small Entry
            </motion.h1>
            
            <motion.p variants={item} className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Premium raffle campaigns with incredible prizes. Every ticket gives you a fair chance to win. 
              Transparent, secure, and exciting.
            </motion.p>
            
            <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="#campaigns" className="btn-primary text-lg px-8 py-4">
                View Campaigns
              </Link>
              <Link href="/register" className="btn-outline border-white text-white hover:bg-white hover:text-deep-blue text-lg px-8 py-4">
                Get Started Free
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats Bar */}
        <div className="bg-white/5 backdrop-blur-sm border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: 'Active Campaigns', value: '24+' },
                { label: 'Winners Paid', value: '₦12M+' },
                { label: 'Tickets Sold', value: '50K+' },
                { label: 'Trust Score', value: '4.9/5' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl md:text-3xl font-bold text-gold">{stat.value}</div>
                  <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 md:py-28 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-title mb-4">How It Works</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Simple, transparent, and fair. Here&apos;s how you can win amazing prizes.</p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8"
          >
            {[
              { step: '01', title: 'Browse Campaigns', desc: 'Explore our selection of premium raffle campaigns with amazing prizes.' },
              { step: '02', title: 'Buy Tickets', desc: 'Purchase tickets starting from as low as ₦500. The more tickets, the higher your chances.' },
              { step: '03', title: 'Watch the Draw', desc: 'Random winner selection happens live. Every ticket has an equal chance.' },
              { step: '04', title: 'Win & Celebrate', desc: 'Winners are announced publicly. Your prize awaits!' },
            ].map((step, i) => (
              <motion.div
                key={step.step}
                variants={item}
                className="bg-white rounded-2xl p-6 shadow-card text-center"
              >
                <div className="w-14 h-14 bg-deep-blue rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-gold font-bold text-lg">{step.step}</span>
                </div>
                <h3 className="font-semibold text-deep-blue text-lg mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Campaigns Section */}
      <section id="campaigns" className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4"
          >
            <div>
              <h2 className="section-title mb-2">Active Campaigns</h2>
              <p className="text-gray-500">Don&apos;t miss your chance to win amazing prizes</p>
            </div>
            <Link href="/campaigns" className="btn-outline text-sm py-2 px-5 w-fit">View All</Link>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-100 rounded-2xl h-80 animate-pulse"></div>
              ))}
            </div>
          ) : campaigns.length > 0 ? (
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {campaigns.slice(0, 6).map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-light-gray rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🎟️</span>
              </div>
              <h3 className="text-xl font-semibold text-deep-blue mb-2">No Active Campaigns</h3>
              <p className="text-gray-500">Check back soon for new exciting campaigns!</p>
            </div>
          )}
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 md:py-28 bg-deep-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose WINBIG AFRICA?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">We&apos;re committed to transparency, fairness, and trust.</p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { icon: '🔒', title: 'Secure & Verified', desc: 'All transactions are encrypted and verified. Your data and money are safe with us.' },
              { icon: '🎲', title: 'Fair Random Draws', desc: 'Winners are selected using cryptographically secure random algorithms.' },
              { icon: '📊', title: '100% Transparent', desc: 'Every draw result is publicly verifiable. No hidden rules, no bias.' },
              { icon: '💳', title: 'Easy Payments', desc: 'Multiple payment options including bank transfer and mobile money.' },
              { icon: '🏆', title: 'Real Prizes', desc: 'All prizes are genuine and fulfilled. We partner with verified brands.' },
              { icon: '📞', title: '24/7 Support', desc: 'Our support team is always available to help you with any questions.' },
            ].map((trust) => (
              <motion.div
                key={trust.title}
                variants={item}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
              >
                <div className="text-4xl mb-4">{trust.icon}</div>
                <h3 className="font-semibold text-white text-lg mb-2">{trust.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{trust.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 md:py-28 bg-gradient-to-br from-gold via-yellow-400 to-gold">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-extrabold text-deep-blue mb-6">Ready to Try Your Luck?</h2>
            <p className="text-deep-blue/80 text-lg mb-10 max-w-2xl mx-auto">
              Join thousands of Nigerians who trust WINBIG AFRICA for fair and exciting raffles.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="bg-deep-blue text-white font-bold px-8 py-4 rounded-xl hover:bg-matte-black transition-colors text-lg">
                Create Free Account
              </Link>
              <Link href="/#campaigns" className="bg-white/20 text-deep-blue font-bold px-8 py-4 rounded-xl hover:bg-white/30 transition-colors text-lg">
                Browse Campaigns
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
