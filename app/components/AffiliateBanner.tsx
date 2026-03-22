'use client';
export default function AffiliateBanner() {
  return (
    <section className="py-14 bg-gradient-to-r from-gold via-yellow-400 to-gold">
      <div className="container mx-auto px-4 text-center">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10">
          <div className="text-deep-blue">
            <span className="text-4xl mb-2 block">🎁</span>
            <h3 className="text-2xl font-black">Invite Friends & Earn</h3>
            <p className="text-deep-blue/70 font-medium mt-1">Get <strong>₦500</strong> for every friend who signs up and buys a ticket</p>
          </div>
          <div className="flex flex-col gap-3">
            <div className="bg-white/20 backdrop-blur rounded-xl px-6 py-3 text-deep-blue">
              <span className="text-2xl font-black">₦500</span>
              <span className="text-sm font-medium ml-2">per referral</span>
            </div>
            <button className="bg-deep-blue hover:bg-blue-900 text-white font-bold px-8 py-3 rounded-full transition-colors text-sm">
              Get Your Referral Link
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
