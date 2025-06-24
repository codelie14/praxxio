import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Moon, Sun, Trash2, Download, Upload, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = ({
  isDarkMode, setIsDarkMode,
  clearChat, exportChat, importChat,
  setShowSettings
}) => {
  const handleImportClick = (event) => {
    const file = event.target.files[0];
    if (file) {
      importChat(file);
    }
    event.target.value = '';
  };

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`sticky top-0 z-50 backdrop-blur-xl border-b ${isDarkMode ? 'bg-slate-900/80 border-slate-700' : 'bg-white/80 border-slate-200'}`}
    >
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-gradient-to-r from-purple-600 to-indigo-600' : 'bg-gradient-to-r from-purple-500 to-indigo-500'}`}>
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>PRAXXIO</h1>
            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Assistant IA Intelligent</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`${isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={clearChat}
            className={`${isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <Trash2 className="w-5 h-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={exportChat}
            className={`${isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <Download className="w-5 h-5" />
          </Button>
          
          <label className="cursor-pointer">
            <input
              type="file"
              accept=".json"
              onChange={handleImportClick}
              className="hidden"
            />
            <Button
              variant="ghost"
              size="icon"
              className={`${isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
              asChild
            >
              <span>
                <Upload className="w-5 h-5" />
              </span>
            </Button>
          </label>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSettings(prev => !prev)}
            className={`${isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;