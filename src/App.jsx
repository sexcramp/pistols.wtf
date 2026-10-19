import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import BioPage from './pages/BioPage';
import { getCurrentUser, isLoggedIn } from './utils/storage';

// Synchronously parse initial URL route to prevent flash of wrong page
const getInitialRoute = () => {
  if (typeof window === 'undefined') {
    return { page: 'home', username: '', mode: 'login' };
  }

  const rawPath = window.location.pathname.replace(/^\/+|\/+$/g, '');
  const searchParams = new URLSearchParams(window.location.search);
  const prefilled = searchParams.get('username') || '';

  // 1. Landing / Home
  if (!rawPath || rawPath === '') {
    return { page: 'home', username: '', mode: 'login' };
  }

  // 2. Login Page
  if (rawPath === 'login') {
    if (isLoggedIn()) {
      const cur = getCurrentUser();
      if (typeof window !== 'undefined' && window.history) {
        window.history.replaceState({}, '', '/dashboard');
      }
      return { page: 'dashboard', username: cur?.username || 'user', mode: 'login' };
    }
    return { page: 'login', username: prefilled, mode: 'login' };
  }

  // 3. Register Page
  if (rawPath === 'register') {
    if (isLoggedIn()) {
      const cur = getCurrentUser();
      if (typeof window !== 'undefined' && window.history) {
        window.history.replaceState({}, '', '/dashboard');
      }
      return { page: 'dashboard', username: cur?.username || 'user', mode: 'register' };
    }
    return { page: 'login', username: prefilled, mode: 'register' };
  }

  // 4. Dashboard (Protected Route)
  if (rawPath === 'dashboard') {
    if (!isLoggedIn()) {
      // User is NOT logged in: redirect to /login
      if (typeof window !== 'undefined' && window.history) {
        window.history.replaceState({}, '', '/login');
      }
      return { page: 'login', username: '', mode: 'login' };
    }
    const cur = getCurrentUser();
    return { page: 'dashboard', username: cur?.username || 'user', mode: 'login' };
  }

  // 5. Bio Page for :username
  return { page: 'bio', username: rawPath.replace('@', ''), mode: 'login' };
};

export default function App() {
  const initialRoute = getInitialRoute();
  const [currentPage, setCurrentPage] = useState(initialRoute.page);
  const [activeUsername, setActiveUsername] = useState(initialRoute.username);
  const [authMode, setAuthMode] = useState(initialRoute.mode);

  // Parse route on back/forward browser navigation
  const parseRoute = () => {
    const route = getInitialRoute();
    setCurrentPage(route.page);
    setActiveUsername(route.username);
    setAuthMode(route.mode);
  };

  useEffect(() => {
    const handlePopState = () => parseRoute();
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Centralized Navigation Function
  const navigate = (page, extra = '') => {
    if (page === 'home') {
      setCurrentPage('home');
      window.history.pushState({}, '', '/');
    } else if (page === 'login') {
      if (isLoggedIn()) {
        const cur = getCurrentUser();
        setActiveUsername(cur?.username || 'user');
        setCurrentPage('dashboard');
        window.history.pushState({}, '', '/dashboard');
      } else {
        setAuthMode('login');
        if (extra) setActiveUsername(extra);
        setCurrentPage('login');
        window.history.pushState({}, '', '/login');
      }
    } else if (page === 'register') {
      if (isLoggedIn()) {
        const cur = getCurrentUser();
        setActiveUsername(cur?.username || 'user');
        setCurrentPage('dashboard');
        window.history.pushState({}, '', '/dashboard');
      } else {
        setAuthMode('register');
        if (extra) setActiveUsername(extra);
        setCurrentPage('login');
        const url = extra ? `/register?username=${encodeURIComponent(extra)}` : '/register';
        window.history.pushState({}, '', url);
      }
    } else if (page === 'dashboard') {
      if (!isLoggedIn()) {
        // Protected Route Redirect: takes unauthenticated users to /login
        setAuthMode('login');
        setCurrentPage('login');
        window.history.pushState({}, '', '/login');
      } else {
        const cur = getCurrentUser();
        const uname = extra || cur?.username || 'user';
        setActiveUsername(uname);
        setCurrentPage('dashboard');
        window.history.pushState({}, '', '/dashboard');
      }
    } else if (page === 'bio') {
      const uname = extra || 'ares';
      setActiveUsername(uname);
      setCurrentPage('bio');
      window.history.pushState({}, '', `/${uname}`);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#060608] text-white selection:bg-[#990026] selection:text-white">
      {/* Floating Stadium Navbar on Landing/Home Page */}
      {currentPage === 'home' && (
        <Navbar 
          onNavigate={navigate} 
          currentPage={currentPage} 
        />
      )}

      <main>
        {/* 1. Landing Page */}
        {currentPage === 'home' && (
          <LandingPage 
            onNavigate={navigate} 
            onOpenAuth={(mode, handle) => navigate(mode === 'register' ? 'register' : 'login', handle)}
          />
        )}

        {/* 2. Dedicated Login & Register Page */}
        {currentPage === 'login' && (
          <LoginPage 
            initialMode={authMode} 
            prefilledUsername={activeUsername} 
            onNavigate={navigate} 
          />
        )}

        {/* 3. Dashboard Page (Protected) */}
        {currentPage === 'dashboard' && (
          <DashboardPage 
            initialUsername={activeUsername || getCurrentUser()?.username || 'user'} 
            onNavigate={navigate} 
          />
        )}

        {/* 4. Bio Page for any claimed/unclaimed username */}
        {currentPage === 'bio' && (
          <BioPage 
            username={activeUsername} 
            onNavigate={navigate} 
            onOpenAuth={(mode, handle) => navigate('register', handle)}
          />
        )}
      </main>
    </div>
  );
}
