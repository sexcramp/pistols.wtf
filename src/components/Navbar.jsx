import React, { useState } from 'react';
import { Menu, X, Sparkles, User, ExternalLink } from 'lucide-react';

export default function Navbar({ onNavigate, currentPage }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4 max-w-5xl mx-auto">
      <nav className="glass-card rounded-full px-5 py-2.5 flex items-center justify-between border border-white/10 shadow-2xl bg-black/60 backdrop-blur-xl">
        {/* Brand */}
        <div 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <img 
            src="/logo.png" 
            alt="whose.baby" 
            className="w-8 h-8 object-contain transition-transform group-hover:scale-105" 
          />
          <span className="font-extrabold text-base tracking-tight text-white flex items-center">
            whose<span className="text-[#EE6F35]">.baby</span>
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6 text-xs font-medium text-neutral-300">
          <button 
            onClick={() => onNavigate('home')} 
            className={`hover:text-[#EE6F35] transition ${currentPage === 'home' ? 'text-[#EE6F35]' : ''}`}
          >
            Home
          </button>
          <button 
            onClick={() => onNavigate('bio', 'ares')} 
            className={`hover:text-[#EE6F35] transition ${currentPage === 'bio' ? 'text-[#EE6F35]' : ''}`}
          >
            Demo Profile
          </button>
          <a 
            href="https://github.com/sexcramp/whose.baby" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-[#EE6F35] transition flex items-center gap-1"
          >
            GitHub
          </a>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-4 py-1.5 rounded-full bg-[#EE6F35] hover:bg-[#D5551A] text-white text-xs font-semibold shadow-lg shadow-[#EE6F35]/25 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <User className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-full text-white/70 hover:text-white md:hidden hover:bg-white/10 transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 p-4 glass-card rounded-2xl border border-white/10 bg-black/95 backdrop-blur-2xl shadow-2xl flex flex-col gap-3 text-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <button
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
            }}
            className="text-left py-2 px-3 rounded-lg hover:bg-white/5 text-white/90 hover:text-[#EE6F35]"
          >
            Home
          </button>
          <button
            onClick={() => {
              onNavigate('bio', 'ares');
              setMobileMenuOpen(false);
            }}
            className="text-left py-2 px-3 rounded-lg hover:bg-white/5 text-white/90 hover:text-[#EE6F35]"
          >
            View Demo Profile (whose.baby/ares)
          </button>
          <button
            onClick={() => {
              onNavigate('dashboard');
              setMobileMenuOpen(false);
            }}
            className="text-left py-2 px-3 rounded-lg bg-[#EE6F35]/20 text-[#EE6F35] font-semibold"
          >
            Customization Studio
          </button>
          <a
            href="https://github.com/sexcramp/whose.baby"
            target="_blank"
            rel="noopener noreferrer"
            className="text-left py-2 px-3 rounded-lg hover:bg-white/5 text-white/70 flex items-center justify-between"
          >
            <span>GitHub Repository</span>
            <ExternalLink className="w-4 h-4 text-white/40" />
          </a>
        </div>
      )}
    </header>
  );
}
