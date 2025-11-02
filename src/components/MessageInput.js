import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import gun from '../config/gunConfig';
import { v4 as uuidv4 } from 'uuid';

const MessageInput = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // Check connection status
  useEffect(() => {
    let connectedPeers = new Set();
    
    const handleConnect = (peer) => {
      connectedPeers.add(peer);
      setIsConnected(true);
    };

    const handleDisconnect = (peer) => {
      connectedPeers.delete(peer);
      if (connectedPeers.size === 0) {
        setIsConnected(false);
      }
    };

    gun.on('hi', handleConnect);
    gun.on('bye', handleDisconnect);

    // Check initial connection status
    setTimeout(() => {
      // Try to read something to check connection
      gun.get('_test').get('connection').once(() => {
        // Connection exists
      });
    }, 1000);

    return () => {
      gun.off('hi', handleConnect);
      gun.off('bye', handleDisconnect);
    };
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    
    if (!message.trim() || !user || sending) return;

    setSending(true);
    try {
      const messageId = uuidv4();
      const messageData = {
        id: messageId,
        text: message.trim(),
        sender: user.displayName || user.email,
        userId: user.uid,
        timestamp: Date.now(),
      };
      
      // Save to Gun.js - ALWAYS save locally first (works even if relay is down)
      // Gun.js will sync to peers automatically when they're available
      const chatroom = gun.get('chatroom').get('messages');
      const messageNode = chatroom.get(messageId);
      
      // Put message - This saves locally IMMEDIATELY (IndexedDB)
      // Sync happens in background when peers are available
      messageNode.put(messageData);
      
      // Verify it's saved locally
      messageNode.once((data) => {
        if (data && data.id === messageId) {
          console.log('✅ Message saved locally:', messageData);
        }
      });

      // Give Gun.js a moment to process and save locally
      await new Promise((resolve) => setTimeout(resolve, 100));

      if (isConnected) {
        console.log('💬 Message sent and syncing:', messageData);
      } else {
        console.log('💾 Message saved locally (offline mode):', messageData);
        console.log('📝 Will sync automatically when relay server returns');
      }
      
      setMessage('');
    } catch (error) {
      console.error('❌ Error sending message:', error);
      // Even if sync fails, message should still be saved locally
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSend} className="border-t border-gray-200 bg-white px-4 py-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          disabled={sending}
        />
        <button
          type="submit"
          disabled={!message.trim() || sending}
          className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          title={!isConnected ? 'Offline - Message will save locally and sync when relay returns' : 'Send message'}
        >
          {sending ? 'Sending...' : isConnected ? 'Send' : 'Save (Offline)'}
        </button>
      </div>
    </form>
  );
};

export default MessageInput;

