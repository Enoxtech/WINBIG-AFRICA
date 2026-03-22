'use client';
import { useState } from 'react';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const faqs = [
    { q: 'How do I buy a lottery ticket?', a: 'Browse our active campaigns, choose your lucky numbers or go with a quick pick, and pay securely via Paystack. Your ticket is confirmed instantly.' },
    { q: 'How are winners determined?', a: 'Winners are selected through a verified random draw using our certified RNG (Random Number Generator) system. All draws are live-streamed for transparency.' },
    { q: 'How do I receive my winnings?', a: 'Winnings are credited directly to your WINBIG wallet instantly after the draw. You can withdraw to your bank account at any time with no hidden charges.' },
    { q: 'Is WINBIG licensed and legal?', a: 'Yes. WINBIG AFRICA operates under applicable regulations. We are committed to legal compliance, transparency, and responsible gaming.' },
    { q: 'What payment methods are accepted?', a: 'We accept all major debit/credit cards, bank transfers, and USSD payments through our secure Paystack payment gateway.' },
    { q: 'Can I play from any state in Nigeria?', a: 'Yes! WINBIG is fully online, so you can participate from any state in Nigeria. All you need is a phone or computer and an internet connection.' },
  ];
  return (
    <section className="py-20 bg-gold/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-deep-blue mb-3">Frequently Asked Questions</h2>
          <p className="text-gray-500 text-lg">Everything you need to know</p>
        </div>
        <div className="max-w-2xl mx-auto space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-deep-blue text-sm sm:text-base">{faq.q}</span>
                <span className={`text-gold text-xl flex-shrink-0 ml-2 transition-transform ${openIndex === i ? 'rotate-45' : ''}`}>+</span>
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5 text-gray-500 text-sm leading-relaxed border-t border-gray-50 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
