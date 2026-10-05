import React, { useState, useEffect, useRef } from 'react';
import { 
  Eye, 
  ExternalLink,
  MapPin,
  Briefcase
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

// ==============================================================
// 7 EXACT BADGE SVGS (Matching Screenshot_20261005_212328_Chrome)
// ==============================================================

// 1. Verified Badge (Scalloped circle with checkmark)
export const VerifiedBadgeIcon = ({ className = "w-4 h-4 text-white" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path 
      d="M12 2l2.4 2.1 3.2-.5 1.3 2.9 3 .9-.2 3.2 2.3 2.3-1.6 2.8 1.1 3-2.7 1.7-.5 3.2-3.1.7-1.7 2.7-3.1-.7-2.6 1.9-2.6-1.9-3.1.7-1.7-2.7-3.1-.7-.5-3.2-2.7-1.7 1.1-3-1.6-2.8 2.3-2.3-.2-3.2 3-.9 1.3-2.9 3.2.5L12 2z" 
      fill="currentColor" 
    />
    <path 
      d="M8.5 12.2l2.4 2.4 4.8-4.8" 
      fill="none" 
      stroke="#000" 
      strokeWidth="2.2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </svg>
);

// 2. Early Supporter (4-pointed star / origami sparkle)
export const StarBadgeIcon = ({ className = "w-4 h-4 text-white" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l2.6 6.8L21.4 12l-6.8 2.6L12 21.4l-2.6-6.8L2.6 12l6.8-2.6L12 2z" />
  </svg>
);

// 3. Target / Staff Badge (Concentric rings with center diamond)
export const TargetBadgeIcon = ({ className = "w-4 h-4 text-white" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="9" strokeWidth="1.6" strokeDasharray="3 2" />
    <circle cx="12" cy="12" r="5" strokeWidth="1.6" />
    <circle cx="12" cy="12" r="1.8" fill="currentColor" />
  </svg>
);

// 4. Diamond Gem Badge
export const DiamondBadgeIcon = ({ className = "w-4 h-4 text-white" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3h12l4 6-10 12L2 9z" />
    <path d="M2 9h20" />
    <path d="m10 3 2 6 2-6" />
    <path d="m7.5 9 4.5 12 4.5-12" />
  </svg>
);

// 5. Spiderweb Badge (Halloween Limited)
export const SpiderwebIcon = ({ className = "w-4 h-4 text-white" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93" />
    <circle cx="12" cy="12" r="4" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="8" strokeWidth="1.5" />
  </svg>
);

// 6. Candy Cane Badge
export const CandyCaneIcon = ({ className = "w-4 h-4 text-white" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <path d="M18 10a5 5 0 0 0-5-5 5 5 0 0 0-5 5v11a2 2 0 0 0 4 0V10a1 1 0 0 1 1-1 1 1 0 0 1 1 1v11" />
    <line x1="8.5" y1="13" x2="11.5" y2="15" />
    <line x1="8.5" y1="17" x2="11.5" y2="19" />
    <line x1="12.5" y1="5.5" x2="14.5" y2="8.5" />
  </svg>
);

// 7. Sun with Rays Badge
export const SunBadgeIcon = ({ className = "w-4 h-4 text-white" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="3.5" fill="currentColor" />
    <line x1="12" y1="2" x2="12" y2="4" />
    <line x1="12" y1="20" x2="12" y2="22" />
    <line x1="4.93" y1="4.93" x2="6.34" y2="6.34" />
    <line x1="17.66" y1="17.66" x2="19.07" y2="19.07" />
    <line x1="2" y1="12" x2="4" y2="12" />
    <line x1="20" y1="12" x2="22" y2="12" />
    <line x1="4.93" y1="19.07" x2="6.34" y2="17.66" />
    <line x1="17.66" y1="6.34" x2="19.07" y2="4.93" />
  </svg>
);

export default function ProfileCard({ profile = {}, isPreview = false, onLinkClick }) {
  const [showUidTooltip, setShowUidTooltip] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const cardRef = useRef(null);
  const [tiltStyle, setTiltStyle] = useState({});

  const theme = profile.theme || {};
  const isTilting = theme.tilt ?? true;
  const avatarUrl = profile.avatarUrl || '/avatar.jpg';
  const hasLinks = Boolean(profile.links && profile.links.length > 0);
  const hasDiscord = Boolean(profile.discordStatus);

  // Format Views counter e.g. 3700 -> 3.7K
  const formatViews = (views) => {
    const num = Number(views) || 0;
    if (num >= 1000) {
      const formatted = (num / 1000).toFixed(1);
      return formatted.endsWith('.0') ? `${Math.floor(num / 1000)}K` : `${formatted}K`;
    }
    return num.toString();
  };

  // 3D Tilt calculation on mouse move
  const handleMouseMove = (e) => {
    if (!isTilting || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

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

  // Badges list (matches Screenshot_20261005_212328_Chrome)
  const defaultBadges = ['verified', 'early', 'owner', 'diamond', 'halloween', 'candy', 'sun'];
  const userBadges = (profile.badges && profile.badges.length > 0) ? profile.badges : defaultBadges;

  return (
    <div className="relative pt-12 select-none">
      {/* ======================================================== */}
      {/* 1. FLOATING AVATAR (Top Edge Overlap)                    */}
      {/* ======================================================== */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
        <div className="relative pointer-events-auto">
          {/* Glowing stardust outer ring matching screenshot */}
          <div className="w-24 h-24 sm:w-26 sm:h-26 rounded-full p-1 bg-white/[0.04] backdrop-blur-md border border-white/20 shadow-[0_0_28px_rgba(255,255,255,0.22)] flex items-center justify-center">
            <img 
              src={avatarUrl} 
              alt={profile.displayName || profile.username || 'aizen'} 
              className="w-full h-full object-cover rounded-full select-none"
            />
          </div>

          {/* Optional Discord status indicator if Discord status is present */}
          {hasDiscord && profile.discordStatus && (
            <div 
              className={`absolute bottom-0 right-1 z-40 w-4 h-4 rounded-full border-2 border-black ${getStatusColor(profile.discordStatus?.status || 'online')}`}
              title={`Status: ${profile.discordStatus?.status || 'online'}`}
            />
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. FROSTED GLASS BIOCARD                                 */}
      {/* ======================================================== */}
      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          ...tiltStyle,
          backgroundColor: 'rgba(0, 0, 0, 0.45)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          borderColor: 'rgba(255, 255, 255, 0.08)',
          boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.7), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
          borderRadius: '38px',
        }}
        className="w-full max-w-[360px] sm:max-w-[380px] pt-16 pb-8 px-6 sm:px-8 border relative overflow-hidden transition-all duration-300 text-white"
      >
        {/* Top Right: Views Counter Capsule Pill (Eye + 3.7K) */}
        <div className="absolute top-5 right-5 sm:top-6 sm:right-6 z-20">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.06] backdrop-blur-md border border-white/[0.08] shadow-sm">
            <Eye className="w-3.5 h-3.5 text-white/70" />
            <span className="text-xs font-semibold text-white/90 font-mono tracking-wide">
              {formatViews(profile.views ?? 3700)}
            </span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 3. CENTERED USERNAME + UID TOOLTIP                       */}
        {/* ======================================================== */}
        <div className="flex flex-col items-center justify-center mt-2 relative">
          {showUidTooltip && (
            <div className="absolute -top-7 px-2.5 py-0.5 rounded-full bg-black/95 border border-white/10 text-[10px] font-mono text-white shadow-lg animate-in fade-in duration-150 z-30">
              UID {profile.uid || '1'}
            </div>
          )}

          <h1 
            onMouseEnter={() => setShowUidTooltip(true)}
            onMouseLeave={() => setShowUidTooltip(false)}
            onClick={() => setShowUidTooltip(!showUidTooltip)}
            style={{ 
              fontFamily: 'Comfortaa, "Plus Jakarta Sans", sans-serif',
              textShadow: '0 2px 14px rgba(0, 0, 0, 0.8)'
            }}
            className="text-[26px] sm:text-[30px] font-bold text-white tracking-tight leading-none cursor-pointer hover:text-white/90 transition-colors"
          >
            {profile.displayName || profile.username || 'aizen'}
          </h1>

          {/* ======================================================== */}
          {/* 4. GAUSSIAN BLURRED BADGES DOCK                          */}
          {/* ======================================================== */}
          <div className="mt-3.5 flex justify-center">
            <div className="inline-flex items-center gap-2.5 sm:gap-3 px-4 py-1.5 rounded-full bg-white/[0.08] backdrop-blur-2xl border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
              {userBadges.map((badge, idx) => {
                let badgeName = '';
                let badgeIcon = null;

                switch (badge) {
                  case 'verified':
                    badgeName = 'Verified';
                    badgeIcon = <VerifiedBadgeIcon className="w-4 h-4 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]" />;
                    break;
                  case 'early':
                    badgeName = 'Early Supporter';
                    badgeIcon = <StarBadgeIcon className="w-4 h-4 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]" />;
                    break;
                  case 'owner':
                  case 'staff':
                    badgeName = 'Staff';
                    badgeIcon = <TargetBadgeIcon className="w-4 h-4 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]" />;
                    break;
                  case 'diamond':
                  case 'vip':
                    badgeName = 'Diamond';
                    badgeIcon = <DiamondBadgeIcon className="w-4 h-4 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]" />;
                    break;
                  case 'halloween':
                    badgeName = 'Halloween Limited';
                    badgeIcon = <SpiderwebIcon className="w-4 h-4 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]" />;
                    break;
                  case 'candy':
                    badgeName = 'Holiday Limited';
                    badgeIcon = <CandyCaneIcon className="w-4 h-4 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]" />;
                    break;
                  case 'sun':
                  case 'booster':
                    badgeName = 'Booster';
                    badgeIcon = <SunBadgeIcon className="w-4 h-4 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]" />;
                    break;
                  default:
                    return null;
                }

                return (
                  <div 
                    key={idx}
                    onMouseEnter={() => setActiveTooltip(badgeName)}
                    onMouseLeave={() => setActiveTooltip(null)}
                    className="relative group p-0.5 hover:scale-125 transition-transform duration-150 cursor-pointer"
                  >
                    {badgeIcon}
                    {activeTooltip === badgeName && (
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-black/95 border border-white/10 text-[10px] whitespace-nowrap text-white shadow-lg pointer-events-none z-40 animate-in fade-in duration-100">
                        {badgeName}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ======================================================== */}
          {/* 5. SUBTEXT / BIO (Screenshot: PRODIGY)                  */}
          {/* ======================================================== */}
          <div className="mt-3 text-center">
            <p 
              style={{
                fontFamily: 'Cormorant Garamond, "Times New Roman", serif',
                letterSpacing: '0.28em',
              }}
              className="text-[13px] sm:text-[14px] uppercase text-white/90 drop-shadow select-none font-normal"
            >
              {profile.bio || 'PRODIGY'}
            </p>
          </div>

          {/* Location / Occupation (if present) */}
          {(profile.location || profile.occupation) && (
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-[11px] text-white/60">
              {profile.location && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-white/60">
                  <MapPin className="w-3 h-3 text-white/40" />
                  {profile.location}
                </span>
              )}
              {profile.occupation && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-white/60">
                  <Briefcase className="w-3 h-3 text-white/40" />
                  {profile.occupation}
                </span>
              )}
            </div>
          )}

          {/* Optional Discord Presence box (if configured) */}
          {hasDiscord && profile.discordStatus && (
            <div className="w-full mt-4 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center gap-3 shadow-sm text-left">
              <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-full overflow-hidden bg-neutral-800 border border-white/10">
                  <img 
                    src={avatarUrl} 
                    alt="Discord" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div 
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-black ${getStatusColor(profile.discordStatus.status || 'online')}`}
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-white tracking-wide truncate">
                    {profile.discordStatus.username || profile.username || 'aizen'}
                  </p>
                  <DiscordIcon className="w-3.5 h-3.5 text-[#5865F2] shrink-0" />
                </div>
                <p className="text-[11px] text-white/50 italic truncate mt-0.5">
                  {profile.discordStatus.activity || 'Playing Valorant'}
                </p>
              </div>
            </div>
          )}

          {/* Optional Social Links (if configured) */}
          {hasLinks && (
            <div className="flex items-center justify-center gap-3 mt-4 pt-3 border-t border-white/[0.06] w-full flex-wrap">
              {(profile.links || []).map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => onLinkClick && onLinkClick(link.id)}
                  title={link.title}
                  className="w-9 h-9 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.06] hover:border-white/[0.15] flex items-center justify-center text-white/70 hover:text-white transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 active:scale-95 shadow-sm"
                >
                  {getSocialIcon(link.icon)}
                </a>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
