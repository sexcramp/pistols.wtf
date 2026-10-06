import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import BioPage from './pages/BioPage';
import AuthModal from './components/AuthModal';

// Synchronously parse initial URL route to prevent 1-second flash of landing page
const getInitialRoute = () => {
  if (typeof window === 'undefined') return { page: 'home', username: 'ares' };
  const path = window.location.pathname.replace(/^\/+|\/+$/g, '');
  if (!path || path === '') {
    return { page: 'home', username: 'ares' };
  } else if (path === 'dashboard') {
    return { page: 'dashboard', username: 'ares' };
  } else {
    return { page: 'bio', username: path.replace('@', '') };
  }
};

export default function App() {
  const initialRoute = getInitialRoute();
  const [currentPage, setCurrentPage] = useState(initialRoute.page); // Synchronous initial state
  const [activeUsername, setActiveUsername] = useState(initialRoute.username);
  const [authModal, setAuthModal] = useState({
    isOpen: false,
    mode: 'register',
    prefilledUsername: '',
  });

  // Handle URL route parsing on back/forward navigation
  const parseRoute = () => {
    const route = getInitialRoute();
    setCurrentPage(route.page);
    if (route.page === 'bio') {
      setActiveUsername(route.username);
    }
  };

  useEffect(() => {
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
    <div className="min-h-screen bg-[#060608] text-white selection:bg-[#990026] selection:text-white">
      {/* Show Floating Stadium Navbar ONLY on Landing/Home Page */}
      {currentPage === 'home' && (
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

      {/* Register / Login Modal */}
      <AuthModal
        isOpen={authModal.isOpen}
        onClose={closeAuth}
        onSuccess={handleAuthSuccess}
        initialMode={authModal.mode}
        prefilledUsername={authModal.prefilledUsername}
      />
    </div>
  );
}
