# Local Relay Server Setup

## Why "Waiting for Relay Server"?

The app shows "Waiting for relay server..." because:
1. **Public relay servers can be unreliable** - They may be down, slow, or blocked by firewalls
2. **Network issues** - Corporate networks or VPNs can block WebRTC connections
3. **First connection takes time** - Gun.js needs to establish a WebRTC connection

**Solution**: Run your own local relay server for guaranteed reliability!

## Quick Start

### 1. Start the Relay Server

Open a **new terminal window** and run:

```bash
npm run relay
```

You should see:
```
🚀 Gun.js Relay Server running on http://localhost:5001/gun
📡 Ready to relay peer-to-peer connections
```

**Keep this terminal window open** - the relay server needs to keep running.

### 2. Start the React App

In your **main terminal**, run:

```bash
npm start
```

The React app will connect to the local relay server automatically.

### 3. Test Multiple Browsers

1. Open the app in one browser (e.g., Chrome)
2. Open it in another browser or incognito window
3. Send a message from one - it should appear in the other within seconds!

## Troubleshooting

### Port 5001 Already in Use?

If you get an error that port 5001 is in use:

1. **Change the port** in `relay-server.js`:
   ```javascript
   const port = process.env.PORT || 5002; // Use 5002 instead
   ```

2. **Update the client config** in `src/config/gunConfig.js`:
   ```javascript
   'http://localhost:5002/gun', // Match the port above
   ```

3. Or **kill the process using port 5001**:
   ```bash
   # Find the process
   lsof -ti:5001
   
   # Kill it (replace PID with the number from above)
   kill -9 <PID>
   ```

### Relay Server Not Starting?

Make sure you have Gun.js installed:
```bash
npm install
```

If you installed with `--legacy-peer-deps`, that's fine - Gun.js should still work.

### Still Shows "Connecting..."?

1. **Check the relay server** - Make sure it's running and shows the success message
2. **Check browser console** - Look for "Connected to peer:" messages
3. **Verify the URL** - Make sure `http://localhost:5001/gun` is in the peers array
4. **Try refreshing** - Sometimes it takes a few seconds to connect

## Production Deployment

For production, you'll want to:
1. Host your relay server on a VPS or cloud service
2. Update the `gunConfig.js` to include your production relay URL
3. Keep the local relay for development

Example production relay setup on a VPS:
```javascript
// In gunConfig.js
peers: [
  'https://your-relay-server.com/gun',
  'http://localhost:5001/gun', // Keep local for dev
]
```

## How It Works

1. **Your relay server** (`relay-server.js`) runs on port 5001
2. **All browser instances** connect to this relay
3. **The relay** helps browsers discover each other and sync data
4. **Messages sync peer-to-peer** through the relay without storing them on the server

The relay is just a **signaling server** - your chat data still lives in each browser's IndexedDB and syncs directly between peers!

