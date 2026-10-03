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
  Music2
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

export default function ProfileCard({ profile, isPreview = false, onLinkClick }) {
  const [displayedBio, setDisplayedBio] = useState('');
  const cardRef = useRef(null);
  const [tiltStyle, setTiltStyle] = useState({});

  const theme = profile.theme || {};
  const primaryColor = theme.primaryColor || '#EE6F35';
  const avatarShape = profile.avatarShape || 'soft'; // circle, soft, rounded, square
  const decoration = profile.avatarDecoration || 'none';
  const decorationHue = profile.avatarDecorationHue ?? 0;
  const isTilting = theme.tilt ?? true;

  // Typewriter effect for Bio
  useEffect(() => {
    if (!theme.typewriterBio) {
      setDisplayedBio(profile.bio || '');
      return;
    }

    setDisplayedBio('');
    const text = profile.bio || '';
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
    const rotateX = ((y - centerY) / centerY) * -7;
    const rotateY = ((x - centerX) / centerX) * 7;

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

  // Avatar Decoration Frames
  const renderAvatarDecoration = () => {
    if (!decoration || decoration === 'none') return null;

    const hueStyle = { filter: `hue-rotate(${decorationHue}deg)` };

    switch (decoration) {
      case 'halo':
        return (
          <div 
            style={hueStyle}
            className="absolute -top-3 -left-3 -right-3 -bottom-3 rounded-full border-2 border-[#EE6F35] animate-pulse shadow-[0_0_20px_#EE6F35] pointer-events-none"
          />
        );
      case 'cyber-orange':
        return (
          <div 
            style={hueStyle}
            className="absolute -inset-2 rounded-2xl border-2 border-dashed border-[#EE6F35] animate-spin shadow-[0_0_25px_#EE6F35]/70 pointer-events-none"
            style={{ ...hueStyle, animationDuration: '14s' }}
          />
        );
      case 'wings':
        return (
          <div 
            style={hueStyle}
            className="absolute -inset-3 bg-gradient-to-r from-amber-400/30 via-[#EE6F35]/40 to-amber-400/30 blur-md rounded-3xl animate-pulse pointer-events-none"
          />
        );
      case 'horns':
        return (
          <div 
            style={hueStyle}
            className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center justify-between w-[85%] pointer-events-none"
          >
            <span className="text-red-500 text-lg font-black drop-shadow-[0_0_10px_red]">▲</span>
            <span className="text-red-500 text-lg font-black drop-shadow-[0_0_10px_red]">▲</span>
          </div>
        );
      case 'void':
        return (
          <div 
            style={hueStyle}
            className="absolute -inset-2.5 rounded-full bg-gradient-to-tr from-purple-900/60 via-[#EE6F35]/30 to-black blur-sm border border-purple-500/50 animate-spin pointer-events-none"
            style={{ ...hueStyle, animationDuration: '8s' }}
          />
        );
      case 'orbit':
        return (
          <div 
            style={hueStyle}
            className="absolute -inset-3 rounded-full border border-amber-300/60 shadow-[0_0_15px_gold] animate-spin pointer-events-none"
            style={{ ...hueStyle, animationDuration: '6s' }}
          >
            <div className="w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_8px_gold] absolute -top-1 left-1/2" />
          </div>
        );
      case 'fire':
        return (
          <div 
            style={hueStyle}
            className="absolute -inset-2.5 rounded-2xl bg-gradient-to-t from-[#EE6F35]/60 via-red-500/40 to-yellow-400/20 blur-sm animate-pulse pointer-events-none"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        ...tiltStyle,
        backgroundColor: theme.cardBackground || 'rgba(18, 18, 20, 0.85)',
        backdropFilter: `blur(${theme.cardBlur ?? 20}px)`,
        WebkitBackdropFilter: `blur(${theme.cardBlur ?? 20}px)`,
        borderColor: theme.cardBorder || 'rgba(238, 111, 53, 0.25)',
        borderRadius: `${theme.cardRadius || 28}px`,
        boxShadow: theme.glowIntensity === 'high' 
          ? `0 0 50px rgba(238, 111, 53, 0.35)` 
          : theme.glowIntensity === 'low' 
          ? `0 0 20px rgba(0, 0, 0, 0.8)` 
          : `0 0 35px rgba(238, 111, 53, 0.2)`,
      }}
      className="w-full max-w-[420px] overflow-hidden shadow-2xl relative border transition-shadow duration-300 selection:bg-[#EE6F35]"
    >
      {/* Banner */}
      <div className="h-32 sm:h-36 w-full relative overflow-hidden bg-gradient-to-br from-neutral-900 via-[#18181c] to-black">
        {profile.bannerUrl && (
          <img 
            src={profile.bannerUrl} 
            alt="Profile Banner" 
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/85" />
      </div>

      <div className="px-6 pb-6 pt-0 relative">
        {/* Avatar & Badges row */}
        <div className="flex items-end justify-between -mt-14 mb-4">
          <div className="relative">
            {renderAvatarDecoration()}

            <div className={`w-24 h-24 ${getShapeClass(avatarShape)} overflow-hidden p-1 bg-black/70 backdrop-blur-md border border-white/20 shadow-2xl relative z-10`}>
              <img 
                src={profile.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'} 
                alt={profile.displayName} 
                className={`w-full h-full object-cover ${getShapeClass(avatarShape)}`}
              />
            </div>

            {/* Discord status badge */}
            <div 
              className={`absolute bottom-0 right-0 z-20 w-5 h-5 rounded-full border-2 border-black flex items-center justify-center ${getStatusColor(profile.discordStatus?.status || 'dnd')}`}
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

        {/* Location & Occupation / Details */}
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

        {/* Tags */}
        {profile.tags && profile.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3.5">
            {profile.tags.map((tag, i) => (
              <span 
                key={i}
                className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-white/5 border border-white/10 text-white/80"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Bio Text */}
        <div className="mb-4 text-xs sm:text-[13px] text-white/75 leading-relaxed font-sans whitespace-pre-line min-h-[38px]">
          {displayedBio}
          {theme.typewriterBio && displayedBio.length < (profile.bio || '').length && (
            <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-[#EE6F35] animate-pulse align-middle" />
          )}
        </div>

        {/* Discord Presence / Spotify activity */}
        {profile.discordStatus && (
          <div className="mb-4 p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
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
                <div className="w-8 h-8 rounded-xl bg-[#EE6F35]/15 border border-[#EE6F35]/30 flex items-center justify-center text-[#EE6F35]">
                  <Radio className="w-4 h-4 animate-pulse" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#EE6F35]">
                      Discord Status
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-white truncate">
                    {profile.discordStatus.activity || 'whose.baby ✦ sync'}
                  </p>
                  {profile.discordStatus.state && (
                    <p className="text-[10px] text-white/50 truncate">
                      {profile.discordStatus.state}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* Links List */}
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

        {/* Footer: View count & Brand */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/40">
          {theme.showViews && (
            <div className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-[#EE6F35]" />
              <span>{(profile.views || 0).toLocaleString()} views</span>
            </div>
          )}

          <div className="flex items-center gap-1 ml-auto">
            <span>powered by</span>
            <span className="font-semibold text-white/70 hover:text-[#EE6F35] transition cursor-pointer">
              whose<span className="text-[#EE6F35]">.</span>baby
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
