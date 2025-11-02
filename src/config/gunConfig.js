import Gun from 'gun';
import 'gun/sea';

// Use multiple relay servers for better reliability
// Gun.js will try to connect to all of them
// Priority: local relay first (fastest), then public relays as fallback
const gun = Gun({
  peers: [
    // Local relay server (run with: npm run relay)
    'http://localhost:5001/gun',
    // Public relay servers as fallback
    'https://gun-relay.herokuapp.com/gun',
    'https://gunjs.herokuapp.com/gun',
    'https://relay.peer.ooo/gun',
  ],
  localStorage: true, // Enable IndexedDB storage
  radisk: true, // Enable disk storage
});

// Log connection status for debugging
gun.on('hi', (peer) => {
  console.log('✅ Connected to peer:', peer);
});

gun.on('bye', (peer) => {
  console.log('❌ Disconnected from peer:', peer);
});

// Log any connection attempts
console.log('🔌 Gun.js initialized with peers:', gun._.opt.peers);

export default gun;

