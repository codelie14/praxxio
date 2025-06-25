
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const SettingsPanel = ({
  apiKey, setApiKey,
  model, setModel,
  temperature, setTemperature,
  maxTokens, setMaxTokens,
  saveApiKey, isDarkMode,
  plugins, setPlugins
}) => {
  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      className={`w-80 ${isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'} backdrop-blur-xl rounded-2xl p-6 border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'} h-fit`}
    >
      <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Paramètres</h3>
      
      <div className="space-y-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            Clé API OpenRouter
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-or-v1-..."
            className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'} focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
          />
        </div>
        
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            Modèle
          </label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'} focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
          >
            <option value="meta-llama/llama-3.3-70b-instruct">Llama 3.3 70B Instruct</option>
            <option value="meta-llama/llama-3.1-70b-instruct">Llama 3.1 70B Instruct</option>
            <option value="anthropic/claude-3.5-sonnet">Claude 3.5 Sonnet</option>
            <option value="openai/gpt-4o">GPT-4o</option>
          </select>
        </div>
        
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            Température: {temperature}
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
        
        <div>
          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            Max Tokens: {maxTokens}
          </label>
          <input
            type="range"
            min="256"
            max="4096"
            step="256"
            value={maxTokens}
            onChange={(e) => setMaxTokens(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      <div className={`border-t my-4 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}></div>
      
      <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Plugins</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="calculator-plugin" className={`${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Calculatrice</Label>
          <Switch
            id="calculator-plugin"
            checked={plugins.calculator}
            onCheckedChange={(checked) => setPlugins(p => ({ ...p, calculator: checked }))}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="web-search-plugin" className={`${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Recherche Web</Label>
          <Switch
            id="web-search-plugin"
            checked={plugins.webSearch}
            onCheckedChange={(checked) => setPlugins(p => ({ ...p, webSearch: checked }))}
          />
        </div>
      </div>

      <div className={`border-t my-4 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}></div>

      <Button onClick={saveApiKey} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
        Sauvegarder
      </Button>
    </motion.div>
  );
};

export default SettingsPanel;
