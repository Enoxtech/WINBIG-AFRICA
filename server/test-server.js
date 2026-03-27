const express = require('express');
const http = require('http');

console.log('Creating express app...');
const app = express();

console.log('Creating HTTP server...');
const server = http.createServer(app);

console.log('Adding route...');
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

console.log('Calling listen...');
server.listen(3003, () => {
  console.log('Test server running on port 3003');
});

server.on('listening', () => {
  console.log('Server is now listening');
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

process.on('exit', (code) => {
  console.log('Process exit event with code:', code);
});

process.on('beforeExit', (code) => {
  console.log('Before exit event with code:', code);
});

console.log('Setup complete, waiting...');
