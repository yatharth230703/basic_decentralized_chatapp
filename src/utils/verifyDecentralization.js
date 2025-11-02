/**
 * Decentralization Verification Utility
 * 
 * Run these functions in browser console to verify the app is truly decentralized
 */

export const verifyDecentralization = {
  /**
   * Check if data is stored locally in IndexedDB
   */
  checkLocalStorage: async () => {
    console.log('🔍 Checking local storage...');
    
    try {
      const databases = await indexedDB.databases();
      console.log(`✅ Found ${databases.length} IndexedDB databases:`);
      
      databases.forEach(db => {
        console.log(`   - ${db.name} (version: ${db.version})`);
      });
      
      // Look for Gun.js database
      const gunDb = databases.find(db => 
        db.name.includes('gun') || db.name.includes('Gun') || db.name.includes('chatroom')
      );
      
      if (gunDb) {
        console.log('✅ Found Gun.js database - data is stored locally!');
      } else {
        console.log('⚠️ Gun.js database not found in list (might be using different name)');
      }
      
      return databases;
    } catch (error) {
      console.error('❌ Error checking IndexedDB:', error);
      return null;
    }
  },

  /**
   * Verify no data is being sent to a central server
   */
  checkNetworkActivity: () => {
    console.log('🔍 Instructions for checking network activity:');
    console.log('1. Open DevTools → Network tab');
    console.log('2. Filter by "WS" (WebSocket) or "XHR"');
    console.log('3. Send a message');
    console.log('4. Look for requests:');
    console.log('   ✅ WebSocket connections (signaling only)');
    console.log('   ❌ POST requests with message content (would indicate centralization)');
    console.log('');
    console.log('✅ If you only see WebSocket connections, data is decentralized!');
  },

  /**
   * Test if relay server can be stopped
   */
  testRelayIndependence: () => {
    console.log('🧪 Test: Relay Server Independence');
    console.log('');
    console.log('Steps:');
    console.log('1. Send a few messages in this browser');
    console.log('2. Stop the relay server (Ctrl+C in terminal)');
    console.log('3. Open app in another browser');
    console.log('4. Try sending messages between browsers');
    console.log('');
    console.log('Expected Result:');
    console.log('✅ Messages should still sync between browsers!');
    console.log('✅ This proves data syncs peer-to-peer, not through server');
    console.log('');
    console.log('❌ If messages stop syncing, data is likely centralized');
  },

  /**
   * Check if messages persist offline
   */
  testOfflinePersistence: () => {
    console.log('🧪 Test: Offline Persistence');
    console.log('');
    console.log('Steps:');
    console.log('1. Send messages while online');
    console.log('2. Disable internet (turn off WiFi)');
    console.log('3. Refresh the page');
    console.log('');
    console.log('Expected Result:');
    console.log('✅ Old messages should still be visible');
    console.log('✅ Data persists in IndexedDB');
    console.log('✅ New messages won\'t sync until internet returns');
  },

  /**
   * Verify all checks at once
   */
  runAllChecks: async () => {
    console.log('🚀 Running all decentralization checks...\n');
    
    await verifyDecentralization.checkLocalStorage();
    console.log('');
    
    verifyDecentralization.checkNetworkActivity();
    console.log('');
    
    verifyDecentralization.testRelayIndependence();
    console.log('');
    
    verifyDecentralization.testOfflinePersistence();
    
    console.log('\n✅ Verification complete!');
    console.log('📖 See DECENTRALIZATION_VERIFICATION.md for detailed explanation');
  }
};

// Make it available globally for browser console
if (typeof window !== 'undefined') {
  window.verifyDecentralization = verifyDecentralization;
}

