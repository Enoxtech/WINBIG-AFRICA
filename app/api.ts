const ADMIN_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4YmFxZ2xwZWFzZWxhbGRpankiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTAwMDAwMDAwLCJleHAiOjIwNjU0NzYwMDB9.5YV5am7y0RlCfqTkR-MN-H7hQTXjyvM-8YcPwGUh0gk';
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function getToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('wb_token');
}

async function fetchWithFallback<T>(url: string, fallbackData: T): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${url}`, {
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('API unavailable');
    return await res.json() as T;
  } catch {
    return fallbackData;
  }
}

// ============ PUBLIC ============

export async function getCampaigns() {
  try {
    const res = await fetch(`${API_BASE}/api/campaigns`, {
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('API unavailable');
    const data = await res.json();
    // Railway returns { value: [...] }, normalize to { campaigns: [...] }
    if ((data as any)?.value && Array.isArray((data as any).value)) {
      return { campaigns: (data as any).value };
    }
    return data as { campaigns: any[] };
  } catch {
    return { campaigns: [] };
  }
}

export async function getCampaign(id: string) {
  // Try individual campaign endpoint first, fall back to list lookup
  let c: any = null;
  try {
    const res = await fetch(`${API_BASE}/api/campaigns/${id}`, {
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      // Railway returns { value: { ... } } or just { ... }
      c = data?.value ?? data;
    }
  } catch {}
  // Fall back to list lookup
  if (!c) {
    const data = await getCampaigns();
    c = (data as any).campaigns?.find((c: any) => c.id === id) || null;
  }
  if (!c) return null;
  return {
    ...c,
    ticketPrice: c.ticket_price ?? c.ticketPrice,
    maxTickets: c.total_tickets ?? c.maxTickets,
    ticketsSold: c.sold_tickets ?? c.ticketsSold,
    endDate: c.end_date ?? c.endDate,
    prizeValue: c.prize_value ?? c.prizeValue,
    imageUrl: c.image_url ?? c.imageUrl,
    ticket_price: c.ticketPrice ?? c.ticket_price,
    total_tickets: c.maxTickets ?? c.total_tickets,
    sold_tickets: c.ticketsSold ?? c.sold_tickets,
    end_date: c.endDate ?? c.end_date,
    prize_value: c.prizeValue ?? c.prize_value,
    image_url: c.imageUrl ?? c.image_url,
  };
}

export async function getMyTickets(userId: string) {
  const fallback = {
    tickets: [
      { id: '1', campaignTitle: 'Weekly Mega Draw', ticketNumber: 'WM-1847', status: 'active', campaignId: 'weekly-mega' },
      { id: '2', campaignTitle: 'Weekly Mega Draw', ticketNumber: 'WM-1848', status: 'active', campaignId: 'weekly-mega' },
    ],
  };
  const token = await getToken();
  try {
    const res = await fetch(`${API_BASE}/api/tickets/user/${userId}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: 'include',
      cache: 'no-store',
    });
    if (!res.ok) return fallback;
    const data = await res.json();
    return { tickets: Array.isArray(data) ? data : (data?.tickets || fallback.tickets) };
  } catch {
    return fallback;
  }
}

export async function getNotifications(_userId: string) {
  return {
    notifications: [
      { id: '1', type: 'win', title: 'You Won! 🎉', message: 'Congratulations! You won ₦75,000 in the Weekly Mega Draw!', time: '2 hours ago', isRead: true },
      { id: '2', type: 'reminder', title: 'Draw Coming Up!', message: 'The ₦5,000,000 Jackpot draw is in 3 days.', time: '5 hours ago', isRead: false },
    ],
  };
}

export async function getUnreadNotificationCount(_userId: string) {
  return { count: 2 };
}

export async function markNotificationsRead(_userId: string, _notificationId: string) {
  return { success: true };
}

export async function markAllNotificationsRead(_userId: string) {
  return { success: true };
}

export async function deleteNotification(_userId: string, _notificationId: string) {
  return { success: true };
}

export async function getWallet(userId: string) {
  const token = await getToken();
  if (!token) return { balance: 0, bonusBalance: 0, totalWon: 0, totalWithdrawn: 0, totalSpent: 0 };
  try {
    const res = await fetch(`${API_BASE}/api/wallet`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: 'include',
      cache: 'no-store',
    });
    if (!res.ok) return { balance: 0, bonusBalance: 0, totalWon: 0, totalWithdrawn: 0, totalSpent: 0 };
    return await res.json();
  } catch {
    return { balance: 0, bonusBalance: 0, totalWon: 0, totalWithdrawn: 0, totalSpent: 0 };
  }
}

