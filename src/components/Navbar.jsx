import React, { useState } from 'react';
import { X } from 'lucide-react';
import { SparklesIcon, DiamondIcon, DiscordIcon } from './Icons';

export default function Navbar({ onNavigate, currentPage }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* ======================================================== */}
      {/* DESKTOP NAVBAR (SCREENSHOT 4: WIDE DOCKER)               */}
      {/* ======================================================== */}
      <header className="fixed top-5 left-0 right-0 z-50 px-6 max-w-[960px] mx-auto hidden sm:block">
        <nav className="h-[56px] rounded-full px-6 flex items-center justify-between bg-gradient-to-b from-[#18181b] via-[#121215] to-[#0c0c0e] border border-[#26262a] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_12px_32px_rgba(0,0,0,0.75)]">
          {/* Brand Left */}
          <div 
            onClick={() => onNavigate('home')}
            className="flex items-center cursor-pointer group"
          >
            <div className="w-8 h-8 flex items-center justify-center shrink-0 overflow-visible">
              <img 
                src="/logo.png" 
                alt="whose.baby" 
                className="w-8 h-8 object-contain scale-[1.3] transform-gpu group-hover:scale-[1.38] transition-transform" 
              />
            </div>
            <span className="font-bold text-[18px] text-white tracking-tight ml-2">
              whose<span className="text-[#EE6F35]">.</span>baby
            </span>
          </div>

          {/* Center Links */}
          <div className="flex items-center gap-9 text-[14px] text-white/90">
            <button 
              onClick={() => onNavigate('home')} 
              className="hover:text-white text-white/90 transition font-normal"
            >
              Features
            </button>
            <button 
              onClick={() => onNavigate('home')} 
              className="hover:text-white text-white/90 transition font-normal"
            >
              Premium
            </button>
            <a 
              href="https://discord.gg" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-white text-white/90 transition font-normal"
            >
              Discord
            </a>
          </div>

          {/* Action Buttons Right */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-5 py-1.5 rounded-full bg-[#1f1f23] hover:bg-[#27272d] border border-white/[0.08] text-white text-[14px] font-medium transition active:scale-[0.98]"
            >
              Login
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-5 py-1.5 rounded-full bg-gradient-to-r from-[#EE6F35] to-[#f47f48] hover:opacity-95 text-white text-[14px] font-medium transition shadow-md shadow-[#EE6F35]/25 active:scale-[0.98]"
            >
              Register
            </button>
          </div>
        </nav>
      </header>

      {/* ======================================================== */}
      {/* MOBILE NAVBAR & IOS ANIMATED DRAWER (SCREENSHOTS 1 & 2)  */}
      {/* ======================================================== */}
      
      {/* iOS Backdrop Dimmer when menu is open */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[6px] ios-backdrop-enter sm:hidden"
        />
      )}

      <header className="fixed top-4 left-4 right-4 z-50 sm:hidden">
        {!mobileMenuOpen ? (
          /* SCREENSHOT 1: CLOSED MOBILE DOCKER */
          <div className="h-[56px] rounded-full px-5 flex items-center justify-between bg-gradient-to-b from-[#18181b] via-[#121215] to-[#0c0c0e] border border-[#26262a] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_10px_30px_rgba(0,0,0,0.8)]">
            {/* Brand Left */}
            <div 
              onClick={() => onNavigate('home')}
              className="flex items-center cursor-pointer"
            >
              <div className="w-8 h-8 flex items-center justify-center shrink-0 overflow-visible">
                <img 
                  src="/logo.png" 
                  alt="whose.baby" 
                  className="w-8 h-8 object-contain scale-[1.3] transform-gpu" 
                />
              </div>
              <span className="font-bold text-[19px] text-white tracking-tight ml-2">
                whose<span className="text-[#EE6F35]">.</span>baby
              </span>
            </div>

            {/* The 2 Horizontal Lines Right */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="w-10 h-10 -mr-1 flex flex-col justify-center items-end gap-[5.5px] pr-1 focus:outline-none active:scale-95 transition-transform"
              aria-label="Open navigation menu"
            >
              <span className="w-5 h-[2px] bg-white rounded-full block"></span>
              <span className="w-5 h-[2px] bg-white rounded-full block"></span>
            </button>
          </div>
        ) : (
          /* SCREENSHOT 2: OPEN MOBILE MENU CARD WITH IOS SPRING ANIMATION */
          <div className="rounded-[28px] p-4 bg-gradient-to-b from-[#18181b] via-[#121215] to-[#0a0a0c] border border-[#26262a] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_25px_50px_rgba(0,0,0,0.95)] ios-menu-enter">
            {/* Header row with Brand and 'X' close button */}
            <div className="flex items-center justify-between px-1 pt-1 pb-2">
              <div 
                onClick={() => {
                  onNavigate('home');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center cursor-pointer"
              >
                <div className="w-8 h-8 flex items-center justify-center shrink-0 overflow-visible">
                  <img 
                    src="/logo.png" 
                    alt="whose.baby" 
                    className="w-8 h-8 object-contain scale-[1.3] transform-gpu" 
                  />
                </div>
                <span className="font-bold text-[19px] text-white tracking-tight ml-2">
                  whose<span className="text-[#EE6F35]">.</span>baby
                </span>
              </div>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 flex items-center justify-center text-white/90 hover:text-white active:scale-90 transition-transform focus:outline-none"
                aria-label="Close menu"
              >
                <X className="w-5 h-5 stroke-[2.2]" />
              </button>
            </div>

            {/* 3 Menu Items with iOS Stagger */}
            <div className="mt-2 space-y-2">
              {/* Features */}
              <button
                onClick={() => {
                  onNavigate('home');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between px-5 py-3.5 rounded-[18px] bg-[#161619] border border-white/[0.05] active:border-white/[0.12] active:scale-[0.98] transition-all ios-item-1"
              >
                <span className="text-[15px] font-normal text-white">Features</span>
                <SparklesIcon className="w-[18px] h-[18px] text-[#EE6F35]" />
              </button>

              {/* Premium */}
              <button
                onClick={() => {
                  onNavigate('home');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between px-5 py-3.5 rounded-[18px] bg-[#161619] border border-white/[0.05] active:border-white/[0.12] active:scale-[0.98] transition-all ios-item-2"
              >
                <span className="text-[15px] font-normal text-white">Premium</span>
                <DiamondIcon className="w-[18px] h-[18px] text-[#EE6F35]" />
              </button>

              {/* Discord */}
              <a
                href="https://discord.gg"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between px-5 py-3.5 rounded-[18px] bg-[#161619] border border-white/[0.05] active:border-white/[0.12] active:scale-[0.98] transition-all ios-item-3"
              >
                <span className="text-[15px] font-normal text-white">Discord</span>
                <DiscordIcon className="w-[18px] h-[18px] text-[#EE6F35]" />
              </a>
            </div>

            {/* Dashed divider */}
            <div className="border-t border-dashed border-white/[0.12] my-3.5 mx-1" />

            {/* Bottom Buttons: Login and Register */}
            <div className="grid grid-cols-2 gap-3 mt-1 ios-item-4">
              <button
                onClick={() => {
                  onNavigate('dashboard');
                  setMobileMenuOpen(false);
                }}
                className="py-3 rounded-[16px] bg-[#222226] hover:bg-[#28282d] border border-white/[0.08] text-white text-[15px] font-medium text-center transition active:scale-[0.96]"
              >
                Login
              </button>
              <button
                onClick={() => {
                  onNavigate('dashboard');
                  setMobileMenuOpen(false);
                }}
                className="py-3 rounded-[16px] bg-gradient-to-r from-[#EE6F35] to-[#f47f48] hover:from-[#d95e26] hover:to-[#e87138] text-white text-[15px] font-medium text-center transition shadow-lg shadow-[#EE6F35]/25 active:scale-[0.96]"
              >
                Register
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
