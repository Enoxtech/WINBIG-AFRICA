'use client';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-light-gray">
      <Navbar />

      <section className="bg-deep-blue py-16">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <h1 className="text-4xl font-black text-white mb-2">Privacy Policy</h1>
            <p className="text-gray-400 text-sm">Last updated: March 21, 2026</p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-14">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl p-8 shadow-sm space-y-8">

          <div>
            <h2 className="text-xl font-bold text-deep-blue mb-3">1. Introduction</h2>
            <p className="text-gray-600 text-sm leading-relaxed">WINBIG AFRICA LIMITED (&quot;WINBIG,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, mobile application, and related services (collectively, the &quot;Platform&quot;). This policy complies with the Nigeria Data Protection Regulation (NDPR) 2019 and other applicable laws.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-deep-blue mb-3">2. Information We Collect</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-2">We collect the following categories of information:</p>
            <ul className="text-gray-600 text-sm space-y-1 list-disc pl-5">
              <li><strong>Account Information:</strong> Full name, email address, phone number, date of birth, and mailing address.</li>
              <li><strong>Payment Information:</strong> Card details, bank account information, and transaction history (processed securely via our payment processor; we do not store full card numbers).</li>
              <li><strong>Identity Verification:</strong> Government-issued ID, biometric data (where required for prize claims).</li>
              <li><strong>Usage Data:</strong> Device type, IP address, browser type, pages visited, and interaction data collected via cookies and similar technologies.</li>
              <li><strong>Communication Data:</strong> Messages, support tickets, and feedback you send us.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-deep-blue mb-3">3. How We Use Your Information</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-2">We use your information to:</p>
            <ul className="text-gray-600 text-sm space-y-1 list-disc pl-5">
              <li>Process ticket purchases and distribute prizes</li>
              <li>Create and manage your account</li>
              <li>Send transactional emails (purchase confirmations, draw results, winner notifications)</li>
              <li>Comply with legal obligations (KYC, anti-fraud, regulatory reporting)</li>
              <li>Improve our Platform and customer service</li>
              <li>Send promotional communications (you can opt out at any time)</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-deep-blue mb-3">4. Data Sharing</h2>
            <p className="text-gray-600 text-sm leading-relaxed">We do not sell your personal data. We may share your information with: (a) payment processors and banks to process transactions; (b) regulatory authorities as required by Nigerian law; (c) auditors or legal counsel in the event of a dispute or investigation; (d) third-party service providers who host or maintain our systems (bound by confidentiality agreements). Winner names and cities may be published for promotional purposes unless you specifically opt out.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-deep-blue mb-3">5. Data Retention</h2>
            <p className="text-gray-600 text-sm leading-relaxed">We retain your account data for as long as your account is active and for a period of 7 years after account closure for legal and regulatory compliance purposes. Transaction records are retained for 7 years per Nigerian Financial Regulations requirements. You may request deletion of your data at any time, subject to our legal retention obligations.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-deep-blue mb-3">6. Data Security</h2>
            <p className="text-gray-600 text-sm leading-relaxed">We implement industry-standard technical and organizational security measures including 256-bit SSL encryption, secure cloud hosting, access controls, regular security audits, and staff training. No method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-deep-blue mb-3">7. Your Rights (Under NDPR)</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-2">You have the right to:</p>
            <ul className="text-gray-600 text-sm space-y-1 list-disc pl-5">
              <li>Access your personal data upon written request</li>
              <li>Rectify inaccurate personal data</li>
              <li>Request erasure of your data (subject to legal holds)</li>
              <li>Restrict or object to processing of your data</li>
              <li>Data portability where applicable</li>
              <li>Withdraw consent to marketing communications at any time</li>
            </ul>
            <p className="text-gray-600 text-sm leading-relaxed mt-2">To exercise any of these rights, email <strong>privacy@winbig.africa</strong>. We will respond within 30 days.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-deep-blue mb-3">8. Cookies & Tracking</h2>
            <p className="text-gray-600 text-sm leading-relaxed">We use cookies and similar technologies to: remember your login session, analyze site traffic, personalize content, and serve relevant advertisements. You can control cookie preferences through your browser settings. Disabling cookies may affect Platform functionality.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-deep-blue mb-3">9. Children&apos;s Privacy</h2>
            <p className="text-gray-600 text-sm leading-relaxed">WINBIG AFRICA does not knowingly collect personal information from anyone under 18 years of age. If we discover that we have collected data from a minor, we will delete it immediately. If you believe a minor has used our Platform, please contact us at <strong>privacy@winbig.africa</strong>.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-deep-blue mb-3">10. International Transfers</h2>
            <p className="text-gray-600 text-sm leading-relaxed">Your data is processed and stored primarily in Nigeria. Where we use cloud service providers with servers outside Nigeria, we ensure appropriate data transfer mechanisms (such as Standard Contractual Clauses) are in place in compliance with NDPR Article 27.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-deep-blue mb-3">11. Changes to This Policy</h2>
            <p className="text-gray-600 text-sm leading-relaxed">We may update this Privacy Policy from time to time. The updated version will be indicated by a revised &quot;Last updated&quot; date at the top of this page. We encourage you to review this Policy periodically.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-deep-blue mb-3">12. Contact Us</h2>
            <p className="text-gray-600 text-sm leading-relaxed">WINBIG AFRICA LIMITED, 15 Admiralty Way, Lekki Phase 1, Lagos, Nigeria.<br />Email: <strong>privacy@winbig.africa</strong><br />Phone: <strong>+234 800 WINBIG (800 946 244)</strong></p>
          </div>

        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
