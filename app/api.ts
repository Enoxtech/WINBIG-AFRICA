const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export { FALLBACK_CAMPAIGNS } from '@/lib/mockData';

// --- Campaign helpers ---
async function fetchWithFallback(): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE}/api/campaigns`, { cache: 'no-store' });
    if (!res.ok) throw new Error('API unavailable');
    return await res.json();
  } catch {
    const { FALLBACK_CAMPAIGNS } = await import('@/lib/mockData');
    return FALLBACK_CAMPAIGNS;
  }
}

export async function getCampaigns() {
  return fetchWithFallback();
}

export async function getCampaign(id: string) {
  try {
    const res = await fetch(`${API_BASE}/api/campaigns/${id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('API unavailable');
    return await res.json();
  } catch {
    const { FALLBACK_CAMPAIGNS } = await import('@/lib/mockData');
    return FALLBACK_CAMPAIGNS.find((c: any) => c.id === id) || null;
  }
}

export async function createCampaign(data: any, _token?: string) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : _token ?? '';
  const res = await fetch(`${API_BASE}/api/campaigns`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create campaign');
  return await res.json();
}

export async function triggerDraw(campaignId: string, _token?: string) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : _token ?? '';
  const res = await fetch(`${API_BASE}/api/campaigns/${campaignId}/draw`, {
    method: 'POST',
    headers: { Authorization: token ? `Bearer ${token}` : '' },
  });
  if (!res.ok) throw new Error('Failed to trigger draw');
  return await res.json();
}

// --- Auth ---
export async function register(full_name: string, email: string, password: string) {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ full_name, email, password }),
  });
  if (!res.ok) throw new Error('Registration failed');
  return await res.json();
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Login failed');
  return await res.json();
}

// --- Tickets ---
export async function purchaseTickets(campaignId: string, quantity: number, _token?: string) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
  const res = await fetch(`${API_BASE}/api/tickets/purchase`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
    body: JSON.stringify({ campaign_id: campaignId, quantity }),
  });
  if (!res.ok) throw new Error('Failed to purchase tickets');
  return await res.json();
}

export async function getUserTickets() {
  return getMyTickets();
}

export async function getMyTickets(_token?: string) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : _token ?? '';
  const res = await fetch(`${API_BASE}/api/tickets`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch tickets');
  return await res.json();
}

export async function getUserCampaigns() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
  const res = await fetch(`${API_BASE}/api/users/campaigns`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch user campaigns');
  return await res.json();
}

// --- Wallet / Paystack ---
export async function initializePaystackPayment(email: string, amount: number, _token?: string) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : _token ?? '';
  const res = await fetch(`${API_BASE}/api/wallet/deposit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
    body: JSON.stringify({ email, amount }),
  });
  if (!res.ok) throw new Error('Failed to initialize payment');
  return await res.json();
}

// --- Admin ---
export async function getAdminDashboard(_token?: string) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : _token ?? '';
  const res = await fetch(`${API_BASE}/api/admin/dashboard`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch admin dashboard');
  return await res.json();
}

export async function getAdminUsers(_token?: string) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : _token ?? '';
  const res = await fetch(`${API_BASE}/api/admin/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch admin users');
  return await res.json();
}
