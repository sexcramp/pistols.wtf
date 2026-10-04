import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Music } from 'lucide-react';

export default function AudioPlayer({ audio, isAutoplayRequested = false, primaryColor = '#990026' }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(audio?.volume ?? 0.6);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Handle autoplay trigger after "Click to Enter"
  useEffect(() => {
    if (isAutoplayRequested && audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((e) => {
        console.log('Autoplay deferred until user interaction', e);
      });
    }
  }, [isAutoplayRequested]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(console.error);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.muted = false;
      setIsMuted(false);
    } else {
      audioRef.current.muted = true;
      setIsMuted(true);
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current.currentTime;
    const duration = audioRef.current.duration || 1;
    setProgress((current / duration) * 100);
  };

  const handleSeek = (e) => {
    if (!audioRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newProgress = Math.max(0, Math.min(1, clickX / width));
    audioRef.current.currentTime = newProgress * (audioRef.current.duration || 0);
    setProgress(newProgress * 100);
  };

  if (!audio?.enabled || !audio?.url) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-80 z-30">
      <audio
        ref={audioRef}
        src={audio.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        loop
      />

      <div className="glass-card rounded-2xl p-3 border border-white/10 shadow-2xl flex flex-col gap-2 backdrop-blur-xl bg-black/80">
        <div className="flex items-center justify-between gap-3">
          {/* Track info */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div 
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                isPlaying ? 'bg-[#990026] text-black shadow-lg shadow-[#990026]/30' : 'bg-white/5 text-white/60'
              }`}
            >
              <Music className={`w-4 h-4 ${isPlaying ? 'animate-bounce' : ''}`} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate leading-tight">
                {audio.title || 'Untitled Track'}
              </p>
              <p className="text-[11px] text-white/50 truncate">
                {audio.artist || 'pistols.wtf'}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={toggleMute}
              className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              onClick={togglePlay}
              className="p-2 rounded-xl bg-[#990026] hover:bg-[#b3002d] text-white shadow-md shadow-[#990026]/20 active:scale-95 transition"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white translate-x-0.5" />}
            </button>
          </div>
        </div>

        {/* Progress scrub bar */}
        <div 
          onClick={handleSeek}
          className="w-full h-1 bg-white/10 rounded-full cursor-pointer overflow-hidden relative"
        >
          <div 
            className="h-full bg-[#990026] rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
