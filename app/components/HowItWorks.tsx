'use client';
export default function HowItWorks() {
  const steps = [
    { num: '01', icon: '📋', title: 'Choose Your Campaign', desc: 'Browse active lottery campaigns and pick the ones that excite you.' },
    { num: '02', icon: '💳', title: 'Purchase Tickets', desc: 'Buy tickets using our secure payment system with Paystack.' },
    { num: '03', icon: '🎉', title: 'Win Big', desc: ' sit back and wait for the live draw. Winners get paid instantly!' },
  ];
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-black text-deep-blue mb-3">How It Works</h2>
          <p className="text-gray-500 text-lg">Three simple steps to start winning</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((s, i) => (
            <div key={i} className="relative text-center p-8 bg-gold/5 rounded-2xl border border-gold/20 hover:border-gold/40 transition-colors">
              <div className="text-5xl mb-4">{s.icon}</div>
              <div className="absolute top-4 right-4 text-5xl font-black text-gold/10">{s.num}</div>
              <h3 className="text-xl font-bold text-deep-blue mb-2">{s.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-gold text-2xl">→</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
