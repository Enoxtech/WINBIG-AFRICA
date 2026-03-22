'use client';
import { useState, useEffect } from 'react';

const initialWinners = [
  { id: 1, name: 'Chidi Okafor', city: 'Lagos', prize: '₦2,500,000', time: '2 mins ago', initials: 'CO' },
  { id: 2, name: 'Aisha Mohammed', city: 'Abuja', prize: '₦500,000', time: '7 mins ago', initials: 'AM' },
  { id: 3, name: 'Emeka Nwosu', city: 'Port Harcourt', prize: '₦1,200,000', time: '12 mins ago', initials: 'EN' },
  { id: 4, name: 'Funke Adeleke', city: 'Ibadan', prize: '₦5,000,000', time: '18 mins ago', initials: 'FA' },
  { id: 5, name: 'Tunde Bakare', city: 'Kano', prize: '₦750,000', time: '25 mins ago', initials: 'TB' },
  { id: 6, name: 'Ngozi Ibe', city: 'Enugu', prize: '₦3,000,000', time: '31 mins ago', initials: 'NI' },
  { id: 7, name: 'Segun Fashola', city: 'Lagos', prize: '₦1,800,000', time: '43 mins ago', initials: 'SF' },
  { id: 8, name: 'Halima Bello', city: 'Sokoto', prize: '₦450,000', time: '1 hr ago', initials: 'HB' },
];

export default function WinnerLiveFeed() {
  const [winners, setWinners] = useState(initialWinners);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomPrizes = ['₦500,000', '₦750,000', '₦1,200,000', '₦2,500,000', '₦3,000,000', '₦5,000,000'];
      const cities = ['Lagos', 'Abuja', 'Port Harcourt', 'Ibadan', 'Kano', 'Enugu', 'Kaduna', 'Ibadan'];
      const names = ['Ade Williams', 'Blessing Obi', 'Chukwudi Amaechi', 'Damilola Sanusi', 'Ebere Nwachukwu', 'Femi Ayinde', 'Grace Okonkwo', 'Hassan Diallo'];
      const initials = ['AW', 'BO', 'CA', 'DS', 'EN', 'FA', 'GO', 'HD'];
      const newWinner = {
        id: Date.now(),
        name: names[Math.floor(Math.random() * names.length)],
        city: cities[Math.floor(Math.random() * cities.length)],
        prize: randomPrizes[Math.floor(Math.random() * randomPrizes.length)],
        time: 'Just now',
        initials: initials[Math.floor(Math.random() * initials.length)],
      };
      setWinners(prev => [newWinner, ...prev.slice(0, 7)]);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 bg-gold/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-black text-deep-blue mb-3">🏆 Recent Winners</h2>
          <p className="text-gray-500 text-lg">Real wins from real Nigerians</p>
        </div>
        <div className="max-w-2xl mx-auto space-y-3">
          {winners.map((w) => (
            <div key={w.id} className="flex items-center justify-between bg-white rounded-xl px-5 py-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold text-sm">
                  {w.initials}
                </div>
                <div>
                  <p className="font-semibold text-deep-blue text-sm">{w.name}</p>
                  <p className="text-gray-400 text-xs">{w.city}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-deep-blue">{w.prize}</p>
                <p className="text-green-500 text-xs font-medium">{w.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
