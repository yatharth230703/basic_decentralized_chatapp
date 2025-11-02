# Troubleshooting Message Synchronization

## Issue: Messages not syncing between browsers

If messages sent from one browser instance are not appearing in another, try these solutions:

### 1. Check Browser Console

Open the browser developer console (F12) and look for:
- "Connected to peer:" messages - indicates Gun.js is connecting to relay servers
- Any error messages related to Gun.js or network connections

### 2. Verify Relay Server Connection

The app uses public relay servers. If they're down:
- Try refreshing the page
- Wait a few minutes and try again
- Check if the relay servers are accessible:
  - `https://gun-relay.herokuapp.com/gun`
  - `https://gunjs.herokuapp.com/gun`
  - `https://relay.peer.ooo/gun`

### 3. Test Local Synchronization

If you're testing on the same machine:
1. Open one browser (e.g., Chrome)
2. Open another browser or incognito window
3. Both should connect through the relay servers

### 4. Check Network Connectivity

- Ensure both browsers have internet connectivity
- Some corporate networks/firewalls may block WebRTC connections
- Try disabling VPN if active

### 5. Clear IndexedDB (Last Resort)

If messages are stuck:
1. Open browser DevTools (F12)
2. Go to Application → Storage → IndexedDB
3. Delete the Gun.js database
4. Refresh the page

### 6. Alternative: Run Your Own Relay Server

For more reliable syncing, run a local relay server:

```bash
# Install Gun.js globally
npm install -g gun

# Run a relay server
gun --port 8765
```

Then update `src/config/gunConfig.js` to include:
```javascript
peers: [
  'http://localhost:8765/gun',
  // ... other relays
]
```

### 7. Debug Mode

Check the browser console for:
- `console.log('Message sent:', messageData)` - confirms message is being saved
- `console.log('Connected to peer:', peer)` - confirms relay connection
- Any Gun.js warnings or errors

## Expected Behavior

- Messages should appear in all connected browsers within 1-3 seconds
- Messages persist even after closing the browser (stored in IndexedDB)
- Messages sync automatically when new browsers connect

## Still Not Working?

If messages still don't sync:
1. Check that both browsers are using the same Gun.js relay servers
2. Verify that messages are being saved locally (check IndexedDB)
3. Try using a different relay server
4. Consider using a dedicated relay server instead of free public ones

