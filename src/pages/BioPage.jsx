import React, { useState, useEffect } from 'react';
import { Volume2, Sparkles, ArrowLeft } from 'lucide-react';
import ProfileCard from '../components/ProfileCard';
import AudioPlayer from '../components/AudioPlayer';
import ParticleCanvas from '../components/ParticleCanvas';
import { getProfileByUsername, incrementProfileViews } from '../utils/storage';

export default function BioPage({ username = 'ares', onNavigate }) {
  const [profile, setProfile] = useState(() => getProfileByUsername(username));
  const hasAudioTrack = Boolean(profile.audio?.enabled && profile.audio?.url);
  const [entered, setEntered] = useState(!hasAudioTrack);
  const [autoplayAudio, setAutoplayAudio] = useState(false);

  useEffect(() => {
    const data = getProfileByUsername(username);
    setProfile(data);
    incrementProfileViews(username);
    const audioOn = Boolean(data.audio?.enabled && data.audio?.url);
    if (!audioOn) {
      setEntered(true);
    }
  }, [username]);

  const handleEnter = () => {
    setEntered(true);
    setAutoplayAudio(true);
  };

  const theme = profile.theme || {};

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 selection:bg-[#EE6F35] overflow-x-hidden">
      {/* Background Particles Canvas */}
      <ParticleCanvas 
        effect={theme.backgroundEffect || 'stars'} 
        primaryColor={theme.primaryColor || '#EE6F35'} 
      />

      {/* Radial Glow */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(238, 111, 53, 0.12) 0%, rgba(8, 8, 8, 0.95) 75%)`
        }}
      />

      {/* Top Brand Link */}
      <div className="fixed top-4 left-4 z-40">
        <button
          onClick={() => onNavigate('home')}
          className="glass-card px-3.5 py-1.5 rounded-full border border-white/10 hover:border-[#EE6F35]/40 text-xs font-semibold text-white/80 hover:text-white flex items-center gap-2 backdrop-blur-xl transition group"
        >
          <img src="/logo.png" alt="logo" className="w-4 h-4 object-contain group-hover:rotate-12 transition-transform" />
          <span>whose<span className="text-[#EE6F35]">.baby</span></span>
        </button>
      </div>

      {/* "Click anywhere to enter" Splash Screen */}
      {!entered && (
        <div 
          onClick={handleEnter}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-2xl cursor-pointer select-none transition-opacity duration-700 animate-in fade-in"
        >
          <div className="text-center p-6 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-[#EE6F35]/20 border border-[#EE6F35]/40 flex items-center justify-center text-[#EE6F35] shadow-[0_0_30px_rgba(238,111,53,0.3)] animate-pulse">
              <Sparkles className="w-7 h-7" />
            </div>

            <div>
              <p className="text-base sm:text-lg font-bold text-white tracking-wide">
                [ click anywhere to enter ]
              </p>
              {profile.audio?.enabled && (
                <p className="text-xs text-white/40 flex items-center justify-center gap-1.5 mt-2">
                  <Volume2 className="w-3.5 h-3.5 text-[#EE6F35]" />
                  <span>Audio enabled: {profile.audio.title || 'Track'}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Profile Card */}
      <div className="relative z-10 my-auto py-12 flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
        <ProfileCard profile={profile} isPreview={false} />

        {/* Claim button below profile */}
        <div className="mt-6 text-center">
          <button
            onClick={() => onNavigate('dashboard')}
            className="text-[11px] font-mono text-white/40 hover:text-[#EE6F35] transition flex items-center gap-1 mx-auto"
          >
            <span>Claim your own whose.baby link</span>
            <span className="text-[#EE6F35]">→</span>
          </button>
        </div>
      </div>

      {/* Persistent Audio Player */}
      <AudioPlayer 
        audio={profile.audio} 
        isAutoplayRequested={autoplayAudio} 
        primaryColor={theme.primaryColor || '#EE6F35'} 
      />
    </div>
  );
}
