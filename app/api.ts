const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

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

export async function getCampaigns() {
  return fetchWithFallback('/api/campaigns', {
    campaigns: [
      {
        id: 'weekly-mega',
        title: 'Weekly Mega Draw',
        description: 'Weekly draw for cash prizes',
        prize: '₦5,000,000',
        prizeValue: 5000000,
        ticketPrice: 2500,
        endDate: '2026-03-28T20:00:00Z',
        status: 'active',
        maxTickets: 1000,
        ticketsSold: 720,
        imageUrl: '',
      },
      {
        id: 'jackpot',
        title: '₦50,000,000 Jackpot',
        description: 'The biggest draw of the year!',
        prize: '₦50,000,000',
        prizeValue: 50000000,
        ticketPrice: 5000,
        endDate: '2026-03-26T20:00:00Z',
        status: 'jackpot',
        maxTickets: 2000,
        ticketsSold: 900,
        imageUrl: '',
      },
      {
        id: 'daily-car',
        title: 'Abuja Car Giveaway',
        description: 'Win a brand new car!',
        prize: 'Brand New Car',
        prizeValue: 15000000,
        ticketPrice: 5000,
        endDate: '2026-04-05T20:00:00Z',
        status: 'active',
        maxTickets: 500,
        ticketsSold: 200,
        imageUrl: '',
      },
    ],
  });
}

export async function getCampaign(id: string) {
  const data = await getCampaigns();
  const c = (data as any).campaigns?.find((c: any) => c.id === id) || null;
  if (!c) return null;
  return {
    ...c,
    // Frontend camelCase names
    ticketPrice: c.ticket_price !== undefined ? c.ticket_price : c.ticketPrice,
    maxTickets: c.total_tickets !== undefined ? c.total_tickets : c.maxTickets,
    ticketsSold: c.sold_tickets !== undefined ? c.sold_tickets : c.ticketsSold,
    endDate: c.end_date !== undefined ? c.end_date : c.endDate,
    prizeValue: c.prize_value !== undefined ? c.prize_value : c.prizeValue,
    imageUrl: c.image_url !== undefined ? c.image_url : c.imageUrl,
    // Backend snake_case aliases (for pages that use these)
    ticket_price: c.ticketPrice !== undefined ? c.ticketPrice : c.ticket_price,
    total_tickets: c.maxTickets !== undefined ? c.maxTickets : c.total_tickets,
    sold_tickets: c.ticketsSold !== undefined ? c.ticketsSold : c.sold_tickets,
    end_date: c.endDate !== undefined ? c.endDate : c.end_date,
    prize_value: c.prizeValue !== undefined ? c.prizeValue : c.prize_value,
    image_url: c.imageUrl !== undefined ? c.imageUrl : c.image_url,
  };
}

export async function getMyTickets(userId: string) {
  const fallback = {
    tickets: [
      { id: '1', campaignTitle: 'Weekly Mega Draw', ticketNumber: 'WM-1847', status: 'active', campaignId: 'weekly-mega' },
      { id: '2', campaignTitle: 'Weekly Mega Draw', ticketNumber: 'WM-1848', status: 'active', campaignId: 'weekly-mega' },
      { id: '3', campaignTitle: 'Weekly Mega Draw', ticketNumber: 'WM-2103', status: 'active', campaignId: 'weekly-mega' },
      { id: '4', campaignTitle: '₦50,000,000 Jackpot', ticketNumber: 'JK-0529', status: 'active', campaignId: 'jackpot' },
      { id: '5', campaignTitle: '₦50,000,000 Jackpot', ticketNumber: 'JK-0530', status: 'active', campaignId: 'jackpot' },
    ],
  };
  return fetchWithFallback(`/api/tickets/user/${userId}`, fallback);
}

export async function getNotifications(userId: string) {
  return {
    notifications: [
      { id: '1', type: 'win', title: 'You Won! 🎉', message: 'Congratulations! You won ₦75,000 in the Weekly Mega Draw!', time: '2 hours ago', isRead: true },
      { id: '2', type: 'reminder', title: 'Draw Coming Up!', message: 'The ₦5,000,000 Jackpot draw is in 3 days. Get your tickets now!', time: '5 hours ago', isRead: false },
      { id: '3', type: 'info', title: 'New Campaign', message: 'A new campaign "Abuja Car Giveaway" just launched with 200 tickets left!', time: '1 day ago', isRead: false },
    ],
  };
}

