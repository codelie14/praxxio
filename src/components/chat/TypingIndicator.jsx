import React from 'react';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

const TypingIndicator = ({ isDarkMode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-start space-x-3"
  >
    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center">
      <Bot className="w-5 h-5 text-white" />
    </div>
    <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
      <div className="flex space-x-1">
        <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-slate-400' : 'bg-slate-600'} animate-bounce`}></div>
        <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-slate-400' : 'bg-slate-600'} animate-bounce`} style={{ animationDelay: '0.1s' }}></div>
        <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-slate-400' : 'bg-slate-600'} animate-bounce`} style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  </motion.div>
);

export default TypingIndicator;