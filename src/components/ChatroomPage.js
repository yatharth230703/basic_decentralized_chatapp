import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import gun from '../config/gunConfig';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ImageUpload from './ImageUpload';
import '../utils/verifyDecentralization'; // Load verification utils

const ChatroomPage = ({ activeTab, setActiveTab }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const chatroom = gun.get('chatroom').get('messages');
    const messagesMap = new Map(); // Use Map for better duplicate handling
    let hasReceivedValidData = false;
    let isSubscribed = true;
    let updateTimeout = null;

    // Check connection status - track connected peers
    let connectedPeers = new Set();
    
    // Set up connection listeners (only once)
    const handleConnect = (peer) => {
      connectedPeers.add(peer);
      setIsConnected(true);
      console.log('✅ Gun.js connected to peer:', peer);
    };

    const handleDisconnect = (peer) => {
      connectedPeers.delete(peer);
      if (connectedPeers.size === 0) {
        setIsConnected(false);
      }
      console.log('❌ Gun.js disconnected from peer:', peer);
    };

    gun.on('hi', handleConnect);
    gun.on('bye', handleDisconnect);

    // Force a connection attempt by writing a test value
    // This helps establish the connection immediately
    const testConnection = setTimeout(() => {
      const testNode = gun.get('_test').get('connection');
      testNode.put({ timestamp: Date.now() });
      console.log('📤 Sent connection test to relay server');
    }, 100);

    // Poll connection status periodically
    // Gun.js 'hi' events might not fire immediately, so we check actively
    let connectionPollCount = 0;
    const connectionPoll = setInterval(() => {
      connectionPollCount++;
      
      // Try to read from the relay to force connection
      const testRead = gun.get('_test').get('connection');
      testRead.once(() => {
        if (!isConnected && connectionPollCount <= 10) {
          console.log(`🔄 Attempting connection (${connectionPollCount}/10)...`);
        }
      });

      // After 5 seconds, if still not connected, show warning
      if (connectionPollCount === 5 && connectedPeers.size === 0) {
        console.warn('⚠️ Still connecting to relay server...');
        console.warn('💡 Verify relay server is running: http://localhost:5001/gun');
        console.warn('💡 Check browser Network tab for connection errors');
      }

      // Stop polling after 10 attempts
      if (connectionPollCount >= 10) {
        clearInterval(connectionPoll);
        if (connectedPeers.size === 0) {
          console.error('❌ Failed to connect to relay server after 10 attempts');
          console.error('💡 Make sure relay server is running: npm run relay');
        }
      }
    }, 500);

    // Initial connection check
    const connectionCheck = setTimeout(() => {
      if (connectedPeers.size === 0 && isSubscribed) {
        console.warn('⚠️ Initial connection check: No peers connected');
      }
    }, 3000);

    // Set a timeout to stop loading after 3 seconds if no messages found
    const loadingTimeout = setTimeout(() => {
      if (isSubscribed && !hasReceivedValidData) {
        setLoading(false);
      }
    }, 3000);

    // Function to update messages array
    const updateMessages = () => {
      if (!isSubscribed) return;
      
      const messagesArray = Array.from(messagesMap.values())
        .filter((msg) => msg && msg.text && msg.id) // Filter valid messages
        .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0)); // Sort by timestamp
      
      setMessages(messagesArray);
      
      if (messagesArray.length > 0) {
        hasReceivedValidData = true;
        clearTimeout(loadingTimeout);
        setLoading(false);
      }
    };

    // Listen for all messages in the chatroom (real-time updates)
    // Gun.js map().on() will fire for all existing messages and new ones
    // This includes messages from IndexedDB (local storage) AND from peers
    const unsubscribe = chatroom.map().on((data, key) => {
      if (!isSubscribed) return;

      // Gun.js emits null/undefined for empty nodes - skip those
      if (data === null || data === undefined || typeof data !== 'object') {
        // Still update if we have messages already loaded
        if (messagesMap.size > 0 && updateTimeout === null) {
          updateMessages();
        }
        return;
      }

      // Process valid message objects
      // Check for all required fields to ensure it's a valid message
      if (data.text && data.id && data.timestamp && data.sender) {
        const messageId = data.id;
        
        // Only add if we don't already have this message (avoid duplicates)
        if (!messagesMap.has(messageId)) {
          messagesMap.set(messageId, data);
          
          // Log where message came from
          const isFromLocal = !isConnected || connectedPeers.size === 0;
          console.log(`📨 Message received: ${isFromLocal ? '(from local storage)' : '(from peer sync)'}`, data.id);
          
          // Debounce updates to batch multiple messages
          if (updateTimeout) {
            clearTimeout(updateTimeout);
          }
          updateTimeout = setTimeout(updateMessages, 50);
        }
      }
    });

    // Also listen for messages from local storage on mount
    // This ensures we show messages even if no peers are connected
    chatroom.map().once((data, key) => {
      if (data && typeof data === 'object' && data.text && data.id && data.timestamp && data.sender) {
        if (!messagesMap.has(data.id)) {
          messagesMap.set(data.id, data);
          updateMessages();
        }
      }
    });

    // Cleanup function
    return () => {
      isSubscribed = false;
      clearTimeout(loadingTimeout);
      clearTimeout(updateTimeout);
      clearTimeout(connectionCheck);
      clearTimeout(testConnection);
      clearInterval(connectionPoll);
      gun.off('hi', handleConnect);
      gun.off('bye', handleDisconnect);
      if (unsubscribe) {
        chatroom.off();
      }
    };
  }, []);

  if (activeTab !== 'chat') return null;

  return (
    <div className="flex flex-col h-full bg-secondary">
      {/* Connection status indicator */}
      <div className="px-4 py-2 bg-white border-b border-gray-200 flex items-center justify-between text-xs">
        <span className="text-gray-600">
          Status: {isConnected ? (
            <span className="text-green-600 font-medium">Connected - Syncing</span>
          ) : (
            <span className="text-orange-600 font-medium">Offline - Saving Locally</span>
          )}
        </span>
        {!isConnected && (
          <span className="text-gray-500">
            Messages saved locally. Will sync when relay returns.
          </span>
        )}
        {isConnected && (
          <span className="text-green-600">✓ All peers connected</span>
        )}
      </div>

      {loading && messages.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading messages...</p>
            {!isConnected && (
              <p className="text-sm text-orange-600 mt-2">
                Waiting for peer connection...
              </p>
            )}
          </div>
        </div>
      ) : (
        <MessageList messages={messages} />
      )}

      <ImageUpload />
      <MessageInput />
    </div>
  );
};

export default ChatroomPage;
