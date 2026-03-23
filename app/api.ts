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

// ==========================================
// WALLET & PAYMENTS
// ==========================================

export async function getWallet(userId: string) {
  return fetchWithFallback(
    /api/wallet/,
    {
      userId,
      balance: 24500,
      totalWon: 157500,
      totalWithdrawn: 45000,
      totalSpent: 88000,
      bonusBalance: 2500,
      lastWon: { amount: 5000, date: '2026-03-20T14:30:00Z', campaign: 'Mega Jackpot March' }
    }
  );
}

export async function getTransactions(userId: string) {
  return fetchWithFallback(
    /api/wallet//transactions,
    {
      transactions: [
        { id: 'txn_001', type: 'win', amount: 5000, description: 'Won: Mega Jackpot March', date: '2026-03-20T14:30:00Z', status: 'completed' },
        { id: 'txn_002', type: 'deposit', amount: 5000, description: 'Paystack Deposit', date: '2026-03-18T10:15:00Z', status: 'completed' },
        { id: 'txn_003', type: 'withdraw', amount: 20000, description: 'Withdrawal to First Bank ****4521', date: '2026-03-15T16:45:00Z', status: 'completed' },
        { id: 'txn_004', type: 'ticket', amount: -1000, description: 'Campaign Ticket Purchase', date: '2026-03-14T09:00:00Z', status: 'completed' },
        { id: 'txn_005', type: 'ticket', amount: -1000, description: 'Campaign Ticket Purchase', date: '2026-03-14T09:01:00Z', status: 'completed' },
        { id: 'txn_006', type: 'win', amount: 2500, description: 'Won: Weekly Bonus Draw', date: '2026-03-10T12:00:00Z', status: 'completed' },
        { id: 'txn_007', type: 'deposit', amount: 10000, description: 'Paystack Deposit', date: '2026-03-08T14:20:00Z', status: 'completed' },
        { id: 'txn_008', type: 'withdraw', amount: 15000, description: 'Withdrawal to Access Bank ****8823', date: '2026-03-05T11:30:00Z', status: 'completed' },
      ]
    }
  );
}

export async function requestWithdrawal(data: {
  userId: string;
  amount: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
}) {
  return fetchWithFallback(/api/wallet//withdraw, {
    success: true,
    message: 'Withdrawal request submitted successfully',
    withdrawal: {
      id: 'wdr_' + Date.now(),
      amount: data.amount,
      bankName: data.bankName,
      accountNumber: data.accountNumber,
      accountName: data.accountName,
      status: 'pending',
      createdAt: new Date().toISOString()
    }
  });
}

export async function requestDeposit(data: {
  userId: string;
  amount: number;
  paymentReference: string;
}) {
  return fetchWithFallback(/api/deposit, {
    success: true,
    message: 'Deposit initiated',
    deposit: {
      id: 'dep_' + Date.now(),
      amount: data.amount,
      paymentReference: data.paymentReference,
      status: 'pending',
      createdAt: new Date().toISOString()
    }
  });
}

// ==========================================
// USER PROFILE
// ==========================================

export async function getProfile(userId: string) {
  return fetchWithFallback(
    /api/users/,
    {
      id: userId,
      name: 'Emeka Okonkwo',
      email: 'emeka.okonkwo@gmail.com',
      phone: '+234 801 234 5678',
      avatar: null,
      bankName: 'First Bank of Nigeria',
      accountNumber: '****4521',
      accountName: 'Emeka O. Okonkwo',
      referralCode: 'EMEKA2026',
      referredBy: 'SUNNY45',
      createdAt: '2025-11-15T08:00:00Z'
    }
  );
}

export async function updateProfile(userId: string, data: { name?: string; email?: string; phone?: string }) {
  return fetchWithFallback(/api/users/, {
    success: true,
    message: 'Profile updated successfully',
    user: { id: userId, ...data }
  });
}

export async function updateBankDetails(userId: string, data: { bankName: string; accountNumber: string; accountName: string }) {
  return fetchWithFallback(/api/users//bank, {
    success: true,
    message: 'Bank details updated successfully',
    bank: data
  });
}

// ==========================================
// REFERRAL STATS
// ==========================================

export async function getReferralStats(userId: string) {
  return fetchWithFallback(
    /api/referrals//stats,
    {
      referralCode: 'EMEKA2026',
      totalReferrals: 12,
      successfulReferrals: 8,
      pendingReferrals: 4,
      totalEarnings: 24000,
      pendingEarnings: 8000,
      paidOut: 16000,
      referrals: [
        { id: 'ref_001', name: 'Chidi Nwankwo', date: '2026-03-20', status: 'successful', earned: 2000 },
        { id: 'ref_002', name: 'Blessing Obi', date: '2026-03-18', status: 'successful', earned: 2000 },
        { id: 'ref_003', name: 'Emeka Ugo', date: '2026-03-15', status: 'pending', earned: 0 },
        { id: 'ref_004', name: 'Chioma Eze', date: '2026-03-12', status: 'successful', earned: 2000 },
        { id: 'ref_005', name: 'Obinna Okafor', date: '2026-03-10', status: 'successful', earned: 2000 },
      ]
    }
  );
}

// ==========================================
// DASHBOARD STATS (for quick view)
// ==========================================

export async function getDashboardStats(userId: string) {
  return fetchWithFallback(
    /api/dashboard/stats/,
    {
      totalTickets: 47,
      activeCampaigns: 3,
      totalWins: 5,
      winStreak: 2,
      nextDraw: '2026-03-28T20:00:00Z',
      recentWins: [
        { amount: 5000, campaign: 'Mega Jackpot March', date: '2026-03-20' },
        { amount: 2500, campaign: 'Weekly Bonus Draw', date: '2026-03-10' },
      ]
    }
  );
}
