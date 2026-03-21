'use client';
import Link from 'next/link';

export default function WinnersPage() {
  const winners = [
    { id: 1, name: 'Chioma A.', city: 'Lagos', prize: '₦500,000', type: 'cash', date: 'March 2026', avatar: 'C', gradient: 'from-green-500 to-emerald-600' },
    { id: 2, name: 'Emeka N.', city: 'Abuja', prize: 'Toyota Camry 2025', type: 'cars', date: 'March 2026', avatar: 'E', gradient: 'from-blue-500 to-indigo-600' },
    { id: 3, name: 'Funke O.', city: 'Ibadan', prize: '₦1,000,000', type: 'cash', date: 'March 2026', avatar: 'F', gradient: 'from-green-500 to-emerald-600' },
    { id: 4, name: 'Segun K.', city: 'Port Harcourt', prize: 'iPhone 16 Pro Max', type: 'gadgets', date: 'Feb 2026', avatar: 'S', gradient: 'from-gray-700 to-gray-900' },
    { id: 5, name: 'Aisha M.', city: 'Kano', prize: '₦250,000', type: 'cash', date: 'Feb 2026', avatar: 'A', gradient: 'from-green-500 to-emerald-600' },
    { id: 6, name: 'Olumide T.', city: 'Lagos', prize: '₦5,000,000', type: 'jackpot', date: 'Feb 2026', avatar: 'O', gradient: 'from-yellow-400 to-amber-500' },
    { id: 7, name: 'Blessing E.', city: 'Benin City', prize: '₦750,000', type: 'cash', date: 'Jan 2026', avatar: 'B', gradient: 'from-green-500 to-emerald-600' },
    { id: 8, name: 'Ibrahim S.', city: 'Kaduna', prize: 'MacBook Air M3', type: 'gadgets', date: 'Jan 2026', avatar: 'I', gradient: 'from-gray-700 to-gray-900' },
    { id: 9, name: 'Ngozi P.', city: 'Enugu', prize: '₦300,000', type: 'cash', date: 'Jan 2026', avatar: 'N', gradient: 'from-green-500 to-emerald-600' },
    { id: 10, name: 'Adebola R.', city: 'Ilorin', prize: '₦2,000,000', type: 'jackpot', date: 'Dec 2025', avatar: 'A', gradient: 'from-yellow-400 to-amber-500' },
    { id: 11, name: 'Halima J.', city: 'Sokoto', prize: 'PS5 Bundle', type: 'gadgets', date: 'Dec 2025', avatar: 'H', gradient: 'from-gray-700 to-gray-900' },
    { id: 12, name: 'Chukwudi O.', city: 'Onitsha', prize: '₦1,500,000', type: 'cash', date: 'Dec 2025', avatar: 'C', gradient: 'from-green-500 to-emerald-600' },
  ];

  const filters = ['all', 'cash', 'cars', 'gadgets', 'jackpot'];
  const labels: Record<string, string> = { all: 'All', cash: '💰 Cash', cars: '🚗 Cars', gadgets: '📱 Gadgets', jackpot: '🏆 Jackpots' };

  let currentFilter = 'all';
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    currentFilter = params.get('filter') || 'all';
  }

  return (
    <div className="min-h-screen bg-light-gray">
      {/* Hero */}
      <section className="bg-deep-blue py-20 text-center px-4">
        <h1 className="text-5xl font-black text-white mb-4">Wall of Fame</h1>
        <p className="text-gray-400 text-lg">Our winners — proof that dreams come true 🇳🇬</p>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-14">
        {/* Filter tabs */}
        <div className="flex flex-wrap gap-3 mb-10">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => {
                const url = new URL(window.location.href);
                url.searchParams.set('filter', f);
                window.location.href = url.toString();
              }}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                currentFilter === f
                  ? 'bg-gold text-deep-blue'
                  : 'bg-white text-gray-600 hover:bg-gold/20'
              }`}
            >
              {labels[f]}
            </button>
          ))}
        </div>

        {/* Winners grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {winners
            .filter(w => currentFilter === 'all' || w.type === currentFilter)
            .map((w, i) => (
              <div
                key={w.id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`h-2 bg-gradient-to-r ${w.gradient}`} />
                <div className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${w.gradient} flex items-center justify-center text-white font-black text-xl mb-4 shadow-lg`}>
                    {w.avatar}
                  </div>
                  <h3 className="font-bold text-deep-blue">{w.name}</h3>
                  <p className="text-gray-400 text-xs mb-3">📍 {w.city}</p>
                  <div className="bg-gold/10 rounded-xl p-3 mb-3">
                    <p className="text-gold font-black text-sm">{w.prize}</p>
                  </div>
                  <p className="text-gray-400 text-xs">{w.date}</p>
                </div>
              </div>
            ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-14">
          <p className="text-gray-500 mb-4">Think you could be our next winner?</p>
          <Link href="/campaigns">
            <button className="bg-gold text-deep-blue font-bold px-8 py-3 rounded-xl hover:bg-yellow-400 transition-colors">
              Enter a Campaign 🎟️
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
