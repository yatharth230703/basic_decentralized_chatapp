import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import gun from '../config/gunConfig';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ImageUpload from './ImageUpload';

const ChatroomPage = ({ activeTab, setActiveTab }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const chatroom = gun.get('chatroom').get('messages');
    const messagesMap = {};

    chatroom.map().on((data, key) => {
      if (data && data.text && data.id) {
        messagesMap[key] = data;
        const messagesArray = Object.values(messagesMap).sort(
          (a, b) => (a.timestamp || 0) - (b.timestamp || 0)
        );
        setMessages(messagesArray);
        setLoading(false);
      }
    });

    return () => {
      chatroom.off();
    };
  }, []);

  if (activeTab !== 'chat') return null;

  return (
    <div className="flex flex-col h-full bg-secondary">
      {loading && messages.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading messages...</p>
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
