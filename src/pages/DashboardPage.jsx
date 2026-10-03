import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Eye, 
  Plus, 
  Trash2, 
  Music, 
  Radio, 
  Palette, 
  Link as LinkIcon, 
  User, 
  Sparkles,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import ProfileCard from '../components/ProfileCard';
import { getProfileByUsername, saveProfile } from '../utils/storage';

export default function DashboardPage({ initialUsername = 'ares', onNavigate }) {
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'links', 'appearance', 'audio'
  const [mobileView, setMobileView] = useState('editor'); // 'editor', 'preview'
  const [profile, setProfile] = useState(() => getProfileByUsername(initialUsername));
  const [toastMessage, setToastMessage] = useState(null);

  // New link form state
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkIcon, setNewLinkIcon] = useState('globe');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = () => {
    saveProfile(profile);
    showToast('Changes saved successfully! ✨');
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
    showToast('Link added!');
  };

  const handleRemoveLink = (id) => {
    setProfile(prev => ({
      ...prev,
      links: (prev.links || []).filter(l => l.id !== id)
    }));
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 max-w-6xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 glass-card px-4 py-3 rounded-2xl border border-[#EE6F35]/40 bg-black/90 shadow-2xl flex items-center gap-2 text-xs font-semibold text-white animate-in slide-in-from-top duration-300">
          <CheckCircle className="w-4 h-4 text-[#EE6F35]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Customization Studio
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#EE6F35]/20 text-[#EE6F35] text-[10px] font-bold uppercase tracking-wider">
              Live
            </span>
          </div>
          <p className="text-xs text-white/50 font-mono">
            Editing handle: <strong className="text-white">whose.baby/{profile.username}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Mobile view toggle */}
          <div className="flex sm:hidden p-1 rounded-xl bg-white/5 border border-white/10">
            <button
              onClick={() => setMobileView('editor')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${mobileView === 'editor' ? 'bg-[#EE6F35] text-white' : 'text-white/60'}`}
            >
              Editor
            </button>
            <button
              onClick={() => setMobileView('preview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${mobileView === 'preview' ? 'bg-[#EE6F35] text-white' : 'text-white/60'}`}
            >
              Live Preview
            </button>
          </div>

          <button
            onClick={() => onNavigate('bio', profile.username)}
            className="px-4 py-2 rounded-xl glass-card hover:border-[#EE6F35]/40 text-xs font-semibold text-white flex items-center gap-1.5 transition"
            title="Open Public Link"
          >
            <Eye className="w-3.5 h-3.5 text-[#EE6F35]" />
            <span className="hidden sm:inline">View Profile</span>
          </button>

          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-[#EE6F35] hover:bg-[#D5551A] text-white text-xs font-bold shadow-lg shadow-[#EE6F35]/25 active:scale-95 transition flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Studio Controls */}
        <div className={`lg:col-span-7 flex flex-col gap-6 ${mobileView === 'preview' ? 'hidden lg:flex' : 'flex'}`}>
          {/* Studio Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/5 no-scrollbar">
            {[
              { id: 'profile', label: 'Profile & Bio', icon: User },
              { id: 'links', label: 'Links & Socials', icon: LinkIcon },
              { id: 'appearance', label: 'Appearance', icon: Palette },
              { id: 'audio', label: 'Audio & Music', icon: Music },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive 
                      ? 'bg-[#EE6F35] text-white shadow-md shadow-[#EE6F35]/20' 
                      : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: Profile & Bio */}
          {activeTab === 'profile' && (
            <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider text-[#EE6F35]">
                General Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-white/70 block mb-1">Username Handle</label>
                  <div className="flex items-center rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-xs">
                    <span className="text-white/40 font-mono">whose.baby/</span>
                    <input
                      type="text"
                      value={profile.username}
                      onChange={(e) => setProfile({ ...profile, username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') })}
                      className="bg-transparent text-white font-mono outline-none flex-1 ml-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-white/70 block mb-1">Display Name</label>
                  <input
                    type="text"
                    value={profile.displayName}
                    onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                    className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-xs text-white outline-none focus:border-[#EE6F35]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-white/70 block mb-1">Bio Description</label>
                <textarea
                  rows="3"
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Tell visitors about yourself..."
                  className="w-full rounded-xl bg-black/60 border border-white/10 p-3 text-xs text-white outline-none focus:border-[#EE6F35]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-medium text-white/70 block mb-1">Avatar Image URL</label>
                  <input
                    type="url"
                    value={profile.avatarUrl}
                    onChange={(e) => setProfile({ ...profile, avatarUrl: e.target.value })}
                    className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-xs text-white outline-none focus:border-[#EE6F35]"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-white/70 block mb-1">Banner Image URL</label>
                  <input
                    type="url"
                    value={profile.bannerUrl}
                    onChange={(e) => setProfile({ ...profile, bannerUrl: e.target.value })}
                    className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-xs text-white outline-none focus:border-[#EE6F35]"
                    placeholder="https://..."
                  />
                </div>
              </div>

              {/* Discord status config */}
              <div className="pt-4 border-t border-white/10">
                <p className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-[#EE6F35]" />
                  <span>Discord Presence Simulation</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-white/60 block mb-1">Status Dot</label>
                    <select
                      value={profile.discordStatus?.status || 'online'}
                      onChange={(e) => setProfile({
                        ...profile,
                        discordStatus: { ...profile.discordStatus, status: e.target.value }
                      })}
                      className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-xs text-white outline-none"
                    >
                      <option value="online">Online (Green)</option>
                      <option value="idle">Idle (Amber)</option>
                      <option value="dnd">Do Not Disturb (Red)</option>
                      <option value="offline">Invisible (Grey)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-white/60 block mb-1">Activity / Custom Status</label>
                    <input
                      type="text"
                      value={profile.discordStatus?.details || ''}
                      onChange={(e) => setProfile({
                        ...profile,
                        discordStatus: { ...profile.discordStatus, details: e.target.value }
                      })}
                      placeholder="e.g. Listening to Spotify"
                      className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Links */}
          {activeTab === 'links' && (
            <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-6">
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider text-[#EE6F35] mb-3">
                  Add New Link
                </h2>
                <form onSubmit={handleAddLink} className="space-y-3 p-4 rounded-xl bg-black/40 border border-white/5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] text-white/60 block mb-1">Platform Icon</label>
                      <select
                        value={newLinkIcon}
                        onChange={(e) => setNewLinkIcon(e.target.value)}
                        className="w-full rounded-xl bg-black/80 border border-white/10 px-3 py-2 text-xs text-white outline-none"
                      >
                        <option value="globe">Website / Globe</option>
                        <option value="github">GitHub</option>
                        <option value="spotify">Spotify</option>
                        <option value="instagram">Instagram</option>
                        <option value="telegram">Telegram</option>
                        <option value="youtube">YouTube</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[11px] text-white/60 block mb-1">Link Title</label>
                      <input
                        type="text"
                        value={newLinkTitle}
                        onChange={(e) => setNewLinkTitle(e.target.value)}
                        placeholder="e.g. My Portfolio or Instagram"
                        className="w-full rounded-xl bg-black/80 border border-white/10 px-3 py-2 text-xs text-white outline-none focus:border-[#EE6F35]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-white/60 block mb-1">Target URL</label>
                    <input
                      type="text"
                      value={newLinkUrl}
                      onChange={(e) => setNewLinkUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full rounded-xl bg-black/80 border border-white/10 px-3 py-2 text-xs text-white outline-none focus:border-[#EE6F35]"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 rounded-xl bg-[#EE6F35] hover:bg-[#D5551A] text-white text-xs font-semibold shadow-md active:scale-95 transition flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Link to Card</span>
                  </button>
                </form>
              </div>

              <div>
                <h2 className="text-xs font-bold text-white uppercase tracking-wider text-white/50 mb-3">
                  Existing Links ({profile.links?.length || 0})
                </h2>
                <div className="space-y-2">
                  {profile.links && profile.links.map((link) => (
                    <div 
                      key={link.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-semibold text-white truncate">{link.title}</p>
                        <p className="text-[11px] text-white/40 truncate font-mono">{link.url}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveLink(link.id)}
                        className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-white/5 transition"
                        title="Remove Link"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Appearance */}
          {activeTab === 'appearance' && (
            <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider text-[#EE6F35]">
                Card Styling & Visual Effects
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-white/70 block mb-1">Background Particles</label>
                  <select
                    value={profile.theme?.backgroundEffect || 'stars'}
                    onChange={(e) => setProfile({
                      ...profile,
                      theme: { ...profile.theme, backgroundEffect: e.target.value }
                    })}
                    className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-xs text-white outline-none"
                  >
                    <option value="stars">Falling Stars (Aesthetic)</option>
                    <option value="rain">Neon Cyber Rain</option>
                    <option value="none">Pure Dark Minimalist</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-white/70 block mb-1">Glow Intensity</label>
                  <select
                    value={profile.theme?.glowIntensity || 'medium'}
                    onChange={(e) => setProfile({
                      ...profile,
                      theme: { ...profile.theme, glowIntensity: e.target.value }
                    })}
                    className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-xs text-white outline-none"
                  >
                    <option value="none">None (Flat)</option>
                    <option value="low">Subtle</option>
                    <option value="medium">Medium Orange Glow</option>
                    <option value="high">Intense Aura</option>
                  </select>
                </div>
              </div>

              {/* Toggles */}
              <div className="pt-2 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-white/80">
                  <input
                    type="checkbox"
                    checked={profile.theme?.typewriterBio ?? true}
                    onChange={(e) => setProfile({
                      ...profile,
                      theme: { ...profile.theme, typewriterBio: e.target.checked }
                    })}
                    className="rounded accent-[#EE6F35]"
                  />
                  <span>Typewriter animation on Bio text</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-white/80">
                  <input
                    type="checkbox"
                    checked={profile.theme?.showBadges ?? true}
                    onChange={(e) => setProfile({
                      ...profile,
                      theme: { ...profile.theme, showBadges: e.target.checked }
                    })}
                    className="rounded accent-[#EE6F35]"
                  />
                  <span>Display Verified & Supporter Badges</span>
                </label>
              </div>
            </div>
          )}

          {/* TAB 4: Audio & Music */}
          {activeTab === 'audio' && (
            <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider text-[#EE6F35]">
                Background Audio Player
              </h2>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-white font-semibold">
                <input
                  type="checkbox"
                  checked={profile.audio?.enabled ?? true}
                  onChange={(e) => setProfile({
                    ...profile,
                    audio: { ...profile.audio, enabled: e.target.checked }
                  })}
                  className="rounded accent-[#EE6F35]"
                />
                <span>Enable Background Audio for Profile</span>
              </label>

              {profile.audio?.enabled && (
                <div className="space-y-3 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-white/60 block mb-1">Song Title</label>
                      <input
                        type="text"
                        value={profile.audio?.title || ''}
                        onChange={(e) => setProfile({
                          ...profile,
                          audio: { ...profile.audio, title: e.target.value }
                        })}
                        placeholder="Song Title"
                        className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-xs text-white outline-none focus:border-[#EE6F35]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-white/60 block mb-1">Artist Name</label>
                      <input
                        type="text"
                        value={profile.audio?.artist || ''}
                        onChange={(e) => setProfile({
                          ...profile,
                          audio: { ...profile.audio, artist: e.target.value }
                        })}
                        placeholder="Artist Name"
                        className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-xs text-white outline-none focus:border-[#EE6F35]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-white/60 block mb-1">Audio File URL (Direct MP3 link)</label>
                    <input
                      type="url"
                      value={profile.audio?.url || ''}
                      onChange={(e) => setProfile({
                        ...profile,
                        audio: { ...profile.audio, url: e.target.value }
                      })}
                      placeholder="https://.../song.mp3"
                      className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-xs text-white outline-none focus:border-[#EE6F35]"
                    />
                  </div>

                  {/* Audio Presets */}
                  <div className="pt-2">
                    <p className="text-[11px] text-white/50 mb-2">Or choose a free royalty-free sample preset:</p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { title: 'Lofi Chill Study', artist: 'FASSounds', url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3' },
                        { title: 'Synthwave Night', artist: 'AlexiAction', url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c7a73467.mp3?filename=cyberpunk-2099-10701.mp3' },
                      ].map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setProfile({
                            ...profile,
                            audio: {
                              ...profile.audio,
                              title: preset.title,
                              artist: preset.artist,
                              url: preset.url
                            }
                          })}
                          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#EE6F35]/20 border border-white/10 text-[11px] text-white/80 hover:text-white transition"
                        >
                          🎵 {preset.title}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Live Card Preview */}
        <div className={`lg:col-span-5 flex flex-col items-center ${mobileView === 'editor' ? 'hidden lg:flex' : 'flex'}`}>
          <div className="sticky top-28 w-full flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-3 px-2">
              <span className="text-xs uppercase font-mono font-bold tracking-widest text-[#EE6F35] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#EE6F35] animate-ping" />
                Live Preview
              </span>
              <span className="text-[11px] text-white/40 font-mono">
                Updates in real-time
              </span>
            </div>

            <div className="w-full flex justify-center">
              <ProfileCard profile={profile} isPreview={true} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
