// Apply schema.sql to Supabase via REST API using service role key
const https = require('https');

const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4a2V2aGh5c2F3YmZ1b2JueWRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDAyMzA2OCwiZXhwIjoyMDg5NTk5MDY4fQ.NsP0NIaWzahKc9ud4thUqc4QcqmpH0nh7VmImseaHA4';

function createTable(tableName, columns) {
  return new Promise((resolve) => {
    const body = JSON.stringify(columns);
    const options = {
      hostname: 'wxkevhhysawbfuobnydo.supabase.co',
      path: '/rest/v1/' + tableName,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceKey,
        'Authorization': 'Bearer ' + serviceKey,
        'Prefer': 'resolution=merge-duplicates',
        'Content-Length': Buffer.byteLength(body)
      }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', e => resolve({ error: e.message }));
    req.write(body);
    req.end();
  });
}

// Create tables in order (FK dependencies: users first, then dependent tables)
async function applySchema() {
  const results = {};

  // wb_users
  results.users = await createTable('wb_users', [
    { key: 'id', value: 'gen_random_uuid()', type: 'text', is_called: true },
    { key: 'email', type: 'text' },
    { key: 'password_hash', type: 'text' },
    { key: 'full_name', type: 'text' },
    { key: 'phone', type: 'text' },
    { key: 'date_of_birth', type: 'text' },
    { key: 'bank_name', type: 'text' },
    { key: 'account_number', type: 'text' },
    { key: 'account_name', type: 'text' },
    { key: 'referred_by', type: 'uuid' },
    { key: 'referral_code', type: 'text' },
    { key: 'role', type: 'text' },
    { key: 'created_at', value: 'now()', type: 'timestamptz', is_called: true },
    { key: 'updated_at', value: 'now()', type: 'timestamptz', is_called: true }
  ]);
  console.log('wb_users:', results.users.status, results.users.body?.slice(0, 100));

  // wb_campaigns
  results.campaigns = await createTable('wb_campaigns', [
    { key: 'id', value: 'gen_random_uuid()', type: 'text', is_called: true },
    { key: 'title', type: 'text' },
    { key: 'description', type: 'text' },
    { key: 'image_url', type: 'text' },
    { key: 'ticket_price', type: 'numeric' },
    { key: 'total_tickets', type: 'integer' },
    { key: 'sold_tickets', type: 'integer' },
    { key: 'status', type: 'text' },
    { key: 'end_date', type: 'timestamptz' },
    { key: 'winner_id', type: 'uuid' },
    { key: 'created_at', value: 'now()', type: 'timestamptz', is_called: true }
  ]);
  console.log('wb_campaigns:', results.campaigns.status, results.campaigns.body?.slice(0, 100));

  // wb_wallets (depends on wb_users)
  results.wallets = await createTable('wb_wallets', [
    { key: 'user_id', type: 'uuid' },
    { key: 'balance', type: 'numeric' },
    { key: 'total_won', type: 'numeric' },
    { key: 'total_withdrawn', type: 'numeric' },
    { key: 'total_spent', type: 'numeric' }
  ]);
  console.log('wb_wallets:', results.wallets.status, results.wallets.body?.slice(0, 100));

  // wb_tickets (depends on wb_users, wb_campaigns)
  results.tickets = await createTable('wb_tickets', [
    { key: 'id', value: 'gen_random_uuid()', type: 'text', is_called: true },
    { key: 'campaign_id', type: 'uuid' },
    { key: 'user_id', type: 'uuid' },
    { key: 'quantity', type: 'integer' },
    { key: 'total_price', type: 'numeric' },
    { key: 'created_at', value: 'now()', type: 'timestamptz', is_called: true }
  ]);
  console.log('wb_tickets:', results.tickets.status, results.tickets.body?.slice(0, 100));

  // wb_draws
  results.draws = await createTable('wb_draws', [
    { key: 'id', value: 'gen_random_uuid()', type: 'text', is_called: true },
    { key: 'campaign_id', type: 'uuid' },
    { key: 'winner_id', type: 'uuid' },
    { key: 'drawn_at', value: 'now()', type: 'timestamptz', is_called: true }
  ]);
  console.log('wb_draws:', results.draws.status, results.draws.body?.slice(0, 100));

  // wb_notifications
  results.notifications = await createTable('wb_notifications', [
    { key: 'id', value: 'gen_random_uuid()', type: 'text', is_called: true },
    { key: 'user_id', type: 'uuid' },
    { key: 'type', type: 'text' },
    { key: 'title', type: 'text' },
    { key: 'message', type: 'text' },
    { key: 'read', type: 'boolean' },
    { key: 'created_at', value: 'now()', type: 'timestamptz', is_called: true }
  ]);
  console.log('wb_notifications:', results.notifications.status, results.notifications.body?.slice(0, 100));

  // wb_withdrawals
  results.withdrawals = await createTable('wb_withdrawals', [
    { key: 'id', value: 'gen_random_uuid()', type: 'text', is_called: true },
    { key: 'user_id', type: 'uuid' },
    { key: 'amount', type: 'numeric' },
    { key: 'bank_name', type: 'text' },
    { key: 'account_number', type: 'text' },
    { key: 'account_name', type: 'text' },
    { key: 'status', type: 'text' },
    { key: 'created_at', value: 'now()', type: 'timestamptz', is_called: true }
  ]);
  console.log('wb_withdrawals:', results.withdrawals.status, results.withdrawals.body?.slice(0, 100));

  // wb_deposits
  results.deposits = await createTable('wb_deposits', [
    { key: 'id', value: 'gen_random_uuid()', type: 'text', is_called: true },
    { key: 'user_id', type: 'uuid' },
    { key: 'amount', type: 'numeric' },
    { key: 'payment_reference', type: 'text' },
    { key: 'status', type: 'text' },
    { key: 'created_at', value: 'now()', type: 'timestamptz', is_called: true }
  ]);
  console.log('wb_deposits:', results.deposits.status, results.deposits.body?.slice(0, 100));

  // wb_referrals
  results.referrals = await createTable('wb_referrals', [
    { key: 'id', value: 'gen_random_uuid()', type: 'text', is_called: true },
    { key: 'referrer_id', type: 'uuid' },
    { key: 'referred_id', type: 'uuid' },
    { key: 'bonus_earned', type: 'numeric' },
    { key: 'status', type: 'text' },
    { key: 'created_at', value: 'now()', type: 'timestamptz', is_called: true }
  ]);
  console.log('wb_referrals:', results.referrals.status, results.referrals.body?.slice(0, 100));

  console.log('\nDone! Check Supabase dashboard for tables.');
}

applySchema().catch(console.error);