export async function getTransactions(userId: string) {
  const fallback = {
    transactions: [
      { id: '1', type: 'win', description: 'Weekly Mega Draw Winnings', amount: 75000, createdAt: '2026-03-21T14:30:00Z' },
      { id: '2', type: 'deposit', description: 'Deposit via Paystack', amount: 10000, createdAt: '2026-03-20T10:00:00Z' },
    ],
  };
  const token = await getToken();
  if (!token) return fallback;
  try {
    const res = await fetch(`${API_BASE}/api/transactions/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: 'include',
      cache: 'no-store',
    });
    if (!res.ok) return fallback;
    return await res.json();
  } catch {
    return fallback;
  }
}

export async function requestWithdrawal(_userId: string, _amount: number, _bankName: string, _accountNumber: string, _accountName: string) {
  return { success: true, message: 'Withdrawal request submitted. Processing takes 24-48 hours.' };
}

export async function requestDeposit(userId: string, _amount: number) {
  return { success: true, paymentUrl: `https://paystack.com/pay/winbig-${userId}` };
}

export async function getCurrentUser() {
  return getProfile();
}

export async function updateProfile(data: { name?: string; email?: string; phone?: string }) {
  const token = await getToken();
  if (!token) return { success: false, error: 'Not authenticated' };
  const res = await fetch(`${API_BASE}/api/users/me`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update profile');
  return res.json();
}

export async function updateBankDetails(data: { bankName: string; accountNumber: string; accountName: string }) {
  const token = await getToken();
  if (!token) return { success: false, error: 'Not authenticated' };
  const res = await fetch(`${API_BASE}/api/users/me/bank`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to save bank details');
  return res.json();
}

export async function getReferralStats(_userId: string) {
  return {
    referralCode: 'EMEKA2026',
    totalReferrals: 12,
    successfulReferrals: 8,
    pendingReferrals: 4,
    totalEarnings: 16000,
    pendingEarnings: 8000,
    paidOut: 8000,
    referrals: [
      { id: '1', name: 'Kunle A.', date: '2026-03-21', status: 'successful', earned: 2000 },
    ],
  };
}

export async function getDashboardStats(_userId: string) {
  return {
    ticketsBought: 142,
    campaignsEntered: 28,
    wins: 8,
    losses: 20,
    totalWon: '₦157,500',
    totalSpent: '₦88,000',
    activeTickets: 12,
    winStreak: 5,
    payoutRate: '28%',
  };
}

export async function getProfile(_userId?: string) {
  const token = await getToken();
  if (!token) return getMockUser();
  try {
    const res = await fetch(`${API_BASE}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return getMockUser();
    return await res.json();
  } catch {
    return getMockUser();
  }
}

export async function purchaseTickets(campaignId: string, quantity: number) {
  const token = await getToken();
  if (!token) return { error: 'Unauthorized. Please login.' };
  try {
    const res = await fetch(`${API_BASE}/api/tickets/purchase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ campaignId, quantity }),
    });
    return res.json();
  } catch (e) {
    return { error: 'Failed to purchase tickets. Please try again.' };
  }
}

export async function initializePaystackPayment(amount: number, email: string, type: 'deposit' | 'ticket' = 'deposit') {
  const token = await getToken();
  if (!token) return { error: 'Unauthorized' };
  try {
    const res = await fetch(`${API_BASE}/payments/paystack/initialize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount, email, type }),
    });
    return res.json();
  } catch {
    return { error: 'Payment initialization failed' };
  }
}

// ============ ADMIN ============

export async function getAdminDashboard() {
  const res = await fetch(`${API_BASE}/api/admin/dashboard`, {
    headers: { 'X-Admin-Key': ADMIN_KEY },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Admin dashboard failed: ${res.status}`);
  const data = await res.json();
  return {
    totalUsers: data.totalUsers ?? data.total_users ?? 0,
    totalCampaigns: data.totalCampaigns ?? data.total_campaigns ?? 0,
    activeCampaigns: data.activeCampaigns ?? 0,
    totalTickets: data.totalTickets ?? data.total_tickets ?? 0,
    totalRevenue: data.totalRevenue ?? data.total_revenue ?? 0,
    totalWinners: data.totalWinners ?? 0,
    conversionRate: data.conversionRate ?? 0,
  };
}

export async function getAdminUsers() {
  const res = await fetch(`${API_BASE}/api/admin/users`, {
    headers: { 'X-Admin-Key': ADMIN_KEY },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Failed to load users: ${res.status}`);
  return res.json();
}

export async function getAdminCampaigns() {
  const res = await fetch(`${API_BASE}/api/admin/campaigns`, {
    headers: { 'X-Admin-Key': ADMIN_KEY },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Failed to load campaigns: ${res.status}`);
  const data = await res.json();
  // Railway wraps in { value: [...] }
  if (data && typeof data === 'object' && 'value' in data && Array.isArray(data.value)) {
    return data.value;
  }
  return Array.isArray(data) ? data : [];
}

export async function createCampaign(data: {
  title: string;
  description: string;
  prize_amount: number;
  ticket_price: number;
  total_tickets: number;
  end_date: string;
  image_url?: string;
  status?: string;
  category?: string;
}) {
  const payload = {
    title: data.title,
    description: data.description,
    image_url: data.image_url || '',
    ticket_price: data.ticket_price,
    total_tickets: data.total_tickets,
    end_date: data.end_date,
    prize_amount: data.prize_amount,
    status: 'active',
    category: data.category || 'general',
  };
  const res = await fetch(`${API_BASE}/api/admin/campaigns`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Key': ADMIN_KEY,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || 'Failed to create campaign');
  }
  return res.json();
}

export async function updateCampaign(id: string, data: any) {
  const payload = {
    title: data.title,
    description: data.description,
    image_url: data.image_url || '',
    ticket_price: data.ticket_price,
    total_tickets: data.total_tickets,
    end_date: data.end_date,
    prize_amount: data.prize_amount,
    status: data.status,
    category: data.category,
  };
  const res = await fetch(`${API_BASE}/api/admin/campaigns/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Key': ADMIN_KEY,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Failed to update campaign: ${res.status}`);
  return res.json();
}

export async function triggerDraw(campaignId: string) {
  const res = await fetch(`${API_BASE}/api/admin/draws/${campaignId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Key': ADMIN_KEY,
    },
    body: JSON.stringify({}),
  });
  return res.json();
}

export async function getAdminSettings() {
  const res = await fetch(`${API_BASE}/api/admin/settings`, {
    headers: { 'X-Admin-Key': ADMIN_KEY },
    cache: 'no-store',
  });
  if (!res.ok) {
    return {
      siteName: 'WINBIG Africa',
      contactEmail: '',
      minWithdrawal: 1000,
      referralBonus: 500,
      platformFee: 5,
      maintenanceMode: false,
      weeklyDrawDay: 'Friday',
      weeklyDrawTime: '21:00',
      urgencyBannerActive: true,
      urgencyBannerEndDate: '',
      registrationsOpen: true,
      minTicketPrice: 50,
      maxTicketPerUser: 50,
    };
  }
  const data = await res.json();
  return {
    siteName: data.site_name ?? 'WINBIG Africa',
    contactEmail: data.contact_email ?? '',
    minWithdrawal: data.min_withdrawal ?? 1000,
    referralBonus: data.referral_bonus ?? 500,
    platformFee: data.platform_fee ?? 5,
    maintenanceMode: data.maintenance_mode ?? false,
    weeklyDrawDay: data.weekly_draw_day ?? 'Friday',
    weeklyDrawTime: data.weekly_draw_time ?? '21:00',
    urgencyBannerActive: data.urgency_banner_active ?? true,
    urgencyBannerEndDate: data.urgency_banner_end_date ?? '',
    registrationsOpen: data.registrations_open ?? true,
    minTicketPrice: data.min_ticket_price ?? 50,
    maxTicketPerUser: data.max_ticket_per_user ?? 50,
  };
}

export async function updateAdminSettings(settings: {
  siteName?: string;
  contactEmail?: string;
  minWithdrawal?: number;
  referralBonus?: number;
  platformFee?: number;
  maintenanceMode?: boolean;
  weeklyDrawDay?: string;
  weeklyDrawTime?: string;
  urgencyBannerActive?: boolean;
  urgencyBannerEndDate?: string;
  registrationsOpen?: boolean;
  minTicketPrice?: number;
  maxTicketPerUser?: number;
}) {
  const payload = {
    site_name: settings.siteName,
    contact_email: settings.contactEmail,
    min_withdrawal: settings.minWithdrawal,
    referral_bonus: settings.referralBonus,
    platform_fee: settings.platformFee,
    maintenance_mode: settings.maintenanceMode,
    weekly_draw_day: settings.weeklyDrawDay,
    weekly_draw_time: settings.weeklyDrawTime,
    urgency_banner_active: settings.urgencyBannerActive,
    urgency_banner_end_date: settings.urgencyBannerEndDate,
    registrations_open: settings.registrationsOpen,
    min_ticket_price: settings.minTicketPrice,
    max_ticket_per_user: settings.maxTicketPerUser,
  };
  const res = await fetch(`${API_BASE}/api/admin/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Key': ADMIN_KEY,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to save settings');
  return res.json();
}

// ============ ADMIN FINANCIAL / WALLET ============

export async function getAdminWallets() {
  const res = await fetch(`${API_BASE}/api/admin/wallets`, {
    headers: { 'X-Admin-Key': ADMIN_KEY },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Failed to load wallets: ${res.status}`);
  return res.json();
}

export async function getAdminTransactions(params?: { page?: number; limit?: number; type?: string; user_id?: string }) {
  const qs = new URLSearchParams();
  if (params?.page) qs.set('page', String(params.page));
  if (params?.limit) qs.set('limit', String(params.limit));
  if (params?.type) qs.set('type', params.type);
  if (params?.user_id) qs.set('user_id', params.user_id);
  const res = await fetch(`${API_BASE}/api/admin/transactions?${qs}`, {
    headers: { 'X-Admin-Key': ADMIN_KEY },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Failed to load transactions: ${res.status}`);
  return res.json();
}

export async function getAdminDeposits(params?: { page?: number; limit?: number; status?: string }) {
  const qs = new URLSearchParams();
  if (params?.page) qs.set('page', String(params.page));
  if (params?.limit) qs.set('limit', String(params.limit));
  if (params?.status) qs.set('status', params.status);
  const res = await fetch(`${API_BASE}/api/admin/deposits?${qs}`, {
    headers: { 'X-Admin-Key': ADMIN_KEY },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Failed to load deposits: ${res.status}`);
  return res.json();
}

export async function getAdminFinancials() {
  const res = await fetch(`${API_BASE}/api/admin/financials`, {
    headers: { 'X-Admin-Key': ADMIN_KEY },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Failed to load financials: ${res.status}`);
  return res.json();
}

// ============ ADMIN WITHDRAWALS ============

export async function getAdminWithdrawals(params?: { page?: number; limit?: number; status?: string }) {
  const qs = new URLSearchParams();
  if (params?.page) qs.set('page', String(params.page));
  if (params?.limit) qs.set('limit', String(params.limit));
  if (params?.status) qs.set('status', params.status);
  const res = await fetch(`${API_BASE}/api/admin/withdrawals?${qs}`, {
    headers: { 'X-Admin-Key': ADMIN_KEY },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Failed to load withdrawals: ${res.status}`);
  return res.json();
}

export async function approveWithdrawal(id: string) {
  const res = await fetch(`${API_BASE}/api/admin/withdrawals/${id}/approve`, {
    method: 'POST',
    headers: { 'X-Admin-Key': ADMIN_KEY },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed' }));
    throw new Error(err.error || 'Failed to approve withdrawal');
  }
  return res.json();
}

export async function rejectWithdrawal(id: string) {
  const res = await fetch(`${API_BASE}/api/admin/withdrawals/${id}/reject`, {
    method: 'POST',
    headers: { 'X-Admin-Key': ADMIN_KEY },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed' }));
    throw new Error(err.error || 'Failed to reject withdrawal');
  }
  return res.json();
}

export async function markWithdrawalPaid(id: string) {
  const res = await fetch(`${API_BASE}/api/admin/withdrawals/${id}/mark-paid`, {
    method: 'POST',
    headers: { 'X-Admin-Key': ADMIN_KEY },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed' }));
    throw new Error(err.error || 'Failed to mark as paid');
  }
  return res.json();
}

// ============ MOCK DATA HELPERS ============

function getMockUser() {
  return {
    id: 'user-001',
    name: 'Emeka Okonkwo',
    email: 'emeka.okonkwo@gmail.com',
    phone: '+2348012345678',
    avatar: null,
    referralCode: 'EMEKA2026',
    referredBy: null,
    createdAt: '2026-01-15T08:00:00Z',
    bankName: 'Access Bank',
    accountNumber: '0123456789',
    accountName: 'Emeka Okonkwo',
  };
}
