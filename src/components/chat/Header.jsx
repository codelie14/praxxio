import React, { useRef } from 'react';
import { Sun, Moon, Trash2, Upload, Download, Settings, LogOut, Share2, PenLine, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Header = ({
  isDarkMode,
  setIsDarkMode,
  deleteCurrentChat,
  exportChat,
  importChat,
  setShowSettings,
  onLogout,
  activeChat,
  onShare,
  onWhiteboard
}) => {
  const importInputRef = useRef(null);
  const { toast } = useToast();

  const handleFeatureNotImplemented = () => {
    toast({
      title: "Bientôt disponible !",
      description: "🚧 Cette fonctionnalité n'est pas encore implémentée, mais ne vous inquiétez pas ! Vous pouvez la demander dans votre prochain message ! 🚀",
    });
  };

  const handleImportClick = () => {
    importInputRef.current.click();
  };

  const handleFileImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      importChat(file);
    }
    e.target.value = null;
  };

  return (
    <header className="bg-transparent p-4 flex justify-between items-center">
      <div className="flex items-center">
        <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          {activeChat?.title || 'PRAXXIO'}
        </h1>
      </div>
      <div className="flex items-center space-x-1">
        <Button variant="ghost" size="icon" onClick={onShare} className={`${isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
          <Share2 className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onWhiteboard} className={`${isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
          <PenLine className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleFeatureNotImplemented} className={`${isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
          <Palette className="w-5 h-5" />
        </Button>
        <div className="border-l h-6 mx-2 border-slate-300 dark:border-slate-700"></div>
        <Button variant="ghost" size="icon" onClick={() => setIsDarkMode(!isDarkMode)} className={`${isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
        <Button variant="ghost" size="icon" onClick={deleteCurrentChat} className={`${isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
          <Trash2 className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={exportChat} className={`${isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
          <Download className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleImportClick} className={`${isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
          <Upload className="w-5 h-5" />
        </Button>
        <input
          type="file"
          ref={importInputRef}
          onChange={handleFileImport}
          className="hidden"
          accept=".json"
        />
        <Button variant="ghost" size="icon" onClick={() => setShowSettings(s => !s)} className={`${isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
          <Settings className="w-5 h-5" />
        </Button>
        {onLogout && (
          <Button variant="ghost" size="icon" onClick={onLogout} className="text-red-500 hover:text-red-400">
            <LogOut className="w-5 h-5" />
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;