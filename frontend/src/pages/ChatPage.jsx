
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/chat/Header';
import SettingsPanel from '@/components/chat/SettingsPanel';
import ChatView from '@/components/chat/ChatView';

const ChatPage = ({ onLogout }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('meta-llama/llama-3.3-70b-instruct');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [attachedFile, setAttachedFile] = useState(null);
  const [plugins, setPlugins] = useState({ calculator: false, webSearch: false });
  
  const messagesEndRef = useRef(null);
  const { toast } = useToast();

  useEffect(() => {
    const savedApiKey = localStorage.getItem('openrouter_api_key') || '';
    setApiKey(savedApiKey);

    let initialMessages = [];
    const savedMessages = localStorage.getItem('praxxio_messages');
    if (savedMessages) {
        try {
            const parsed = JSON.parse(savedMessages);
            if (Array.isArray(parsed)) {
                initialMessages = parsed.map(msg => ({
                    ...msg,
                    timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date()
                }));
            }
        } catch (error) {
            console.error("Failed to parse messages from localStorage", error);
            localStorage.removeItem('praxxio_messages');
        }
    }

    if (initialMessages.length === 0) {
        initialMessages.push({
            id: 1,
            type: 'bot',
            content: "Bonjour ! Je suis votre assistant IA PRAXXIO. Comment puis-je vous aider aujourd'hui ?\n\nVous pouvez me demander de faire beaucoup de choses, comme :\n*   Rédiger un e-mail\n*   Écrire un poème\n*   Traduire un texte\n*   Expliquer un concept complexe\n*   Générer du code dans n'importe quel langage",
            timestamp: new Date()
        });
    }
    setMessages(initialMessages);
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('praxxio_messages', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachedFile({
          file: file,
          preview: reader.result
        });
      };
      reader.readAsDataURL(file);
    } else if (file) {
      toast({
        title: "Fichier non supporté",
        description: "Veuillez sélectionner un fichier image.",
        variant: "destructive"
      });
    }
  };

  const removeAttachedFile = () => {
    setAttachedFile(null);
  };

  const handleSendMessage = useCallback(async (messageContent) => {
    const currentMessage = typeof messageContent === 'string' ? messageContent : inputMessage;
    if ((!currentMessage.trim() && !attachedFile) || isLoading) return;
    
    if (plugins.calculator || plugins.webSearch) {
      toast({
        title: "Plugins activés",
        description: "🚧 Cette fonctionnalité n'est pas encore implémentée, mais ne vous inquiétez pas ! Vous pouvez la demander dans votre prochain message ! 🚀",
      });
    }

    if (!apiKey) {
      toast({
        title: "Clé API manquante",
        description: "Veuillez configurer votre clé API OpenRouter dans les paramètres.",
        variant: "destructive"
      });
      setShowSettings(true);
      return;
    }

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: currentMessage,
      imageUrl: attachedFile ? attachedFile.preview : null,
      timestamp: new Date()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputMessage('');
    setAttachedFile(null);
    setIsLoading(true);

    try {
      const apiMessages = updatedMessages.map(m => {
        const contentParts = [];
        if (m.content && m.content.trim() !== '') {
          contentParts.push({ type: 'text', text: m.content });
        }
        if (m.imageUrl) {
          contentParts.push({ type: 'image_url', image_url: { url: m.imageUrl } });
        }

        if (m.type === 'bot' || m.type === 'assistant') { // assistant is legacy
          return { role: 'assistant', content: m.content };
        }

        if (contentParts.length === 0) return null;
        
        return {
          role: 'user',
          content: contentParts.length === 1 && contentParts[0].type === 'text' ? contentParts[0].text : contentParts
        };
      }).filter(Boolean);

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'PRAXXIO Chat App'
        },
        body: JSON.stringify({
          model: model,
          messages: apiMessages,
          temperature: temperature,
          max_tokens: maxTokens,
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

      setMessages(prev => [...prev, botMessage]);
      
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      toast({
        title: "Erreur",
        description: `Impossible d'envoyer le message. ${error.message}`,
        variant: "destructive"
      });
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  }, [inputMessage, attachedFile, isLoading, apiKey, messages, model, temperature, maxTokens, toast, plugins]);

  const clearChat = useCallback(() => {
    setMessages([{
      id: 1,
      type: 'bot',
      content: 'Bonjour ! Je suis votre assistant IA PRAXXIO. Comment puis-je vous aider aujourd\'hui ?',
      timestamp: new Date()
    }]);
    toast({
      title: "Chat effacé",
      description: "L'historique des messages a été supprimé."
    });
  }, [toast]);

  const exportChat = useCallback(() => {
    const chatData = {
      messages: messages,
      exportDate: new Date().toISOString(),
      settings: { model, temperature, maxTokens }
    };
    
    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `praxxio-chat-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Chat exporté",
      description: "L'historique a été téléchargé avec succès."
    });
  }, [messages, model, temperature, maxTokens, toast]);

  const importChat = useCallback((file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const chatData = JSON.parse(e.target.result);
        if (chatData && Array.isArray(chatData.messages)) {
          const importedMessages = chatData.messages.map(msg => ({
            ...msg,
            timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date()
          }));
          setMessages(importedMessages);
          if (chatData.settings) {
            setModel(chatData.settings.model || 'meta-llama/llama-3.3-70b-instruct');
            setTemperature(chatData.settings.temperature || 0.7);
            setMaxTokens(chatData.settings.maxTokens || 2048);
          }
          toast({
            title: "Chat importé",
            description: "L'historique a été restauré avec succès."
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
  }, [toast]);

  const saveApiKey = useCallback(() => {
    localStorage.setItem('openrouter_api_key', apiKey);
    toast({
      title: "Paramètres sauvegardés",
      description: "Votre configuration a été enregistrée."
    });
    setShowSettings(false);
  }, [apiKey, toast]);

  return (
    <div className={`min-h-screen transition-all duration-500 ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'}`}>
      <Helmet>
        <title>PRAXXIO - Assistant IA Intelligent</title>
        <meta name="description" content="PRAXXIO est votre assistant IA personnel avec chat intelligent utilisant Llama 3.3 70B Instruct pour des conversations naturelles et contextuelles." />
      </Helmet>

      <Header
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        clearChat={clearChat}
        exportChat={exportChat}
        importChat={importChat}
        setShowSettings={setShowSettings}
        onLogout={onLogout}
      />

      <main className="max-w-6xl mx-auto px-4 py-6 flex gap-6">
        <AnimatePresence>
          {showSettings && (
            <SettingsPanel
              apiKey={apiKey} setApiKey={setApiKey}
              model={model} setModel={setModel}
              temperature={temperature} setTemperature={setTemperature}
              maxTokens={maxTokens} setMaxTokens={setMaxTokens}
              saveApiKey={saveApiKey}
              isDarkMode={isDarkMode}
              plugins={plugins}
              setPlugins={setPlugins}
            />
          )}
        </AnimatePresence>

        <ChatView
          messages={messages}
          isLoading={isLoading}
          isDarkMode={isDarkMode}
          messagesEndRef={messagesEndRef}
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          handleSendMessage={handleSendMessage}
          attachedFile={attachedFile}
          onFileChange={handleFileSelect}
          onRemoveFile={removeAttachedFile}
        />
      </main>
    </div>
  );
};

export default ChatPage;