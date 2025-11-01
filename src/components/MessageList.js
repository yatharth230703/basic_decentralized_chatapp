import React, { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

const MessageList = ({ messages }) => {
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  };

  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <p>No messages yet. Be the first to say something!</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
      {messages.map((msg) => {
        const isOwnMessage = msg.userId === user?.uid;
        return (
          <div
            key={msg.id}
            className={`flex ${isOwnMessage ? 'ml-auto' : 'mr-auto'} max-w-[80%] md:max-w-[70%]`}
          >
            <div
              className={`rounded-lg px-4 py-2 ${
                isOwnMessage
                  ? 'bg-primary text-white'
                  : 'bg-white text-text border border-gray-200'
              }`}
            >
              {!isOwnMessage && (
                <div className="font-semibold text-sm mb-1 opacity-90">
                  {msg.sender || 'Anonymous'}
                </div>
              )}
              <div className="text-sm break-words">{msg.text}</div>
              <div
                className={`text-xs mt-1 ${
                  isOwnMessage ? 'text-white opacity-80' : 'text-gray-500'
                }`}
              >
                {formatTime(msg.timestamp)}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;

