const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export { FALLBACK_CAMPAIGNS } from '@/lib/mockData';

// ─── Campaigns ──────────────────────────────────────────────────────────────────

async function fetchCampaigns(): Promise<any[]> {
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
  return fetchCampaigns();
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

// ─── Auth ──────────────────────────────────────────────────────────────────────

export async function register(full_name: string, email: string, password: string) {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ full_name, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Registration failed');
  return data;
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');
  return data;
}

// ─── Wallet (user) ──────────────────────────────────────────────────────────────

export async function getWallet(token: string) {
  try {
    const res = await fetch(`${API_BASE}/api/wallet`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('API unavailable');
    return await res.json();
  } catch {
    return { balance: 0, total_won: 0, total_withdrawn: 0, total_spent: 0 };
  }
}

export async function requestWithdrawal(data: { amount: number; bank_name: string; account_number: string; account_name: string }, token: string) {
  const res = await fetch(`${API_BASE}/api/wallet/withdraw`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Withdrawal failed');
  return json;
}

export async function getWithdrawalHistory(token: string) {
  try {
    const res = await fetch(`${API_BASE}/api/wallet/history`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('API unavailable');
    return await res.json();
  } catch {
    return [];
  }
}

// ─── Tickets ────────────────────────────────────────────────────────────────────

export async function getMyTickets(token: string) {
  try {
    const res = await fetch(`${API_BASE}/api/tickets/my`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('API unavailable');
    return await res.json();
  } catch {
    return [];
  }
}

export async function buyTicket(campaignId: string, quantity: number, token: string) {
  const res = await fetch(`${API_BASE}/api/tickets/buy`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ campaign_id: campaignId, quantity }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Purchase failed');
  return json;
}

// ─── Notifications ─────────────────────────────────────────────────────────────

export async function getNotifications(token: string) {
  try {
    const res = await fetch(`${API_BASE}/api/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('API unavailable');
    return await res.json();
  } catch {
    return [];
  }
}

export async function getUnreadNotificationCount(token: string) {
  try {
    const res = await fetch(`${API_BASE}/api/notifications/unread-count`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('API unavailable');
    return await res.json();
  } catch {
    return { count: 0 };
  }
}

export async function markNotificationsRead(token: string, ids?: string[]) {
  try {
    const res = await fetch(`${API_BASE}/api/notifications/mark-read`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ids }),
    });
    if (!res.ok) throw new Error('API unavailable');
    return await res.json();
  } catch {
    return { success: true };
  }
}

export async function deleteNotification(token: string, id: string) {
  try {
    const res = await fetch(`${API_BASE}/api/notifications/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('API unavailable');
    return await res.json();
  } catch {
    return { success: true };
  }
}

// ─── User Profile ──────────────────────────────────────────────────────────────

export async function getCurrentUser(token: string) {
  try {
    const res = await fetch(`${API_BASE}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('API unavailable');
    return await res.json();
  } catch {
    return null;
  }
}

export async function updateProfile(data: { full_name?: string; phone?: string; date_of_birth?: string }, token: string) {
  const res = await fetch(`${API_BASE}/api/users/me`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Update failed');
  return json;
}

export async function updateBankDetails(data: { bank_name: string; account_number: string; account_name: string }, token: string) {
  const res = await fetch(`${API_BASE}/api/users/me/bank`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Bank details save failed');
  return json;
}

// ─── Admin ─────────────────────────────────────────────────────────────────────

export async function getAdminDashboard(token: string) {
  try {
    const res = await fetch(`${API_BASE}/api/admin/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('API unavailable');
    return await res.json();
  } catch {
    return { total_users: 0, total_campaigns: 0, active_campaigns: 0, total_winners: 0, revenue: 0 };
  }
}

export async function getAdminUsers(token: string) {
  try {
    const res = await fetch(`${API_BASE}/api/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('API unavailable');
    return await res.json();
  } catch {
    return [];
  }
}

// ─── Paystack ─────────────────────────────────────────────────────────────────

export async function initializePaystackPayment(email: string, amount: number, metadata?: any, token?: string) {
  const authToken = token ?? (typeof window !== 'undefined' ? localStorage.getItem('token') : '');
  const res = await fetch(`${API_BASE}/api/payments/paystack/init`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authToken ? `Bearer ${authToken}` : '',
    },
    body: JSON.stringify({ email, amount, metadata }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Payment init failed');
  return json;
}

// Alias for backwards compatibility
export const purchaseTickets = buyTicket;

// ─── Referrals ─────────────────────────────────────────────────────────────────

export async function getReferralStats(token: string) {
  try {
    const res = await fetch(`${API_BASE}/api/referrals/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('API unavailable');
    return await res.json();
  } catch {
    return { total_referrals: 0, total_earned: 0, pending_bonus: 0, referral_link: '', referral_code: '', recent_referrals: [] };
  }
}
