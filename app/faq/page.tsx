'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const faqs = [
  { q: 'How does WINBIG AFRICA work?', a: 'WINBIG AFRICA runs transparent raffle campaigns. You purchase tickets for a chance to win prizes. When the campaign ends, a winner is randomly selected using our verifiable random number generator (VRNG). All draws are live-streamed for transparency.' },
  { q: 'How do I know the draws are fair?', a: 'We use a cryptographically secure Verifiable Random Number Generator (VRNG) that produces provably fair results. Each draw can be independently verified. Our source code is open for audit and all draw algorithms are published before each campaign begins.' },
  { q: 'How do I purchase a ticket?', a: 'Simply create a free account, browse active campaigns, select the one you want to enter, choose how many tickets you\'d like (more tickets = higher chance), and pay securely with your card, bank transfer, or USSD. That\'s it — you\'re in!' },
  { q: 'How will I know if I win?', a: 'Winners are announced on our website, on our social media channels, and via email/SMS directly to the winner. If you win, you\'ll also see a notification in your WINBIG dashboard. We\'ll never ask you for fees to claim your prize.' },
  { q: 'How do I withdraw my winnings?', a: 'Nigerian winners can withdraw directly to their Nigerian bank account via NIBSS instant transfer. International winners can receive via wire transfer or mobile money. All withdrawals are processed within 24 hours of winner confirmation.' },
  { q: 'What payment methods are accepted?', a: 'We accept all major Nigerian debit/credit cards (Visa, Mastercard, Verve), bank transfers, USSD payments (*919#), and mobile money (O Pay, PalmPay, etc.). All transactions are secured with 256-bit SSL encryption.' },
  { q: 'Are there any fees to participate?', a: 'The only fee is the ticket price — there are no hidden charges, registration fees, or subscription costs. You only pay for the tickets you want to buy.' },
  { q: 'Can I buy tickets as a gift for someone else?', a: 'Yes! During checkout, you can designate the tickets to another person\'s name. They\'ll receive an email notification and their ticket confirmation.' },
  { q: 'What happens if a campaign doesn\'t sell out?', a: 'All campaigns have a set minimum number of tickets that must be sold for the draw to proceed. If the minimum isn\'t reached, the campaign is extended or all purchasers receive a full refund automatically — no questions asked.' },
  { q: 'Is WINBIG AFRICA licensed and legal?', a: 'WINBIG AFRICA operates as a promotional lottery platform under Nigerian law. We are fully registered as a Nigerian business and comply with all applicable federal and state regulations regarding prize promotions and financial transactions.' },
  { q: 'What is the minimum age to participate?', a: 'You must be at least 18 years old to create an account and purchase tickets on WINBIG AFRICA. Age verification is required during registration and before any prize can be claimed.' },
  { q: 'How are prizes delivered?', a: 'Cash prizes are paid directly to the winner\'s bank account. Physical prizes (cars, electronics, etc.) are delivered at a location of the winner\'s choosing within Nigeria. International shipping is available for eligible prizes — details are specified per campaign.' },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(prev => prev === i ? null : i);

  return (
    <div className="min-h-screen bg-light-gray">
      <Navbar />

      <section className="bg-deep-blue py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.5) 0%, transparent 60%)' }} />
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <span className="text-gold font-bold text-sm uppercase tracking-wider">Got Questions?</span>
            <h1 className="text-4xl sm:text-5xl font-black text-white mt-3 mb-4">Frequently Asked Questions</h1>
            <p className="text-gray-400 text-lg">Everything you need to know about WINBIG AFRICA. If you don&apos;t find your answer here, our support team is ready to help 24/7.</p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-14">
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.04 }}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm"
            >
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-semibold text-deep-blue text-sm pr-4">{faq.q}</span>
                <motion.span
                  animate={{ rotate: openIndex === i ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-gold font-black text-lg flex-shrink-0"
                >
                  +
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 text-gray-500 text-sm leading-relaxed border-t border-gray-50 pt-4">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center bg-deep-blue rounded-2xl p-8">
          <h3 className="text-white font-bold text-lg mb-2">Still have questions?</h3>
          <p className="text-gray-400 text-sm mb-5">Our team is available 24/7 on WhatsApp, email, and in-app chat.</p>
          <a href="mailto:support@winbig.africa">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }} className="bg-gold text-deep-blue font-bold px-6 py-3 rounded-xl">
              Contact Support →
            </motion.button>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
