/**
 * Gun.js Relay Server
 * 
 * This server acts as a relay peer for Gun.js clients to connect through.
 * Run this server locally on port 5001 to enable peer-to-peer synchronization.
 * 
 * IMPORTANT: This server does NOT store messages or images!
 * - It only helps browsers discover each other (signaling)
 * - All data is stored locally in each browser's IndexedDB
 * - Messages sync directly between browsers via WebRTC
 * - This server is just a "phone book" - not a post office!
 * 
 * Usage: node relay-server.js
 */

const Gun = require('gun');
const http = require('http');

const port = process.env.PORT || 5001;
const server = http.createServer();

// Initialize Gun.js with the HTTP server
// Gun.js automatically handles CORS and WebSocket connections
const gun = Gun({
  web: server,
  file: 'gun-data', // Optional: persist data to disk
});

// Add CORS headers to help with browser connections
server.on('request', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
});

// Start the server - bind to all interfaces (0.0.0.0) for better connectivity
server.listen(port, '0.0.0.0', () => {
  console.log(`\n🚀 Gun.js Relay Server running on http://localhost:${port}/gun`);
  console.log(`📡 Ready to relay peer-to-peer connections\n`);
  console.log(`✅ Server is listening for connections...`);
  console.log(`\nTo use this relay, add 'http://localhost:${port}/gun' to your Gun.js peers array.`);
});

// Log when clients connect
gun.on('opt', (context) => {
  if (context.on) {
    console.log('👤 New client connected:', context.id);
  }
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`\n❌ Port ${port} is already in use.`);
    console.error(`   Please stop the process using port ${port} or use a different port.\n`);
  } else {
    console.error('Server error:', error);
  }
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Shutting down relay server...');
  server.close(() => {
    console.log('✅ Relay server stopped.\n');
    process.exit(0);
  });
});

