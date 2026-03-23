export const FALLBACK_CAMPAIGNS = [
  {
    id: 'camp-001',
    title: '₦5,000,000 Mega Jackpot',
    description: 'Stand a chance to win our biggest prize yet! ₦5 million could change your life forever.',
    image_url: 'https://images.unsplash.com/photo-1567427018141-0584cfcbf1b8?w=800&q=80',
    ticket_price: 500,
    max_tickets: 10000,
    sold_tickets: 7234,
    status: 'active',
    draw_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    winner_id: null,
    prize_amount: 5_000_000,
    jackpot: true,
  },
  {
    id: 'camp-002',
    title: 'Toyota Camry 2025',
    description: 'Win a brand new Toyota Camry! Full option, zero mileage, yours.',
    image_url: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80',
    ticket_price: 1000,
    max_tickets: 5000,
    sold_tickets: 5000,
    status: 'ended',
    draw_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    winner_id: 'user-winner-001',
    prize_amount: 15_000_000,
  },
  {
    id: 'camp-003',
    title: '₦500,000 Weekly Draw',
    description: 'Every week we give away ₦500,000 to one lucky winner. Enter now!',
    image_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
    ticket_price: 100,
    max_tickets: 3000,
    sold_tickets: 1847,
    status: 'active',
    draw_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    winner_id: null,
    prize_amount: 500_000,
  },
  {
    id: 'camp-004',
    title: 'iPhone 16 Pro Max',
    description: 'The latest iPhone 16 Pro Max — 256GB Space Black. Your dream phone awaits.',
    image_url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80',
    ticket_price: 250,
    max_tickets: 2000,
    sold_tickets: 1205,
    status: 'active',
    draw_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    winner_id: null,
    prize_amount: 1_200_000,
  },
  {
    id: 'camp-005',
    title: '₦1,000,000 Weekend Special',
    description: 'Double your weekend vibes with ₦1 million! Only 2 days left to enter.',
    image_url: 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=800&q=80',
    ticket_price: 200,
    max_tickets: 5000,
    sold_tickets: 3420,
    status: 'active',
    draw_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    winner_id: null,
    prize_amount: 1_000_000,
  },
  {
    id: 'camp-006',
    title: 'MacBook Air M3',
    description: 'Apple MacBook Air M3 chip, 8GB RAM, 256GB SSD. Perfect for work and play.',
    image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
    ticket_price: 300,
    max_tickets: 2500,
    sold_tickets: 890,
    status: 'active',
    draw_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    winner_id: null,
    prize_amount: 1_500_000,
  },
  {
    id: 'camp-007',
    title: '₦250,000 Shopping Voucher',
    description: "Shop to your heart's content with ₦250,000 at any store of your choice!",
    image_url: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=800&q=80',
    ticket_price: 50,
    max_tickets: 5000,
    sold_tickets: 2100,
    status: 'active',
    draw_date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    winner_id: null,
    prize_amount: 250_000,
  },
];

// Simulates API call with realistic delay, falls back to FALLBACK_CAMPAIGNS when API is unavailable
export async function getCampaigns() {
  try {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const res = await fetch(`${API_BASE}/api/campaigns`, { cache: 'no-store' });
    if (!res.ok) throw new Error('API unavailable');
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    // Return fallback campaigns when backend is not live
    return FALLBACK_CAMPAIGNS;
  }
}
