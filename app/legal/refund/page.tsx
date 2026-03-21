'use client';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <h1 className="section-title mb-2">Refund Policy</h1>
        <p className="text-gray-400 text-sm mb-8">Last Updated: March 20, 2026</p>
        <div className="prose prose-lg max-w-none text-gray-600 space-y-6">
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 mb-6">
            <p className="text-orange-800 font-medium text-sm">⚠️ Important: Please read this policy carefully before purchasing any tickets.</p>
          </div>
          <h2 className="text-xl font-bold text-deep-blue">1. No Refunds Policy</h2>
          <p>All ticket purchases on WINBIG AFRICA are <strong>final</strong>. By purchasing a ticket, you acknowledge that you are entering a voluntary raffle and understand that ticket purchases are non-refundable under normal circumstances.</p>
          <h2 className="text-xl font-bold text-deep-blue">2. Exception: Campaign Cancellation</h2>
          <p>If WINBIG AFRICA cancels a campaign (e.g., due to technical fraud, organizer request, or legal requirement), all participants will receive a full refund of their ticket purchase price within 14 business days.</p>
          <h2 className="text-xl font-bold text-deep-blue">3. Exception: Technical Errors</h2>
          <p>If a ticket purchase fails due to a technical error on our platform (e.g., duplicate charges, payment deducted but ticket not issued), please contact us within 48 hours with proof of payment. We will investigate and process a refund if warranted.</p>
          <h2 className="text-xl font-bold text-deep-blue">4. How to Request a Refund</h2>
          <p>To request a refund, email <span className="text-gold">support@winbigafrica.com</span> with:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Your full name and registered email address</li>
            <li>Campaign name and date of purchase</li>
            <li>Transaction reference or payment proof</li>
            <li>Description of the issue</li>
          </ul>
          <h2 className="text-xl font-bold text-deep-blue">5. Response Time</h2>
          <p>We aim to respond to all refund requests within 48 hours. Approved refunds are processed within 14 business days to your original payment method.</p>
          <h2 className="text-xl font-bold text-deep-blue">6. Disputes</h2>
          <p>If you believe a refund is warranted beyond these exceptions, you may escalate to support@winbigafrica.com. Our team will review your case and make a final determination.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
