import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import BioPage from './pages/BioPage';
import AuthModal from './components/AuthModal';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'dashboard', 'bio'
  const [activeUsername, setActiveUsername] = useState('ares');
  const [authModal, setAuthModal] = useState({
    isOpen: false,
    mode: 'register',
    prefilledUsername: '',
  });

  // Handle URL route parsing on initial load and back/forward navigation
  const parseRoute = () => {
    const path = window.location.pathname.replace(/^\/+|\/+$/g, '');
    
    if (!path || path === '') {
      setCurrentPage('home');
    } else if (path === 'dashboard') {
      setCurrentPage('dashboard');
    } else {
      // Any other path is treated as a username bio profile (e.g. /ares)
      setActiveUsername(path.replace('@', ''));
      setCurrentPage('bio');
    }
  };

  useEffect(() => {
    parseRoute();
    const handlePopState = () => parseRoute();
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (page, username = 'ares') => {
    setCurrentPage(page);
    if (page === 'home') {
      window.history.pushState({}, '', '/');
    } else if (page === 'dashboard') {
      setActiveUsername(username);
      window.history.pushState({}, '', '/dashboard');
    } else if (page === 'bio') {
      setActiveUsername(username);
      window.history.pushState({}, '', `/${username}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openAuth = (mode = 'register', prefilled = '') => {
    setAuthModal({
      isOpen: true,
      mode,
      prefilledUsername: prefilled,
    });
  };

  const closeAuth = () => {
    setAuthModal(prev => ({ ...prev, isOpen: false }));
  };

  const handleAuthSuccess = (username) => {
    navigate('dashboard', username);
  };

  return (
    <div className="min-h-screen bg-[#060608] text-white selection:bg-[#EE6F35] selection:text-white">
      {/* Show Navbar on Home and Dashboard */}
      {currentPage !== 'bio' && (
        <Navbar 
          onNavigate={navigate} 
          onOpenAuth={openAuth}
          currentPage={currentPage} 
        />
      )}

      <main>
        {currentPage === 'home' && (
          <LandingPage 
            onNavigate={navigate} 
            onOpenAuth={openAuth}
          />
        )}

        {currentPage === 'dashboard' && (
          <DashboardPage initialUsername={activeUsername} onNavigate={navigate} />
        )}

        {currentPage === 'bio' && (
          <BioPage username={activeUsername} onNavigate={navigate} />
        )}
      </main>

      {/* Register / Login Modal (Screenshot 1:1) */}
      <AuthModal
        isOpen={authModal.isOpen}
        onClose={closeAuth}
        initialMode={authModal.mode}
        prefilledUsername={authModal.prefilledUsername}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}
