
import { useState, useCallback } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useToast } from '@/components/ui/use-toast';

export const useSettings = () => {
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useLocalStorage('praxxio_dark_mode', true);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useLocalStorage('openrouter_api_key', '');
  const [model, setModel] = useLocalStorage('praxxio_model', 'meta-llama/llama-3.3-70b-instruct');
  const [temperature, setTemperature] = useLocalStorage('praxxio_temperature', 0.7);
  const [maxTokens, setMaxTokens] = useLocalStorage('praxxio_max_tokens', 2048);
  const [plugins, setPlugins] = useLocalStorage('praxxio_plugins', { expertMode: false });
  const [longTermMemory, setLongTermMemory] = useLocalStorage('praxxio_long_term_memory', '');
  const [knowledgeBase, setKnowledgeBase] = useLocalStorage('praxxio_knowledge_base', []);
  
  const settings = {
    isDarkMode,
    showSettings,
    apiKey,
    model,
    temperature,
    maxTokens,
    plugins,
    longTermMemory,
    knowledgeBase
  };
  
  const setters = {
    setIsDarkMode,
    setShowSettings,
    setApiKey,
    setModel,
    setTemperature,
    setMaxTokens,
    setPlugins,
    setLongTermMemory,
    setKnowledgeBase
  };

  const saveSettings = useCallback(() => {
    toast({
      title: "Paramètres sauvegardés",
      description: "Votre configuration a été enregistrée avec succès."
    });
    setShowSettings(false);
  }, [toast, setShowSettings]);

  return { settings, setters, saveSettings };
};
