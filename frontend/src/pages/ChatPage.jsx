import React, { useRef, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { AnimatePresence } from 'framer-motion';
import Header from '@/components/chat/Header';
import SettingsPanel from '@/components/chat/SettingsPanel';
import ChatView from '@/components/chat/ChatView';
import Sidebar from '@/components/chat/Sidebar';
import { useSettings } from '@/hooks/useSettings';
import { useChatManager } from '@/hooks/useChatManager';
import { useFileAttachment } from '@/hooks/useFileAttachment';
import { useChatAPI } from '@/hooks/useChatAPI';
import Whiteboard from '@/components/collaboration/Whiteboard';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ShareDialog from '@/components/collaboration/ShareDialog';

const ChatPage = ({ onLogout }) => {
  const { settings, setters, saveSettings } = useSettings();
  const { chats, activeChat, handleNewChat, handleSelectChat, handleDeleteChat, updateChat, exportChat, importChat } = useChatManager();
  const { attachedFile, handleFileSelect, removeAttachedFile } = useFileAttachment();
  const { isLoading, inputMessage, setInputMessage, handleSendMessage } = useChatAPI(settings, setters, activeChat, updateChat, attachedFile, removeAttachedFile);

  const [isWhiteboardOpen, setIsWhiteboardOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  const messagesEndRef = useRef(null);

  const messages = useMemo(() => activeChat?.messages || [], [activeChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className={`min-h-screen transition-all duration-500 flex ${settings.isDarkMode ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'}`}>
      <Helmet>
        <title>PRAXXIO - Assistant IA Intelligent</title>
        <meta name="description" content="PRAXXIO est votre assistant IA personnel avec chat intelligent utilisant Llama 3.3 70B Instruct pour des conversations naturelles et contextuelles." />
      </Helmet>

      <Sidebar
        chats={chats}
        activeChatId={activeChat?.id}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        isDarkMode={settings.isDarkMode}
      />

      <div className="flex-1 flex flex-col">
        <Header
          isDarkMode={settings.isDarkMode}
          setIsDarkMode={setters.setIsDarkMode}
          deleteCurrentChat={() => activeChat && handleDeleteChat(activeChat.id)}
          exportChat={exportChat}
          importChat={importChat}
          setShowSettings={setters.setShowSettings}
          onLogout={onLogout}
          activeChat={activeChat}
          onShare={() => setIsShareDialogOpen(true)}
          onWhiteboard={() => setIsWhiteboardOpen(true)}
        />

        <main className="flex-1 max-w-6xl mx-auto px-4 pb-6 flex gap-6 w-full h-[calc(100vh-80px)] overflow-hidden">
          <AnimatePresence>
            {settings.showSettings && (
              <SettingsPanel
                settings={settings}
                setters={setters}
                onSave={saveSettings}
                isDarkMode={settings.isDarkMode}
              />
            )}
          </AnimatePresence>

          <ChatView
            messages={messages}
            isLoading={isLoading}
            isDarkMode={settings.isDarkMode}
            messagesEndRef={messagesEndRef}
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            handleSendMessage={handleSendMessage}
            attachedFile={attachedFile}
            onFileChange={handleFileSelect}
            onRemoveFile={removeAttachedFile}
            activeChat={activeChat}
          />
        </main>
      </div>

      <Dialog open={isWhiteboardOpen} onOpenChange={setIsWhiteboardOpen}>
          <DialogContent className="max-w-7xl h-[90vh] p-0 border-0">
             <Whiteboard isDarkMode={settings.isDarkMode} />
          </DialogContent>
      </Dialog>

      <ShareDialog
        open={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
        chatTitle={activeChat?.title || 'Conversation'}
      />

    </div>
  );
};

export default ChatPage;