import ClientLayout from './ClientLayout';
import ClientPageTransition from './components/ClientPageTransition';
import UrgencyBanner from './components/UrgencyBanner';

export default function HomePage() {
  return (
    <ClientLayout>
      <ClientPageTransition>
        <UrgencyBanner />
        <HomePageContent />
      </ClientPageTransition>
    </ClientLayout>
  );
}

function HomePageContent() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-deep-blue pt-12 pb-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-gold rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <span className="text-gold text-sm font-bold">🎉</span>
            <span className="text-white/80 text-sm">Nigeria's Most Trusted Raffle Platform</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
            Win Life-Changing<br />
            <span className="text-gold">Cash Prizes</span> 🎉
          </h1>

          <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
            Enter raffles for as little as ₦100. Win millions. New draws every week.
            Nigeria's biggest raffle community — over 50,000 winners!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <a href="/campaigns" className="btn-primary text-lg px-8 py-4">
              🎟️ Enter a Raffle Now
            </a>
            <a href="/about" className="btn-outline text-lg px-8 py-4">
              How It Works
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-8 mb-8">
            {[
              { label: 'Winners', value: '50,000+', icon: '🏆' },
              { label: 'Paid Out', value: '₦500M+', icon: '💰' },
              { label: 'Draws', value: 'Daily', icon: '🎲' },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-2">
                <span className="text-2xl">{stat.icon}</span>
                <div className="text-left">
                  <div className="text-white font-black text-lg">{stat.value}</div>
                  <div className="text-white/50 text-xs">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Live Draw Badge */}
          <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-full px-5 py-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="text-red-300 font-bold text-sm">Live Draws Every Week</span>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-gray-100 sticky top-[73px] z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Winners', value: '50,000+', icon: '🏆' },
            { label: 'Prizes Won', value: '₦500M+', icon: '💰' },
            { label: 'Verified', value: '100%', icon: '✅' },
            { label: 'Support', value: '24/7', icon: '💬' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl mb-0.5">{s.icon}</div>
              <div className="font-black text-deep-blue text-lg">{s.value}</div>
              <div className="text-gray-400 text-xs">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-gold font-bold text-sm uppercase tracking-widest">Simple Process</span>
            <h2 className="text-3xl md:text-4xl font-black text-deep-blue mt-2">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { n: '01', icon: '🎯', title: 'Pick a Raffle', desc: 'Browse our active campaigns and choose the raffles you want to enter.' },
              { n: '02', icon: '💳', title: 'Buy Tickets', desc: 'Purchase your tickets securely with card, bank transfer, or USSD.' },
              { n: '03', icon: '🎲', title: 'Wait for Draw', desc: 'Watch the live draw on our social media. Random & verified!' },
              { n: '04', icon: '💰', title: 'Win & Celebrate', desc: 'Winners are notified instantly. Your prize, your rules.' },
            ].map((step) => (
              <div key={step.n} className="bg-white rounded-2xl p-6 border border-gray-100 text-center relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-deep-blue text-white w-8 h-8 rounded-full flex items-center justify-center text-xs font-black">{step.n}</div>
                <div className="text-4xl mb-3">{step.icon}</div>
                <h3 className="font-black text-deep-blue mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Campaigns */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-gold font-bold text-sm uppercase tracking-widest">Limited Time</span>
              <h2 className="text-3xl md:text-4xl font-black text-deep-blue mt-2">Active Campaigns</h2>
            </div>
            <a href="/campaigns" className="text-gold font-bold hover:underline text-sm">View All →</a>
          </div>
          <FeaturedCampaigns />
        </div>
      </section>

      {/* Winner Ticker */}
      <WinnerTicker />

      {/* Testimonials */}
      <section className="py-20 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-gold font-bold text-sm uppercase tracking-widest">Real Winners</span>
            <h2 className="text-3xl md:text-4xl font-black text-deep-blue mt-2">What Winners Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Chioma A.', city: 'Lagos', text: 'I never thought I could win anything online. WINBIG changed my life — won ₦5M and it was credited same day!', stars: 5, icon: '👩🏿‍💼' },
              { name: 'Emeka O.', city: 'Abuja', text: 'The weekly raffles are legit. Been playing for 3 months and finally won ₦500K. Customer support is amazing too!', stars: 5, icon: '👨🏿‍🔧' },
              { name: 'Fatima K.', city: 'Kano', text: 'Easy to use, fast payouts, real winners. I tell everyone about WINBIG. This platform is a game-changer for Nigeria!', stars: 5, icon: '👩🏿‍🎓' },
            ].map((r) => (
              <div key={r.name} className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{r.icon}</span>
                  <div>
                    <div className="font-bold text-deep-blue text-sm">{r.name}</div>
                    <div className="text-gray-400 text-xs">{r.city}</div>
                  </div>
                  <div className="ml-auto text-gold text-sm">{'★'.repeat(r.stars)}</div>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">"{r.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-gradient-to-br from-deep-blue via-deep-blue to-green-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">Ready to Try Your Luck?</h2>
          <p className="text-white/70 text-lg mb-8">Join 50,000+ Nigerians already winning on WINBIG. Your first ticket could change everything.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/campaigns" className="btn-primary text-lg px-8 py-4">
              🎟️ Get Your First Ticket
            </a>
            <a href="/winners" className="btn-outline text-lg px-8 py-4">
              🏆 See Past Winners
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function FeaturedCampaigns() {
  const campaigns = [
    { id: '1', title: '₦5,000,000 Mega Jackpot', prize: '₦5,000,000', price: '₦500', sold: 8432, total: 10000, end: '2026-03-25T23:59:59Z', badge: 'JACKPOT', img: '💎' },
    { id: '2', title: '₦500,000 Weekly Raffle', prize: '₦500,000', price: '₦200', sold: 3201, total: 5000, end: '2026-03-23T23:59:59Z', badge: 'HOT', img: '🔥' },
    { id: '3', title: '₦100,000 Daily Draw', prize: '₦100,000', price: '₦100', sold: 1892, total: 2000, end: '2026-03-22T23:59:59Z', badge: null, img: '🎯' },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {campaigns.map((c) => {
        const pct = Math.round((c.sold / c.total) * 100);
        return (
          <div key={c.id} className="bg-light-gray rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="h-40 bg-gradient-to-br from-deep-blue to-deep-blue/80 flex items-center justify-center text-6xl relative">
              {c.img}
              {c.badge && (
                <span className={`absolute top-3 right-3 text-xs font-black px-3 py-1 rounded-full ${
                  c.badge === 'JACKPOT' ? 'bg-gold text-deep-blue' : 'bg-red-500 text-white'
                }`}>
                  {c.badge === 'JACKPOT' ? '💎 JACKPOT' : '🔥 HOT'}
                </span>
              )}
            </div>
            <div className="p-5">
              <h3 className="font-black text-deep-blue text-lg mb-1">{c.title}</h3>
              <p className="text-gold font-black text-2xl mb-1">{c.prize}</p>
              <p className="text-gray-400 text-sm mb-3">Ticket: {c.price}</p>
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>{c.sold} sold</span>
                  <span>{pct}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-gold to-gold/70 rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs">Ends in 2d 7h</span>
                <a href={`/campaigns/${c.id}`} className="btn-primary !py-2 !px-4 text-sm">
                  Enter →
                </a>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function WinnerTicker() {
  const winners = [
    '🎉 Chioma A. just won ₦5,000,000!',
    '🏆 Emeka N. won ₦500,000 on Weekly Raffle!',
    '🎊 Fatima K. won ₦100,000 Daily Draw!',
    '⭐ Ibrahim S. won ₦50,000 Bonus Draw!',
    '🎉 Adebayo M. won ₦250,000 Mega Jackpot!',
  ];
  return (
    <section className="py-12 bg-deep-blue overflow-hidden">
      <div className="flex items-center gap-8 animate-ticker whitespace-nowrap">
        {[...winners, ...winners].map((w, i) => (
          <span key={i} className="text-white/80 font-semibold text-sm">{w}</span>
        ))}
      </div>
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker { animation: ticker 30s linear infinite; }
      `}</style>
    </section>
  );
}
