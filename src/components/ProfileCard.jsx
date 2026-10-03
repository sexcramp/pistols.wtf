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

// Spiderweb SVG for the Halloween limited badge (from Screenshot_20261003_194936_Chrome.jpg)
export const SpiderwebIcon = ({ className = "w-4 h-4 text-purple-400" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="12" cy="12" r="8" />
  </svg>
);

export default function ProfileCard({ profile, isPreview = false, onLinkClick }) {
  const [displayedBio, setDisplayedBio] = useState('');
  const [showUidTooltip, setShowUidTooltip] = useState(false);
  const cardRef = useRef(null);
  const [tiltStyle, setTiltStyle] = useState({});

  const theme = profile.theme || {};
  const primaryColor = theme.primaryColor || '#EE6F35';
  const avatarShape = profile.avatarShape || 'rounded'; // square, soft, rounded, circle
  const decoration = profile.avatarDecoration || 'none';
  const decorationHue = profile.avatarDecorationHue ?? 0;
  const isTilting = theme.tilt ?? true;
  const layout = theme.layout || 'floating'; // floating, stacked, compact, showcase

  const hasAvatar = Boolean(profile.avatarUrl);
  const hasBanner = Boolean(profile.bannerUrl);
  const hasBio = Boolean(profile.bio && profile.bio.trim());
  const hasLinks = Boolean(profile.links && profile.links.length > 0);
  const hasWidgets = Boolean(profile.widgets && profile.widgets.length > 0);
  const hasDiscord = Boolean(profile.discordStatus);

  // If user hasn't added avatar, banner, or bio yet, show the minimal default capsule (Screenshot 1:1)
  const isMinimalDefault = !hasAvatar && !hasBanner && !hasBio && !hasLinks && !hasWidgets;

  // Typewriter effect for Bio
  useEffect(() => {
    if (!theme.typewriterBio || !profile.bio) {
      setDisplayedBio(profile.bio || '');
      return;
    }

    setDisplayedBio('');
    const text = profile.bio;
    let currentIdx = 0;

    const interval = setInterval(() => {
      if (currentIdx <= text.length) {
        setDisplayedBio(text.slice(0, currentIdx));
        currentIdx++;
      } else {
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [profile.bio, theme.typewriterBio]);

  // 3D Tilt calculation on mouse move
  const handleMouseMove = (e) => {
    if (!isTilting || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`,
      transition: 'transform 0.1s ease-out'
    });
  };

  const handleMouseLeave = () => {
    if (!isTilting) return;
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.4s ease-out'
    });
    setShowUidTooltip(false);
  };

  // Social Icon Helper
  const getSocialIcon = (iconName) => {
    const className = "w-4 h-4";
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
      case 'rounded': return 'rounded-xl';
      case 'square': return 'rounded-md';
      case 'soft':
      default: return 'rounded-2xl';
    }
  };

  // Render Badges
  const renderBadges = () => {
    const badges = profile.badges || ['halloween'];
    return (
      <div className="flex items-center justify-center gap-2 mt-2.5">
        {badges.map((badge, idx) => {
          if (badge === 'halloween') {
            return (
              <div 
                key={idx} 
                title="Halloween Limited Badge"
                className="w-8 h-8 rounded-full bg-[#161622]/90 border border-purple-500/30 flex items-center justify-center shadow-[0_0_12px_rgba(168,85,247,0.35)] hover:scale-110 transition-transform"
              >
                <SpiderwebIcon className="w-4 h-4 text-purple-400 drop-shadow-[0_0_6px_rgba(168,85,247,0.8)]" />
              </div>
            );
          }
          if (badge === 'verified') {
            return (
              <div 
                key={idx}
                title="Verified Profile"
                className="w-8 h-8 rounded-full bg-[#161622]/90 border border-[#EE6F35]/40 flex items-center justify-center text-[#EE6F35] shadow-[0_0_12px_rgba(238,111,53,0.35)] hover:scale-110 transition-transform"
              >
                <BadgeCheck className="w-4 h-4 fill-[#EE6F35] text-black" />
              </div>
            );
          }
          if (badge === 'early') {
            return (
              <div 
                key={idx}
                title="Early Supporter"
                className="w-8 h-8 rounded-full bg-[#161622]/90 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.35)] hover:scale-110 transition-transform"
              >
                <Sparkles className="w-4 h-4 fill-amber-400/20" />
              </div>
            );
          }
          if (badge === 'owner') {
            return (
              <div 
                key={idx}
                title="Staff / Owner"
                className="w-8 h-8 rounded-full bg-[#161622]/90 border border-purple-400/40 flex items-center justify-center text-purple-400 shadow-[0_0_12px_rgba(192,132,252,0.35)] hover:scale-110 transition-transform"
              >
                <ShieldCheck className="w-4 h-4" />
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  };

  // -------------------------------------------------------------
  // 1. MINIMAL DEFAULT PROFILE LOOK (EXACT MATCH Screenshot 194936)
  // -------------------------------------------------------------
  if (isMinimalDefault) {
    return (
      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          ...tiltStyle,
          backgroundColor: theme.cardBackground || 'rgba(10, 10, 13, 0.92)',
          borderColor: theme.cardBorder || 'rgba(255, 255, 255, 0.07)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.9), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        }}
        className="w-full max-w-[390px] rounded-[38px] px-8 py-9 sm:px-10 sm:py-10 border relative overflow-hidden backdrop-blur-xl transition-all duration-300 select-none"
      >
        {/* Top Right: Views Counter Pill with Eye (Screenshot 1:1) */}
        <div className="absolute top-4 sm:top-5 right-5 sm:right-6">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#14141c]/90 border border-white/5 shadow-inner">
            <Eye className="w-3.5 h-3.5 text-[#EE6F35] drop-shadow-[0_0_6px_rgba(238,111,53,0.7)]" />
            <span className="text-xs font-semibold text-white/90">
              {profile.views ?? 0}
            </span>
          </div>
        </div>

        {/* Center: Username + UID Tooltip (Screenshot 194936 & 194942) */}
        <div className="flex flex-col items-center justify-center mt-3 mb-1 relative">
          
          {/* Tooltip on hover/tap (Screenshot_20261003_194942_Chrome.jpg) */}
          {showUidTooltip && (
            <div className="absolute -top-7 px-2.5 py-0.5 rounded-full bg-black/90 border border-white/10 text-[10px] font-mono text-white/90 shadow-lg animate-in fade-in duration-150">
              UID {profile.uid || '545701376'}
            </div>
          )}

          <h1 
            onMouseEnter={() => setShowUidTooltip(true)}
            onMouseLeave={() => setShowUidTooltip(false)}
            onClick={() => setShowUidTooltip(!showUidTooltip)}
            style={{ fontFamily: 'Comfortaa, "Plus Jakarta Sans", sans-serif' }}
            className="text-[32px] sm:text-[36px] font-medium text-white tracking-tight cursor-pointer hover:text-white/90 transition-colors"
          >
            {profile.displayName || profile.username || 'bloodare'}
          </h1>

          {/* Centered Badge (Spiderweb / Halloween) */}
          {renderBadges()}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. CUSTOMIZED PROFILE (WHEN USER ADDS AVATAR/LINKS/BANNER)
  // -------------------------------------------------------------
  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        ...tiltStyle,
        backgroundColor: theme.cardBackground || 'rgba(12, 12, 16, 0.88)',
        backdropFilter: `blur(${theme.cardBlur ?? 20}px)`,
        WebkitBackdropFilter: `blur(${theme.cardBlur ?? 20}px)`,
        borderColor: theme.cardBorder || 'rgba(255, 255, 255, 0.08)',
        borderRadius: `${theme.cardRadius || 36}px`,
        boxShadow: '0 25px 60px rgba(0,0,0,0.92), inset 0 1px 0 rgba(255,255,255,0.06)',
      }}
      className="w-full max-w-[410px] overflow-hidden shadow-2xl relative border transition-shadow duration-300 selection:bg-[#EE6F35]"
    >
      {/* Banner */}
      {hasBanner && (
        <div className="h-32 sm:h-36 w-full relative overflow-hidden bg-gradient-to-br from-neutral-900 via-[#18181c] to-black">
          <img 
            src={profile.bannerUrl} 
            alt="Profile Banner" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/85" />
        </div>
      )}

      {/* Views Counter (Top Right) */}
      <div className="absolute top-4 right-5 z-20">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 shadow-inner">
          <Eye className="w-3.5 h-3.5 text-purple-400 drop-shadow-[0_0_6px_rgba(168,85,247,0.7)]" />
          <span className="text-xs font-semibold text-white/90">
            {profile.views ?? 0}
          </span>
        </div>
      </div>

      <div className={`px-6 pb-6 pt-5 relative ${hasBanner ? '-mt-12' : ''}`}>
        
        {/* Avatar & Presence Row (if avatar enabled) */}
        {hasAvatar && (
          <div className="flex items-end justify-between mb-4">
            <div className="relative">
              <div className={`w-24 h-24 ${getShapeClass(avatarShape)} overflow-hidden p-1 bg-black/80 backdrop-blur-md border border-white/15 shadow-2xl relative z-10`}>
                <img 
                  src={profile.avatarUrl} 
                  alt={profile.displayName} 
                  className={`w-full h-full object-cover ${getShapeClass(avatarShape)}`}
                />
              </div>

              {/* Status badge */}
              <div 
                className={`absolute bottom-0 right-0 z-20 w-5 h-5 rounded-full border-2 border-black flex items-center justify-center ${getStatusColor(profile.discordStatus?.status || 'online')}`}
                title={`Status: ${profile.discordStatus?.status || 'online'}`}
              />
            </div>
          </div>
        )}

        {/* Username Header + Tooltip */}
        <div className="mb-3 relative">
          {showUidTooltip && (
            <div className="absolute -top-7 left-0 px-2.5 py-0.5 rounded-full bg-black/90 border border-white/10 text-[10px] font-mono text-white/90 shadow-lg animate-in fade-in duration-150">
              UID {profile.uid || '545701376'}
            </div>
          )}

          <h1 
            onMouseEnter={() => setShowUidTooltip(true)}
            onMouseLeave={() => setShowUidTooltip(false)}
            onClick={() => setShowUidTooltip(!showUidTooltip)}
            style={{ fontFamily: 'Comfortaa, "Plus Jakarta Sans", sans-serif' }}
            className="text-[28px] sm:text-[32px] font-semibold text-white tracking-tight cursor-pointer inline-block"
          >
            {profile.displayName || profile.username || 'bloodare'}
          </h1>

          {/* Badges */}
          <div className="flex items-center gap-2 mt-1">
            {renderBadges()}
          </div>
        </div>

        {/* Location & Occupation */}
        {(profile.location || profile.occupation) && (
          <div className="flex flex-wrap items-center gap-3 mb-3 text-[11px] text-white/60">
            {profile.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#EE6F35]" />
                {profile.location}
              </span>
            )}
            {profile.occupation && (
              <span className="flex items-center gap-1">
                <Briefcase className="w-3 h-3 text-[#EE6F35]" />
                {profile.occupation}
              </span>
            )}
          </div>
        )}

        {/* Bio Text */}
        {hasBio && (
          <div className="mb-4 text-xs sm:text-[13px] text-white/75 leading-relaxed whitespace-pre-line min-h-[24px]">
            {displayedBio}
            {theme.typewriterBio && displayedBio.length < (profile.bio || '').length && (
              <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-[#EE6F35] animate-pulse align-middle" />
            )}
          </div>
        )}

        {/* Discord Activity / Spotify Widget */}
        {hasDiscord && profile.discordStatus && (
          <div className="mb-4 p-3 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center gap-3">
            {profile.discordStatus.spotify ? (
              <>
                <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-neutral-800 border border-white/10 relative">
                  {profile.discordStatus.spotify.albumArt ? (
                    <img 
                      src={profile.discordStatus.spotify.albumArt} 
                      alt="Album Art" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <SpotifyIcon className="w-5 h-5 text-emerald-500 m-auto mt-2.5" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <SpotifyIcon className="w-3 h-3 text-emerald-400" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                      Listening to Spotify
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-white truncate mt-0.5">
                    {profile.discordStatus.spotify.song || 'After Dark'}
                  </p>
                  <p className="text-[10px] text-white/50 truncate">
                    by {profile.discordStatus.spotify.artist || 'Mr.Kitty'}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="w-8 h-8 rounded-xl bg-[#5865F2]/20 border border-[#5865F2]/40 flex items-center justify-center text-[#5865F2]">
                  <DiscordIcon className="w-4 h-4 text-[#5865F2]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#5865F2]">
                      Discord Status
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-white truncate">
                    {profile.discordStatus.activity || 'whose.baby ✦ sync'}
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Links List */}
        {hasLinks && (
          <div className="space-y-2 mb-4">
            {(profile.links || []).map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => onLinkClick && onLinkClick(link.id)}
                className="group flex items-center justify-between p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 hover:border-[#EE6F35]/40 transition-all duration-200 active:scale-[0.98]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-white/5 group-hover:bg-[#EE6F35]/20 text-white/70 group-hover:text-[#EE6F35] flex items-center justify-center transition border border-white/10 group-hover:border-[#EE6F35]/30 shrink-0">
                    {getSocialIcon(link.icon)}
                  </div>
                  <span className="text-xs font-medium text-white/90 group-hover:text-white truncate">
                    {link.title}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {link.clicks !== undefined && (
                    <span className="text-[10px] font-mono text-white/40 group-hover:text-white/60">
                      {link.clicks} clicks
                    </span>
                  )}
                  <ExternalLink className="w-3.5 h-3.5 text-white/40 group-hover:text-[#EE6F35] group-hover:translate-x-0.5 transition" />
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/40">
          <div className="flex items-center gap-1 ml-auto">
            <span>whose<span className="text-[#EE6F35]">.</span>baby</span>
          </div>
        </div>

      </div>
    </div>
  );
}
