'use client';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-light-gray">
      <Navbar />

      <section className="bg-deep-blue py-16">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <h1 className="text-4xl font-black text-white mb-2">Terms & Conditions</h1>
            <p className="text-gray-400 text-sm">Last updated: March 21, 2026</p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-14">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl p-8 shadow-sm space-y-8">

          <div>
            <h2 className="text-xl font-bold text-deep-blue mb-3">1. Acceptance of Terms</h2>
            <p className="text-gray-600 text-sm leading-relaxed">By accessing and using WINBIG AFRICA (&quot;the Platform&quot;), operated by WINBIG AFRICA LIMITED, a company registered under the laws of the Federal Republic of Nigeria (RC: 1234567), you agree to be bound by these Terms & Conditions (&quot;Terms&quot;). If you do not agree to these Terms, please do not use the Platform.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-deep-blue mb-3">2. Eligibility</h2>
            <p className="text-gray-600 text-sm leading-relaxed">You must be at least 18 years of age to create an account or participate in any campaign on WINBIG AFRICA. By registering, you represent and warrant that you are 18+ and legally capable of entering binding contracts under Nigerian law. WINBIG AFRICA reserves the right to request age verification at any time.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-deep-blue mb-3">3. Raffle Campaigns & Ticket Purchases</h2>
            <p className="text-gray-600 text-sm leading-relaxed">Each campaign on WINBIG AFRICA is a promotional raffle. Ticket purchases are final and non-refundable except as described in Section 7. Purchasing a ticket does not guarantee a win. The odds of winning depend on the total number of tickets sold for each campaign. All campaigns have a predetermined end date and prize.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-deep-blue mb-3">4. Winner Selection & Fairness</h2>
            <p className="text-gray-600 text-sm leading-relaxed">Winners are selected using a cryptographically secure Verifiable Random Number Generator (VRNG). The selection algorithm is deterministic and auditable. WINBIG AFRICA will publish the seed and algorithm for each draw before the campaign closes. All draws may be witnessed by an independent auditor. The Platform\'s decision in all draw matters is final and binding.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-deep-blue mb-3">5. Prizes & Delivery</h2>
            <p className="text-gray-600 text-sm leading-relaxed">Prizes are as described in each campaign listing. Cash prizes are paid in Nigerian Naira (NGN) via NIBSS Instant Transfer to the winner\'s verified Nigerian bank account within 24 hours of winner confirmation. Physical prizes are delivered within 14 business days to an address within Nigeria nominated by the winner. WINBIG AFRICA accepts no liability for prizes lost or delayed due to inaccurate information provided by the winner.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-deep-blue mb-3">6. Account Responsibilities</h2>
            <p className="text-gray-600 text-sm leading-relaxed">You are solely responsible for maintaining the confidentiality of your login credentials and for all activities under your account. You agree to provide accurate, current, and complete information during registration and checkout. WINBIG AFRICA reserves the right to suspend or terminate accounts that provide false information or engage in fraudulent activity.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-deep-blue mb-3">7. Refund Policy</h2>
            <p className="text-gray-600 text-sm leading-relaxed">Ticket purchases are generally non-refundable. However, if a campaign fails to meet its minimum ticket threshold, all purchasers will receive a full automatic refund to their original payment method within 5 business days. Refund requests for other reasons will not be honored — please purchase responsibly.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-deep-blue mb-3">8. Limitation of Liability</h2>
            <p className="text-gray-600 text-sm leading-relaxed">WINBIG AFRICA\'s total liability for any claim arising from use of the Platform shall not exceed the total amount paid by the claimant for tickets in the relevant campaign. WINBIG AFRICA shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or other intangible losses.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-deep-blue mb-3">9. Intellectual Property</h2>
            <p className="text-gray-600 text-sm leading-relaxed">All content, branding, logos, and materials on WINBIG AFRICA are the property of WINBIG AFRICA LIMITED and may not be reproduced, distributed, or used for commercial purposes without prior written consent.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-deep-blue mb-3">10. Governing Law</h2>
            <p className="text-gray-600 text-sm leading-relaxed">These Terms shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria. Any disputes shall be subject to the exclusive jurisdiction of the courts of Lagos State, Nigeria.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-deep-blue mb-3">11. Amendments</h2>
            <p className="text-gray-600 text-sm leading-relaxed">WINBIG AFRICA reserves the right to amend these Terms at any time. Continued use of the Platform after any amendments constitutes your acceptance of the revised Terms. We encourage you to review these Terms periodically.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-deep-blue mb-3">12. Contact</h2>
            <p className="text-gray-600 text-sm leading-relaxed">For questions regarding these Terms, please contact us at: <strong>legal@winbig.africa</strong> or WINBIG AFRICA LIMITED, 15 Admiralty Way, Lekki Phase 1, Lagos, Nigeria.</p>
          </div>

        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
