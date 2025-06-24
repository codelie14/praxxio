import React from 'react';
import { motion } from 'framer-motion';
import { User, Bot } from 'lucide-react';

const MessageBubble = ({ message, isDarkMode }) => {
  const getDisplayTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`flex items-start space-x-3 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
    >
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
        message.type === 'user' 
          ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
          : 'bg-gradient-to-r from-purple-600 to-indigo-600'
      }`}>
        {message.type === 'user' ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-white" />
        )}
      </div>
      
      <div className={`flex-1 max-w-3xl ${message.type === 'user' ? 'text-right' : ''}`}>
        <div className={`inline-block p-4 rounded-2xl ${
          message.type === 'user'
            ? `${isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'}`
            : `${isDarkMode ? 'bg-slate-700 text-slate-100' : 'bg-slate-100 text-slate-900'}`
        }`}>
          <p className="whitespace-pre-wrap text-left">{message.content}</p>
        </div>
        <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          {getDisplayTime(message.timestamp)}
        </p>
      </div>
    </motion.div>
  );
};

export default MessageBubble;