export async function getUnreadNotificationCount(userId: string) {
  return { count: 2 };
}

export async function markNotificationsRead(userId: string, notificationId: string) {
  return { success: true };
}

export async function markAllNotificationsRead(userId: string) {
  return { success: true };
}

export async function deleteNotification(userId: string, notificationId: string) {
  return { success: true };
}

export async function getWallet(userId: string) {
  return {
    id: 'wallet-1',
    userId,
    balance: 24500,
    bonusBalance: 2500,
    totalWon: 157500,
    totalWithdrawn: 45000,
    totalSpent: 88000,
    createdAt: '2025-11-01T00:00:00Z',
  };
}

export async function getTransactions(userId: string) {
  return {
    transactions: [
      { id: '1', type: 'win', description: 'Weekly Mega Draw Winnings', amount: 75000, createdAt: '2026-03-21T14:30:00Z' },
      { id: '2', type: 'deposit', description: 'Deposit via Paystack', amount: 10000, createdAt: '2026-03-20T10:00:00Z' },
      { id: '3', type: 'withdraw', description: 'Withdrawal to GTBank', amount: -25000, createdAt: '2026-03-18T16:00:00Z' },
      { id: '4', type: 'ticket', description: 'Weekly Mega Draw Ticket', amount: -2500, createdAt: '2026-03-15T09:00:00Z' },
      { id: '5', type: 'ticket', description: 'Jackpot Entry Ticket', amount: -5000, createdAt: '2026-03-10T11:00:00Z' },
    ],
  };
}

export async function requestWithdrawal(userId: string, amount: number, bankName: string, accountNumber: string, accountName: string) {
  return { success: true, message: 'Withdrawal request submitted. Processing takes 24-48 hours.' };
}

export async function requestDeposit(userId: string, amount: number) {
  return { success: true, paymentUrl: `https://paystack.com/pay/winbig-${userId}` };
}

export async function getCurrentUser() {
  return getProfile();
}

export async function updateProfile(data: { name?: string; email?: string; phone?: string }) {
  return { success: true, ...data };
}

export async function updateBankDetails(data: { bankName: string; accountNumber: string; accountName: string }) {
  return { success: true, ...data };
}

export async function getReferralStats(userId: string) {
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
      { id: '2', name: 'Funke B.', date: '2026-03-16', status: 'successful', earned: 2000 },
      { id: '3', name: 'Tunde C.', date: '2026-03-09', status: 'pending', earned: 0 },
    ],
  };
}

export async function getDashboardStats(userId: string) {
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


// ============ ADMIN ============
export async function getAdminDashboard() {
  const token = getToken();
  if (!token) return getMockAdminDashboard();
  try {
    const res = await fetch(`${API_BASE}/admin/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return getMockAdminDashboard();
    return res.json();
  } catch { return getMockAdminDashboard(); }
}

export async function getAdminUsers() {
  const token = getToken();
  if (!token) return [];
  try {
    const res = await fetch(`${API_BASE}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export async function createCampaign(data: {
  title: string;
  description: string;
  prize_amount: number;
  ticket_price: number;
  max_tickets: number;
  end_date: string;
  image_url?: string;
  status?: string;
}) {
  const token = getToken();
  if (!token) return { error: 'Unauthorized' };
  const res = await fetch(`${API_BASE}/admin/campaigns`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function triggerDraw(campaignId: string) {
  const token = getToken();
  if (!token) return { error: 'Unauthorized' };
  const res = await fetch(`${API_BASE}/admin/draws/trigger`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ campaignId }),
  });
  return res.json();
}

export async function purchaseTickets(campaignId: string, quantity: number) {
  const token = getToken();
  if (!token) return { error: 'Unauthorized. Please login.' };
  try {
    const res = await fetch(`${API_BASE}/tickets/purchase`, {
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
  const token = getToken();
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

export async function getProfile(_userId?: string) {
  const token = getToken();
  if (!token) return getMockUser();
  try {
    const res = await fetch(`${API_BASE}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return getMockUser();
    return res.json();
  } catch { return getMockUser(); }
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

function getMockAdminDashboard() {
  return {
    total_users: 1247,
    total_campaigns: 18,
    active_campaigns: 6,
    total_tickets_sold: 8934,
    total_revenue: 44700000,
    total_winnings_paid: 38900000,
    recent_users: [],
    recent_tickets: [],
  };
}

