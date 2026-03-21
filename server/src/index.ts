import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: { origin: '*' }
});

const PORT = 3001;
const JWT_SECRET = 'winbig-africa-jwt-secret-2026';
const SUPABASE_URL = 'https://wxkevhhysawbfuobnydo.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4a2V2aGh5c2F3YmZ1b2JueWRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMjMwNjgsImV4cCI6MjA4ODc2ODU5MH0.VxhMOWdHLtkzWgf8yULRj6yIZ80cs3RWTVPhqLLPzgU';

// ─── Mock Data Store (used when Supabase is unavailable) ───
const mockUsers: any[] = [];
const mockCampaigns: any[] = [
  {
    id: 'camp-001',
    title: '₦5,000,000 Mega Jackpot',
    description: 'Stand a chance to win our biggest prize yet! ₦5 million could change your life forever.',
    image_url: 'https://images.unsplash.com/photo-1567427018141-0584cfcbf1b8?w=800&q=80',
    ticket_price: 500,
    total_tickets: 10000,
    sold_tickets: 7234,
    status: 'active',
    end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    winner_id: null,
  },
  {
    id: 'camp-002',
    title: 'Toyota Camry 2025',
    description: 'Win a brand new Toyota Camry! Full option, zero mileage, yours.',
    image_url: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80',
    ticket_price: 1000,
    total_tickets: 5000,
    sold_tickets: 5000,
    status: 'completed',
    end_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    winner_id: 'user-winner-001',
  },
  {
    id: 'camp-003',
    title: '₦500,000 Weekly Draw',
    description: 'Every week we give away ₦500,000 to one lucky winner. Enter now!',
    image_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
    ticket_price: 100,
    total_tickets: 3000,
    sold_tickets: 1847,
    status: 'active',
    end_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    winner_id: null,
  },
  {
    id: 'camp-004',
    title: 'iPhone 16 Pro Max',
    description: 'The latest iPhone 16 Pro Max — 256GB Space Black. Your dream phone awaits.',
    image_url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80',
    ticket_price: 250,
    total_tickets: 2000,
    sold_tickets: 1205,
    status: 'active',
    end_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    winner_id: null,
  },
  {
    id: 'camp-005',
    title: '₦1,000,000 Weekend Special',
    description: 'Double your weekend vibes with ₦1 million! Only 2 days left to enter.',
    image_url: 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=800&q=80',
    ticket_price: 200,
    total_tickets: 5000,
    sold_tickets: 3456,
    status: 'active',
    end_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    winner_id: null,
  },
];
const mockTickets: any[] = [];
const mockDraws: any[] = [];

app.use(cors());
app.use(express.json());

// ─── Supabase Helpers (with mock fallback) ───
async function supabaseFetch(table: string, params?: string): Promise<any> {
  try {
    const url = `${SUPABASE_URL}/rest/v1/${table}${params ? '?' + params : ''}`;
    const res = await fetch(url, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    if (!res.ok) throw new Error(`Supabase error: ${res.status}`);
    return res.json();
  } catch {
    // Fallback to mock data
    if (table === 'wb_users') return mockUsers;
    if (table === 'wb_campaigns') {
      let result = [...mockCampaigns];
      if (params?.includes('id=eq.')) {
        const id = params.split('id=eq.')[1]?.split('&')[0];
        result = result.filter(c => c.id === id);
      }
      if (params?.includes('order=')) result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      return result;
    }
    if (table === 'wb_tickets') {
      let result = [...mockTickets];
      if (params?.includes('campaign_id=eq.')) {
        const cid = params.split('campaign_id=eq.')[1]?.split('&')[0];
        result = result.filter(t => t.campaign_id === cid);
      }
      if (params?.includes('user_id=eq.')) {
        const uid = params.split('user_id=eq.')[1]?.split('&')[0];
        result = result.filter(t => t.user_id === uid);
      }
      if (params?.includes('order=')) result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      return result;
    }
    if (table === 'wb_draws') return mockDraws;
    return [];
  }
}

async function supabaseInsert(table: string, data: any): Promise<any> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(`Supabase error: ${res.status}`);
    return res.json();
  } catch {
    // Fallback to mock data
    if (table === 'wb_users') { mockUsers.push(data); return [data]; }
    if (table === 'wb_campaigns') { mockCampaigns.push(data); return [data]; }
    if (table === 'wb_tickets') { mockTickets.push(data); return [data]; }
    if (table === 'wb_draws') { mockDraws.push(data); return [data]; }
    return [data];
  }
}

