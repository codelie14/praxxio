import React from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MessageInput = ({ inputMessage, setInputMessage, handleSendMessage, isLoading, isDarkMode }) => {

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`p-6 border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
      <div className="flex space-x-3">
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Tapez votre message..."
          rows={1}
          className={`flex-1 px-4 py-3 rounded-xl border ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500'} focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none`}
          style={{ minHeight: '48px', maxHeight: '120px' }}
        />
        <Button
          onClick={handleSendMessage}
          disabled={isLoading || !inputMessage.trim()}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;