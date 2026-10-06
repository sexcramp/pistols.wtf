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
// GUNS.LOL AUTHENTIC VECTOR BADGES
// ==============================================================

// 1. Premium Diamond Gem (Authentic guns.lol cut gemstone)
export const GunsPremiumDiamondIcon = ({ className = "w-5 h-5", color = "currentColor" }) => (
  <svg className={className} viewBox="23 32 465 448" fill={color}>
    <path d="M396.31 32H264l84.19 112.26L396.31 32zm-280.62 0l48.12 112.26L248 32H115.69zM256 74.67L192 160h128l-64-85.33zm166.95-23.61L376.26 160H488L422.95 51.06zm-333.9 0L23 160h112.74L89.05 51.06zM146.68 192H24l222.8 288h.53L146.68 192zm218.64 0L264.67 480h.53L488 192H365.32zm-35.93 0H182.61L256 400l73.39-208z" />
  </svg>
);

// 2. Owner Crown (Authentic guns.lol crown emblem)
export const GunsOwnerCrownIcon = ({ className = "w-5 h-5", color = "currentColor" }) => (
  <svg className={className} viewBox="0 0 512 512" fill={color}>
    <path d="M51.2 136.5l30.4 196.3h348.8l30.4-196.3-108.8 68.3L256 73.1 160 204.8 51.2 136.5zM45.7 370.3c0-4.2 3.4-7.6 7.6-7.6h405.4c4.2 0 7.6 3.4 7.6 7.6v51.2c0 14.1-11.5 25.6-25.6 25.6H71.3c-14.1 0-25.6-11.5-25.6-25.6v-51.2z" />
  </svg>
);

