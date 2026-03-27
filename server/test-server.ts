import express from 'express';
import { createServer } from 'http';

const app = express();
const server = createServer(app);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

server.listen(3001, () => {
  console.log('Test server running on port 3001');
});

server.on('error', (err) => {
  console.error('Server error:', err);
});
