import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { PenSquare, Code, BrainCircuit } from 'lucide-react';

const QuickActions = ({ onAction }) => {
  const actions = [
    {
      icon: <PenSquare className="w-5 h-5 mr-2" />,
      text: 'Rédiger un e-mail de suivi',
    },
    {
      icon: <Code className="w-5 h-5 mr-2" />,
      text: "Écrire une fonction Python qui inverse une chaîne",
    },
    {
      icon: <BrainCircuit className="w-5 h-5 mr-2" />,
      text: "Expliquer l'informatique quantique en termes simples",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="px-6 pb-4 grid grid-cols-1 md:grid-cols-3 gap-3"
    >
      {actions.map((action, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
        >
          <Button
            variant="outline"
            className="w-full h-auto text-left justify-start py-3 px-4"
            onClick={() => onAction(action.text)}
          >
            {action.icon}
            <span className="flex-1 whitespace-normal">{action.text}</span>
          </Button>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default QuickActions;