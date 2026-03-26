const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://wxkevhhysawbfuobnydo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4a2V2aGh5c2F3YmZ1b2JueWRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDAyMzA2OCwiZXhwIjoyMDg5NTk5MDY4fQ.NsP0NIaWzahKc9ud4thUqc4QcqmpH0nh7VmImseaHA4';

const sb = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('=== WB_USERS ===');
  const { data: users, error } = await sb.from('wb_users').select('id, email, name, role');
  if (error) console.error('Error:', error);
  else console.log(JSON.stringify(users, null, 2));
}

main();
