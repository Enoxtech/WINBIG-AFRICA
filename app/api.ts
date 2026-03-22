import { purchaseTickets as purchaseTicketsApi, getMyTickets as getMyTicketsApi, getCampaign as getCampaignApi, getBaseUrl } from './api';

// Auth token helper
function getAuthHeader() {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  get: async (endpoint: string) => {
    const base = getBaseUrl();
    const res = await fetch(`${base}${endpoint}`, {
      headers: { ...getAuthHeader() },
    });
    if (!res.ok) throw new Error(`GET ${endpoint} failed: ${res.status}`);
    return res.json();
  },

  post: async (endpoint: string, body: Record<string, unknown>) => {
    const base = getBaseUrl();
    const res = await fetch(`${base}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || `POST ${endpoint} failed: ${res.status}`);
    return data;
  },
};

export async function purchaseTickets(campaignId: string, quantity: number, token: string) {
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/tickets/purchase`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ campaignId, quantity }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Purchase failed');
  return data;
}

export async function getMyTickets(token: string) {
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/tickets/my-tickets`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to load tickets');
  return data;
}

export async function getCampaign(id: string) {
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/campaigns/${id}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to load campaign');
  return res.json();
}
