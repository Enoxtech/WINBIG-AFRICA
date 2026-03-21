'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  { q: 'How does WINBIG AFRICA work?', a: 'WINBIG AFRICA is an online lottery platform where you purchase raffle tickets for various prize campaigns. When a campaign reaches its deadline, a winner is randomly selected and announced. You can win cash prizes, cars, gadgets, and more!' },
  { q: 'How do I buy a ticket?', a: 'Simply create a free account, browse active campaigns, choose the one you want to enter, select how many tickets you want to buy, and pay securely. Each ticket gives you one entry into the draw.' },
  { q: 'How are winners selected?', a: 'Winners are selected using a cryptographically secure random number generator (RNG). The draw process is completely transparent — we publish the algorithm and allow independent verification.' },
  { q: 'How do I receive my winnings?', a: 'For cash prizes, winnings are credited directly to your WINBIG wallet. You can then withdraw to your Nigerian bank account (Naira) via NIBSS transfer. For physical prizes like cars, our team will contact you to arrange delivery.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major Nigerian bank transfers, USSD payments, and major debit/credit cards (Visa, Mastercard). Your payment information is encrypted and never stored on our servers.' },
  { q: 'Is WINBIG AFRICA legal?', a: 'WINBIG AFRICA operates in full compliance with Nigerian laws, including the National Lottery Regulatory Commission (NLRC) guidelines. We are committed to responsible gaming and hold a valid operating license.' },
  { q: 'What happens if a campaign doesn\'t sell out?', a: 'Every campaign has a minimum ticket threshold. If the threshold isn\'t met by the deadline, the campaign is cancelled and all ticket purchases are refunded automatically to your wallet.' },
  { q: 'Can I cancel or get a refund on my ticket?', a: 'All ticket purchases are final. Raffle tickets are not refundable once purchased. Please make sure you review the campaign details carefully before purchasing.' },
  { q: 'How do I know the draws are fair?', a: 'We use provably fair technology — each draw uses a seed that combines our server secret with the campaign\'s ticket pool. The algorithm is open-source and can be audited by anyone. Winners are verified and published.' },
  { q: 'What is the minimum age to participate?', a: 'You must be at least 18 years old to create an account and participate in any WINBIG AFRICA campaign. We verify age during registration and may request identification at any time.' },
  { q: 'How do I contact customer support?', a: 'You can reach us via WhatsApp at +234 800 WINBIG, by email at support@winbig.africa, or through the in-app chat. Our team is available Monday to Saturday, 8am — 8pm WAT.' },
  { q: 'Can I refer friends to WINBIG?', a: 'Yes! Each user gets a unique referral link from their dashboard. When your friend signs up using your link and buys their first ticket, you earn a free ticket credit. There\'s no limit on referrals!' },
];

export default function FAQPage() {
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-light-gray">
      <section className="bg-deep-blue py-20 text-center px-4">
        <h1 className="text-5xl font-black text-white mb-3">FAQ</h1>
        <p className="text-gray-400 text-lg">Everything you need to know about WINBIG AFRICA</p>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-14 space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <button
              onClick={() => setOpenId(openId === i ? null : i)}
              className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
            >
              <span className="font-semibold text-deep-blue pr-4">{faq.q}</span>
              <motion.span
                animate={{ rotate: openId === i ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-gold text-xl flex-shrink-0"
              >
                ▼
              </motion.span>
            </button>
            <AnimatePresence>
              {openId === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-5 text-gray-500 text-sm leading-relaxed border-t border-gray-100 pt-4">
                    {faq.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="text-center pb-14 px-4">
        <p className="text-gray-500 mb-4">Still have questions?</p>
        <a href="mailto:support@winbig.africa" className="bg-gold text-deep-blue font-bold px-8 py-3 rounded-xl hover:bg-yellow-400 transition-colors inline-block">
          Contact Support 📧
        </a>
      </div>
    </div>
  );
}
