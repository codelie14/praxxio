import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '@/pages/LoginPage';
import ChatPage from '@/pages/ChatPage';
import { Toaster } from '@/components/ui/toaster';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem('praxxio_authenticated');
    if (session) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = () => {
    localStorage.setItem('praxxio_authenticated', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('praxxio_authenticated');
    localStorage.removeItem('praxxio_chats');
    localStorage.removeItem('openrouter_api_key');
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return <div className="bg-slate-900 min-h-screen w-full"></div>;
  }

  return (
    <>
      <Routes>
        <Route 
          path="/login" 
          element={!isAuthenticated ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/" 
          element={isAuthenticated ? <ChatPage onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;