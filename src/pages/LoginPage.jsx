import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';

const LoginPage = ({ onLogin }) => {
  return (
    <>
      <Helmet>
        <title>Connexion - PRAXXIO</title>
        <meta name="description" content="Connectez-vous à PRAXXIO pour accéder à votre assistant IA personnel." />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-white p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md text-center"
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400 mb-2">
              PRAXXIO
            </h1>
            <p className="text-xl text-slate-300">Votre assistant IA personnel vous attend.</p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-8 shadow-2xl"
          >
            <p className="text-slate-300 mb-6">
              Puisque vous êtes le seul utilisateur, vos conversations et paramètres seront sauvegardés directement dans votre navigateur.
            </p>
            <Button
              onClick={onLogin}
              className="w-full text-lg py-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
            >
              <Zap className="mr-2 h-5 w-5" />
              Accéder à mon espace
            </Button>
            <p className="text-xs text-slate-500 mt-6">
              Pour une synchronisation entre appareils, une base de données cloud comme Supabase pourra être ajoutée plus tard.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;