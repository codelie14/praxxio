import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bot, Copy, Check } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';

const MessageBubble = ({ message, isDarkMode }) => {
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);

  const getDisplayTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const handleCopy = () => {
    if (message.content) {
      navigator.clipboard.writeText(message.content);
      setIsCopied(true);
      toast({
        title: "Copié !",
        description: "La réponse de l'IA a été copiée dans le presse-papiers.",
      });
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const CodeBlock = {
    code({node, inline, className, children, ...props}) {
      const match = /language-(\w+)/.exec(className || '')
      return !inline && match ? (
        <div className="relative">
          <SyntaxHighlighter
            style={isDarkMode ? vscDarkPlus : prism}
            language={match[1]}
            PreTag="div"
            {...props}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </div>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      )
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`group flex items-start space-x-3 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
    >
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
        message.type === 'user' 
          ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
          : 'bg-gradient-to-r from-purple-600 to-indigo-600'
      }`}>
        {message.type === 'user' ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-white" />
        )}
      </div>
      
      <div className={`flex-1 max-w-3xl ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
        <div className={`relative inline-block p-4 rounded-2xl ${
          message.type === 'user'
            ? `${isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'}`
            : `${isDarkMode ? 'bg-slate-700 text-slate-100' : 'bg-slate-100 text-slate-900'}`
        }`}>
          {message.type === 'bot' && (
             <button
              onClick={handleCopy}
              className={`absolute top-2 right-2 p-1.5 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100
                ${isDarkMode ? 'bg-slate-800 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'}
                ${isCopied ? 'text-green-500' : (isDarkMode ? 'text-slate-300' : 'text-slate-600')}
              `}
            >
              {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          )}

          {message.imageUrl && (
            <div className="mb-2">
              <img  src={message.imageUrl} alt={message.content || 'Image envoyée'} className="rounded-lg max-w-xs max-h-64" src="https://images.unsplash.com/photo-1595872018818-97555653a011" />
            </div>
          )}
          {message.content && (
             <div className="prose dark:prose-invert max-w-none text-left">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={CodeBlock}>
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
        <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          {getDisplayTime(message.timestamp)}
        </p>
      </div>
    </motion.div>
  );
};

export default MessageBubble;