async function supabaseUpdate(table: string, data: any, match: string): Promise<any> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${match}`, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(`Supabase error: ${res.status}`);
    return res.json();
  } catch {
    // Fallback to mock data
    const id = match.split('id=eq.')[1];
    if (table === 'wb_campaigns') {
      const idx = mockCampaigns.findIndex(c => c.id === id);
      if (idx !== -1) mockCampaigns[idx] = { ...mockCampaigns[idx], ...data };
      return [mockCampaigns[idx]];
    }
    return [];
  }
}

// Auth middleware
function authMiddleware(req: any, res: any, next: any) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

function adminMiddleware(req: any, res: any, next: any) {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  next();
}

// Socket.io connection
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
});

// Broadcast ticket sale
function broadcastTicketSale(campaignId: string, soldTickets: number) {
  io.emit('ticket-update', { campaignId, soldTickets });
}

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields required' });
    }
    const existing = await supabaseFetch('wb_users', `email=eq.${email}`);
    if (existing?.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    const password_hash = await bcrypt.hash(password, 10);
    const user = await supabaseInsert('wb_users', {
      id: uuidv4(),
      name,
      email,
      password_hash,
      role: 'user',
      created_at: new Date().toISOString()
    });
    const token = jwt.sign({ id: user[0]?.id || user.id, email, role: 'user' }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user[0]?.id || user.id, name, email, role: 'user' } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = await supabaseFetch('wb_users', `email=eq.${email}`);
    if (!users || users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const user = users[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Campaign Routes
app.get('/api/campaigns', async (req, res) => {
  try {
    const campaigns = await supabaseFetch('wb_campaigns', 'order=created_at.desc');
    res.json(campaigns);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/campaigns/:id', async (req, res) => {
  try {
    const campaigns = await supabaseFetch('wb_campaigns', `id=eq.${req.params.id}`);
    if (!campaigns || campaigns.length === 0) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    const campaign = campaigns[0];
    // Get tickets count
    const tickets = await supabaseFetch('wb_tickets', `campaign_id=eq.${req.params.id}&select=id`);
    campaign.sold_tickets = tickets?.length || 0;
    res.json(campaign);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Ticket Routes
app.post('/api/tickets/purchase', authMiddleware, async (req, res) => {
  try {
    const { campaign_id, quantity } = req.body;
    const userId = req.user.id;

    const campaigns = await supabaseFetch('wb_campaigns', `id=eq.${campaign_id}`);
    if (!campaigns || campaigns.length === 0) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    const campaign = campaigns[0];

    const existingTickets = await supabaseFetch('wb_tickets', `campaign_id=eq.${campaign_id}&select=ticket_number`);
    const soldCount = existingTickets?.length || 0;

    if (soldCount + quantity > campaign.total_tickets) {
      return res.status(400).json({ error: 'Not enough tickets available' });
    }

    const generatedTickets = [];
    const usedNumbers = new Set(existingTickets?.map((t: any) => t.ticket_number) || []);

    for (let i = 0; i < quantity; i++) {
      let ticketNumber: string;
      do {
        ticketNumber = String(Math.floor(100000 + Math.random() * 900000));
      } while (usedNumbers.has(ticketNumber));
      usedNumbers.add(ticketNumber);
      generatedTickets.push({
        id: uuidv4(),
        campaign_id,
        user_id: userId,
        ticket_number: ticketNumber,
        created_at: new Date().toISOString()
      });
    }

    for (const ticket of generatedTickets) {
      await supabaseInsert('wb_tickets', ticket);
    }

    // Update campaign sold_tickets
    const newSoldCount = soldCount + quantity;
    await supabaseUpdate('wb_campaigns', { sold_tickets: newSoldCount }, `id=eq.${campaign_id}`);

    // Broadcast update
    broadcastTicketSale(campaign_id, newSoldCount);

    res.json({ tickets: generatedTickets, message: 'Tickets purchased successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/tickets/my-tickets', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const tickets = await supabaseFetch('wb_tickets', `user_id=eq.${userId}&order=created_at.desc`);
    res.json(tickets);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Routes
app.get('/api/admin/dashboard', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await supabaseFetch('wb_users', 'select=id');
    const campaigns = await supabaseFetch('wb_campaigns', 'select=id,sold_tickets,ticket_price');
    const tickets = await supabaseFetch('wb_tickets', 'select=id');

    const totalUsers = users?.length || 0;
    const totalCampaigns = campaigns?.length || 0;
    const totalTickets = tickets?.length || 0;
    const totalRevenue = campaigns?.reduce((sum: number, c: any) => sum + (c.sold_tickets * c.ticket_price), 0) || 0;

    res.json({ totalUsers, totalCampaigns, totalTickets, totalRevenue });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await supabaseFetch('wb_users', 'select=id,name,email,role,created_at&order=created_at.desc');
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/campaigns', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { title, description, image_url, ticket_price, total_tickets, end_date } = req.body;
    if (!title || !ticket_price || !total_tickets) {
      return res.status(400).json({ error: 'Required fields missing' });
    }
    const campaign = await supabaseInsert('wb_campaigns', {
      id: uuidv4(),
      title,
      description: description || '',
      image_url: image_url || '',
      ticket_price,
      total_tickets,
      sold_tickets: 0,
      end_date: end_date || null,
      status: 'active',
      winner_id: null,
      created_at: new Date().toISOString()
    });
    res.json(campaign);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/campaigns/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { title, description, image_url, ticket_price, total_tickets, end_date, status } = req.body;
    const updates: any = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (image_url !== undefined) updates.image_url = image_url;
    if (ticket_price !== undefined) updates.ticket_price = ticket_price;
    if (total_tickets !== undefined) updates.total_tickets = total_tickets;
    if (end_date !== undefined) updates.end_date = end_date;
    if (status !== undefined) updates.status = status;

    await supabaseUpdate('wb_campaigns', updates, `id=eq.${req.params.id}`);
    const campaigns = await supabaseFetch('wb_campaigns', `id=eq.${req.params.id}`);
    res.json(campaigns[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/draws/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const campaignId = req.params.id;
    const tickets = await supabaseFetch('wb_tickets', `campaign_id=eq.${campaignId}`);
    if (!tickets || tickets.length === 0) {
      return res.status(400).json({ error: 'No tickets sold for this campaign' });
    }

    const winnerIndex = Math.floor(Math.random() * tickets.length);
    const winningTicket = tickets[winnerIndex];

    // Record draw
    await supabaseInsert('wb_draws', {
      id: uuidv4(),
      campaign_id: campaignId,
      winning_ticket_id: winningTicket.id,
      drawn_at: new Date().toISOString()
    });

    // Update campaign status and winner
    await supabaseUpdate('wb_campaigns', { status: 'completed', winner_id: winningTicket.user_id }, `id=eq.${campaignId}`);

    // Get winner info
    const users = await supabaseFetch('wb_users', `id=eq.${winningTicket.user_id}`);
    const winner = users?.[0];

    res.json({
      winningTicket,
      winner: winner ? { name: winner.name, email: winner.email } : null,
      message: 'Draw completed successfully'
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/campaigns/:id/participants', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const tickets = await supabaseFetch('wb_tickets', `campaign_id=eq.${req.params.id}&select=id,ticket_number,user_id,created_at`);
    res.json(tickets);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

httpServer.listen(PORT, () => {
  console.log(`WINBIG AFRICA server running on port ${PORT}`);
});
