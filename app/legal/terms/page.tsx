'use client';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <h1 className="section-title mb-2">Terms & Conditions</h1>
        <p className="text-gray-400 text-sm mb-8">Last Updated: March 20, 2026</p>
        <div className="prose prose-lg max-w-none text-gray-600 space-y-6">
          <p>Welcome to WINBIG AFRICA. By using our platform, you agree to these terms. Please read them carefully.</p>
          <h2 className="text-xl font-bold text-deep-blue">1. Eligibility</h2>
          <p>You must be 18 years or older and a resident of Nigeria to participate in any campaign on WINBIG AFRICA. By registering, you confirm that you meet these requirements.</p>
          <h2 className="text-xl font-bold text-deep-blue">2. Campaign Participation</h2>
          <p>Each campaign has a specified number of tickets and price. Tickets are sold on a first-come, first-served basis. Purchasing a ticket does not guarantee a win — all draws are random.</p>
          <h2 className="text-xl font-bold text-deep-blue">3. Draw Process</h2>
          <p>Winners are selected using a random selection process from all valid tickets sold. The draw occurs automatically when a campaign reaches its end date or sells out. Winners are announced publicly on the platform.</p>
          <h2 className="text-xl font-bold text-deep-blue">4. Prizes</h2>
          <p>WINBIG AFRICA is not responsible for the delivery of prizes. Prize details are as described in each campaign. Any disputes regarding prizes should be directed to the campaign organizer.</p>
          <h2 className="text-xl font-bold text-deep-blue">5. Refunds</h2>
          <p>All ticket purchases are final. Refunds are only provided at the sole discretion of WINBIG AFRICA. See our Refund Policy for full details.</p>
          <h2 className="text-xl font-bold text-deep-blue">6. Account Responsibilities</h2>
          <p>You are responsible for maintaining the confidentiality of your account and password. WINBIG AFRICA is not liable for any loss or damage arising from unauthorized use of your account.</p>
          <h2 className="text-xl font-bold text-deep-blue">7. Privacy</h2>
          <p>Your personal information is handled in accordance with our Privacy Policy. We collect and store data necessary for platform operations only.</p>
          <h2 className="text-xl font-bold text-deep-blue">8. Limitation of Liability</h2>
          <p>WINBIG AFRICA is not liable for any indirect, incidental, or consequential loss arising from participation in any campaign.</p>
          <h2 className="text-xl font-bold text-deep-blue">9. Changes to Terms</h2>
          <p>WINBIG AFRICA reserves the right to update these terms at any time. Continued use of the platform constitutes acceptance of updated terms.</p>
          <h2 className="text-xl font-bold text-deep-blue">10. Contact</h2>
          <p>For questions about these terms, contact us at support@winbigafrica.com</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
