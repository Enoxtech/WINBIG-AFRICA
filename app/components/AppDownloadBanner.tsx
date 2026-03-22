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
          <div className="flex flex-col sm:flex-row gap-4">
            {/* App Store Badge */}
            <a href="#" className="flex items-center gap-3 bg-black hover:bg-gray-800 rounded-xl px-5 py-3 transition-colors min-w-[160px]">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <div>
                <div className="text-white text-[10px] leading-none">Download on the</div>
                <div className="text-white text-sm font-semibold leading-none">App Store</div>
              </div>
            </a>
            {/* Google Play Badge */}
            <a href="#" className="flex items-center gap-3 bg-black hover:bg-gray-800 rounded-xl px-5 py-3 transition-colors min-w-[160px]">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
                <path d="M3.18 23.76c.36.2.8.2 1.16 0l10.56-6.07a.85.85 0 0 0 .43-.73V.93a.87.87 0 0 0-1.23-.74L2.75 6.32A.87.87 0 0 0 2 6.93V23.2a.87.87 0 0 0 .48.74l.7.38zm10.13-6.18l-3.3 1.9v-3.8l3.3 1.9zM4.73 7.75l4.64 2.67-2.22 1.28-2.42-4.15v.2zm5.07 1.42L6.4 7.07l2.21-1.28 2.4 4.15-1.21.73zm-.36 6.62l2.86-1.65 1.02 1.8-3.88 2.21v-2.36zm4.17-3.36l-2.1 1.2-1.02-1.8 3.12-1.79v2.39z"/>
              </svg>
              <div>
                <div className="text-white text-[10px] leading-none">Get it on</div>
                <div className="text-white text-sm font-semibold leading-none">Google Play</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
