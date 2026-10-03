import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Eye, 
  Plus, 
  Trash2, 
  Music, 
  Palette, 
  Link as LinkIcon, 
  User, 
  Sparkles, 
  CheckCircle, 
  Copy, 
  Check, 
  Layers, 
  Sliders, 
  ShieldCheck, 
  ExternalLink,
  Radio,
  MapPin,
  Briefcase,
  Flame,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import ProfileCard from '../components/ProfileCard';
import { DiscordIcon, SpotifyIcon, GoogleIcon } from '../components/Icons';
import { getProfileByUsername, saveProfile } from '../utils/storage';

export default function DashboardPage({ initialUsername = 'ares', onNavigate }) {
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'appearance', 'links', 'effects', 'audio', 'discord'
  const [mobileView, setMobileView] = useState('editor'); // 'editor', 'preview'
  const [profile, setProfile] = useState(() => getProfileByUsername(initialUsername));
  const [toastMessage, setToastMessage] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // New link form state
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkIcon, setNewLinkIcon] = useState('globe');

  // New tag state
  const [newTagInput, setNewTagInput] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = () => {
    saveProfile(profile);
    showToast('Changes saved to whose.baby! ✦');
  };

  const handleCopyLink = () => {
    const fullUrl = `https://whose.baby/${profile.username}`;
    navigator.clipboard?.writeText(fullUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
    showToast(`Copied ${fullUrl} to clipboard!`);
  };

  // Add Link
  const handleAddLink = (e) => {
    e.preventDefault();
    if (!newLinkTitle || !newLinkUrl) return;

    const newLink = {
      id: Date.now().toString(),
      title: newLinkTitle,
      url: newLinkUrl.startsWith('http') ? newLinkUrl : `https://${newLinkUrl}`,
      icon: newLinkIcon,
      clicks: 0
    };

    setProfile(prev => ({
      ...prev,
      links: [...(prev.links || []), newLink]
    }));

    setNewLinkTitle('');
    setNewLinkUrl('');
    showToast('Link added!');
  };

  // Remove Link
  const handleRemoveLink = (id) => {
    setProfile(prev => ({
      ...prev,
      links: (prev.links || []).filter(l => l.id !== id)
    }));
  };

  // Move Link Up/Down
  const handleMoveLink = (index, direction) => {
    const links = [...(profile.links || [])];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= links.length) return;
    const temp = links[index];
    links[index] = links[targetIdx];
    links[targetIdx] = temp;
    setProfile(prev => ({ ...prev, links }));
  };

  // Add Tag
  const handleAddTag = (e) => {
    e.preventDefault();
    const tag = newTagInput.trim().replace(/^#/, '');
    if (!tag) return;
    if ((profile.tags || []).includes(tag)) return;

    setProfile(prev => ({
      ...prev,
      tags: [...(prev.tags || []), tag]
    }));
    setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove) => {
    setProfile(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(t => t !== tagToRemove)
    }));
  };

  // Toggle Badges
  const handleToggleBadge = (badgeName) => {
    const badges = profile.badges || [];
    const updated = badges.includes(badgeName)
      ? badges.filter(b => b !== badgeName)
      : [...badges, badgeName];
    setProfile(prev => ({ ...prev, badges: updated }));
  };

  const theme = profile.theme || {};

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 max-w-6xl mx-auto selection:bg-[#EE6F35]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 px-4 py-3 rounded-2xl border border-[#EE6F35]/40 bg-black/95 shadow-2xl flex items-center gap-2 text-xs font-semibold text-white animate-in slide-in-from-top duration-300">
          <CheckCircle className="w-4 h-4 text-[#EE6F35]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Studio
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#EE6F35]/20 text-[#EE6F35] text-[10px] font-bold uppercase tracking-wider border border-[#EE6F35]/30">
              Live Preview
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/50 font-mono">
            <span>whose.baby/<strong className="text-white">{profile.username}</strong></span>
            <button
              onClick={handleCopyLink}
              className="p-1 hover:text-white rounded transition"
              title="Copy public link"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Mobile view toggle */}
          <div className="flex lg:hidden p-1 rounded-xl bg-white/5 border border-white/10">
            <button
              onClick={() => setMobileView('editor')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${mobileView === 'editor' ? 'bg-[#EE6F35] text-white shadow-md' : 'text-white/60'}`}
            >
              Editor
            </button>
            <button
              onClick={() => setMobileView('preview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${mobileView === 'preview' ? 'bg-[#EE6F35] text-white shadow-md' : 'text-white/60'}`}
            >
              Live Card
            </button>
          </div>

          <button
            onClick={() => onNavigate('bio', profile.username)}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white flex items-center gap-1.5 transition"
            title="Open Fullscreen Public Bio"
          >
            <Eye className="w-3.5 h-3.5 text-[#EE6F35]" />
            <span className="hidden sm:inline">View Bio Page</span>
          </button>

          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-[#EE6F35] hover:bg-[#d95e26] text-white text-xs font-bold shadow-lg shadow-[#EE6F35]/25 active:scale-95 transition flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Controls (Editor) */}
        <div className={`lg:col-span-7 flex flex-col gap-6 ${mobileView === 'preview' ? 'hidden lg:flex' : 'flex'}`}>
          
          {/* Studio Navigation Tabs (Inspired by feds-lol & guns.lol) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/5 no-scrollbar">
            {[
              { id: 'profile', label: 'Profile & Info', icon: User },
              { id: 'appearance', label: 'Appearance', icon: Palette },
              { id: 'links', label: 'Links', icon: LinkIcon },
              { id: 'effects', label: 'Effects & Media', icon: Sparkles },
              { id: 'audio', label: 'Audio & Splash', icon: Music },
              { id: 'discord', label: 'Discord Sync', icon: DiscordIcon },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive 
                      ? 'bg-[#EE6F35] text-white shadow-md shadow-[#EE6F35]/25' 
                      : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: PROFILE & INFO */}
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-5 rounded-3xl bg-neutral-900/60 border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-[#EE6F35]" />
                  <span>General Information</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-white/70 block mb-1">Display Name</label>
                    <input
                      type="text"
                      value={profile.displayName || ''}
                      onChange={(e) => setProfile(prev => ({ ...prev, displayName: e.target.value }))}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-[#EE6F35]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-white/70 block mb-1">Username Handle</label>
                    <input
                      type="text"
                      value={profile.username || ''}
                      disabled
                      className="w-full bg-black/30 border border-white/5 rounded-xl px-3.5 py-2 text-xs text-white/50 font-mono cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Location & Occupation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-white/70 block mb-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#EE6F35]" />
                      <span>Location</span>
                    </label>
                    <input
                      type="text"
                      value={profile.location || ''}
                      onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="e.g. Tokyo, Japan"
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-[#EE6F35]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-white/70 block mb-1 flex items-center gap-1">
                      <Briefcase className="w-3 h-3 text-[#EE6F35]" />
                      <span>Occupation / Title</span>
                    </label>
                    <input
                      type="text"
                      value={profile.occupation || ''}
                      onChange={(e) => setProfile(prev => ({ ...prev, occupation: e.target.value }))}
                      placeholder="e.g. Designer & Developer"
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-[#EE6F35]"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="text-xs font-medium text-white/70 block mb-1">Bio Description</label>
                  <textarea
                    rows={3}
                    value={profile.bio || ''}
                    onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell visitors about yourself..."
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-[#EE6F35] resize-none"
                  />
                </div>

                {/* Typewriter toggle */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <div>
                    <span className="text-xs font-medium text-white block">Typewriter Bio Animation</span>
                    <span className="text-[11px] text-white/40">Types out your bio when visitors open your link</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={Boolean(theme.typewriterBio)}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      theme: { ...prev.theme, typewriterBio: e.target.checked }
                    }))}
                    className="w-4 h-4 accent-[#EE6F35] cursor-pointer"
                  />
                </div>
              </div>

              {/* Tags Section */}
              <div className="p-5 rounded-3xl bg-neutral-900/60 border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#EE6F35]" />
                  <span>Profile Tags</span>
                </h3>

                <form onSubmit={handleAddTag} className="flex gap-2">
                  <input
                    type="text"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    placeholder="Add a tag (e.g. Producer, Developer, Gamer)"
                    className="flex-1 bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-[#EE6F35]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold"
                  >
                    Add
                  </button>
                </form>

                <div className="flex flex-wrap gap-2">
                  {(profile.tags || []).map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/90 flex items-center gap-1.5"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-white/40 hover:text-white"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Badges Section */}
              <div className="p-5 rounded-3xl bg-neutral-900/60 border border-white/10 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#EE6F35]" />
                  <span>Profile Badges</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  {[
                    { id: 'verified', label: 'Verified Badge', color: 'text-[#EE6F35]' },
                    { id: 'early', label: 'Early Supporter', color: 'text-amber-400' },
                    { id: 'owner', label: 'Owner / Staff', color: 'text-purple-400' },
                  ].map(b => {
                    const active = (profile.badges || []).includes(b.id);
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => handleToggleBadge(b.id)}
                        className={`p-3 rounded-2xl border text-xs font-semibold flex items-center justify-between transition ${
                          active 
                            ? 'bg-[#EE6F35]/10 border-[#EE6F35]/50 text-white' 
                            : 'bg-black/40 border-white/5 text-white/40 hover:text-white/80'
                        }`}
                      >
                        <span className={active ? b.color : ''}>{b.label}</span>
                        {active && <Check className="w-3.5 h-3.5 text-[#EE6F35]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: APPEARANCE (FEDS-LOL / GUNS-LOL STYLE) */}
          {activeTab === 'appearance' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Avatar Shape & Decorations */}
              <div className="p-5 rounded-3xl bg-neutral-900/60 border border-white/10 space-y-5">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Palette className="w-4 h-4 text-[#EE6F35]" />
                  <span>Avatar Shape & Decorations</span>
                </h3>

                {/* Avatar URL */}
                <div>
                  <label className="text-xs font-medium text-white/70 block mb-1">Avatar Image URL</label>
                  <input
                    type="url"
                    value={profile.avatarUrl || ''}
                    onChange={(e) => setProfile(prev => ({ ...prev, avatarUrl: e.target.value }))}
                    placeholder="https://..."
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-[#EE6F35]"
                  />
                </div>

                {/* Shapes */}
                <div>
                  <label className="text-xs font-medium text-white/70 block mb-2">Avatar Border Shape</label>
                  <div className="grid grid-cols-4 gap-2.5">
                    {[
                      { id: 'circle', label: 'Circle' },
                      { id: 'soft', label: 'Soft' },
                      { id: 'rounded', label: 'Rounded' },
                      { id: 'square', label: 'Square' },
                    ].map(shape => (
                      <button
                        key={shape.id}
                        type="button"
                        onClick={() => setProfile(prev => ({ ...prev, avatarShape: shape.id }))}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold transition ${
                          (profile.avatarShape || 'soft') === shape.id
                            ? 'bg-[#EE6F35] border-[#EE6F35] text-white shadow-md shadow-[#EE6F35]/25'
                            : 'bg-black/50 border-white/5 text-white/60 hover:text-white'
                        }`}
                      >
                        {shape.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Avatar Decoration Frame */}
                <div>
                  <label className="text-xs font-medium text-white/70 block mb-2">Avatar Frame / Decoration</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { id: 'none', label: 'None' },
                      { id: 'halo', label: 'Neon Halo' },
                      { id: 'cyber-orange', label: 'Cyber Tech' },
                      { id: 'wings', label: 'Angel Wings' },
                      { id: 'horns', label: 'Demon Horns' },
                      { id: 'void', label: 'Void Vortex' },
                      { id: 'orbit', label: 'Star Orbit' },
                      { id: 'fire', label: 'Fiery Blaze' },
                    ].map(dec => (
                      <button
                        key={dec.id}
                        type="button"
                        onClick={() => setProfile(prev => ({ ...prev, avatarDecoration: dec.id }))}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition ${
                          (profile.avatarDecoration || 'none') === dec.id
                            ? 'bg-[#EE6F35] border-[#EE6F35] text-white shadow-md shadow-[#EE6F35]/25'
                            : 'bg-black/50 border-white/5 text-white/60 hover:text-white'
                        }`}
                      >
                        {dec.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Decoration Hue Slider */}
                {profile.avatarDecoration && profile.avatarDecoration !== 'none' && (
                  <div>
                    <div className="flex items-center justify-between text-xs text-white/70 mb-1.5">
                      <span>Decoration Color Hue</span>
                      <span className="font-mono text-[#EE6F35]">{profile.avatarDecorationHue || 0}°</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={360}
                      value={profile.avatarDecorationHue || 0}
                      onChange={(e) => setProfile(prev => ({ ...prev, avatarDecorationHue: Number(e.target.value) }))}
                      className="w-full accent-[#EE6F35] cursor-pointer"
                    />
                  </div>
                )}
              </div>

              {/* Card Container Customization */}
              <div className="p-5 rounded-3xl bg-neutral-900/60 border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#EE6F35]" />
                  <span>Card Container Styling</span>
                </h3>

                {/* 3D Tilt Card Toggle */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-black/40 border border-white/5">
                  <div>
                    <span className="text-xs font-semibold text-white block">3D Parallax Tilt Effect</span>
                    <span className="text-[11px] text-white/40">Smooth 3D tilting following cursor and motion</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={theme.tilt ?? true}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      theme: { ...prev.theme, tilt: e.target.checked }
                    }))}
                    className="w-4 h-4 accent-[#EE6F35] cursor-pointer"
                  />
                </div>

                {/* Card Background Blur Slider */}
                <div>
                  <div className="flex items-center justify-between text-xs text-white/70 mb-1">
                    <span>Card Glass Blur</span>
                    <span className="font-mono text-[#EE6F35]">{theme.cardBlur ?? 20}px</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={40}
                    value={theme.cardBlur ?? 20}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      theme: { ...prev.theme, cardBlur: Number(e.target.value) }
                    }))}
                    className="w-full accent-[#EE6F35] cursor-pointer"
                  />
                </div>

                {/* Card Border Radius */}
                <div>
                  <label className="text-xs font-medium text-white/70 block mb-2">Card Corner Radius</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[16, 22, 28, 36].map(radius => (
                      <button
                        key={radius}
                        type="button"
                        onClick={() => setProfile(prev => ({
                          ...prev,
                          theme: { ...prev.theme, cardRadius: radius }
                        }))}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold transition ${
                          (theme.cardRadius || 28) === radius
                            ? 'bg-[#EE6F35] border-[#EE6F35] text-white'
                            : 'bg-black/50 border-white/5 text-white/60 hover:text-white'
                        }`}
                      >
                        {radius}px
                      </button>
                    ))}
                  </div>
                </div>

                {/* Glow Intensity */}
                <div>
                  <label className="text-xs font-medium text-white/70 block mb-2">Glow Ambience</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['low', 'medium', 'high'].map(glow => (
                      <button
                        key={glow}
                        type="button"
                        onClick={() => setProfile(prev => ({
                          ...prev,
                          theme: { ...prev.theme, glowIntensity: glow }
                        }))}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold capitalize transition ${
                          (theme.glowIntensity || 'medium') === glow
                            ? 'bg-[#EE6F35] border-[#EE6F35] text-white'
                            : 'bg-black/50 border-white/5 text-white/60 hover:text-white'
                        }`}
                      >
                        {glow}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 3: LINKS & SOCIALS */}
          {activeTab === 'links' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Add New Link Card */}
              <div className="p-5 rounded-3xl bg-neutral-900/60 border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#EE6F35]" />
                  <span>Add New Link</span>
                </h3>

                <form onSubmit={handleAddLink} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-white/70 block mb-1">Title / Label</label>
                      <input
                        type="text"
                        value={newLinkTitle}
                        onChange={(e) => setNewLinkTitle(e.target.value)}
                        placeholder="e.g. My Spotify Playlist"
                        className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-[#EE6F35]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-white/70 block mb-1">Platform Icon</label>
                      <select
                        value={newLinkIcon}
                        onChange={(e) => setNewLinkIcon(e.target.value)}
                        className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-[#EE6F35]"
                      >
                        <option value="globe">Custom Website</option>
                        <option value="spotify">Spotify</option>
                        <option value="discord">Discord</option>
                        <option value="github">GitHub</option>
                        <option value="instagram">Instagram</option>
                        <option value="youtube">YouTube</option>
                        <option value="twitter">X (Twitter)</option>
                        <option value="tiktok">TikTok</option>
                        <option value="telegram">Telegram</option>
                        <option value="twitch">Twitch</option>
                        <option value="kick">Kick</option>
                        <option value="steam">Steam</option>
                        <option value="soundcloud">Soundcloud</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-white/70 block mb-1">Destination URL</label>
                    <input
                      type="text"
                      value={newLinkUrl}
                      onChange={(e) => setNewLinkUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-[#EE6F35]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-[#EE6F35] hover:bg-[#d95e26] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-[#EE6F35]/25"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add to Card</span>
                  </button>
                </form>
              </div>

              {/* Current Links List */}
              <div className="p-5 rounded-3xl bg-neutral-900/60 border border-white/10 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center justify-between">
                  <span>Current Links ({(profile.links || []).length})</span>
                </h3>

                <div className="space-y-2">
                  {(profile.links || []).map((link, index) => (
                    <div
                      key={link.id}
                      className="p-3 rounded-2xl bg-black/50 border border-white/5 flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex flex-col gap-0.5">
                          <button
                            type="button"
                            onClick={() => handleMoveLink(index, 'up')}
                            disabled={index === 0}
                            className="text-white/30 hover:text-white disabled:opacity-20"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveLink(index, 'down')}
                            disabled={index === (profile.links || []).length - 1}
                            className="text-white/30 hover:text-white disabled:opacity-20"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-white truncate">{link.title}</p>
                          <p className="text-[11px] text-white/40 truncate">{link.url}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] font-mono text-white/40">{link.clicks || 0} clicks</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveLink(link.id)}
                          className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: EFFECTS & MEDIA */}
          {activeTab === 'effects' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-5 rounded-3xl bg-neutral-900/60 border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#EE6F35]" />
                  <span>Background Atmosphere</span>
                </h3>

                <div>
                  <label className="text-xs font-medium text-white/70 block mb-2">Particle Effect</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { id: 'stars', label: 'Starfield' },
                      { id: 'rain', label: 'Rain' },
                      { id: 'grid', label: 'Cyber Grid' },
                      { id: 'none', label: 'Clean Void' },
                    ].map(eff => (
                      <button
                        key={eff.id}
                        type="button"
                        onClick={() => setProfile(prev => ({
                          ...prev,
                          theme: { ...prev.theme, backgroundEffect: eff.id }
                        }))}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition ${
                          (theme.backgroundEffect || 'stars') === eff.id
                            ? 'bg-[#EE6F35] border-[#EE6F35] text-white'
                            : 'bg-black/50 border-white/5 text-white/60 hover:text-white'
                        }`}
                      >
                        {eff.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-white/70 block mb-1">Banner Image URL</label>
                  <input
                    type="url"
                    value={profile.bannerUrl || ''}
                    onChange={(e) => setProfile(prev => ({ ...prev, bannerUrl: e.target.value }))}
                    placeholder="https://..."
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-[#EE6F35]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: AUDIO & SPLASH */}
          {activeTab === 'audio' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-5 rounded-3xl bg-neutral-900/60 border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Music className="w-4 h-4 text-[#EE6F35]" />
                  <span>Background Audio & Splash</span>
                </h3>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-black/40 border border-white/5">
                  <div>
                    <span className="text-xs font-semibold text-white block">Autoplay on Enter</span>
                    <span className="text-[11px] text-white/40">Plays audio when visitors click anywhere to enter</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={Boolean(profile.audio?.enabled)}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      audio: { ...prev.audio, enabled: e.target.checked }
                    }))}
                    className="w-4 h-4 accent-[#EE6F35] cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-white/70 block mb-1">Song Title</label>
                    <input
                      type="text"
                      value={profile.audio?.title || ''}
                      onChange={(e) => setProfile(prev => ({
                        ...prev,
                        audio: { ...prev.audio, title: e.target.value }
                      }))}
                      placeholder="e.g. After Dark"
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-[#EE6F35]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-white/70 block mb-1">Artist Name</label>
                    <input
                      type="text"
                      value={profile.audio?.artist || ''}
                      onChange={(e) => setProfile(prev => ({
                        ...prev,
                        audio: { ...prev.audio, artist: e.target.value }
                      }))}
                      placeholder="e.g. Mr.Kitty"
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-[#EE6F35]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-white/70 block mb-1">Audio Stream URL (.mp3)</label>
                  <input
                    type="url"
                    value={profile.audio?.url || ''}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      audio: { ...prev.audio, url: e.target.value }
                    }))}
                    placeholder="https://.../song.mp3"
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-[#EE6F35]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: DISCORD SYNC */}
          {activeTab === 'discord' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-5 rounded-3xl bg-neutral-900/60 border border-white/10 space-y-4">
                <div className="flex items-center gap-2">
                  <DiscordIcon className="w-5 h-5 text-[#5865F2]" />
                  <h3 className="text-sm font-bold text-white">Automated Discord Synchronization</h3>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#5865F2]/10 border border-[#5865F2]/25 space-y-1 text-xs">
                  <span className="font-bold text-[#5865F2] uppercase text-[10px] tracking-wider block">
                    ✦ Zero Bot Commands Needed
                  </span>
                  <p className="text-white/70 text-[11px] leading-relaxed">
                    Users never need to type <code className="text-white bg-black/40 px-1 py-0.5 rounded">/claim</code> or commands.
                    When someone authorizes with Discord, the bot automatically pulls them into your support server and syncs their status dot and Spotify widget.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-medium text-white/70 block mb-1">Connected Discord ID</label>
                  <input
                    type="text"
                    value={profile.discordId || ''}
                    onChange={(e) => setProfile(prev => ({ ...prev, discordId: e.target.value }))}
                    placeholder="e.g. 712345678901234567"
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white font-mono outline-none focus:border-[#5865F2]"
                  />
                </div>

                <div className="pt-2 border-t border-white/5 space-y-2">
                  <span className="text-xs font-semibold text-white block">Status Dot Simulation</span>
                  <div className="grid grid-cols-3 gap-2">
                    {['online', 'idle', 'dnd'].map(status => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setProfile(prev => ({
                          ...prev,
                          discordStatus: { ...prev.discordStatus, status }
                        }))}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold capitalize transition ${
                          profile.discordStatus?.status === status
                            ? 'bg-[#5865F2] border-[#5865F2] text-white'
                            : 'bg-black/50 border-white/5 text-white/60 hover:text-white'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Live Phone Mockup Preview */}
        <div className={`lg:col-span-5 flex flex-col items-center sticky top-24 ${mobileView === 'editor' ? 'hidden lg:flex' : 'flex'}`}>
          <div className="w-full flex items-center justify-between mb-3 px-2">
            <span className="text-xs font-semibold text-white/60 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Card
            </span>
            <span className="text-[11px] font-mono text-white/40">whose.baby/{profile.username}</span>
          </div>

          {/* Interactive Card Render */}
          <div className="w-full flex justify-center transform-gpu">
            <ProfileCard profile={profile} isPreview={true} />
          </div>
        </div>

      </div>
    </div>
  );
}
