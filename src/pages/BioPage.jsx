import React, { useState, useEffect } from 'react';
import ProfileCard from '../components/ProfileCard';
import AudioPlayer from '../components/AudioPlayer';
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
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-black selection:bg-white/20 overflow-x-hidden">
      {/* Top Brand Link */}
      <div className="fixed top-4 left-4 z-40">
        <button
          onClick={() => onNavigate('home')}
          className="px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 hover:border-white/20 text-xs font-semibold text-white/80 hover:text-white flex items-center gap-2 backdrop-blur-xl transition group"
        >
          <img src="/logo.png" alt="pistols.wtf" className="w-4 h-4 object-contain group-hover:rotate-12 transition-transform" />
          <span>pistols.wtf</span>
        </button>
      </div>

      {/* "click to enter" Splash Screen */}
      {!entered && (
        <div 
          onClick={handleEnter}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black cursor-pointer select-none transition-opacity duration-500 animate-in fade-in"
        >
          <p className="text-sm sm:text-base font-mono tracking-widest text-white/70 hover:text-white transition cursor-pointer">
            click to enter
          </p>
        </div>
      )}

      {/* Main Profile Card */}
      <div className="relative z-10 my-auto py-12 flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
        <ProfileCard profile={profile} isPreview={false} />

        {/* Claim button below profile */}
        <div className="mt-6 text-center">
          <button
            onClick={() => onNavigate('dashboard')}
            className="text-[11px] font-mono text-white/30 hover:text-white/60 transition mx-auto"
          >
            pistols.wtf
          </button>
        </div>
      </div>

      {/* Persistent Audio Player */}
      <AudioPlayer 
        audio={profile.audio} 
        isAutoplayRequested={autoplayAudio} 
      />
    </div>
  );
}
