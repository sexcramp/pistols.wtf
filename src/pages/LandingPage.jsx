import React, { useState } from 'react';
import confetti from 'canvas-confetti';

export default function LandingPage({ onNavigate }) {
  const [claimHandle, setClaimHandle] = useState('');

  const handleClaim = (e) => {
    e.preventDefault();
    const clean = claimHandle.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
    if (!clean) return;

    try {
      confetti({
        particleCount: 70,
        spread: 65,
        origin: { y: 0.65 },
        colors: ['#EE6F35', '#FFA172', '#FFFFFF', '#D5551A']
      });
    } catch (err) {}

    setTimeout(() => {
      onNavigate('dashboard', clean);
    }, 600);
  };

  return (
    <div className="relative min-h-screen bg-[#060608] text-white flex flex-col items-center justify-start px-4 selection:bg-[#EE6F35] selection:text-white overflow-hidden">
      {/* Subtle, minimal ambient glow behind lower hero / claim box */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[340px] sm:w-[580px] h-[340px] sm:h-[420px] pointer-events-none -z-10"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(238, 111, 53, 0.08) 0%, rgba(6, 6, 8, 0) 70%)'
        }}
      />

      {/* Main Hero Container */}
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center pt-[135px] sm:pt-[190px] md:pt-[220px] pb-24">
        
        {/* Main Headline: 3 lines on mobile (Screenshot 3), 2 lines on desktop (Screenshot 4) */}
        <h1 className="font-extrabold text-white tracking-[-0.035em] text-center">
          {/* Mobile version (3 lines) */}
          <span className="block sm:hidden text-[44px] leading-[1.08]">
            Your digital<br />
            identity,<br />
            simplified.
          </span>

          {/* Desktop version (2 lines) */}
          <span className="hidden sm:block text-6xl md:text-[76px] lg:text-[80px] leading-[1.06]">
            Your digital identity,<br />
            simplified.
          </span>
        </h1>

        {/* Subtitle Paragraph (Identical text across Screenshots 3 & 4) */}
        <p className="text-[15px] sm:text-[16px] md:text-[17px] text-[#9ca3af] text-center max-w-[340px] sm:max-w-[560px] md:max-w-[620px] mx-auto mt-5 sm:mt-6 leading-relaxed">
          Create stunning bio links, showcase your content, and connect with your audience. whose.baby gives you the tools to build your online presence — beautifully.
        </p>

        {/* Claim Username Input Bar (Fixed responsive container & snug inside pill) */}
        <div className="w-full max-w-[350px] sm:max-w-[420px] mx-auto mt-8 sm:mt-10 px-1">
          <form 
            onSubmit={handleClaim}
            className="relative flex items-center justify-between rounded-full p-1.5 pl-4 sm:pl-5 bg-[#101013]/90 border border-white/[0.09] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_12px_32px_rgba(0,0,0,0.8)] focus-within:border-[#EE6F35]/70 focus-within:shadow-[0_0_25px_rgba(238,111,53,0.25)] transition-all overflow-hidden"
          >
            <div className="flex items-center min-w-0 flex-1 mr-2">
              <span className="text-[14px] sm:text-[15px] font-normal text-[#EE6F35] select-none shrink-0 whitespace-nowrap">
                whose.baby/
              </span>
              <input
                type="text"
                value={claimHandle}
                onChange={(e) => setClaimHandle(e.target.value)}
                placeholder="username"
                className="w-full min-w-0 flex-1 bg-transparent border-none outline-none text-[14px] sm:text-[15px] text-white placeholder-white/40 px-1 font-normal"
                required
              />
            </div>
            
            <button
              type="submit"
              className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-[#EE6F35] to-[#f47f48] hover:from-[#d95e26] hover:to-[#e87138] text-white text-[14px] sm:text-[15px] font-medium tracking-normal shadow-md shadow-[#EE6F35]/30 active:scale-95 transition-all shrink-0"
            >
              Claim
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
