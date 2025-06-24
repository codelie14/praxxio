import React from 'react';
import { AnimatePresence } from 'framer-motion';
import MessageBubble from '@/components/chat/MessageBubble';
import TypingIndicator from '@/components/chat/TypingIndicator';

const MessageList = ({ messages, isLoading, isDarkMode, messagesEndRef }) => {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      <AnimatePresence>
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} isDarkMode={isDarkMode} />
        ))}
      </AnimatePresence>
      
      {isLoading && <TypingIndicator isDarkMode={isDarkMode} />}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;