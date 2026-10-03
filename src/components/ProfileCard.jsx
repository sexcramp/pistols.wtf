import React, { useState, useEffect } from 'react';
import { 
  BadgeCheck, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink, 
  Eye, 
  Radio
} from 'lucide-react';
import { 
  DiscordIcon, 
  GithubIcon, 
  SpotifyIcon, 
  InstagramIcon, 
  TelegramIcon, 
  YoutubeIcon, 
  GlobeIcon 
} from './Icons';

export default function ProfileCard({ profile, isPreview = false }) {
  const [displayedBio, setDisplayedBio] = useState('');
  const [bioIndex, setBioIndex] = useState(0);

  const theme = profile.theme || {};
  const primaryColor = theme.primaryColor || '#EE6F35';

  // Typewriter effect for Bio
  useEffect(() => {
    if (!theme.typewriterBio) {
      setDisplayedBio(profile.bio || '');
      return;
    }

    setDisplayedBio('');
    setBioIndex(0);
    const text = profile.bio || '';
    let currentIdx = 0;

    const interval = setInterval(() => {
      if (currentIdx <= text.length) {
        setDisplayedBio(text.slice(0, currentIdx));
        currentIdx++;
      } else {
        clearInterval(interval);
      }
    }, 35);

    return () => clearInterval(interval);
  }, [profile.bio, theme.typewriterBio]);

  // Social Icon Helper
  const getSocialIcon = (iconName) => {
    const className = "w-4 h-4";
    switch (iconName?.toLowerCase()) {
      case 'discord': return <DiscordIcon className={className} />;
      case 'github': return <GithubIcon className={className} />;
      case 'instagram': return <InstagramIcon className={className} />;
      case 'telegram': return <TelegramIcon className={className} />;
      case 'youtube': return <YoutubeIcon className={className} />;
      case 'spotify': return <SpotifyIcon className={className} />;
      default: return <GlobeIcon className={className} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-emerald-500';
      case 'idle': return 'bg-amber-500';
      case 'dnd': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div 
      className="w-full max-w-[420px] rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 relative border"
      style={{
        backgroundColor: theme.cardBackground || 'rgba(18, 18, 18, 0.85)',
        backdropFilter: `blur(${theme.cardBlur ?? 20}px)`,
        WebkitBackdropFilter: `blur(${theme.cardBlur ?? 20}px)`,
        borderColor: theme.cardBorder || 'rgba(238, 111, 53, 0.25)',
        boxShadow: theme.glowIntensity === 'high' 
          ? `0 0 50px rgba(238, 111, 53, 0.35)` 
          : theme.glowIntensity === 'low' 
          ? `0 0 20px rgba(0, 0, 0, 0.7)` 
          : `0 0 35px rgba(238, 111, 53, 0.2)`,
      }}
    >
      {/* Banner */}
      <div className="h-32 w-full relative overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-800 to-black">
        {profile.bannerUrl && (
          <img 
            src={profile.bannerUrl} 
            alt="Profile Banner" 
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/80" />
      </div>

      <div className="px-6 pb-6 pt-0 relative">
        {/* Avatar & Badges row */}
        <div className="flex items-end justify-between -mt-14 mb-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl overflow-hidden p-1 bg-black/60 backdrop-blur-md border border-white/15 shadow-xl">
              <img 
                src={profile.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'} 
                alt={profile.displayName} 
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            {/* Discord status badge */}
            <div 
              className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-black flex items-center justify-center ${getStatusColor(profile.discordStatus?.status)}`}
              title={`Status: ${profile.discordStatus?.status || 'online'}`}
            />
          </div>

          {/* Badges container */}
          {theme.showBadges && profile.badges && profile.badges.length > 0 && (
            <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
              {profile.badges.includes('verified') && (
                <div title="Verified Profile" className="text-[#EE6F35]">
                  <BadgeCheck className="w-4 h-4 fill-[#EE6F35] text-black" />
                </div>
              )}
              {profile.badges.includes('early') && (
                <div title="Early Supporter" className="text-amber-400">
                  <Sparkles className="w-4 h-4 fill-amber-400/20" />
                </div>
              )}
              {profile.badges.includes('owner') && (
                <div title="Staff / Owner" className="text-purple-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Name and Handle */}
        <div className="mb-3">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {profile.displayName || profile.username}
            </h1>
          </div>
          <p className="text-xs font-mono font-medium text-[#EE6F35] tracking-wide">
            whose.baby/{profile.username}
          </p>
        </div>

        {/* Discord Activity Card */}
        {profile.discordStatus && (
          <div className="mb-4 p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#EE6F35]/15 border border-[#EE6F35]/30 flex items-center justify-center text-[#EE6F35]">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#EE6F35]">Discord Status</span>
              </div>
              <p className="text-xs text-white/90 truncate font-medium">
                {profile.discordStatus.details || profile.discordStatus.activity || 'Active on Discord'}
              </p>
            </div>
          </div>
        )}

        {/* Bio */}
        <div className="mb-5 p-3 rounded-xl bg-black/40 border border-white/5 min-h-[52px]">
          <p className="text-xs text-neutral-300 whitespace-pre-line leading-relaxed font-sans">
            {displayedBio}
            {theme.typewriterBio && displayedBio.length < (profile.bio || '').length && (
              <span className="inline-block w-1.5 h-3.5 ml-1 bg-[#EE6F35] animate-pulse align-middle" />
            )}
          </p>
        </div>

        {/* Links list */}
        <div className="space-y-2 mb-6">
          {profile.links && profile.links.map((link) => (
            <a
              key={link.id}
              href={isPreview ? '#' : link.url}
              target={isPreview ? '_self' : '_blank'}
              rel="noopener noreferrer"
              onClick={(e) => {
                if (isPreview) e.preventDefault();
              }}
              className="group flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-[#EE6F35]/15 border border-white/10 hover:border-[#EE6F35]/50 transition-all duration-200 active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-black/60 flex items-center justify-center text-white/80 group-hover:text-[#EE6F35] transition-colors">
                  {getSocialIcon(link.icon)}
                </div>
                <span className="text-xs font-semibold text-white tracking-wide">
                  {link.title}
                </span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-white/40 group-hover:text-[#EE6F35] group-hover:translate-x-0.5 transition-all" />
            </a>
          ))}
        </div>

        {/* Card Footer (Views & UID) */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/40 font-mono">
          <div className="flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            <span>{(profile.views || 0).toLocaleString()} views</span>
          </div>
          <div>
            <span>UID #{String(profile.uid || 1).padStart(3, '0')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
