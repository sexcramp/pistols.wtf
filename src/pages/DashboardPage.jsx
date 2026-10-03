import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  ExternalLink, 
  Eye, 
  Hash, 
  User, 
  Tag, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Palette, 
  Link as LinkIcon, 
  Shield, 
  Puzzle, 
  Music, 
  Settings, 
  Folder, 
  Dices, 
  HelpCircle, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit3, 
  Sliders, 
  Save, 
  Check, 
  MapPin, 
  Briefcase, 
  Layers, 
  Wand2, 
  EyeOff, 
  GripVertical,
  Radio,
  Clock,
  Sun,
  Calendar,
  Gamepad2,
  Tv,
  RadioTower,
  Volume2
} from 'lucide-react';
import ProfileCard, { SpiderwebIcon } from '../components/ProfileCard';
import { 
  DiscordIcon, 
  SpotifyIcon, 
  GithubIcon, 
  YoutubeIcon, 
  TwitchIcon, 
  SteamIcon, 
  SoundcloudIcon 
} from '../components/Icons';
import { getProfileByUsername, saveProfile } from '../utils/storage';

export default function DashboardPage({ initialUsername = 'bloodare', onNavigate }) {
  // Navigation State
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState('customize'); // 'overview', 'customize', 'settings', 'templates'
  const [customizeSubTab, setCustomizeSubTab] = useState('profile'); // 'profile', 'appearance', 'links', 'badges', 'widgets', 'tracks'
  const [previewOpen, setPreviewOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Profile State
  const [profile, setProfile] = useState(() => getProfileByUsername(initialUsername));

  // Modals & Forms
  const [showAddLinkModal, setShowAddLinkModal] = useState(false);
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkIcon, setNewLinkIcon] = useState('globe');

  const [showAddTrackModal, setShowAddTrackModal] = useState(false);
  const [newTrackTitle, setNewTrackTitle] = useState('');
  const [newTrackArtist, setNewTrackArtist] = useState('');
  const [newTrackUrl, setNewTrackUrl] = useState('');

  // Badges Sub-Filter
  const [badgeFilter, setBadgeFilter] = useState('owned'); // 'owned', 'other'

  // Giveaways Sub-Filter
  const [giveawayFilter, setGiveawayFilter] = useState('active'); // 'active', 'winners'

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = () => {
    saveProfile(profile);
    showToast('Changes saved successfully! ✦');
  };

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
    setShowAddLinkModal(false);
    showToast('Link added to profile!');
  };

  const handleAddTrack = (e) => {
    e.preventDefault();
    if (!newTrackTitle || !newTrackUrl) return;

    setProfile(prev => ({
      ...prev,
      audio: {
        enabled: true,
        title: newTrackTitle,
        artist: newTrackArtist || 'Unknown Artist',
        url: newTrackUrl,
      }
    }));

    setShowAddTrackModal(false);
    showToast('Track added to profile!');
  };

  const handleAddWidget = (widgetKey, widgetTitle) => {
    const existing = profile.widgets || [];
    if (existing.some(w => w.key === widgetKey)) {
      showToast(`${widgetTitle} widget is already added!`);
      return;
    }

    setProfile(prev => ({
      ...prev,
      widgets: [...existing, { key: widgetKey, title: widgetTitle, id: Date.now().toString() }]
    }));
    showToast(`Added ${widgetTitle} widget!`);
  };

  const theme = profile.theme || {};

  return (
    <div className="min-h-screen bg-[#08080a] text-white selection:bg-[#EE6F35] font-sans pb-24">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 px-4 py-3 rounded-2xl border border-[#EE6F35]/40 bg-black/95 shadow-2xl flex items-center gap-2 text-xs font-semibold text-white animate-in slide-in-from-top duration-300">
          <Sparkles className="w-4 h-4 text-[#EE6F35]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 1. TOP HEADER BAR (EXACT MATCH Screenshot 194845 / 195229)    */}
      {/* ------------------------------------------------------------- */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-[#0a0a0d]/95 backdrop-blur-md border-b border-white/[0.06] z-40 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Hamburger button (2 horizontal bars) */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-9 h-9 rounded-xl flex flex-col justify-center items-center gap-1.5 text-white/70 hover:text-white hover:bg-white/5 active:scale-95 transition"
            aria-label="Open Navigation Drawer"
          >
            <span className="w-4 h-[2px] bg-current rounded-full" />
            <span className="w-4 h-[2px] bg-current rounded-full" />
          </button>

          {/* Section Icon & Title */}
          <div className="flex items-center gap-2">
            {currentSection === 'overview' ? (
              <>
                <Layers className="w-4 h-4 text-purple-400" />
                <span className="text-[15px] font-semibold text-white tracking-tight">Overview</span>
              </>
            ) : (
              <>
                <Palette className="w-4 h-4 text-[#5865F2]" />
                <span className="text-[15px] font-semibold text-white tracking-tight">Customize</span>
              </>
            )}
          </div>
        </div>

        {/* Right Action: View Profile Pill Button */}
        <button
          onClick={() => onNavigate('bio', profile.username)}
          className="px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-medium text-white/90 hover:text-white flex items-center gap-1.5 transition active:scale-95"
        >
          <ExternalLink className="w-3.5 h-3.5 text-white/60" />
          <span>View Profile</span>
        </button>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* 2. SIDEBAR DRAWER OVERLAY (Screenshot_20261003_194922_Chrome) */}
      {/* ------------------------------------------------------------- */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Content */}
          <div className="relative w-[280px] sm:w-[320px] max-w-[85vw] h-full bg-[#0d0d10] border-r border-white/10 flex flex-col justify-between p-4 z-10 overflow-y-auto animate-in slide-in-from-left duration-250">
            <div>
              {/* Brand Header */}
              <div className="flex items-center justify-between px-2 pt-2 pb-5 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <img src="/logo.png" alt="logo" className="w-5 h-5 object-contain" />
                  </div>
                  <span className="font-bold text-[17px] text-white tracking-tight">
                    whose<span className="text-[#EE6F35]">.</span>baby
                  </span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* SECTION: Dashboard */}
              <div className="mt-4 mb-4">
                <p className="px-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                  Dashboard
                </p>
                <button
                  onClick={() => {
                    setCurrentSection('overview');
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    currentSection === 'overview'
                      ? 'bg-[#1b1b2f] text-white border-l-2 border-[#5865F2]'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Layers className="w-4 h-4 text-[#5865F2]" />
                  <span>Overview</span>
                </button>
              </div>

              {/* SECTION: Customize */}
              <div className="mb-4">
                <p className="px-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                  Customize
                </p>
                <div className="space-y-0.5">
                  {[
                    { id: 'profile', label: 'Profile', icon: User },
                    { id: 'appearance', label: 'Appearance', icon: Palette },
                    { id: 'links', label: 'Links', icon: LinkIcon },
                    { id: 'badges', label: 'Badges', icon: Shield },
                    { id: 'widgets', label: 'Widgets', icon: Puzzle },
                    { id: 'tracks', label: 'Tracks', icon: Music },
                  ].map(tab => {
                    const Icon = tab.icon;
                    const isActive = currentSection === 'customize' && customizeSubTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setCurrentSection('customize');
                          setCustomizeSubTab(tab.id);
                          setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                          isActive
                            ? 'bg-[#1b1b2f] text-white font-semibold border-l-2 border-[#5865F2]'
                            : 'text-white/60 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Icon className="w-4 h-4 text-white/70" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION: Manage */}
              <div className="mb-4">
                <p className="px-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                  Manage
                </p>
                <div className="space-y-0.5">
                  <button
                    onClick={() => {
                      setCurrentSection('settings');
                      setSidebarOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-white/60 hover:text-white hover:bg-white/5 transition"
                  >
                    <Settings className="w-4 h-4 text-white/70" />
                    <span>Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      setCurrentSection('templates');
                      setSidebarOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-white/60 hover:text-white hover:bg-white/5 transition"
                  >
                    <Folder className="w-4 h-4 text-white/70" />
                    <span>Templates</span>
                  </button>
                </div>
              </div>

              {/* SECTION: Resources */}
              <div className="mb-4">
                <p className="px-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                  Resources
                </p>
                <div className="space-y-0.5">
                  <a
                    href="https://discord.gg"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-white/60 hover:text-white hover:bg-white/5 transition"
                  >
                    <DiscordIcon className="w-4 h-4 text-[#5865F2]" />
                    <span>Discord Support</span>
                  </a>
                  <button
                    onClick={() => showToast('Help & documentation: whose.baby/docs')}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-white/60 hover:text-white hover:bg-white/5 transition"
                  >
                    <HelpCircle className="w-4 h-4 text-white/70" />
                    <span>Help</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom User Capsule (Screenshot 1:1) */}
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-white/70" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate">
                    {profile.displayName || profile.username}
                  </p>
                  <p className="text-[10px] font-mono text-white/40 truncate">
                    UID {profile.uid || '545,701,376'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('home')}
                className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="pt-20 px-4 max-w-xl mx-auto">
        
        {/* ========================================================= */}
        {/* VIEW 1: OVERVIEW PAGE (Screenshot_20261003_194845_Chrome) */}
        {/* ========================================================= */}
        {currentSection === 'overview' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* 1. Profile Views Card */}
            <div className="p-5 rounded-[26px] bg-[#121215] border border-white/[0.06] flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-black/50 border border-white/5 flex items-center justify-center text-white/60">
                <Eye className="w-5 h-5 text-white/70" />
              </div>
              <div>
                <p className="text-xl font-bold text-white tracking-tight">{profile.views ?? 0}</p>
                <p className="text-xs text-white/40">Profile Views</p>
              </div>
            </div>

            {/* 2. User ID Card */}
            <div className="p-5 rounded-[26px] bg-[#121215] border border-white/[0.06] flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-black/50 border border-white/5 flex items-center justify-center text-white/60">
                <Hash className="w-5 h-5 text-white/70" />
              </div>
              <div>
                <p className="text-xl font-bold text-white tracking-tight font-mono">
                  {profile.uid || '545,701,376'}
                </p>
                <p className="text-xs text-white/40">User ID</p>
              </div>
            </div>

            {/* 3. Username Card */}
            <div className="p-5 rounded-[26px] bg-[#121215] border border-white/[0.06] flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-black/50 border border-white/5 flex items-center justify-center text-white/60">
                <User className="w-5 h-5 text-white/70" />
              </div>
              <div>
                <p className="text-xl font-bold text-white tracking-tight">
                  {profile.username || 'bloodare'}
                </p>
                <p className="text-xs text-white/40">Username</p>
              </div>
            </div>

            {/* 4. Limited Badges Card (Screenshot 1:1) */}
            <div className="p-5 rounded-[26px] bg-[#121215] border border-white/[0.06] space-y-4">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-white/70" />
                <h3 className="text-sm font-bold text-white">Limited Badges</h3>
              </div>
              <p className="text-xs text-white/50 leading-relaxed">
                You've claimed all available limited badges. Check back later for more!
              </p>

              {/* Carousel Row */}
              <div className="flex items-center gap-2.5 py-1">
                <button className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50">
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Claimed Halloween Badge */}
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#352565]/80 border border-purple-500/40 text-xs font-semibold text-white shadow-md shadow-purple-900/30">
                  <Check className="w-3.5 h-3.5 text-purple-300" />
                  <SpiderwebIcon className="w-4 h-4 text-purple-300" />
                  <span>Halloween</span>
                </div>

                {/* Locked Mystery Badge */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/5 text-xs text-white/40">
                  <span>?</span>
                  <span>🦯</span>
                  <span>???</span>
                </div>

                <button className="w-8 h-8 rounded-full bg-[#5865F2] hover:bg-[#4752C4] flex items-center justify-center text-white ml-auto shadow-md">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div className="w-[10%] h-full bg-[#5865F2] rounded-full" />
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-white/40 font-mono">1 / 10 badges</span>
                </div>
              </div>
            </div>

            {/* 5. Join Discord / Casino Card */}
            <div className="p-5 rounded-[26px] bg-[#121215] border border-white/[0.06] space-y-3">
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#5865F2] flex items-center justify-center text-white shrink-0 shadow-lg shadow-[#5865F2]/25">
                  <DiscordIcon className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white">Join our Discord</p>
                  <p className="text-[11px] text-white/40 truncate">discord.gg/whosebaby</p>
                </div>
              </div>

              <button className="w-full py-3 px-4 rounded-2xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#5865F2]/20 active:scale-[0.98] transition">
                <DiscordIcon className="w-4 h-4 text-white" />
                <span>Connected to Discord</span>
              </button>

              <button 
                onClick={() => showToast('Casino rewards coming soon!')}
                className="w-full py-3 px-4 rounded-2xl bg-[#C88A1A] hover:bg-[#b07812] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition"
              >
                <Dices className="w-4 h-4 text-white" />
                <span>Go to Casino</span>
              </button>
            </div>

            {/* 6. Giveaways Card */}
            <div className="p-5 rounded-[26px] bg-[#121215] border border-white/[0.06] space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-white/70" />
                <h3 className="text-sm font-bold text-white">Giveaways</h3>
              </div>

              {/* Active / Winners Pill Tabs */}
              <div className="grid grid-cols-2 p-1 rounded-xl bg-black/50 border border-white/5 text-xs">
                <button
                  onClick={() => setGiveawayFilter('active')}
                  className={`py-1.5 rounded-lg font-semibold transition ${
                    giveawayFilter === 'active' ? 'bg-white/10 text-white' : 'text-white/40'
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setGiveawayFilter('winners')}
                  className={`py-1.5 rounded-lg font-semibold transition ${
                    giveawayFilter === 'winners' ? 'bg-white/10 text-white' : 'text-white/40'
                  }`}
                >
                  Winners
                </button>
              </div>

              <p className="text-xs text-white/40 py-2 text-center">
                No active giveaways yet. Please check back later.
              </p>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 2: CUSTOMIZE TABS (MATCHING SCREENSHOTS 3 TO 8)      */}
        {/* ========================================================= */}
        {currentSection === 'customize' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            
            {/* Subtabs Bar (Profile, Appearance, Links, Badges, Widgets, Tracks) */}
            <div className="flex items-center gap-6 overflow-x-auto border-b border-white/[0.08] pb-1 no-scrollbar text-xs font-semibold">
              {[
                { id: 'profile', label: 'Profile' },
                { id: 'appearance', label: 'Appearance' },
                { id: 'links', label: 'Links' },
                { id: 'badges', label: 'Badges' },
                { id: 'widgets', label: 'Widgets' },
                { id: 'tracks', label: 'Tracks' },
              ].map(sub => {
                const isActive = customizeSubTab === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setCustomizeSubTab(sub.id)}
                    className={`pb-2.5 relative whitespace-nowrap transition-colors ${
                      isActive ? 'text-white' : 'text-white/40 hover:text-white/70'
                    }`}
                  >
                    <span>{sub.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#5865F2] rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* ----------------------------------------------------- */}
            {/* SUBTAB: PROFILE (Screenshot_20261003_195229_Chrome)  */}
            {/* ----------------------------------------------------- */}
            {customizeSubTab === 'profile' && (
              <div className="space-y-6">
                {/* 1. Avatar Section */}
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-white/90 block">Avatar</label>
                  <div className="w-20 h-20 rounded-2xl bg-[#141418] border border-white/10 flex items-center justify-center text-white/50 overflow-hidden">
                    {profile.avatarUrl ? (
                      <img src={profile.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-white/40" />
                    )}
                  </div>
                  <button
                    onClick={() => {
                      const url = prompt('Enter your Avatar image URL:', profile.avatarUrl || '');
                      if (url !== null) {
                        setProfile(prev => ({ ...prev, avatarUrl: url.trim() }));
                        showToast('Avatar updated!');
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-semibold transition"
                  >
                    Change Avatar
                  </button>

                  {/* Avatar Shape */}
                  <div className="pt-2">
                    <label className="text-xs font-medium text-white/60 block mb-2">Avatar Shape</label>
                    <div className="grid grid-cols-4 gap-2">
                      {['Square', 'Soft', 'Rounded', 'Circle'].map(shape => {
                        const shapeKey = shape.toLowerCase();
                        const isSelected = (profile.avatarShape || 'rounded') === shapeKey;
                        return (
                          <button
                            key={shape}
                            onClick={() => setProfile(prev => ({ ...prev, avatarShape: shapeKey }))}
                            className={`py-2 rounded-xl border text-xs font-medium transition ${
                              isSelected
                                ? 'bg-[#1e1b4b] border-[#5865F2] text-white'
                                : 'bg-[#121215] border-white/5 text-white/60 hover:text-white'
                            }`}
                          >
                            {shape}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="h-[1px] bg-white/[0.06]" />

                {/* 2. Decoration */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/90 block">Decoration</label>
                  <button
                    onClick={() => {
                      const next = profile.avatarDecoration === 'halo' ? 'none' : 'halo';
                      setProfile(prev => ({ ...prev, avatarDecoration: next }));
                      showToast(`Avatar decoration: ${next}`);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-semibold transition"
                  >
                    Change Decoration
                  </button>
                </div>

                <div className="h-[1px] bg-white/[0.06]" />

                {/* 3. Background Color / Media */}
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-white/90 block">Background</label>
                  <div className="inline-flex p-1 rounded-xl bg-black/60 border border-white/5 text-xs">
                    <button className="px-4 py-1.5 rounded-lg bg-white/10 text-white font-medium">Color</button>
                    <button className="px-4 py-1.5 rounded-lg text-white/40 hover:text-white">Media</button>
                  </div>
                  <div className="w-16 h-8 rounded-xl bg-[#060608] border border-white/15 flex items-center justify-center cursor-pointer">
                    <Edit3 className="w-3.5 h-3.5 text-white/60" />
                  </div>
                  <p className="text-[11px] text-white/40">
                    Sets a solid background color. Any image/video background will be removed.
                  </p>
                </div>

                <div className="h-[1px] bg-white/[0.06]" />

                {/* 4. Banner */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/90 block">Banner</label>
                  <button
                    onClick={() => {
                      const url = prompt('Enter Banner image URL:', profile.bannerUrl || '');
                      if (url !== null) {
                        setProfile(prev => ({ ...prev, bannerUrl: url.trim() }));
                        showToast('Banner updated!');
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-semibold transition"
                  >
                    Change Banner
                  </button>
                </div>

                <div className="h-[1px] bg-white/[0.06]" />

                {/* 5. Display Name */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/90 block">Display Name</label>
                  <div className="rounded-xl bg-[#121215] border border-white/[0.08] px-3.5 py-2.5 flex items-center gap-2.5">
                    <User className="w-4 h-4 text-white/40 shrink-0" />
                    <input
                      type="text"
                      value={profile.displayName || ''}
                      onChange={(e) => setProfile(prev => ({ ...prev, displayName: e.target.value }))}
                      className="w-full bg-transparent border-none outline-none text-xs text-white"
                    />
                  </div>
                </div>

                {/* 6. Bio with Formatting Toolbar */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/90 block">Bio</label>
                  <div className="rounded-2xl bg-[#121215] border border-white/[0.08] overflow-hidden">
                    {/* Rich text button row (Screenshot 1:1) */}
                    <div className="flex flex-wrap items-center gap-1.5 p-2.5 border-b border-white/5 text-[11px] text-white/60 font-mono select-none">
                      <span className="px-1.5 py-0.5 rounded hover:bg-white/5 cursor-pointer">H1</span>
                      <span className="px-1.5 py-0.5 rounded hover:bg-white/5 cursor-pointer">H2</span>
                      <span className="px-1.5 py-0.5 rounded hover:bg-white/5 cursor-pointer">H3</span>
                      <span className="px-1.5 py-0.5 rounded hover:bg-white/5 font-bold cursor-pointer">B</span>
                      <span className="px-1.5 py-0.5 rounded hover:bg-white/5 italic cursor-pointer">I</span>
                      <span className="px-1.5 py-0.5 rounded hover:bg-white/5 underline cursor-pointer">U</span>
                      <span className="px-1.5 py-0.5 rounded hover:bg-white/5 line-through cursor-pointer">S</span>
                    </div>
                    <textarea
                      rows={3}
                      value={profile.bio || ''}
                      onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Write your bio..."
                      className="w-full p-3 bg-transparent border-none outline-none text-xs text-white placeholder-white/30 resize-none"
                    />
                  </div>
                </div>

                {/* 7. Occupation */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/90 block">Occupation</label>
                  <div className="rounded-xl bg-[#121215] border border-white/[0.08] px-3.5 py-2.5 flex items-center gap-2.5">
                    <Briefcase className="w-4 h-4 text-white/40 shrink-0" />
                    <input
                      type="text"
                      value={profile.occupation || ''}
                      onChange={(e) => setProfile(prev => ({ ...prev, occupation: e.target.value }))}
                      placeholder="Your job or occupation"
                      className="w-full bg-transparent border-none outline-none text-xs text-white placeholder-white/30"
                    />
                  </div>
                </div>

                {/* 8. Location */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/90 block">Location</label>
                  <div className="rounded-xl bg-[#121215] border border-white/[0.08] px-3.5 py-2.5 flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-white/40 shrink-0" />
                    <input
                      type="text"
                      value={profile.location || ''}
                      onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Your location"
                      className="w-full bg-transparent border-none outline-none text-xs text-white placeholder-white/30"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------- */}
            {/* SUBTAB: APPEARANCE (Screenshot_20261003_195256_Chrome)*/}
            {/* ----------------------------------------------------- */}
            {customizeSubTab === 'appearance' && (
              <div className="space-y-6">
                {/* Section: Layout */}
                <div className="p-5 rounded-[26px] bg-[#121215] border border-white/[0.06] space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-white/70" />
                      <h3 className="text-sm font-bold text-white">Layout</h3>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/50">
                      <span>Advanced</span>
                      <div className="w-8 h-4 rounded-full bg-white/10 p-0.5 cursor-pointer">
                        <div className="w-3 h-3 rounded-full bg-white/40" />
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-white/50">
                    Customize the layout settings for your profile.
                  </p>

                  {/* 1. Floating Avatar Card Illustration */}
                  <div
                    onClick={() => {
                      setProfile(prev => ({ ...prev, theme: { ...prev.theme, layout: 'floating' } }));
                      showToast('Layout set to Floating Avatar');
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition text-center ${
                      (theme.layout || 'floating') === 'floating'
                        ? 'bg-[#171728] border-[#5865F2] shadow-lg shadow-[#5865F2]/20'
                        : 'bg-black/40 border-white/5 hover:border-white/10'
                    }`}
                  >
                    <p className="text-xs font-semibold text-white/90 mb-3">Floating Avatar</p>
                    <div className="w-40 h-20 mx-auto rounded-xl bg-white/10 relative flex flex-col items-center justify-center p-2">
                      <div className="w-7 h-7 rounded-full bg-white/40 absolute -top-3 shadow-md" />
                      <div className="w-16 h-1.5 rounded-full bg-white/20 mt-4 mb-2" />
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-white/25" />
                        <div className="w-2 h-2 rounded-full bg-white/25" />
                        <div className="w-2 h-2 rounded-full bg-white/25" />
                      </div>
                    </div>
                  </div>

                  {/* 2. Stacked Card Illustration */}
                  <div
                    onClick={() => {
                      setProfile(prev => ({ ...prev, theme: { ...prev.theme, layout: 'stacked' } }));
                      showToast('Layout set to Stacked');
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition text-center ${
                      theme.layout === 'stacked'
                        ? 'bg-[#171728] border-[#5865F2] shadow-lg shadow-[#5865F2]/20'
                        : 'bg-black/40 border-white/5 hover:border-white/10'
                    }`}
                  >
                    <p className="text-xs font-semibold text-white/90 mb-3">Stacked</p>
                    <div className="w-40 h-20 mx-auto rounded-xl bg-white/10 relative p-3">
                      <div className="w-6 h-6 rounded-full bg-white/40 mb-2" />
                      <div className="w-20 h-1.5 rounded-full bg-white/20 mb-2" />
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-white/25" />
                        <div className="w-2 h-2 rounded-full bg-white/25" />
                      </div>
                    </div>
                  </div>

                  {/* 3. Compact Row Card Illustration */}
                  <div
                    onClick={() => {
                      setProfile(prev => ({ ...prev, theme: { ...prev.theme, layout: 'compact' } }));
                      showToast('Layout set to Compact Row');
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition text-center ${
                      theme.layout === 'compact'
                        ? 'bg-[#171728] border-[#5865F2] shadow-lg shadow-[#5865F2]/20'
                        : 'bg-black/40 border-white/5 hover:border-white/10'
                    }`}
                  >
                    <p className="text-xs font-semibold text-white/90 mb-3">Compact Row</p>
                    <div className="w-40 h-16 mx-auto rounded-xl bg-white/10 flex items-center gap-3 p-3">
                      <div className="w-6 h-6 rounded-full bg-white/40 shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <div className="w-16 h-1.5 rounded-full bg-white/30" />
                        <div className="w-10 h-1 rounded-full bg-white/20" />
                      </div>
                    </div>
                  </div>

                  {/* Save Layout Button */}
                  <button
                    onClick={handleSave}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#5865F2] to-[#7c3aed] text-white font-semibold text-xs shadow-lg shadow-[#5865F2]/25 active:scale-[0.98] transition"
                  >
                    Save
                  </button>
                </div>

                {/* Section: Profile Card Presets */}
                <div className="p-5 rounded-[26px] bg-[#121215] border border-white/[0.06] space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Palette className="w-4 h-4 text-white/70" />
                      <h3 className="text-sm font-bold text-white">Profile Card</h3>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/50">
                      <span>Advanced</span>
                      <div className="w-8 h-4 rounded-full bg-white/10 p-0.5 cursor-pointer">
                        <div className="w-3 h-3 rounded-full bg-white/40" />
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-white/50">
                    This is the center piece of your profile. Most of your profile elements will be built around it.
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'classic', label: 'classic' },
                      { id: 'frosted-square', label: 'frosted square' },
                      { id: 'frosted-soft', label: 'frosted soft' },
                      { id: 'outlined', label: 'outlined' },
                    ].map(card => {
                      const isSelected = (theme.cardTemplate || 'classic') === card.id;
                      return (
                        <div
                          key={card.id}
                          onClick={() => {
                            setProfile(prev => ({ ...prev, theme: { ...prev.theme, cardTemplate: card.id } }));
                            showToast(`Card style: ${card.label}`);
                          }}
                          className={`p-3 rounded-2xl border text-center cursor-pointer transition ${
                            isSelected
                              ? 'bg-[#1b1b2d] border-[#5865F2]'
                              : 'bg-black/40 border-white/5 hover:border-white/10'
                          }`}
                        >
                          <div className="h-16 rounded-xl bg-white/[0.06] flex items-center justify-center mb-2">
                            <span className="text-[10px] font-mono text-white/40">👁 0</span>
                          </div>
                          <span className="text-xs font-medium text-white/80">{card.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------- */}
            {/* SUBTAB: LINKS (Screenshot_20261003_195310_Chrome)    */}
            {/* ----------------------------------------------------- */}
            {customizeSubTab === 'links' && (
              <div className="space-y-4">
                {/* Action Buttons: Customize & Add Link */}
                <div className="flex items-center justify-end gap-2.5">
                  <button 
                    onClick={() => showToast('Link appearance customizer')}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white flex items-center gap-1.5 transition"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Customize</span>
                  </button>
                  <button 
                    onClick={() => setShowAddLinkModal(true)}
                    className="px-4 py-2 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-[#5865F2]/25 active:scale-95 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Link</span>
                  </button>
                </div>

                {/* Links Container */}
                <div className="p-8 rounded-[26px] bg-[#121215] border border-white/[0.06] text-center space-y-4">
                  {(profile.links || []).length === 0 ? (
                    <>
                      {/* Skeleton Links Illustration (Screenshot 1:1) */}
                      <div className="w-48 mx-auto space-y-2 py-3 opacity-25">
                        <div className="h-7 rounded-xl bg-white/15 flex items-center px-3 gap-2">
                          <div className="w-3 h-3 rounded-full bg-white/30" />
                          <div className="w-16 h-1.5 rounded-full bg-white/30" />
                        </div>
                        <div className="h-7 rounded-xl bg-white/15 flex items-center px-3 gap-2">
                          <div className="w-3 h-3 rounded-full bg-white/30" />
                          <div className="w-20 h-1.5 rounded-full bg-white/30" />
                        </div>
                      </div>

                      <h4 className="text-sm font-bold text-white">No Links Found</h4>
                      <p className="text-xs text-white/50">
                        Create your first link to get started.
                      </p>

                      <button
                        onClick={() => setShowAddLinkModal(true)}
                        className="px-5 py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-lg shadow-[#5865F2]/20"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Link</span>
                      </button>
                    </>
                  ) : (
                    <div className="space-y-2 text-left">
                      {(profile.links || []).map(link => (
                        <div key={link.id} className="p-3 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between">
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-white truncate">{link.title}</p>
                            <p className="text-[11px] text-white/40 truncate">{link.url}</p>
                          </div>
                          <button
                            onClick={() => {
                              setProfile(prev => ({ ...prev, links: prev.links.filter(l => l.id !== link.id) }));
                              showToast('Link removed');
                            }}
                            className="text-red-400 p-1 hover:bg-red-500/10 rounded-lg transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ----------------------------------------------------- */}
            {/* SUBTAB: BADGES (Screenshot_20261003_195315_Chrome)   */}
            {/* ----------------------------------------------------- */}
            {customizeSubTab === 'badges' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  {/* Owned / Other Pill Filters */}
                  <div className="inline-flex p-1 rounded-xl bg-black/60 border border-white/5 text-xs">
                    <button
                      onClick={() => setBadgeFilter('owned')}
                      className={`px-4 py-1.5 rounded-lg font-medium transition ${
                        badgeFilter === 'owned' ? 'bg-white/10 text-white' : 'text-white/40'
                      }`}
                    >
                      Owned
                    </button>
                    <button
                      onClick={() => setBadgeFilter('other')}
                      className={`px-4 py-1.5 rounded-lg font-medium transition ${
                        badgeFilter === 'other' ? 'bg-white/10 text-white' : 'text-white/40'
                      }`}
                    >
                      Other
                    </button>
                  </div>

                  <button 
                    onClick={() => showToast('Badge position & glow customization')}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white flex items-center gap-1.5 transition"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Customize</span>
                  </button>
                </div>

                {/* Badge Item (Screenshot 1:1) */}
                <div className="p-3.5 rounded-[22px] bg-[#121215] border border-white/[0.06] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-4 h-4 text-white/30 cursor-grab" />
                    
                    {/* Badge Icon box */}
                    <div className="w-9 h-9 rounded-xl bg-[#191629] border border-purple-500/30 flex items-center justify-center shadow-[0_0_10px_rgba(168,85,247,0.3)]">
                      <SpiderwebIcon className="w-4 h-4 text-purple-400" />
                    </div>

                    <span className="text-xs font-semibold text-white">Halloween</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60">
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60">
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------- */}
            {/* SUBTAB: WIDGETS (Screenshot_20261003_195336_Chrome)  */}
            {/* ----------------------------------------------------- */}
            {customizeSubTab === 'widgets' && (
              <div className="space-y-5">
                {/* 14 Colorful Widget Buttons (Screenshot 1:1) */}
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { key: 'timezone', label: 'Timezone', color: 'bg-[#0ea5e9]', icon: Clock },
                    { key: 'weather', label: 'Weather', color: 'bg-[#f59e0b]', icon: Sun },
                    { key: 'account-date', label: 'Account Date', color: 'bg-[#8b5cf6]', icon: Calendar },
                    { key: 'chess', label: 'Chess.com', color: 'bg-[#84cc16]', icon: Gamepad2 },
                    { key: 'discord', label: 'Discord', color: 'bg-[#5865F2]', icon: DiscordIcon },
                    { key: 'spotify', label: 'Spotify', color: 'bg-[#10b981]', icon: SpotifyIcon },
                    { key: 'roblox', label: 'Roblox', color: 'bg-[#18181b]', icon: Gamepad2 },
                    { key: 'valorant', label: 'Valorant', color: 'bg-[#f43f5e]', icon: Shield },
                    { key: 'soundcloud', label: 'SoundCloud', color: 'bg-[#EE6F35]', icon: SoundcloudIcon },
                    { key: 'youtube', label: 'YouTube', color: 'bg-[#ef4444]', icon: YoutubeIcon },
                    { key: 'twitch', label: 'Twitch', color: 'bg-[#9333ea]', icon: TwitchIcon },
                    { key: 'steam', label: 'Steam', color: 'bg-[#0284c7]', icon: SteamIcon },
                    { key: 'github', label: 'GitHub', color: 'bg-[#27272a]', icon: GithubIcon },
                    { key: 'lastfm', label: 'Last.fm', color: 'bg-[#dc2626]', icon: Music },
                  ].map(w => {
                    const Icon = w.icon;
                    return (
                      <button
                        key={w.key}
                        onClick={() => handleAddWidget(w.key, w.label)}
                        className={`p-3 rounded-2xl ${w.color} text-white text-left shadow-md flex items-center justify-between active:scale-[0.98] transition group`}
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-bold leading-tight">{w.label}</p>
                          <p className="text-[10px] text-white/80 flex items-center gap-1 mt-0.5">
                            <span>+ Add widget</span>
                          </p>
                        </div>
                        <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                          <Icon className="w-3.5 h-3.5 text-white" />
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Empty State / Active Widgets */}
                <div className="p-8 rounded-[26px] bg-[#121215] border border-white/[0.06] text-center space-y-3">
                  {(profile.widgets || []).length === 0 ? (
                    <>
                      <div className="w-48 mx-auto space-y-2 py-2 opacity-20">
                        <div className="h-7 rounded-xl bg-white/20 flex items-center px-3 gap-2">
                          <div className="w-3 h-3 rounded-full bg-emerald-400" />
                          <div className="w-16 h-1.5 rounded-full bg-white/30" />
                        </div>
                      </div>
                      <h4 className="text-sm font-bold text-white">No Widgets Found</h4>
                      <p className="text-xs text-white/50 leading-relaxed max-w-sm mx-auto">
                        Widgets are a great way to add dynamic content and integrate your other platforms to your page.
                      </p>
                    </>
                  ) : (
                    <div className="space-y-2 text-left">
                      {(profile.widgets || []).map(w => (
                        <div key={w.id} className="p-3 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between">
                          <span className="text-xs font-semibold text-white">{w.title}</span>
                          <button
                            onClick={() => {
                              setProfile(prev => ({ ...prev, widgets: prev.widgets.filter(item => item.id !== w.id) }));
                              showToast('Widget removed');
                            }}
                            className="text-red-400 hover:bg-red-500/10 p-1 rounded-lg"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ----------------------------------------------------- */}
            {/* SUBTAB: TRACKS (Screenshot_20261003_195347_Chrome)   */}
            {/* ----------------------------------------------------- */}
            {customizeSubTab === 'tracks' && (
              <div className="space-y-5">
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-white/90 block">Layout</label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { id: 'default', label: 'Default', icon: Music },
                      { id: 'compact', label: 'Compact', icon: Volume2 },
                      { id: 'banner', label: 'Banner 💎', icon: Layers },
                      { id: 'vinyl', label: 'Vinyl 💎', icon: RadioTower },
                      { id: 'cover-vinyl', label: 'Cover Vinyl 💎', icon: Tv },
                    ].map(layout => {
                      const isSelected = (theme.trackLayout || 'default') === layout.id;
                      return (
                        <div
                          key={layout.id}
                          onClick={() => {
                            setProfile(prev => ({ ...prev, theme: { ...prev.theme, trackLayout: layout.id } }));
                            showToast(`Track layout: ${layout.label}`);
                          }}
                          className={`p-3 rounded-2xl border text-center cursor-pointer transition ${
                            isSelected
                              ? 'bg-[#1b1b2d] border-[#5865F2]'
                              : 'bg-[#121215] border-white/5 hover:border-white/10'
                          }`}
                        >
                          <span className="text-xs font-semibold text-white/90">{layout.label}</span>
                          <div className="h-12 mt-2 rounded-xl bg-white/[0.04] flex items-center justify-center">
                            <Music className="w-4 h-4 text-white/30" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setShowAddTrackModal(true)}
                    className="px-4 py-2 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-[#5865F2]/25"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Track</span>
                  </button>
                </div>

                {/* Empty State / Current Track */}
                <div className="p-8 rounded-[26px] bg-[#121215] border border-white/[0.06] text-center space-y-4">
                  {profile.audio?.url ? (
                    <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between text-left">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white truncate">{profile.audio.title}</p>
                        <p className="text-[11px] text-white/40 truncate">{profile.audio.artist}</p>
                      </div>
                      <button
                        onClick={() => {
                          setProfile(prev => ({ ...prev, audio: null }));
                          showToast('Track removed');
                        }}
                        className="text-red-400 p-1 hover:bg-red-500/10 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="w-40 mx-auto py-2 opacity-25">
                        <div className="w-10 h-10 rounded-xl bg-white/20 mx-auto flex items-center justify-center">
                          <Music className="w-5 h-5 text-white/50" />
                        </div>
                      </div>
                      <h4 className="text-sm font-bold text-white">No Tracks Found</h4>
                      <p className="text-xs text-white/50 max-w-xs mx-auto">
                        Let your visitors listen to your favorite music directly from your profile.
                      </p>
                      <button
                        onClick={() => setShowAddTrackModal(true)}
                        className="px-5 py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-lg shadow-[#5865F2]/20"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Track</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

          </div>
        )}

      </main>

      {/* ------------------------------------------------------------- */}
      {/* 3. FLOATING PREVIEW BUTTON (Screenshot_20261003_195229_Chrome)*/}
      {/* ------------------------------------------------------------- */}
      <div className="fixed bottom-6 right-5 z-40">
        <button
          onClick={() => setPreviewOpen(true)}
          className="px-4 py-2.5 rounded-full bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-bold shadow-2xl shadow-[#5865F2]/50 flex items-center gap-2 active:scale-95 transition"
        >
          <Eye className="w-4 h-4" />
          <span>Preview</span>
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. LIVE CARD PREVIEW MODAL                                   */}
      {/* ------------------------------------------------------------- */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            onClick={() => setPreviewOpen(false)}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />
          <div className="relative z-10 w-full max-w-sm flex flex-col items-center animate-in zoom-in-95 duration-200">
            <div className="w-full flex items-center justify-between mb-3 px-2">
              <span className="text-xs font-semibold text-white/70">Card Live Preview</span>
              <button
                onClick={() => setPreviewOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <ProfileCard profile={profile} isPreview={true} />
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 5. ADD LINK MODAL                                             */}
      {/* ------------------------------------------------------------- */}
      {showAddLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowAddLinkModal(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="relative z-10 w-full max-w-md p-6 rounded-[28px] bg-[#141418] border border-white/10 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4">Add New Link</h3>
            <form onSubmit={handleAddLink} className="space-y-3">
              <div>
                <label className="text-xs text-white/70 block mb-1">Title / Label</label>
                <input
                  type="text"
                  value={newLinkTitle}
                  onChange={(e) => setNewLinkTitle(e.target.value)}
                  placeholder="e.g. Discord Server, Spotify, Instagram"
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-[#5865F2]"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-white/70 block mb-1">Destination URL</label>
                <input
                  type="text"
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-[#5865F2]"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-white/70 block mb-1">Platform Icon</label>
                <select
                  value={newLinkIcon}
                  onChange={(e) => setNewLinkIcon(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-[#5865F2]"
                >
                  <option value="globe">Custom Website</option>
                  <option value="discord">Discord</option>
                  <option value="spotify">Spotify</option>
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

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddLinkModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-semibold shadow-lg shadow-[#5865F2]/25"
                >
                  Add Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 6. ADD TRACK MODAL                                            */}
      {/* ------------------------------------------------------------- */}
      {showAddTrackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowAddTrackModal(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="relative z-10 w-full max-w-md p-6 rounded-[28px] bg-[#141418] border border-white/10 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4">Add Background Track</h3>
            <form onSubmit={handleAddTrack} className="space-y-3">
              <div>
                <label className="text-xs text-white/70 block mb-1">Song Title</label>
                <input
                  type="text"
                  value={newTrackTitle}
                  onChange={(e) => setNewTrackTitle(e.target.value)}
                  placeholder="e.g. After Dark"
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-[#5865F2]"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-white/70 block mb-1">Artist Name</label>
                <input
                  type="text"
                  value={newTrackArtist}
                  onChange={(e) => setNewTrackArtist(e.target.value)}
                  placeholder="e.g. Mr.Kitty"
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-[#5865F2]"
                />
              </div>

              <div>
                <label className="text-xs text-white/70 block mb-1">Audio Stream URL (.mp3)</label>
                <input
                  type="url"
                  value={newTrackUrl}
                  onChange={(e) => setNewTrackUrl(e.target.value)}
                  placeholder="https://.../audio.mp3"
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-[#5865F2]"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTrackModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-semibold shadow-lg shadow-[#5865F2]/25"
                >
                  Save Track
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
