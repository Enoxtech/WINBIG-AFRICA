const https = require('https');

const GH_TOKEN = 'ghp_z4SxgkHTZxiRlv0JeqJJtvxrTqPzXS2Y9c6y';
const REPO = 'Enoxtech/WINBIG-AFRICA';

function githubApi(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const body = data ? JSON.stringify(data) : null;
    const options = {
      hostname: 'api.github.com',
      path: path,
      method: method,
      headers: {
        'Authorization': 'token ' + GH_TOKEN,
        'User-Agent': 'WINBIG-AFRICA-deployer',
        'Accept': 'application/vnd.github.v3+json',
        ...(body && { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) })
      }
    };
    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(responseData) }); }
        catch (e) { resolve({ status: res.statusCode, data: responseData }); }
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function main() {
  // Check if server/package.json exists in repo
  const r = await githubApi('GET', `/repos/${REPO}/contents/server%2Fpackage.json`);
  console.log('server/package.json exists:', r.status === 200, '(status:', r.status + ')');
  if (r.status === 200) console.log('  sha:', r.data.sha);
}

main().catch(console.error);
