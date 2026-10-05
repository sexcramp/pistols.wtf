import React, { useState, useEffect, useRef } from 'react';
import { 
  BadgeCheck, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink, 
  Eye, 
  Radio,
  MapPin,
  Briefcase,
  Music2,
  Clock,
  CloudSun
} from 'lucide-react';
import { 
  DiscordIcon, 
  GithubIcon, 
  SpotifyIcon, 
  InstagramIcon, 
  TelegramIcon, 
  YoutubeIcon, 
  TwitterIcon,
  TikTokIcon,
  TwitchIcon,
  KickIcon,
  SteamIcon,
  SoundcloudIcon,
  GlobeIcon 
} from './Icons';

// Spiderweb SVG for the Halloween limited badge
export const SpiderwebIcon = ({ className = "w-4 h-4 text-[#818cf8]" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="12" cy="12" r="8" />
  </svg>
);

export default function ProfileCard({ profile, isPreview = false, onLinkClick }) {
  const [displayedBio, setDisplayedBio] = useState('');
  const [showUidTooltip, setShowUidTooltip] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const cardRef = useRef(null);
  const [tiltStyle, setTiltStyle] = useState({});

  const theme = profile.theme || {};
  const avatarShape = profile.avatarShape || 'rounded'; // square, soft, rounded, circle
  const isTilting = theme.tilt ?? true;

  const hasAvatar = Boolean(profile.avatarUrl);
  const hasBanner = Boolean(profile.bannerUrl);
  const hasBio = Boolean(profile.bio && profile.bio.trim());
  const hasLinks = Boolean(profile.links && profile.links.length > 0);
  const hasWidgets = Boolean(profile.widgets && profile.widgets.length > 0);
  const hasDiscord = Boolean(profile.discordStatus);

  // If user hasn't added avatar, banner, or bio yet, show the minimal default capsule
  const isMinimalDefault = !hasAvatar && !hasBanner && !hasBio && !hasLinks && !hasWidgets;

  // Typewriter effect for Status / Bio (from jefersc/gunslol-template)
  useEffect(() => {
    const rawText = profile.bio || profile.statusText || 'Living in the noise ✦';
    if (!theme.typewriterBio) {
      setDisplayedBio(rawText);
      return;
    }

    setDisplayedBio('');
    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx <= rawText.length) {
        setDisplayedBio(rawText.slice(0, currentIdx));
        currentIdx++;
      } else {
        clearInterval(interval);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [profile.bio, profile.statusText, theme.typewriterBio]);

  // 3D Tilt calculation on mouse move (from jefersc/gunslol-template)
  const handleMouseMove = (e) => {
    if (!isTilting || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`,
      transition: 'transform 0.1s ease-out'
    });
  };

  const handleMouseLeave = () => {
    if (!isTilting) return;
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s cubic-bezier(0.03, 0.98, 0.52, 0.99)'
    });
    setShowUidTooltip(false);
    setActiveTooltip(null);
  };

  // Social Icon Helper
  const getSocialIcon = (iconName) => {
    const className = "w-5 h-5";
    switch (iconName?.toLowerCase()) {
      case 'discord': return <DiscordIcon className={className} />;
      case 'spotify': return <SpotifyIcon className={className} />;
      case 'github': return <GithubIcon className={className} />;
      case 'instagram': return <InstagramIcon className={className} />;
      case 'telegram': return <TelegramIcon className={className} />;
      case 'youtube': return <YoutubeIcon className={className} />;
      case 'twitter':
      case 'x': return <TwitterIcon className={className} />;
      case 'tiktok': return <TikTokIcon className={className} />;
      case 'twitch': return <TwitchIcon className={className} />;
      case 'kick': return <KickIcon className={className} />;
      case 'steam': return <SteamIcon className={className} />;
      case 'soundcloud': return <SoundcloudIcon className={className} />;
      default: return <GlobeIcon className={className} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-emerald-500 shadow-[0_0_10px_#10b981]';
      case 'idle': return 'bg-amber-500 shadow-[0_0_10px_#f59e0b]';
      case 'dnd': return 'bg-red-500 shadow-[0_0_10px_#ef4444]';
      default: return 'bg-zinc-500';
    }
  };

  const getShapeClass = (shape) => {
    switch (shape) {
      case 'circle': return 'rounded-full';
      case 'rounded': return 'rounded-2xl';
      case 'square': return 'rounded-lg';
      case 'soft':
      default: return 'rounded-3xl';
    }
  };

  // Badges container matching gunslol-template (#badges)
  const renderBadges = () => {
    const badges = profile.badges || ['halloween'];
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/10 shadow-sm">
        {badges.map((badge, idx) => {
          if (badge === 'halloween') {
            return (
              <div 
                key={idx} 
                onMouseEnter={() => setActiveTooltip('Halloween Limited')}
                onMouseLeave={() => setActiveTooltip(null)}
                className="relative group p-1 hover:scale-125 transition-transform cursor-pointer"
              >
                <SpiderwebIcon className="w-4 h-4 text-[#818cf8] drop-shadow-[0_0_6px_rgba(129,140,248,0.6)]" />
                {activeTooltip === 'Halloween Limited' && (
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-black/90 border border-white/10 text-[10px] whitespace-nowrap text-white shadow-lg pointer-events-none z-30">
                    Halloween
                  </span>
                )}
              </div>
            );
          }
          if (badge === 'verified') {
            return (
              <div 
                key={idx}
                onMouseEnter={() => setActiveTooltip('Verified')}
                onMouseLeave={() => setActiveTooltip(null)}
                className="relative group p-1 hover:scale-125 transition-transform cursor-pointer text-sky-400"
              >
                <BadgeCheck className="w-4 h-4 fill-sky-400 text-black drop-shadow-[0_0_6px_rgba(56,189,248,0.6)]" />
                {activeTooltip === 'Verified' && (
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-black/90 border border-white/10 text-[10px] whitespace-nowrap text-white shadow-lg pointer-events-none z-30">
                    Verified
                  </span>
                )}
              </div>
            );
          }
          if (badge === 'early') {
            return (
              <div 
                key={idx}
                onMouseEnter={() => setActiveTooltip('Early Supporter')}
                onMouseLeave={() => setActiveTooltip(null)}
                className="relative group p-1 hover:scale-125 transition-transform cursor-pointer text-amber-400"
              >
                <Sparkles className="w-4 h-4 fill-amber-400/30 text-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
                {activeTooltip === 'Early Supporter' && (
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-black/90 border border-white/10 text-[10px] whitespace-nowrap text-white shadow-lg pointer-events-none z-30">
                    Early Supporter
                  </span>
                )}
              </div>
            );
          }
          if (badge === 'owner') {
            return (
              <div 
                key={idx}
                onMouseEnter={() => setActiveTooltip('Owner / Staff')}
                onMouseLeave={() => setActiveTooltip(null)}
                className="relative group p-1 hover:scale-125 transition-transform cursor-pointer text-white/90"
              >
                <ShieldCheck className="w-4 h-4 drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]" />
                {activeTooltip === 'Owner / Staff' && (
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-black/90 border border-white/10 text-[10px] whitespace-nowrap text-white shadow-lg pointer-events-none z-30">
                    Owner
                  </span>
                )}
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  };

  // -------------------------------------------------------------
  // 1. MINIMAL DEFAULT PROFILE LOOK (Pure black stadium capsule)
  // -------------------------------------------------------------
  if (isMinimalDefault) {
    return (
      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          ...tiltStyle,
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderColor: 'rgba(255, 255, 255, 0.08)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
          borderRadius: '32px',
        }}
        className="w-full max-w-[390px] px-8 py-9 sm:px-10 sm:py-10 border relative overflow-hidden transition-all duration-300 select-none"
      >
        {/* Top Right: Views Counter Pill */}
        <div className="absolute top-4 sm:top-5 right-5 sm:right-6">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] backdrop-blur-md border border-white/[0.08] shadow-inner">
            <Eye className="w-3.5 h-3.5 text-white/50" />
            <span className="text-xs font-semibold text-white/80 font-mono">
              {profile.views ?? 0}
            </span>
          </div>
        </div>

        {/* Center: Username + UID Tooltip */}
        <div className="flex flex-col items-center justify-center mt-3 mb-1 relative">
          {showUidTooltip && (
            <div className="absolute -top-7 px-2.5 py-0.5 rounded-full bg-black/90 border border-white/10 text-[10px] font-mono text-white shadow-lg animate-in fade-in duration-150">
              UID {profile.uid || '545701376'}
            </div>
          )}

          <h1 
            onMouseEnter={() => setShowUidTooltip(true)}
            onMouseLeave={() => setShowUidTooltip(false)}
            onClick={() => setShowUidTooltip(!showUidTooltip)}
            style={{ 
              fontFamily: 'Comfortaa, "Plus Jakarta Sans", sans-serif',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
            }}
            className="text-[32px] sm:text-[36px] font-medium text-white tracking-tight cursor-pointer hover:text-white/90 transition-colors"
          >
            {profile.displayName || profile.username || 'bloodare'}
          </h1>

          {/* Centered Badges */}
          <div className="mt-2.5">
            {renderBadges()}
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. GUNS.LOL BIOCARD ARCHITECTURE (jefersc/gunslol-template 1:1)
  // -------------------------------------------------------------
  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        ...tiltStyle,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '32px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
      }}
      className="w-full max-w-[420px] overflow-hidden relative border transition-shadow duration-300 selection:bg-white/20 text-white"
    >
      {/* Banner */}
      {hasBanner && (
        <div className="h-32 sm:h-36 w-full relative overflow-hidden bg-gradient-to-br from-zinc-900 via-neutral-950 to-black">
          <img 
            src={profile.bannerUrl} 
            alt="Profile Banner" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-[#0a0a0c]" />
        </div>
      )}

      {/* Views Counter (Top Right) */}
      <div className="absolute top-4 right-5 z-20">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] backdrop-blur-md border border-white/[0.08] shadow-inner">
          <Eye className="w-3.5 h-3.5 text-white/50" />
          <span className="text-xs font-semibold text-white/80 font-mono">
            {profile.views ?? 0}
          </span>
        </div>
      </div>

      <div className={`p-6 sm:p-7 relative ${hasBanner ? '-mt-10' : ''}`}>
        
        {/* ======================================================== */}
        {/* SECTION 1: PROFILE MAIN (Avatar + Name + Status)         */}
        {/* ======================================================== */}
        <div className="flex items-center gap-4 mb-4">
          
          {/* Avatar Wrapper */}
          {hasAvatar && (
            <div className="relative shrink-0">
              <div className={`w-20 h-20 ${getShapeClass(avatarShape)} overflow-hidden p-1 bg-white/[0.03] backdrop-blur-md border border-white/10 shadow-lg relative z-10`}>
                <img 
                  src={profile.avatarUrl} 
                  alt={profile.displayName} 
                  className={`w-full h-full object-cover ${getShapeClass(avatarShape)}`}
                />
              </div>

              {/* Status Badge */}
              <div 
                className={`absolute bottom-0 right-0 z-20 w-4.5 h-4.5 rounded-full border-2 border-black flex items-center justify-center ${getStatusColor(profile.discordStatus?.status || 'online')}`}
                title={`Status: ${profile.discordStatus?.status || 'online'}`}
              />
            </div>
          )}

          {/* Profile Info (Name Row + Badges) */}
          <div className="min-w-0 flex-1">
            <div className="relative flex items-center gap-2.5 flex-wrap">
              {showUidTooltip && (
                <div className="absolute -top-7 left-0 px-2 py-0.5 rounded-full bg-black/95 border border-white/10 text-[10px] font-mono text-white shadow-lg animate-in fade-in duration-150 z-30">
                  UID {profile.uid || '545701376'}
                </div>
              )}

              <h1 
                onMouseEnter={() => setShowUidTooltip(true)}
                onMouseLeave={() => setShowUidTooltip(false)}
                onClick={() => setShowUidTooltip(!showUidTooltip)}
                style={{ 
                  fontFamily: 'Comfortaa, "Plus Jakarta Sans", sans-serif',
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.6)'
                }}
                className="text-[24px] sm:text-[26px] font-bold text-white tracking-tight cursor-pointer truncate"
              >
                {profile.displayName || profile.username || 'ares'}
              </h1>

              {/* Badges Container */}
              {renderBadges()}
            </div>

            {/* Status Text (Typewriter effect) */}
            <div className="mt-1 text-xs sm:text-[13px] text-white/70 leading-relaxed font-medium">
              <span>{displayedBio}</span>
              {theme.typewriterBio && (
                <span className="inline-block w-1.5 h-3.5 ml-1 bg-white/90 animate-pulse align-middle" />
              )}
            </div>
          </div>
        </div>

        {/* Location & Occupation Pill Tags */}
        {(profile.location || profile.occupation) && (
          <div className="flex flex-wrap items-center gap-2 mb-4 text-[11px] text-white/60">
            {profile.location && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-white/50">
                <MapPin className="w-3 h-3 text-white/40" />
                {profile.location}
              </span>
            )}
            {profile.occupation && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-white/50">
                <Briefcase className="w-3 h-3 text-white/40" />
                {profile.occupation}
              </span>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* SECTION 2: DISCORD PRESENCE BOX (jefersc/gunslol 1:1)    */}
        {/* ======================================================== */}
        {hasDiscord && profile.discordStatus && (
          <div className="mb-4 p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center gap-3.5 shadow-sm">
            {/* Discord Avatar with Status Indicator */}
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-800 border border-white/10">
                <img 
                  src={profile.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"} 
                  alt="Discord" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div 
                className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-black ${getStatusColor(profile.discordStatus.status || 'online')}`}
              />
            </div>

            {/* Discord Info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-white tracking-wide truncate">
                  {profile.discordStatus.username || profile.username || 'ares_wtf'}
                </p>
                <DiscordIcon className="w-3.5 h-3.5 text-[#5865F2] shrink-0" />
              </div>
              <p className="text-[11px] text-white/50 italic truncate mt-0.5">
                {profile.discordStatus.activity || 'Playing Valorant'}
              </p>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SECTION 3: SOCIAL LINKS ICONS ROW (gunslol #social-links) */}
        {/* ======================================================== */}
        {hasLinks && (
          <div className="flex items-center justify-center gap-3.5 py-2 mb-2 flex-wrap">
            {(profile.links || []).map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => onLinkClick && onLinkClick(link.id)}
                title={link.title}
                className="w-10 h-10 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] hover:border-white/[0.15] flex items-center justify-center text-white/70 hover:text-white transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 active:scale-95 shadow-sm group"
              >
                {getSocialIcon(link.icon)}
              </a>
            ))}
          </div>
        )}

        {/* Full Link Cards (if more than 3 links or custom links) */}
        {hasLinks && profile.links.length > 5 && (
          <div className="space-y-2 mt-3 pt-3 border-t border-white/[0.06]">
            {profile.links.slice(0, 3).map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => onLinkClick && onLinkClick(link.id)}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.05] hover:border-white/[0.12] transition active:scale-[0.98]"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-white/70">
                    {getSocialIcon(link.icon)}
                  </div>
                  <span className="text-xs text-white/90 truncate">{link.title}</span>
                </div>
                <ExternalLink className="w-3 h-3 text-white/30" />
              </a>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
