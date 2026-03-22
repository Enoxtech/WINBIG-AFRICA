'use client';
export default function AppDownloadBanner() {
  return (
    <section className="py-16 bg-deep-blue">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 max-w-4xl mx-auto">
          <div className="text-center md:text-left">
            <div className="inline-block bg-gold/20 text-gold text-xs font-bold px-3 py-1 rounded-full mb-3">
              📱 COMING SOON
            </div>
            <h3 className="text-3xl font-black text-white mb-2">Get the WINBIG Mobile App</h3>
            <p className="text-gray-400 mb-1">Play, win, and manage your tickets — all from your phone.</p>
            <p className="text-gray-500 text-sm">iOS & Android — Available soon</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="bg-white/10 border border-white/20 rounded-xl px-6 py-4 text-center min-w-[140px]">
              <div className="text-3xl mb-1">🍎</div>
              <p className="text-white text-xs font-medium">App Store</p>
              <p className="text-gray-400 text-xs">Coming Soon</p>
            </div>
            <div className="bg-white/10 border border-white/20 rounded-xl px-6 py-4 text-center min-w-[140px]">
              <div className="text-3xl mb-1">🤖</div>
              <p className="text-white text-xs font-medium">Google Play</p>
              <p className="text-gray-400 text-xs">Coming Soon</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
