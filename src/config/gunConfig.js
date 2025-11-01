import Gun from 'gun';
import 'gun/sea';

// Use free public relay servers
// If one fails, Gun.js will automatically try others
const gun = Gun({
  peers: [
    'https://gun-relay.herokuapp.com/gun',
    'https://gunjs.herokuapp.com/gun',
    // Add more relay servers or your own relay if needed
  ],
  localStorage: true, // Enable IndexedDB storage
});

export default gun;

