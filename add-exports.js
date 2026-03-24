const fs = require('fs');
const path = 'app/api.ts';
let content = fs.readFileSync(path, 'utf8');

// Find the last export and append new functions
const newExports = `

// ============ ADMIN ============
export async function getAdminDashboard() {
  const token = getToken();
  if (!token) return getMockAdminDashboard();
  try {
    const res = await fetch(\`\${API_BASE}/admin/dashboard\`, {
      headers: { Authorization: \`Bearer \${token}\` },
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
    const res = await fetch(\`\${API_BASE}/admin/users\`, {
      headers: { Authorization: \`Bearer \${token}\` },
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
  const res = await fetch(\`\${API_BASE}/admin/campaigns\`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: \`Bearer \${token}\`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function triggerDraw(campaignId: string) {
  const token = getToken();
  if (!token) return { error: 'Unauthorized' };
  const res = await fetch(\`\${API_BASE}/admin/draws/trigger\`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: \`Bearer \${token}\`,
    },
    body: JSON.stringify({ campaignId }),
  });
  return res.json();
}

export async function purchaseTickets(campaignId: string, quantity: number) {
  const token = getToken();
  if (!token) return { error: 'Unauthorized. Please login.' };
  try {
    const res = await fetch(\`\${API_BASE}/tickets/purchase\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: \`Bearer \${token}\`,
      },
      body: JSON.stringify({ campaignId, quantity }),
    });
    return res.json();
  } catch (e) {
    return { error: 'Failed to purchase tickets. Please try again.' };
  }
}

export async function initializePaystackPayment(amount: number, email: string, type: 'deposit' | 'ticket') {
  const token = getToken();
  if (!token) return { error: 'Unauthorized' };
  try {
    const res = await fetch(\`\${API_BASE}/payments/paystack/initialize\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: \`Bearer \${token}\`,
      },
      body: JSON.stringify({ amount, email, type }),
    });
    return res.json();
  } catch {
    return { error: 'Payment initialization failed' };
  }
}

export async function getProfile(userId: string) {
  const token = getToken();
  if (!token) return getMockUser();
  try {
    const res = await fetch(\`\${API_BASE}/users/me\`, {
      headers: { Authorization: \`Bearer \${token}\` },
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
`;

// Append before the last closing brace or at end of file
// Find a good insertion point - after the last export
const lines = content.split('\n');
let insertIndex = lines.length;
// Find where functions end (look for the last })
for (let i = lines.length - 1; i >= 0; i--) {
  if (lines[i].trim() === '}' && i > 0) {
    // Check if previous non-empty line ends with a statement
    for (let j = i - 1; j >= 0; j--) {
      if (lines[j].trim() && !lines[j].trim().startsWith('//') && !lines[j].trim().startsWith('*')) {
        if (lines[j].trim().endsWith(';') || lines[j].trim().endsWith('{')) {
          insertIndex = i + 1;
        }
        break;
      }
    }
    break;
  }
}

lines.splice(insertIndex, 0, newExports);
fs.writeFileSync(path, lines.join('\n'), 'utf8');
console.log('Added missing exports. New line count:', lines.length);
