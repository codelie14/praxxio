import { useState, useEffect, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/components/ui/use-toast';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const createNewChat = () => ({
  id: uuidv4(),
  title: 'Nouvelle Conversation',
  messages: [{
    id: uuidv4(),
    type: 'bot',
    content: "Bonjour ! Je suis votre assistant IA PRAXXIO. Comment puis-je vous aider aujourd'hui ?",
    timestamp: new Date()
  }],
  createdAt: new Date().toISOString()
});

export const useChatManager = () => {
  const [chats, setChats] = useLocalStorage('praxxio_chats', []);
  const [activeChatId, setActiveChatId] = useLocalStorage('praxxio_active_chat_id', null);
  const { toast } = useToast();

  useEffect(() => {
    let loadedChats = chats;
    if (Array.isArray(loadedChats)) {
      loadedChats = loadedChats.map(chat => ({
        ...chat,
        messages: chat.messages.map(msg => ({
          ...msg,
          timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date()
        }))
      }));
    } else {
      loadedChats = [];
    }

    if (loadedChats.length === 0) {
      const firstChat = createNewChat();
      loadedChats.push(firstChat);
      setActiveChatId(firstChat.id);
    } else if (!activeChatId || !loadedChats.some(c => c.id === activeChatId)) {
      setActiveChatId(loadedChats[0].id);
    }
    setChats(loadedChats);
  }, []);

  const activeChat = useMemo(() => chats.find(c => c.id === activeChatId) || null, [chats, activeChatId]);

  const handleNewChat = useCallback(() => {
    const newChat = createNewChat();
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
  }, [setChats, setActiveChatId]);

  const handleSelectChat = useCallback((chatId) => {
    setActiveChatId(chatId);
  }, [setActiveChatId]);

  const handleDeleteChat = useCallback((chatId) => {
    setChats(prev => {
      const newChats = prev.filter(c => c.id !== chatId);
      if (activeChatId === chatId) {
        if (newChats.length > 0) {
          setActiveChatId(newChats[0].id);
        } else {
          const freshChat = createNewChat();
          newChats.push(freshChat);
          setActiveChatId(freshChat.id);
        }
      }
      return newChats;
    });
    toast({
      title: "Conversation supprimée",
      description: "La conversation a été supprimée avec succès."
    });
  }, [activeChatId, setChats, setActiveChatId, toast]);

  const updateChat = useCallback((chatId, updates) => {
    setChats(prev => prev.map(chat => chat.id === chatId ? { ...chat, ...updates } : chat));
  }, [setChats]);
  
  const exportChat = useCallback(() => {
    if (!activeChat) return;
    const chatData = {
      ...activeChat,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `praxxio-chat-${activeChat.title.replace(/\s/g, '_')}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Chat exporté",
      description: "La conversation active a été téléchargée."
    });
  }, [activeChat, toast]);

  const importChat = useCallback((file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const chatData = JSON.parse(e.target.result);
        if (chatData && Array.isArray(chatData.messages)) {
          const newChat = {
            id: chatData.id || uuidv4(),
            title: chatData.title || 'Chat Importé',
            createdAt: chatData.createdAt || new Date().toISOString(),
            messages: chatData.messages.map(msg => ({
              ...msg,
              id: msg.id || uuidv4(),
              timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date()
            }))
          };
          setChats(prev => [newChat, ...prev]);
          setActiveChatId(newChat.id);
          toast({
            title: "Chat importé",
            description: "L'historique a été importé comme une nouvelle conversation."
          });
        } else {
            throw new Error("Format de fichier de chat invalide.");
        }
      } catch (error) {
        toast({
          title: "Erreur d'importation",
          description: error.message || "Le fichier n'est pas valide.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  }, [toast, setChats, setActiveChatId]);

  return {
    chats,
    activeChatId,
    activeChat,
    handleNewChat,
    handleSelectChat,
    handleDeleteChat,
    updateChat,
    exportChat,
    importChat
  };
};