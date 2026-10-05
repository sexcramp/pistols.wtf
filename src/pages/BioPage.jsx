import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import ProfileCard from '../components/ProfileCard';
import { getProfileByUsername, incrementProfileViews } from '../utils/storage';

export default function BioPage({ username = 'aizen', onNavigate }) {
  const [profile, setProfile] = useState(() => getProfileByUsername(username));
  const [entered, setEntered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const data = getProfileByUsername(username);
    setProfile(data);
    incrementProfileViews(username);
  }, [username]);

  const handleEnter = () => {
    setEntered(true);
    // Start audio automatically on enter as requested
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setIsMuted(false);
      }).catch((err) => {
        console.log('Audio autoplay prevented:', err);
      });
    }
  };

  const toggleAudio = (e) => {
    e.stopPropagation();
    if (!audioRef.current) return;

    if (!isPlaying) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setIsMuted(false);
      }).catch(console.error);
    } else {
      if (isMuted) {
        audioRef.current.muted = false;
        setIsMuted(false);
      } else {
        audioRef.current.muted = true;
        setIsMuted(true);
      }
    }
  };

  const wallpaperUrl = profile.wallpaperUrl || '/wallpaper.jpg';
  const audioUrl = profile.audio?.url || 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3';

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-black selection:bg-white/20 overflow-x-hidden">
      {/* Background Wallpaper (Full Bleed Skyline) */}
      <div 
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0 transition-opacity duration-700"
        style={{ backgroundImage: `url(${wallpaperUrl})` }}
      />
      {/* Dark Subtle Backdrop Tint */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px] z-0 pointer-events-none" />

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={audioUrl}
        loop
        preload="auto"
      />

      {/* ======================================================== */}
      {/* TOP LEFT: CIRCULAR AUDIO TOGGLE (Screenshot Match 1:1)   */}
      {/* ======================================================== */}
      {entered && (
        <div className="fixed top-6 left-6 z-40 animate-in fade-in duration-300">
          <button
            onClick={toggleAudio}
            title={isMuted ? "Unmute audio" : "Mute audio"}
            className="w-11 h-11 rounded-full bg-black/45 hover:bg-black/65 border border-white/10 backdrop-blur-xl flex items-center justify-center text-white/90 hover:text-white transition shadow-lg active:scale-95 group"
          >
            {isPlaying && !isMuted ? (
              <Volume2 className="w-5 h-5 text-white/90 group-hover:text-white transition-transform group-hover:scale-110" />
            ) : (
              <VolumeX className="w-5 h-5 text-white/40 group-hover:text-white/70 transition-transform group-hover:scale-110" />
            )}
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* "CLICK TO ENTER" SPLASH SCREEN                           */}
      {/* ======================================================== */}
      {!entered && (
        <div 
          onClick={handleEnter}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm cursor-pointer select-none transition-opacity duration-500 animate-in fade-in"
        >
          <p className="text-sm sm:text-base font-mono tracking-widest text-white/70 hover:text-white transition cursor-pointer">
            click to enter
          </p>
        </div>
      )}

      {/* ======================================================== */}
      {/* MAIN PROFILE CARD CONTAINER                              */}
      {/* ======================================================== */}
      <div className="relative z-10 my-auto py-12 flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
        <ProfileCard profile={profile} isPreview={false} />

        {/* pistols.wtf branding link below card */}
        <div className="mt-6 text-center">
          <button
            onClick={() => onNavigate('dashboard')}
            className="text-[11px] font-mono tracking-widest text-white/25 hover:text-white/60 transition mx-auto"
          >
            pistols.wtf
          </button>
        </div>
      </div>
    </div>
  );
}
