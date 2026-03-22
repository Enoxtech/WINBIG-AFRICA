'use client';
export default function TrustBadges() {
  const badges = [
    { icon: '🛡️', text: 'Licensed & Regulated' },
    { icon: '🔒', text: 'Secure Payments' },
    { icon: '⚡', text: 'Instant Payouts' },
    { icon: '💬', text: '24/7 Support' },
  ];
  return (
    <div className="bg-white border-b border-gray-100 py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-6 sm:gap-10 md:gap-16">
          {badges.map((b, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
              <span className="text-lg">{b.icon}</span>
              <span className="font-medium">{b.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
