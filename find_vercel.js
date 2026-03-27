const fs = require('fs');
const path = require('path');

// Find Vercel token
const searchPaths = [
  path.join(process.env.LOCALAPPDATA || '', 'vercel', 'credentials'),
  path.join(process.env.APPDATA || '', 'vercel', 'credentials'),
  'C:\\Users\\SkyBond\\.vercel\\credentials.txt',
];

let token = null;
for (const p of searchPaths) {
  try {
    if (fs.existsSync(p)) {
      const content = fs.readFileSync(p, 'utf8');
      console.log('Found:', p, content.substring(0, 100));
    }
  } catch (e) {}
}

// Check netrc for Vercel token
const netrcPath = path.join(process.env.USERPROFILE || '', '_netrc');
try {
  if (fs.existsSync(netrcPath)) {
    const content = fs.readFileSync(netrcPath, 'utf8');
    const match = content.match(/machine\s+vercel\.com\s+login\s+(\S+)/);
    if (match) console.log('Token from netrc:', match[1].substring(0, 20) + '...');
  }
} catch (e) {}

// Check for Vercel env
const envToken = process.env.VERCEL_TOKEN;
if (envToken) console.log('VERCEL_TOKEN found:', envToken.substring(0, 20) + '...');

console.log('No token found');
