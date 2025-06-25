import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { PlusSquare, MessageSquare, Trash2 } from 'lucide-react';

const Sidebar = ({ chats, activeChatId, onNewChat, onSelectChat, onDeleteChat, isDarkMode }) => {
  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className={`w-80 flex flex-col ${isDarkMode ? 'bg-slate-900/50' : 'bg-slate-100/50'} backdrop-blur-lg border-r ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}
    >
      <div className="p-4 border-b border-inherit">
        <Button onClick={onNewChat} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white">
          <PlusSquare className="w-5 h-5 mr-2" />
          Nouvelle Conversation
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        <AnimatePresence>
          {chats.map(chat => (
            <motion.div
              key={chat.id}
              layout
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer mb-2 transition-colors duration-200
                ${activeChatId === chat.id
                  ? `${isDarkMode ? 'bg-purple-500/20' : 'bg-purple-100'}`
                  : `${isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-200'}`
                }
              `}
              onClick={() => onSelectChat(chat.id)}
            >
              <div className="flex items-center overflow-hidden">
                <MessageSquare className={`w-5 h-5 mr-3 flex-shrink-0 ${activeChatId === chat.id ? 'text-purple-400' : (isDarkMode ? 'text-slate-400' : 'text-slate-500')}`} />
                <span className={`truncate text-sm font-medium ${activeChatId === chat.id ? (isDarkMode ? 'text-white' : 'text-slate-800') : (isDarkMode ? 'text-slate-300' : 'text-slate-700')}`}>
                  {chat.title}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChat(chat.id);
                }}
                className="p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 hover:text-red-500 hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="p-4 border-t border-inherit text-center">
        <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>PRAXXIO v1.0</p>
      </div>
    </motion.div>
  );
};

export default Sidebar;