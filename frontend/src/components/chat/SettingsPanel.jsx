
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { FileText, Trash2, Loader2 } from 'lucide-react';

const SettingsPanel = ({
  settings,
  setters,
  onSave,
  isDarkMode
}) => {
  const { toast } = useToast();
  const knowledgeFileInputRef = useRef(null);
  const [isParsing, setIsParsing] = useState(false);

  const handleKnowledgeUploadClick = () => {
    knowledgeFileInputRef.current.click();
  };

  const handleKnowledgeFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsParsing(true);
    try {
      let text = '';
      if (file.type === 'application/pdf') {
        const pdfParser = await import('pdf-parse');
        const data = await pdfParser.default(await file.arrayBuffer());
        text = data.text;
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const mammoth = await import('mammoth');
        const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
        text = result.value;
      } else if (file.type === 'text/plain') {
        text = await file.text();
      } else {
        throw new Error("Type de fichier non supporté. Veuillez utiliser PDF, DOCX, ou TXT.");
      }

      setters.setKnowledgeBase(prev => [...prev, { id: uuidv4(), name: file.name, content: text.substring(0, 15000) }]);
      toast({ title: "Document ajouté !", description: `${file.name} a été ajouté à votre base de connaissances.` });
    } catch (error) {
      console.error("Erreur de parsing:", error);
      toast({ title: "Erreur de parsing", description: error.message, variant: 'destructive' });
    } finally {
      setIsParsing(false);
      if(knowledgeFileInputRef.current) knowledgeFileInputRef.current.value = "";
    }
  };

  const handleDeleteKnowledgeDoc = (docId) => {
    setters.setKnowledgeBase(prev => prev.filter(doc => doc.id !== docId));
    toast({ title: "Document supprimé", description: "Le document a été retiré de votre base de connaissances." });
  };

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      className={`w-96 ${isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'} backdrop-blur-xl rounded-2xl p-6 border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'} h-fit flex flex-col overflow-y-auto`}
    >
      <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Paramètres</h3>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="apiKey" className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            Clé API OpenRouter
          </Label>
          <input
            id="apiKey"
            type="password"
            value={settings.apiKey}
            onChange={(e) => setters.setApiKey(e.target.value)}
            placeholder="sk-or-v1-..."
            className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'} focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
          />
        </div>
        
        <div>
          <Label htmlFor="model" className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            Modèle
          </Label>
          <select
            id="model"
            value={settings.model}
            onChange={(e) => setters.setModel(e.target.value)}
            className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'} focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
          >
            <option value="meta-llama/llama-3.3-70b-instruct">Llama 3.3 70B Instruct</option>
            <option value="meta-llama/llama-3.1-70b-instruct">Llama 3.1 70B Instruct</option>
            <option value="anthropic/claude-3.5-sonnet">Claude 3.5 Sonnet</option>
            <option value="openai/gpt-4o">GPT-4o</option>
          </select>
        </div>
        
        <div>
          <Label htmlFor="temperature" className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            Température: {settings.temperature}
          </Label>
          <input
            id="temperature"
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={settings.temperature}
            onChange={(e) => setters.setTemperature(parseFloat(e.target.value))}
            className="w-full accent-purple-500"
          />
        </div>
        
        <div>
          <Label htmlFor="maxTokens" className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            Max Tokens: {settings.maxTokens}
          </Label>
          <input
            id="maxTokens"
            type="range"
            min="256"
            max="8192"
            step="256"
            value={settings.maxTokens}
            onChange={(e) => setters.setMaxTokens(parseInt(e.target.value))}
            className="w-full accent-purple-500"
          />
        </div>
      </div>

      <div className={`border-t my-4 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}></div>
      
      <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Intelligence Augmentée</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="expert-mode" className={`${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Mode Expert (CoT)</Label>
          <Switch
            id="expert-mode"
            checked={settings.plugins.expertMode}
            onCheckedChange={(checked) => setters.setPlugins(p => ({ ...p, expertMode: checked }))}
          />
        </div>
        <div>
          <Label htmlFor="long-term-memory" className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            Mémoire à long terme
          </Label>
          <textarea
            id="long-term-memory"
            rows="3"
            placeholder="Ex: Mon anniversaire est le 14 Juillet, je préfère les réponses concises..."
            className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'} focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
            value={settings.longTermMemory}
            onChange={(e) => setters.setLongTermMemory(e.target.value)}
          />
        </div>
        <div>
          <Label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            Base de connaissances
          </Label>
          <div className="space-y-2">
            {settings.knowledgeBase.map(doc => (
              <div key={doc.id} className={`flex items-center justify-between p-2 rounded-lg ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-100'}`}>
                <div className="flex items-center space-x-2 overflow-hidden">
                  <FileText className="w-5 h-5 text-purple-400 flex-shrink-0" />
                  <span className={`text-sm truncate ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{doc.name}</span>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDeleteKnowledgeDoc(doc.id)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
          <Button onClick={handleKnowledgeUploadClick} variant="outline" className="w-full mt-2" disabled={isParsing}>
            {isParsing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isParsing ? 'Analyse en cours...' : 'Uploader un document'}
          </Button>
          <input
            type="file"
            ref={knowledgeFileInputRef}
            onChange={handleKnowledgeFileChange}
            className="hidden"
            accept=".pdf,.docx,.txt"
          />
        </div>
      </div>

      <div className={`border-t my-4 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}></div>

      <Button onClick={onSave} className="w-full mt-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
        Sauvegarder
      </Button>
    </motion.div>
  );
};

export default SettingsPanel;
