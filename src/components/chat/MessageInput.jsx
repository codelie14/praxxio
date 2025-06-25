import React, { useRef } from 'react';
import { Send, Paperclip, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MessageInput = ({ 
  inputMessage, 
  setInputMessage, 
  handleSendMessage, 
  isLoading, 
  isDarkMode,
  onFileChange,
  attachedFile,
  onRemoveFile
}) => {

  const fileInputRef = useRef(null);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !attachedFile) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className={`p-4 border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
      {attachedFile && (
        <div className="relative w-24 h-24 mb-2 p-1 border rounded-lg border-dashed">
          <img  src={attachedFile.preview} alt="Aperçu de la pièce jointe" className="w-full h-full object-cover rounded-md" src="https://images.unsplash.com/photo-1607212695733-c08334601aeb" />
          <Button
            variant="ghost"
            size="icon"
            className="absolute -top-2 -right-2 bg-slate-800/50 hover:bg-slate-700/80 rounded-full h-6 w-6"
            onClick={onRemoveFile}
          >
            <X className="h-4 w-4 text-white" />
          </Button>
        </div>
      )}
      <div className="flex items-end space-x-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleAttachClick}
          disabled={isLoading}
          className={`${isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
        >
          <Paperclip className="w-5 h-5" />
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileChange}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.txt"
        />
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
          disabled={isLoading || (!inputMessage.trim() && !attachedFile)}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;