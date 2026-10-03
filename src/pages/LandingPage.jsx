import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  ArrowRight, 
  Music, 
  Radio, 
  Layers, 
  Zap, 
  CheckCircle2, 
  ExternalLink,
  Shield,
  Palette
} from 'lucide-react';
import ProfileCard from '../components/ProfileCard';
import { getProfileByUsername } from '../utils/storage';

export default function LandingPage({ onNavigate }) {
  const [claimHandle, setClaimHandle] = useState('');
  const [claimStatus, setClaimStatus] = useState(null);
  const sampleProfile = getProfileByUsername('ares');

  const handleClaim = (e) => {
    e.preventDefault();
    const clean = claimHandle.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
    if (!clean) return;

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#EE6F35', '#FFA172', '#FFFFFF', '#D5551A']
      });
    } catch (err) {}

    setClaimStatus(`whose.baby/${clean} is available!`);
    setTimeout(() => {
      onNavigate('dashboard', clean);
    }, 900);
  };

  return (
    <div className="relative min-h-screen pt-28 pb-20 px-4 max-w-6xl mx-auto flex flex-col items-center">
      {/* Ambient background glow */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[350px] sm:w-[600px] h-[350px] sm:h-[450px] orange-radial-glow pointer-events-none -z-10" />

      {/* Hero Announcement Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#EE6F35]/30 bg-[#EE6F35]/10 text-[#EE6F35] text-xs font-semibold mb-8 backdrop-blur-md animate-fade-in">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Next-Generation Aesthetic Bio-Links</span>
      </div>

      {/* Main Title - Inspired by Reference */}
      <div className="text-center max-w-3xl mb-6">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
          Your digital <br />
          <span className="orange-gradient-text">identity, simplified.</span>
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-white/60 max-w-xl mx-auto leading-relaxed">
          Create stunning bio links, showcase your content, and connect with your audience. <strong className="text-white/90">whose.baby</strong> gives you the tools to build your online presence — beautifully.
        </p>
      </div>

      {/* Claim Username Input Bar - Matches Reference */}
      <div className="w-full max-w-md mb-4">
        <form 
          onSubmit={handleClaim}
          className="relative flex items-center glass-card rounded-full p-1.5 pl-5 border border-white/15 focus-within:border-[#EE6F35] focus-within:shadow-[0_0_25px_rgba(238,111,53,0.3)] transition-all bg-black/70 backdrop-blur-2xl"
        >
          <span className="text-sm font-mono text-white/40 select-none">
            whose.baby/
          </span>
          <input
            type="text"
            value={claimHandle}
            onChange={(e) => setClaimHandle(e.target.value)}
            placeholder="username"
            className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-white/25 px-1 font-mono"
            required
          />
          <button
            type="submit"
            className="px-6 py-2.5 rounded-full bg-[#EE6F35] hover:bg-[#D5551A] text-white text-xs font-bold tracking-wide shadow-lg shadow-[#EE6F35]/30 active:scale-95 transition-all flex items-center gap-1.5 shrink-0"
          >
            <span>Claim</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {claimStatus && (
          <div className="mt-2 text-center text-xs text-emerald-400 font-medium flex items-center justify-center gap-1 animate-pulse">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{claimStatus} Taking you to studio...</span>
          </div>
        )}
      </div>

      {/* Quick stats or sub-banner */}
      <div className="flex items-center gap-6 text-[11px] text-white/40 font-mono mb-16">
        <span>⚡ 100% Free Forever</span>
        <span>•</span>
        <span>🎵 Background Music</span>
        <span>•</span>
        <span>👾 Discord Presence</span>
      </div>

      {/* Mockup Showcase - Inspired by Reference Frame */}
      <div className="w-full max-w-5xl rounded-3xl p-2 sm:p-4 bg-gradient-to-b from-white/10 to-transparent border border-white/10 shadow-2xl backdrop-blur-sm mb-20">
        <div className="rounded-2xl bg-[#0c0c0c] border border-white/10 overflow-hidden shadow-inner flex flex-col md:flex-row">
          
          {/* Mockup Sidebar */}
          <div className="w-full md:w-56 p-4 border-b md:border-b-0 md:border-r border-white/5 bg-[#090909] flex flex-col gap-4 text-xs">
            <div className="flex items-center gap-2 text-white font-bold">
              <img src="/logo.png" alt="logo" className="w-5 h-5 object-contain" />
              <span>whose.baby</span>
            </div>

            <div className="space-y-1 text-white/50 text-[11px]">
              <p className="text-[10px] uppercase font-bold text-white/30 tracking-wider mb-1">Overview</p>
              <div className="px-2.5 py-1.5 rounded-lg bg-white/5 text-white font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#EE6F35]" />
                Dashboard
              </div>
              <p className="text-[10px] uppercase font-bold text-white/30 tracking-wider pt-3 mb-1">Customize</p>
              <div className="px-2.5 py-1.5 text-white/60 hover:text-white flex items-center gap-2">
                <span>🎨</span> Appearance
              </div>
              <div className="px-2.5 py-1.5 text-white/60 hover:text-white flex items-center gap-2">
                <span>🔗</span> Links & Socials
              </div>
              <div className="px-2.5 py-1.5 text-white/60 hover:text-white flex items-center gap-2">
                <span>🎵</span> Audio Player
              </div>
              <div className="px-2.5 py-1.5 text-white/60 hover:text-white flex items-center gap-2">
                <span>✨</span> Badges & Effects
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-white/5">
              <button 
                onClick={() => onNavigate('dashboard')}
                className="w-full py-2 px-3 rounded-xl bg-[#EE6F35]/20 hover:bg-[#EE6F35] text-[#EE6F35] hover:text-white transition font-medium text-center"
              >
                Open Studio →
              </button>
            </div>
          </div>

          {/* Center Pane: Interactive Preview */}
          <div className="flex-1 p-6 sm:p-10 flex flex-col items-center justify-center bg-radial-at-c from-[#141414] to-[#080808]">
            <div className="mb-4 text-center">
              <p className="text-xs uppercase font-bold tracking-widest text-[#EE6F35]">Live Profile Preview</p>
              <p className="text-[11px] text-white/40">Try interacting with the card below</p>
            </div>

            <div className="w-full flex justify-center scale-95 sm:scale-100 transition-transform">
              <ProfileCard profile={sampleProfile} isPreview={true} />
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="w-full max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
            Crafted for aesthetics & performance
          </h2>
          <p className="text-xs sm:text-sm text-white/50 max-w-md mx-auto">
            Everything you need to turn your profile into an immersive audio-visual experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 rounded-2xl glass-card glass-card-hover border border-white/5 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EE6F35]/15 border border-[#EE6F35]/30 flex items-center justify-center text-[#EE6F35]">
              <Music className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Audio & Autoplay</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              Equipped with a slick "Click to Enter" splash screen to bypass browser audio limits, featuring custom volume and scrub controls.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-card glass-card-hover border border-white/5 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EE6F35]/15 border border-[#EE6F35]/30 flex items-center justify-center text-[#EE6F35]">
              <Radio className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Discord Rich Presence</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              Showcase your real-time Discord status, current game activity, and live Spotify track directly on your card.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-card glass-card-hover border border-white/5 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EE6F35]/15 border border-[#EE6F35]/30 flex items-center justify-center text-[#EE6F35]">
              <Palette className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Custom Visuals & Effects</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              Fine-tune glassmorphism blur, starfield particles, typewriter bios, custom neon glows, and badges.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="w-full max-w-4xl mt-20 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#170a04] via-[#210f06] to-[#140803] border border-[#EE6F35]/30 text-center relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-3">
            Claim your handle on <span className="text-[#EE6F35]">whose.baby</span>
          </h2>
          <p className="text-xs sm:text-sm text-white/60 max-w-md mx-auto mb-6">
            Get your unique link before someone else takes it. Free setup in under 60 seconds.
          </p>
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-8 py-3 rounded-full bg-[#EE6F35] hover:bg-[#D5551A] text-white text-sm font-bold shadow-xl shadow-[#EE6F35]/30 active:scale-95 transition-all inline-flex items-center gap-2"
          >
            <span>Start Customizing</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