// 3. Verified Scalloped Seal (Authentic guns.lol verified emblem)
export const GunsVerifiedIcon = ({ className = "w-5 h-5", color = "#1d9bf0" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path 
      d="M12 1.5l2.45 2.8 3.6-.8 1.9 3.2 3.4 1.45L23 12l-2.45 2.8.35 3.7-3.6.8-1.9 3.2-3.4-1.45L8.6 22.5l-1.9-3.2-3.6-.8.35-3.7L1 12l2.45-2.8-.35-3.7 3.6-.8 1.9-3.2L12 1.5z" 
      fill={color}
    />
    <path 
      d="M8.5 12.3l2.4 2.4 4.8-4.8" 
      stroke="#ffffff" 
      strokeWidth="2.2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </svg>
);

// 4. Spiderweb / Limited Badge
export const SpiderwebIcon = ({ className = "w-4 h-4", color = "currentColor" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93" />
    <circle cx="12" cy="12" r="4" strokeWidth="1.4" />
    <circle cx="12" cy="12" r="8" strokeWidth="1.4" />
  </svg>
);

export default function ProfileCard({ profile = {}, isPreview = false, onLinkClick }) {
  const [showUidTooltip, setShowUidTooltip] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const cardRef = useRef(null);
  const [tiltStyle, setTiltStyle] = useState({});

  const theme = profile.theme || {};
  // Toggleable 3D Moving Card tilt
  const isTilting = theme.tilt ?? true;
  const isMonochromeBadges = Boolean(theme.monochromeBadges);
  const monoColor = theme.monochromeBadgeColor || '#ffffff';

  // Only show avatar if user explicitly has an avatar set
  const hasAvatar = Boolean(profile.avatarUrl && profile.avatarUrl.trim());
  const avatarUrl = profile.avatarUrl;

  // Only show badges if user has badges array with items (no fallback for blank users)
  const userBadges = Array.isArray(profile.badges) ? profile.badges : [];
  const hasBadges = userBadges.length > 0;

  // Only show bio if user has non-empty bio
  const hasBio = Boolean(profile.bio && profile.bio.trim());

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

  // 3D Tilt calculation on mouse move (only if enabled)
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
    const className = "w-4 h-4 sm:w-5 sm:h-5";
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

  // Render individual badge item matching guns.lol standards with full-color vs monochrome support
  const renderBadgeItem = (badge, idx) => {
    let badgeName = '';
    let badgeEl = null;

    if (badge === 'owner' || badge === 'crown') {
      badgeName = 'Owner';
      if (isMonochromeBadges) {
        badgeEl = <GunsOwnerCrownIcon className="w-5 h-5 sm:w-5.5 sm:h-5.5" color={monoColor} />;
      } else {
        badgeEl = (
          <img 
            src="/badges/owner.png" 
            alt="Owner" 
            className="w-5 h-5 sm:w-5.5 sm:h-5.5 object-contain drop-shadow-[0_0_8px_rgba(245,166,35,0.7)] select-none pointer-events-none" 
          />
        );
      }
    } else if (badge === 'premium' || badge === 'diamond') {
      badgeName = 'Premium';
      if (isMonochromeBadges) {
        badgeEl = <GunsPremiumDiamondIcon className="w-5 h-5 sm:w-5.5 sm:h-5.5" color={monoColor} />;
      } else {
        badgeEl = (
          <GunsPremiumDiamondIcon 
            className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-[#00f0ff] drop-shadow-[0_0_8px_rgba(0,240,255,0.7)] select-none" 
            color="#00f0ff"
          />
        );
      }
    } else if (badge === 'verified') {
      badgeName = 'Verified';
      if (isMonochromeBadges) {
        badgeEl = <GunsVerifiedIcon className="w-5 h-5 sm:w-5.5 sm:h-5.5" color={monoColor} />;
      } else {
        badgeEl = (
          <img 
            src="/badges/verified.png" 
            alt="Verified" 
            className="w-5 h-5 sm:w-5.5 sm:h-5.5 object-contain drop-shadow-[0_0_8px_rgba(29,155,240,0.7)] select-none pointer-events-none" 
          />
        );
      }
    } else {
      return null;
    }

    return (
      <div 
        key={idx}
        onMouseEnter={() => setActiveTooltip(badgeName)}
        onMouseLeave={() => setActiveTooltip(null)}
        className="relative group p-0.5 hover:scale-125 transition-transform duration-200 cursor-pointer flex items-center justify-center"
      >
        {badgeEl}
        {activeTooltip === badgeName && (
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-black/95 border border-white/10 text-[11px] font-medium whitespace-nowrap text-white shadow-xl pointer-events-none z-40 animate-in fade-in duration-100">
            {badgeName}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className={`relative select-none w-full flex justify-center ${hasAvatar ? 'pt-12 sm:pt-13 md:pt-14' : 'pt-0'}`}>
      {/* ======================================================== */}
      {/* 1. FLOATING AVATAR (ONLY IF USER HAS AVATAR SET)         */}
      {/* ======================================================== */}
      {hasAvatar && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
          <div className="relative pointer-events-auto">
            {/* Perfectly sized, zero borderline floating avatar */}
            <div className="w-24 h-24 sm:w-26 sm:h-26 md:w-28 md:h-28 rounded-full overflow-hidden shadow-[0_12px_32px_rgba(0,0,0,0.7)]">
              <img 
                src={avatarUrl} 
                alt={profile.displayName || profile.username || 'user'} 
                className="w-full h-full object-cover rounded-full select-none"
              />
            </div>

            {/* Optional Discord status indicator if status is active */}
            {hasDiscord && profile.discordStatus && (
              <div 
                className={`absolute bottom-0 right-1 z-40 w-4 h-4 rounded-full border-2 border-black ${getStatusColor(profile.discordStatus?.status || 'online')}`}
                title={`Status: ${profile.discordStatus?.status || 'online'}`}
              />
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. FROSTED GLASS BIOCARD                                 */}
      {/* ======================================================== */}
      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          ...(isTilting ? tiltStyle : {}),
          backgroundColor: 'rgba(0, 0, 0, 0.45)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          borderColor: 'rgba(255, 255, 255, 0.08)',
          boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.7), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
        }}
        className={`w-[92vw] max-w-[380px] sm:max-w-[440px] md:max-w-[480px] ${
          hasAvatar ? 'pt-16 sm:pt-18 md:pt-20' : 'pt-8 sm:pt-9 md:pt-10'
        } pb-7 sm:pb-8 md:pb-9 px-6 sm:px-9 md:px-10 border relative overflow-hidden transition-all duration-300 text-white rounded-[32px] sm:rounded-[38px] md:rounded-[42px]`}
      >
        {/* Top Right: Views Counter Capsule Pill */}
        <div className="absolute top-5 right-5 sm:top-6 sm:right-6 z-20">
          <div className="flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1 rounded-full bg-white/[0.06] backdrop-blur-md border border-white/[0.08] shadow-sm">
            <Eye className="w-3.5 h-3.5 text-white/70" />
            <span className="text-xs sm:text-[13px] font-semibold text-white/90 font-mono tracking-wide">
              {formatViews(profile.views ?? 0)}
            </span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 3. CENTERED USERNAME + UID TOOLTIP                       */}
        {/* ======================================================== */}
        <div className="flex flex-col items-center justify-center mt-1 relative">
          {showUidTooltip && (
            <div className="absolute -top-8 px-2.5 py-0.5 rounded-full bg-black/95 border border-white/10 text-[10px] font-mono text-white shadow-lg animate-in fade-in duration-150 z-30">
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
            className="text-[26px] sm:text-[30px] md:text-[34px] font-bold text-white tracking-tight leading-none cursor-pointer hover:text-white/90 transition-colors"
          >
            {profile.displayName || profile.username || 'user'}
          </h1>

          {/* ======================================================== */}
          {/* 4. GAUSSIAN BLURRED BADGES DOCK (ONLY IF BADGES EXIST)   */}
          {/* ======================================================== */}
          {hasBadges && (
            <div className="mt-3.5 sm:mt-4 flex justify-center">
              <div className="inline-flex items-center gap-3 sm:gap-4 px-4 py-1.5 sm:px-5 sm:py-2 rounded-full bg-white/[0.08] backdrop-blur-2xl border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.35)]">
                {userBadges.map((badge, idx) => renderBadgeItem(badge, idx))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 5. BIO / DESCRIPTION (NORMAL CLEAN FONT)                 */}
          {/* ======================================================== */}
          {hasBio && (
            <div className="mt-2.5 sm:mt-3 text-center px-3 max-w-[90%] mx-auto">
              <p className="text-xs sm:text-[13px] md:text-sm text-white/80 font-normal leading-relaxed drop-shadow-sm select-none break-words">
                {profile.bio}
              </p>
            </div>
          )}

          {/* Location / Occupation (if present) */}
          {(profile.location || profile.occupation) && (
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-white/60">
              {profile.location && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-white/60">
                  <MapPin className="w-3 h-3 text-white/40" />
                  {profile.location}
                </span>
              )}
              {profile.occupation && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-white/60">
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
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Discord" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-white/10" />
                  )}
                </div>
                <div 
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-black ${getStatusColor(profile.discordStatus.status || 'online')}`}
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs sm:text-sm font-semibold text-white tracking-wide truncate">
                    {profile.discordStatus.username || profile.username}
                  </p>
                  <DiscordIcon className="w-4 h-4 text-[#5865F2] shrink-0" />
                </div>
                <p className="text-xs text-white/50 italic truncate mt-0.5">
                  {profile.discordStatus.activity || 'Online'}
                </p>
              </div>
            </div>
          )}

          {/* Optional Social Links (if configured) */}
          {hasLinks && (
            <div className="flex items-center justify-center gap-3 sm:gap-3.5 mt-4 pt-3.5 border-t border-white/[0.06] w-full flex-wrap">
              {(profile.links || []).map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => onLinkClick && onLinkClick(link.id)}
                  title={link.title}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.06] hover:border-white/[0.15] flex items-center justify-center text-white/70 hover:text-white transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 active:scale-95 shadow-sm"
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
