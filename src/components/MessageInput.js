import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import gun from '../config/gunConfig';
import { v4 as uuidv4 } from 'uuid';

const MessageInput = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

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
      
      // Save to Gun.js - Gun.js handles sync automatically
      const chatroom = gun.get('chatroom').get('messages');
      const messageNode = chatroom.get(messageId);
      
      // Put message - Gun.js will sync to all peers automatically
      messageNode.put(messageData);
      
      // Give Gun.js a moment to process
      await new Promise((resolve) => setTimeout(resolve, 50));

      console.log('Message sent:', messageData);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
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
        >
          {sending ? 'Sending...' : 'Send'}
        </button>
      </div>
    </form>
  );
};

export default MessageInput;

