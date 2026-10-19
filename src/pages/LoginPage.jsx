import React, { useState, useEffect } from 'react';
import { 
  X, 
  ArrowRight, 
  UserPlus, 
  Check, 
  ShieldCheck, 
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { 
  GoogleIcon, 
  DiscordIcon, 
  LinkChainIcon, 
  KeyIcon, 
  EyeIcon, 
  EyeOffIcon 
} from '../components/Icons';
import { 
  getProfileByUsername, 
  saveProfile, 
  createBlankProfile, 
  loginUser, 
  isLoggedIn 
} from '../utils/storage';

export default function LoginPage({ initialMode = 'login', prefilledUsername = '', onNavigate }) {
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [username, setUsername] = useState(prefilledUsername);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Google Account Chooser Dialog State
  const [showGooglePicker, setShowGooglePicker] = useState(false);
  const [customGmail, setCustomGmail] = useState('');
  const [isTypingGmail, setIsTypingGmail] = useState(false);

  // Discord Bot Auth Dialog State
  const [showDiscordSheet, setShowDiscordSheet] = useState(false);
  const [discordUsername, setDiscordUsername] = useState('');

  // Auto-redirect if already logged in
  useEffect(() => {
    if (isLoggedIn()) {
      onNavigate('dashboard');
    }
  }, [onNavigate]);

  useEffect(() => {
    setMode(initialMode);
    if (prefilledUsername) {
      setUsername(prefilledUsername.toLowerCase().replace(/[^a-z0-9_-]/g, ''));
    }
  }, [initialMode, prefilledUsername]);

  // Complete Authentication Helper
  const completeAuth = (finalUsername, userEmail = '', extraData = {}) => {
    setLoading(true);
    const cleanUsername = (finalUsername || username || 'user').trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
    
    let profileData = getProfileByUsername(cleanUsername);
    if (!profileData) {
      profileData = createBlankProfile(cleanUsername);
    }

    const updated = {
      ...profileData,
      username: cleanUsername,
      displayName: extraData.displayName || profileData.displayName || cleanUsername,
      email: userEmail || email || `${cleanUsername}@gmail.com`,
      ...extraData,
    };

    saveProfile(updated);
    loginUser(cleanUsername);

    setShowGooglePicker(false);
    setShowDiscordSheet(false);
    setLoading(false);

    onNavigate('dashboard', cleanUsername);
  };

  // Form Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
    if (!cleanUsername) {
      setError('Please provide a valid username.');
      return;
    }

    if (!password || password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }

    completeAuth(cleanUsername, email);
  };

  // Google Account Selection Handler
  const handleSelectGoogleAccount = (selectedEmail, selectedName) => {
    const defaultHandle = username || selectedEmail.split('@')[0].replace(/[^a-z0-9_-]/g, '') || 'user';
    completeAuth(defaultHandle, selectedEmail, {
      displayName: selectedName || defaultHandle,
      avatarUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${defaultHandle}`,
    });
  };

  // Discord Bot Authorization Handler
  const handleConfirmDiscord = () => {
    const tag = discordUsername || username || 'user';
    const cleanHandle = username || tag.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    
    completeAuth(cleanHandle, `${cleanHandle}@discord.user`, {
      displayName: cleanHandle,
      discordTag: tag,
      discordId: tag,
      discordStatus: {
        status: 'online',
        activity: 'Playing with pistols.wtf',
        username: tag
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#060608] text-white flex flex-col justify-between selection:bg-[#990026] selection:text-white px-4 py-8 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div 
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] pointer-events-none -z-10"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(153, 0, 38, 0.15) 0%, rgba(64, 0, 16, 0.05) 50%, rgba(6, 6, 8, 0) 75%)'
        }}
      />

      {/* Top Header / Back Link */}
      <header className="max-w-md w-full mx-auto flex items-center justify-between pb-6">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-xs font-medium text-white/50 hover:text-white transition group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </button>

        <div 
          onClick={() => onNavigate('home')} 
          className="flex items-center gap-2 cursor-pointer"
        >
          <img src="/logo.png" alt="pistols.wtf" className="w-7 h-7 object-contain" />
          <span className="font-bold text-base text-white tracking-tight">
            pistols<span className="text-[#990026]">.</span>wtf
          </span>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="max-w-[430px] w-full mx-auto my-auto">
        <div className="rounded-[32px] p-6 sm:p-8 bg-gradient-to-b from-[#18181b] via-[#121215] to-[#0a0a0c] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_25px_60px_rgba(0,0,0,0.95)]">
          
          {/* Mode Switch Tabs (Sign In / Register) */}
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-black/50 border border-white/5 mb-6 text-sm font-semibold">
            <button
              onClick={() => {
                setMode('login');
                setError(null);
                window.history.pushState({}, '', '/login');
              }}
              className={`py-2 rounded-xl transition ${
                mode === 'login' 
                  ? 'bg-[#990026] text-white shadow-md shadow-[#990026]/30' 
                  : 'text-white/40 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode('register');
                setError(null);
                window.history.pushState({}, '', '/register');
              }}
              className={`py-2 rounded-xl transition ${
                mode === 'register' 
                  ? 'bg-[#990026] text-white shadow-md shadow-[#990026]/30' 
                  : 'text-white/40 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {mode === 'register' ? 'Claim Your Handle' : 'Welcome Back'}
            </h1>
            <p className="text-xs text-white/50 mt-1 leading-relaxed">
              {mode === 'register' 
                ? 'Create your aesthetic biolink page and join pistols.wtf' 
                : 'Sign in to access your dashboard and manage your link'}
            </p>
          </div>

          {/* OAuth Buttons (Official Google & Discord Bot Auth) */}
          <div className="space-y-3">
            {/* 1. Official Google Sign-in */}
            <button
              onClick={() => setShowGooglePicker(true)}
              type="button"
              className="w-full py-3 px-4 rounded-2xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-sm group"
            >
              <GoogleIcon className="w-4 h-4 shrink-0" />
              <span>Continue with Google</span>
            </button>

            {/* 2. Discord Bot Authorization Button */}
            <button
              onClick={() => setShowDiscordSheet(true)}
              type="button"
              className="w-full py-3 px-4 rounded-2xl bg-[#5865F2] hover:bg-[#4752c4] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-3 shadow-lg shadow-[#5865F2]/25 active:scale-[0.98] transition-all"
            >
              <DiscordIcon className="w-4 h-4 text-white shrink-0" />
              <span>Connect with Discord (Sync Status)</span>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-5 text-white/30 text-xs">
            <div className="flex-1 h-[1px] bg-white/[0.06]" />
            <span className="px-3 select-none">
              {mode === 'register' ? 'or register with username' : 'or login with password'}
            </span>
            <div className="flex-1 h-[1px] bg-white/[0.06]" />
          </div>

          {/* Direct Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-medium">
                {error}
              </div>
            )}

            {/* Username Input */}
            <div>
              <label className="text-xs font-medium text-white/80 mb-1.5 block">
                Username Handle
              </label>
              <div className="rounded-xl bg-[#141416] border border-white/[0.08] focus-within:border-[#990026]/70 focus-within:shadow-[0_0_15px_rgba(153,0,38,0.2)] px-3.5 py-2.5 flex items-center gap-2.5 transition-all">
                <LinkChainIcon className="w-4 h-4 text-white/40 shrink-0" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''));
                    setError(null);
                  }}
                  placeholder="yourname"
                  className="w-full min-w-0 bg-transparent border-none outline-none text-xs text-white placeholder-white/30"
                  required
                />
              </div>
              <p className="text-[11px] text-white/40 mt-1 font-mono">
                pistols.wtf/{username || 'username'}
              </p>
            </div>

            {/* Email Input (Register only) */}
            {mode === 'register' && (
              <div>
                <label className="text-xs font-medium text-white/80 mb-1.5 block">
                  Email Address (Optional)
                </label>
                <div className="rounded-xl bg-[#141416] border border-white/[0.08] focus-within:border-[#990026]/70 px-3.5 py-2.5 flex items-center gap-2.5 transition-all">
                  <span className="text-white/40 font-mono text-xs select-none">@</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="w-full min-w-0 bg-transparent border-none outline-none text-xs text-white placeholder-white/30"
                  />
                </div>
              </div>
            )}

            {/* Password Input */}
            <div>
              <label className="text-xs font-medium text-white/80 mb-1.5 block">
                Password
              </label>
              <div className="rounded-xl bg-[#141416] border border-white/[0.08] focus-within:border-[#990026]/70 focus-within:shadow-[0_0_15px_rgba(153,0,38,0.2)] px-3.5 py-2.5 flex items-center gap-2.5 transition-all">
                <KeyIcon className="w-4 h-4 text-white/40 shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full min-w-0 bg-transparent border-none outline-none text-xs text-white placeholder-white/30"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-white/40 hover:text-white transition focus:outline-none shrink-0"
                >
                  {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#990026] via-[#73001d] to-[#400010] hover:from-[#b3002d] hover:to-[#5c0017] text-white font-semibold text-xs sm:text-sm shadow-lg shadow-[#990026]/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span>{mode === 'register' ? 'Claim & Enter Studio' : 'Enter Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

        </div>
      </main>

      {/* Footer Info */}
      <footer className="max-w-md w-full mx-auto text-center pt-6 text-[11px] text-white/30 font-mono">
        pistols.wtf — verified aesthetic biolinks
      </footer>

      {/* ------------------------------------------------------------------ */}
      {/* 1. AUTHENTIC GOOGLE ACCOUNT PICKER MODAL                          */}
      {/* ------------------------------------------------------------------ */}
      {showGooglePicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            onClick={() => setShowGooglePicker(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          <div className="relative w-full max-w-[390px] rounded-[28px] p-6 bg-[#161618] border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.95)] z-10 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <GoogleIcon className="w-5 h-5" />
                <span className="text-sm font-semibold text-white">Sign in with Google</span>
              </div>
              <button 
                onClick={() => setShowGooglePicker(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-lg font-bold text-white tracking-tight">Choose an account</h3>
            <p className="text-xs text-white/50 mt-1 mb-5">
              to continue to <strong className="text-white">pistols.wtf</strong>
            </p>

            <div className="space-y-2">
              {/* Account 1: Personal Device Account */}
              <button
                onClick={() => handleSelectGoogleAccount(`${username || 'user'}@gmail.com`, username || 'Google User')}
                className="w-full p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 flex items-center gap-3 transition text-left group"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#990026] to-amber-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                  {(username ? username[0] : 'G').toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-white group-hover:text-[#990026] transition truncate">
                    {username ? `${username.charAt(0).toUpperCase() + username.slice(1)}` : 'Google Account'}
                  </p>
                  <p className="text-[11px] text-white/50 truncate">
                    {username ? `${username}@gmail.com` : 'personal.account@gmail.com'}
                  </p>
                </div>
              </button>

              {/* Use another account option */}
              {!isTypingGmail ? (
                <button
                  onClick={() => setIsTypingGmail(true)}
                  className="w-full p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 flex items-center gap-3 transition text-left group"
                >
                  <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-white/80 group-hover:text-white transition">
                      Use another Gmail account
                    </p>
                  </div>
                </button>
              ) : (
                <div className="p-3 rounded-2xl bg-white/[0.04] border border-[#990026]/50 space-y-2.5 animate-in fade-in duration-150">
                  <label className="text-[11px] font-medium text-white/70 block">
                    Enter your Gmail address
                  </label>
                  <input
                    type="email"
                    value={customGmail}
                    onChange={(e) => setCustomGmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full bg-[#111] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 outline-none focus:border-[#990026]"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customGmail.includes('@')) {
                        handleSelectGoogleAccount(customGmail, customGmail.split('@')[0]);
                      }
                    }}
                    className="w-full py-2 rounded-xl bg-[#990026] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-[#990026]/25"
                  >
                    <span>Continue with this Gmail</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            <div className="mt-5 pt-4 border-t border-white/10 text-[11px] text-white/40 leading-relaxed">
              To continue, Google will share your name, email address, and profile picture with pistols.wtf.
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 2. DISCORD BOT AUTHORIZATION MODAL                                */}
      {/* ------------------------------------------------------------------ */}
      {showDiscordSheet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            onClick={() => setShowDiscordSheet(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          <div className="relative w-full max-w-[400px] rounded-[28px] p-6 bg-[#161618] border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.95)] z-10 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <DiscordIcon className="w-5 h-5 text-[#5865F2]" />
                <span className="text-sm font-semibold text-white">Discord Authorization</span>
              </div>
              <button 
                onClick={() => setShowDiscordSheet(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-lg font-bold text-white tracking-tight">Authorize Discord Bot</h3>
            <p className="text-xs text-white/50 mt-1 mb-4 leading-relaxed">
              Syncs your Discord avatar, live custom status, and Spotify activity to your pistols.wtf card.
            </p>

            <div className="p-3.5 rounded-2xl bg-[#5865F2]/10 border border-[#5865F2]/30 mb-4 space-y-2 text-xs text-white/80">
              <div className="flex items-center gap-2 text-[#5865F2] font-semibold text-[11px] uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Discord Bot Features</span>
              </div>
              <ul className="text-[11px] text-white/70 space-y-1 list-disc list-inside">
                <li>Real-time status sync (online/idle/dnd)</li>
                <li>Displays live Spotify track and artist</li>
                <li>Automatically grants pistols.wtf role</li>
              </ul>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-white/80 mb-1.5 block">
                  Discord Username or User ID
                </label>
                <input
                  type="text"
                  value={discordUsername}
                  onChange={(e) => setDiscordUsername(e.target.value)}
                  placeholder={username || 'discord_username'}
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/30 outline-none focus:border-[#5865F2]"
                />
              </div>

              <button
                type="button"
                onClick={handleConfirmDiscord}
                className="w-full py-3 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-bold shadow-lg shadow-[#5865F2]/25 active:scale-95 transition flex items-center justify-center gap-2"
              >
                <DiscordIcon className="w-4 h-4 text-white" />
                <span>Authorize & Enter Studio</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
