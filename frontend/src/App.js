import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import DetectionForm from './components/DetectionForm';
import History from './components/History';
import AuthModal from './components/AuthModal';
import AdminDashboard from './components/AdminDashboard';

function AppContent() {
  const [isDark, setIsDark] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuth = (newToken) => {
    setToken(newToken);
    setIsAuthenticated(true);
    navigate('/admin');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300">
        <Header 
          isDark={isDark} 
          setIsDark={setIsDark} 
          currentPath={location.pathname}
          navigate={navigate}
          isAuthenticated={isAuthenticated}
          onShowAuth={() => setShowAuthModal(true)}
          onLogout={handleLogout}
        />
        
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <DetectionForm token={token} isAuthenticated={isAuthenticated} onShowAuth={() => setShowAuthModal(true)} />
            </>
          } />
          <Route path="/admin" element={
            isAuthenticated ? <AdminDashboard token={token} /> : <Navigate to="/" />
          } />
          <Route path="/history" element={
            isAuthenticated ? <History token={token} /> : <Navigate to="/" />
          } />
        </Routes>

        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuth={handleAuth}
        />
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
