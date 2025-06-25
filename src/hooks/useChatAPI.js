
import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

export const useChatAPI = (settings, setters, activeChat, updateChat, attachedFile, removeAttachedFile) => {
  const [isLoading, setIsLoading] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const { toast } = useToast();

  const handleSendMessage = useCallback(async (messageContent) => {
    const currentMessage = typeof messageContent === 'string' ? messageContent : inputMessage;
    if ((!currentMessage.trim() && !attachedFile) || isLoading || !activeChat?.id) return;

    if (!settings.apiKey) {
      toast({
        title: "Clé API manquante",
        description: "Veuillez configurer votre clé API OpenRouter dans les paramètres.",
        variant: "destructive"
      });
      setters.setShowSettings(true);
      return;
    }

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: currentMessage,
      imageUrl: attachedFile ? attachedFile.preview : null,
      timestamp: new Date()
    };
    
    const isFirstUserMessage = activeChat.messages.filter(m => m.type === 'user').length === 0;
    const newTitle = isFirstUserMessage && currentMessage.trim() ? currentMessage.substring(0, 40) + (currentMessage.length > 40 ? '...' : '') : activeChat.title;
    
    updateChat(activeChat.id, { title: newTitle, messages: [...activeChat.messages, userMessage] });
    
    setInputMessage('');
    if(removeAttachedFile) removeAttachedFile();
    setIsLoading(true);

    try {
      const systemPromptParts = [];

      if (settings.longTermMemory?.trim()) {
        systemPromptParts.push(`--- MEMOIRE A LONG TERME DE L'UTILISATEUR ---\n${settings.longTermMemory}\n--- FIN MEMOIRE ---`);
      }

      if (settings.knowledgeBase?.length > 0) {
        const knowledgeText = settings.knowledgeBase.map(doc => `DOCUMENT: ${doc.name}\nCONTENU:\n${doc.content}`).join('\n\n');
        systemPromptParts.push(`--- BASE DE CONNAISSANCES ---\nUtilise les informations suivantes de la base de connaissances personnelle de l'utilisateur pour répondre à sa question. Fais référence aux documents si nécessaire.\n${knowledgeText}\n--- FIN CONNAISSANCES ---`);
      }

      if (settings.plugins.expertMode) {
        systemPromptParts.push("INSTRUCTION SPECIALE: Pense étape par étape (Chain-of-Thought). Explique ton raisonnement de manière claire et structurée avant de donner la réponse finale. Utilise le formatage Markdown pour la clarté.");
      }

      const systemPrompt = systemPromptParts.join('\n\n');

      const currentChatState = { ...activeChat, messages: [...activeChat.messages, userMessage]};
      let apiMessages = currentChatState.messages
        .filter(m => m.type === 'user' || m.type === 'bot' || m.type === 'assistant')
        .map(m => {
          const contentParts = [];
          if (m.content && m.content.trim() !== '') {
            contentParts.push({ type: 'text', text: m.content });
          }
          if (m.imageUrl) {
            contentParts.push({ type: 'image_url', image_url: { url: m.imageUrl } });
          }
  
          if (m.type === 'bot' || m.type === 'assistant') {
            return { role: 'assistant', content: m.content };
          }
  
          if (contentParts.length === 0) return null;
          
          return {
            role: 'user',
            content: contentParts.length === 1 && contentParts[0].type === 'text' ? contentParts[0].text : contentParts
          };
      }).filter(Boolean);

      if (systemPrompt) {
        apiMessages.unshift({ role: 'system', content: systemPrompt });
      }

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${settings.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'PRAXXIO Chat App'
        },
        body: JSON.stringify({
          model: settings.model,
          messages: apiMessages,
          temperature: settings.temperature,
          max_tokens: settings.maxTokens,
          stream: false
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Erreur API: ${response.status} - ${errorData.error?.message || 'Erreur inconnue'}`);
      }

      const data = await response.json();
      const botResponse = data.choices[0]?.message?.content || 'Désolé, je n\'ai pas pu générer une réponse.';

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      };
      
      updateChat(activeChat.id, { messages: [...currentChatState.messages, botMessage] });

    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      toast({
        title: "Erreur",
        description: `Impossible d'envoyer le message. ${error.message}`,
        variant: "destructive"
      });
      updateChat(activeChat.id, { messages: activeChat.messages.filter(m => m.id !== userMessage.id) });
    } finally {
      setIsLoading(false);
    }
  }, [inputMessage, attachedFile, isLoading, settings, setters, activeChat, updateChat, removeAttachedFile, toast]);

  return {
    isLoading,
    inputMessage,
    setInputMessage,
    handleSendMessage
  };
};
