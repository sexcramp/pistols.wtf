import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import ProfileCard from '../components/ProfileCard';
import { getProfileByUsername, incrementProfileViews } from '../utils/storage';

export default function BioPage({ username = 'ares', onNavigate, onOpenAuth }) {
  const [profile, setProfile] = useState(() => getProfileByUsername(username));
  const hasAudioTrack = Boolean(profile?.audio?.enabled && profile?.audio?.url);
  const [entered, setEntered] = useState(!hasAudioTrack);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const data = getProfileByUsername(username);
    setProfile(data);
    if (data) {
      incrementProfileViews(username);
      const audioOn = Boolean(data.audio?.enabled && data.audio?.url);
      if (!audioOn) {
        setEntered(true);
      }
    }
  }, [username]);

  // ========================================================
  // UNCLAIMED USERNAME SCREEN (GUNS.LOL AESTHETIC)
  // ========================================================
  if (!profile) {
    const cleanHandle = username?.toLowerCase().replace(/[^a-z0-9_-]/g, '') || 'user';
    return (
      <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-[#060608] text-white selection:bg-[#990026] overflow-hidden">
        {/* Subtle ambient crimson glow */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[500px] h-[340px] sm:h-[500px] pointer-events-none -z-10"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(153, 0, 38, 0.12) 0%, rgba(6, 6, 8, 0) 70%)'
          }}
        />

        {/* Unclaimed Frosted Glass Card */}
        <div className="w-full max-w-[400px] sm:max-w-[430px] rounded-[34px] sm:rounded-[38px] bg-black/50 border border-white/[0.08] backdrop-blur-[28px] p-8 sm:p-10 text-center shadow-[0_25px_60px_rgba(0,0,0,0.85),inset_0_1px_0_0_rgba(255,255,255,0.08)] animate-in fade-in zoom-in-95 duration-300">
          
          {/* Status Pill */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-medium text-white/70 tracking-wide uppercase">
                Available to claim
              </span>
            </div>
          </div>

          {/* Username Title */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight break-all">
            pistols.wtf/{cleanHandle}
          </h1>

          {/* Description */}
          <p className="mt-3 text-sm text-white/50 leading-relaxed max-w-[320px] mx-auto font-normal">
            This username has not been claimed yet. Claim it now and create your clean profile.
          </p>

          {/* Claim Button */}
          <div className="mt-8">
            <button
              onClick={() => {
                if (onOpenAuth) {
                  onOpenAuth('register', cleanHandle);
                } else if (onNavigate) {
                  onNavigate('home');
                }
              }}
              className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#990026] via-[#73001d] to-[#400010] hover:from-[#b3002d] hover:to-[#5c0017] text-white text-sm font-semibold tracking-wide shadow-lg shadow-[#990026]/35 active:scale-95 transition-all"
            >
              Claim @{cleanHandle}
            </button>
          </div>

          {/* Back to Home Link */}
          <div className="mt-5">
            <button
              onClick={() => onNavigate && onNavigate('home')}
              className="text-xs font-mono text-white/40 hover:text-white/80 transition"
            >
              ← Back to homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleEnter = () => {
    setEntered(true);
    // Start audio automatically on enter if configured
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setIsMuted(false);
      }).catch((err) => {
        console.log('Audio autoplay deferred:', err);
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

  // Only render wallpaper if user has a wallpaper URL configured (solid black default)
  const hasWallpaper = Boolean(profile.wallpaperUrl && profile.wallpaperUrl.trim());
  const wallpaperUrl = profile.wallpaperUrl;
  const audioUrl = profile.audio?.url;

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-[#060608] selection:bg-white/20 overflow-x-hidden">
      {/* Background Wallpaper (Only if user has set a wallpaper) */}
      {hasWallpaper && (
        <>
          <div 
            className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0 transition-opacity duration-700"
            style={{ backgroundImage: `url(${wallpaperUrl})` }}
          />
          {/* Dark Subtle Backdrop Tint */}
          <div className="fixed inset-0 bg-black/45 backdrop-blur-[1px] z-0 pointer-events-none" />
        </>
      )}

      {/* Hidden Audio Element (Only if audio is configured) */}
      {hasAudioTrack && audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          loop
          preload="auto"
        />
      )}

      {/* ======================================================== */}
      {/* TOP LEFT: CIRCULAR AUDIO TOGGLE (Only if audio enabled)  */}
      {/* ======================================================== */}
      {hasAudioTrack && entered && (
        <div className="fixed top-6 left-6 sm:top-8 sm:left-8 z-40 animate-in fade-in duration-300">
          <button
            onClick={toggleAudio}
            title={isMuted ? "Unmute audio" : "Mute audio"}
            className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/45 hover:bg-black/65 border border-white/10 backdrop-blur-xl flex items-center justify-center text-white/90 hover:text-white transition shadow-lg active:scale-95 group"
          >
            {isPlaying && !isMuted ? (
              <Volume2 className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white/90 group-hover:text-white transition-transform group-hover:scale-110" />
            ) : (
              <VolumeX className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white/40 group-hover:text-white/70 transition-transform group-hover:scale-110" />
            )}
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* "CLICK TO ENTER" SPLASH SCREEN (Only if audio enabled)   */}
      {/* ======================================================== */}
      {hasAudioTrack && !entered && (
        <div 
          onClick={handleEnter}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm cursor-pointer select-none transition-opacity duration-500 animate-in fade-in"
        >
          <p className="text-sm sm:text-base font-mono tracking-widest text-white/70 hover:text-white transition cursor-pointer">
            click to enter
          </p>
        </div>
      )}

      {/* ======================================================== */}
      {/* MAIN PROFILE CARD CONTAINER                              */}
      {/* ======================================================== */}
      <div className="relative z-10 my-auto py-10 sm:py-14 flex flex-col items-center animate-in fade-in zoom-in-95 duration-500 w-full">
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
