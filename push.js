const https = require('https');
const fs = require('fs');
const path = require('path');

const TOKEN = 'vcp_0HLrkSHEDMrBBmVleW3DYst85Pjpem6swDu6Aqxd8kZRYMMKjR3bTcsa';
const OWNER = 'WINBIG-AFRICA';
const REPO = 'wingit-frontend';
const BRANCH = 'main';

function apiRequest(method, apiPath, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: apiPath,
      method,
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'User-Agent': 'WINBIG-PUSH',
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      }
    };
    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch { resolve(data); }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function getFileSha(filePath) {
  try {
    const data = await apiRequest('GET', `/repos/${OWNER}/${REPO}/contents/${filePath}?ref=${BRANCH}`);
    return data.sha;
  } catch { return null; }
}

async function uploadFile(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) { console.log(`MISSING: ${filePath}`); return; }
  const content = fs.readFileSync(fullPath, 'utf-8');
  const sha = await getFileSha(filePath);
  const body = {
    message: `Update ${filePath}`,
    content: Buffer.from(content).toString('base64'),
    branch: BRANCH,
    sha: sha || undefined,
  };
  try {
    const result = await apiRequest('PUT', `/repos/${OWNER}/${REPO}/contents/${filePath}`, body);
    console.log(`OK: ${filePath}`);
  } catch (e) {
    console.log(`ERR: ${filePath} - ${JSON.stringify(e)}`);
  }
}

async function main() {
  console.log('Fetching current branch ref...');
  const refData = await apiRequest('GET', `/repos/${OWNER}/${REPO}/git/refs/heads/${BRANCH}`);
  const currentSha = refData.object.sha;
  console.log('Current commit:', currentSha);

  const commitData = await apiRequest('GET', `/repos/${OWNER}/${REPO}/git/commits/${currentSha}`);
  const baseTreeSha = commitData.tree.sha;

  const files = [
    'app/globals.css',
    'app/layout.tsx',
    'app/page.tsx',
    'app/loading.tsx',
    'app/not-found.tsx',
    'app/campaigns/[id]/page.tsx',
    'app/dashboard/page.tsx',
    'app/winners/page.tsx',
    'app/faq/page.tsx',
    'app/terms/page.tsx',
    'app/privacy/page.tsx',
    'app/components/Footer.tsx',
    'app/components/ScrollProgressBar.tsx',
    'app/components/CursorTrail.tsx',
    'app/components/Particles.tsx',
    'app/components/PageTransition.tsx',
    'app/components/SoundEffects.tsx',
  ];

  const trees = [];
  for (const f of files) {
    const full = path.join(process.cwd(), f);
    if (!fs.existsSync(full)) { console.log('MISSING: ' + f); continue; }
    const content = fs.readFileSync(full, 'utf-8');
    const blob = await apiRequest('POST', `/repos/${OWNER}/${REPO}/git/blobs`, { content, encoding: 'utf-8' });
    trees.push({ path: f, mode: '100644', type: 'blob', sha: blob.sha });
    console.log('BLOB: ' + f);
  }

  console.log('Creating tree...');
  const newTree = await apiRequest('POST', `/repos/${OWNER}/${REPO}/git/trees`, { base_tree: baseTreeSha, tree: trees });
  console.log('Tree:', newTree.sha);

  const commitMsg = 'feat: implement all 19 UI enhancements\n\nScroll progress bar, custom gold scrollbar, particle hero background, cursor trail, 3D tilt cards, countdown timers, ticket quantity selector, share buttons, lazy image loading, animated 404, winners page, FAQ accordion, terms, privacy, upgraded footer, achievement badges, referral system, loading skeletons, page transitions, toggleable sound effects.';

  const newCommit = await apiRequest('POST', `/repos/${OWNER}/${REPO}/git/commits`, {
    message: commitMsg,
    tree: newTree.sha,
    parents: [currentSha]
  });
  console.log('Commit:', newCommit.sha);

  await apiRequest('PATCH', `/repos/${OWNER}/${REPO}/git/refs/heads/${BRANCH}`, { sha: newCommit.sha });
  console.log('SUCCESS - pushed to GitHub!');
}

main().catch(e => console.error('ERROR:', e.message));
