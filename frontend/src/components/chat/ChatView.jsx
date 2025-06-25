import React from 'react';
import MessageList from '@/components/chat/MessageList';
import QuickActions from '@/components/chat/QuickActions';
import MessageInput from '@/components/chat/MessageInput';

const ChatView = ({
  messages,
  isLoading,
  isDarkMode,
  messagesEndRef,
  inputMessage,
  setInputMessage,
  handleSendMessage,
  attachedFile,
  onFileChange,
  onRemoveFile
}) => {
  const handleQuickAction = (prompt) => {
    setInputMessage(prompt);
  };

  return (
    <div className={`flex-1 ${isDarkMode ? 'bg-slate-800/30' : 'bg-white/30'} backdrop-blur-xl rounded-2xl border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'} flex flex-col h-[calc(100vh-140px)]`}>
      <MessageList
        messages={messages}
        isLoading={isLoading}
        isDarkMode={isDarkMode}
        messagesEndRef={messagesEndRef}
      />
      {!messages.some(m => m.type === 'user') && !isLoading && (
        <QuickActions onAction={handleQuickAction} />
      )}
      <MessageInput
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        handleSendMessage={() => handleSendMessage()}
        isLoading={isLoading}
        isDarkMode={isDarkMode}
        attachedFile={attachedFile}
        onFileChange={onFileChange}
        onRemoveFile={onRemoveFile}
      />
    </div>
  );
};

export default ChatView;