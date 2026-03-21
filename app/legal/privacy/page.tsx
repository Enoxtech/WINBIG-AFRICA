'use client';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <h1 className="section-title mb-2">Privacy Policy</h1>
        <p className="text-gray-400 text-sm mb-8">Last Updated: March 20, 2026</p>
        <div className="prose prose-lg max-w-none text-gray-600 space-y-6">
          <p>WINBIG AFRICA is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your information.</p>
          <h2 className="text-xl font-bold text-deep-blue">1. Information We Collect</h2>
          <p>We collect information you provide directly: name, email address, and payment information when you register or purchase tickets. We also collect usage data such as your IP address and browser type.</p>
          <h2 className="text-xl font-bold text-deep-blue">2. How We Use Your Information</h2>
          <p>We use your information to: operate our platform, process ticket purchases, communicate about campaigns, announce winners, and improve our services. We never sell your personal data to third parties.</p>
          <h2 className="text-xl font-bold text-deep-blue">3. Data Sharing</h2>
          <p>We share your information only with service providers who assist in platform operations (e.g., payment processors). We may also disclose information when required by Nigerian law.</p>
          <h2 className="text-xl font-bold text-deep-blue">4. Data Security</h2>
          <p>We use industry-standard encryption and security measures to protect your data. However, no internet transmission is 100% secure, and we cannot guarantee absolute security.</p>
          <h2 className="text-xl font-bold text-deep-blue">5. Cookies</h2>
          <p>Our platform uses cookies to maintain session state and improve user experience. You can disable cookies in your browser settings, but some features may not work properly.</p>
          <h2 className="text-xl font-bold text-deep-blue">6. Your Rights</h2>
          <p>Under Nigerian data protection law, you have the right to access, correct, or delete your personal data. Contact us at support@winbigafrica.com to exercise these rights.</p>
          <h2 className="text-xl font-bold text-deep-blue">7. Data Retention</h2>
          <p>We retain your data for as long as your account is active or as needed to provide services. We delete or anonymize data when it is no longer needed.</p>
          <h2 className="text-xl font-bold text-deep-blue">8. Contact</h2>
          <p>For privacy-related concerns, contact our Data Protection Officer at support@winbigafrica.com.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
