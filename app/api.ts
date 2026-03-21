const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function register(name: string, email: string, password: string) {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  return res.json();
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return res.json();
}

export async function getCampaigns() {
  const res = await fetch(`${API_BASE}/api/campaigns`);
  return res.json();
}

export async function getCampaign(id: string) {
  const res = await fetch(`${API_BASE}/api/campaigns/${id}`);
  return res.json();
}

export async function purchaseTickets(campaignId: string, quantity: number, token: string) {
  const res = await fetch(`${API_BASE}/api/tickets/purchase`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ campaign_id: campaignId, quantity })
  });
  return res.json();
}

export async function getMyTickets(token: string) {
  const res = await fetch(`${API_BASE}/api/tickets/my-tickets`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
}

export async function getAdminDashboard(token: string) {
  const res = await fetch(`${API_BASE}/api/admin/dashboard`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
}

export async function getAdminUsers(token: string) {
  const res = await fetch(`${API_BASE}/api/admin/users`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
}

export async function createCampaign(data: any, token: string) {
  const res = await fetch(`${API_BASE}/api/admin/campaigns`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function updateCampaign(id: string, data: any, token: string) {
  const res = await fetch(`${API_BASE}/api/admin/campaigns/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function triggerDraw(id: string, token: string) {
  const res = await fetch(`${API_BASE}/api/admin/draws/${id}`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
}

export async function getParticipants(id: string, token: string) {
  const res = await fetch(`${API_BASE}/api/admin/campaigns/${id}/participants`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
}
