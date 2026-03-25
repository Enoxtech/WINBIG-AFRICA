const https = require('https');

const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4a2V2aGh5c2F3YmZ1b2JueWRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDAyMzA2OCwiZXhwIjoyMDg5NTk5MDY4fQ.NsP0NIaWzahKc9ud4thUqc4QcqmpH0nh7VmImseaHA4';

function get(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'wxkevhhysawbfuobnydo.supabase.co',
      path: '/rest/v1' + path,
      method: 'GET',
      headers: {
        'apikey': serviceKey,
        'Authorization': 'Bearer ' + serviceKey
      }
    };
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
    req.end();
  });
}

async function main() {
  // Test anon key on public endpoint
  const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4a2V2aGh5c2F3YmZ1b2JueWRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMjMwNjgsImV4cCI6MjA4OTU5OTA2OH0.9UnoajZKsi_QPCHdLGesTfLunAeQOqHp3LEsZ0kKjV4';
  
  // Test tables exist
  const r = await get('/users?select=id&limit=1');
  console.log('Tables test - Status:', r.status, 'Body:', r.body.slice(0, 200));
}

main().catch(console.error);
