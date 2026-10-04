import React, { useState, useEffect } from 'react';
import { X, Check, ArrowRight, UserPlus } from 'lucide-react';
import { 
  DiscordIcon, 
  GoogleIcon,
  LinkChainIcon, 
  KeyIcon, 
  EyeIcon, 
  EyeOffIcon 
} from './Icons';
import { getProfileByUsername, saveProfile } from '../utils/storage';

export default function AuthModal({ isOpen, onClose, initialMode = 'register', prefilledUsername = '', onSuccess }) {
  const [mode, setMode] = useState(initialMode); // 'register' or 'login'
  const [username, setUsername] = useState(prefilledUsername);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  // Google Account Chooser State
  const [showGooglePicker, setShowGooglePicker] = useState(false);
  const [customGmail, setCustomGmail] = useState('');
  const [isTypingGmail, setIsTypingGmail] = useState(false);

  // Discord Auth Sheet State
  const [showDiscordSheet, setShowDiscordSheet] = useState(false);
  const [discordUsername, setDiscordUsername] = useState('');

  useEffect(() => {
    setMode(initialMode);
    if (prefilledUsername) {
      setUsername(prefilledUsername.toLowerCase().replace(/[^a-z0-9_-]/g, ''));
    }
  }, [initialMode, prefilledUsername, isOpen]);

  if (!isOpen) return null;

  // Complete Login / Register Helper
  const completeAuth = (finalUsername, userEmail = '', extraData = {}) => {
    const cleanUsername = (finalUsername || username || 'ares').trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
    const existing = getProfileByUsername(cleanUsername);
    const updated = {
      ...existing,
      username: cleanUsername,
      displayName: cleanUsername.charAt(0).toUpperCase() + cleanUsername.slice(1),
      email: userEmail || email || `${cleanUsername}@gmail.com`,
      ...extraData,
    };
    saveProfile(updated);

    setShowGooglePicker(false);
    setShowDiscordSheet(false);
    onClose();

    if (onSuccess) {
      onSuccess(cleanUsername);
    }
  };

  // Standard Form Submit
  const handleSubmit = (e) => {
    e.preventDefault();
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

  // Trigger Google Account Picker
  const handleGoogleAuthClick = () => {
    setShowGooglePicker(true);
  };

  // Trigger Discord Sheet
  const handleDiscordAuthClick = () => {
    setShowDiscordSheet(true);
  };

  // Select Google Account
  const handleSelectGoogleAccount = (selectedEmail, selectedName, avatarUrl) => {
    const defaultHandle = username || selectedEmail.split('@')[0].replace(/[^a-z0-9_-]/g, '');
    completeAuth(defaultHandle, selectedEmail, {
      displayName: selectedName,
      avatarUrl: avatarUrl || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80`,
    });
  };

  // Connect Discord Account
  const handleConfirmDiscord = () => {
    const tag = discordUsername || username || 'ares';
    const cleanHandle = username || tag.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    completeAuth(cleanHandle, `${cleanHandle}@discord.user`, {
      displayName: tag,
      discordId: '712345678901234567',
      discordStatus: {
        status: 'online',
        activity: 'pistols.wtf ✦ sync',
        details: 'Member of Support Server',
        state: `pistols.wtf/${cleanHandle}`
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 selection:bg-[#990026]">
      {/* iOS Blur Backdrop */}
      <div 
        onClick={() => {
          if (showGooglePicker) setShowGooglePicker(false);
          else if (showDiscordSheet) setShowDiscordSheet(false);
          else onClose();
        }}
        className="fixed inset-0 bg-black/80 backdrop-blur-[10px] ios-backdrop-enter"
      />

      {/* -------------------------------------------------------- */}
      {/* 1. GOOGLE ACCOUNT CHOOSER POPUP (AUTHENTIC GMAIL PICKER) */}
      {/* -------------------------------------------------------- */}
      {showGooglePicker ? (
        <div className="relative w-full max-w-[400px] rounded-[28px] p-6 bg-[#161618] border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.95)] z-20 animate-in zoom-in-95 duration-200">
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
            {/* Suggested / Device Accounts */}
            <button
              onClick={() => handleSelectGoogleAccount(`${username || 'user'}@gmail.com`, username ? username.toUpperCase() : 'Google User', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80')}
              className="w-full p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 flex items-center gap-3 transition text-left group"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#990026] to-amber-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                {(username ? username[0] : 'U').toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-white group-hover:text-[#990026] transition truncate">
                  {username ? `${username.charAt(0).toUpperCase() + username.slice(1)}` : 'Personal Account'}
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
              <div className="p-3 rounded-2xl bg-white/[0.04] border border-[#990026]/50 space-y-2.5">
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
      ) : showDiscordSheet ? (
        /* -------------------------------------------------------- */
        /* 2. DISCORD INSTANT CONNECT & AUTO SERVER JOIN SHEET     */
        /* -------------------------------------------------------- */
        <div className="relative w-full max-w-[400px] rounded-[28px] p-6 bg-[#161618] border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.95)] z-20 animate-in zoom-in-95 duration-200">
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

          <h3 className="text-lg font-bold text-white tracking-tight">Connect with Discord</h3>
          <p className="text-xs text-white/50 mt-1 mb-4">
            Automatically joins the support server and syncs your avatar & live status.
          </p>

          <div className="p-3 rounded-2xl bg-[#5865F2]/10 border border-[#5865F2]/30 mb-4 space-y-1.5 text-xs text-white/80">
            <div className="flex items-center gap-2 text-[#5865F2] font-semibold text-[11px] uppercase tracking-wider">
              <Check className="w-3.5 h-3.5" />
              <span>Zero Commands Needed</span>
            </div>
            <p className="text-[11px] text-white/60">
              Your Discord ID will be linked automatically and you'll receive the Verified role in our server.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-white/80 mb-1.5 block">
                Discord Username / Handle
              </label>
              <input
                type="text"
                value={discordUsername}
                onChange={(e) => setDiscordUsername(e.target.value)}
                placeholder={username ? `${username}` : 'ares'}
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
      ) : (
        /* -------------------------------------------------------- */
        /* 3. MAIN AUTH MODAL (1:1 PIXEL-PERFECT REPLICA)          */
        /* -------------------------------------------------------- */
        <div className="relative w-full max-w-[430px] rounded-[30px] p-6 sm:p-7 bg-gradient-to-b from-[#18181b] via-[#121215] to-[#0a0a0c] border border-[#26262a] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_25px_60px_rgba(0,0,0,0.95)] z-10 ios-menu-enter">
          
          {/* Header: Brand & Close Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-7 h-7 flex items-center justify-center shrink-0 overflow-visible">
                <img 
                  src="/logo.png" 
                  alt="pistols.wtf" 
                  className="w-7 h-7 object-contain scale-[1.3] transform-gpu" 
                />
              </div>
              <span className="font-bold text-[18px] text-white tracking-tight ml-2">
                whose<span className="text-[#990026]">.</span>baby
              </span>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/5 active:scale-90 transition-all focus:outline-none"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5 stroke-[2.2]" />
            </button>
          </div>

          {/* Title & Subtitle */}
          <div className="mt-4 mb-5">
            <h2 className="text-[25px] font-bold text-white tracking-tight leading-tight">
              {mode === 'register' ? 'Register' : 'Login'}
            </h2>
            <p className="text-[14px] text-white/60 mt-1">
              {mode === 'register' 
                ? 'Create your account to start using pistols.wtf.'
                : 'Sign in to manage your link and settings.'}
            </p>
          </div>

          {/* Social Auth Buttons (Discord & Google) */}
          <div className="space-y-2.5">
            {/* Discord Button */}
            <button
              onClick={handleDiscordAuthClick}
              type="button"
              className="w-full py-3 px-4 rounded-2xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold text-[15px] flex items-center justify-center gap-2.5 shadow-lg shadow-[#5865F2]/25 active:scale-[0.98] transition-all"
            >
              <DiscordIcon className="w-5 h-5 text-white" />
              <span>{mode === 'register' ? 'Sign Up with Discord' : 'Sign In with Discord'}</span>
            </button>

            {/* Google Button */}
            <button
              onClick={handleGoogleAuthClick}
              type="button"
              className="w-full py-2.5 px-4 rounded-2xl bg-[#1e1e22] hover:bg-[#27272c] border border-white/[0.08] text-white font-medium text-[14px] flex items-center justify-center gap-2.5 active:scale-[0.98] transition-all"
            >
              <GoogleIcon className="w-4 h-4" />
              <span>{mode === 'register' ? 'Sign Up with Google' : 'Sign In with Google'}</span>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-4 text-white/40 text-[13px]">
            <div className="flex-1 h-[1px] bg-white/[0.08]" />
            <span className="px-3 select-none font-normal">
              {mode === 'register' ? 'or register with' : 'or login with'}
            </span>
            <div className="flex-1 h-[1px] bg-white/[0.08]" />
          </div>

          {/* Registration / Login Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {error && (
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
                {error}
              </div>
            )}

            {/* Username Field */}
            <div>
              <label className="text-[13px] font-medium text-white/90 mb-1.5 block">
                Username
              </label>
              <div className="rounded-xl bg-[#141416] border border-white/[0.08] focus-within:border-[#990026]/70 focus-within:shadow-[0_0_15px_rgba(238,111,53,0.15)] px-3.5 py-2.5 flex items-center gap-2.5 transition-all">
                <LinkChainIcon className="w-4 h-4 text-white/40 shrink-0" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''));
                    setError(null);
                  }}
                  placeholder="Your username"
                  className="w-full min-w-0 bg-transparent border-none outline-none text-[14px] text-white placeholder-white/35 font-normal"
                  required
                />
              </div>
              {mode === 'register' && (
                <p className="text-[12px] text-white/50 mt-1.5 font-normal">
                  Your page will be available at <strong className="text-white font-semibold">pistols.wtf/{username || 'username'}</strong>
                </p>
              )}
            </div>

            {/* Email Address Field (for Register) */}
            {mode === 'register' && (
              <div>
                <label className="text-[13px] font-medium text-white/90 mb-1.5 block">
                  Email address
                </label>
                <div className="rounded-xl bg-[#141416] border border-white/[0.08] focus-within:border-[#990026]/70 focus-within:shadow-[0_0_15px_rgba(238,111,53,0.15)] px-3.5 py-2.5 flex items-center gap-2.5 transition-all">
                  <span className="text-white/40 font-mono text-[14px] select-none pl-0.5">@</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@email.com"
                    className="w-full min-w-0 bg-transparent border-none outline-none text-[14px] text-white placeholder-white/35 font-normal ml-0.5"
                    required
                  />
                </div>
              </div>
            )}

            {/* Password Field */}
            <div>
              <label className="text-[13px] font-medium text-white/90 mb-1.5 block">
                Password
              </label>
              <div className="rounded-xl bg-[#141416] border border-white/[0.08] focus-within:border-[#990026]/70 focus-within:shadow-[0_0_15px_rgba(238,111,53,0.15)] px-3.5 py-2.5 flex items-center gap-2.5 transition-all">
                <KeyIcon className="w-4 h-4 text-white/40 shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="w-full min-w-0 bg-transparent border-none outline-none text-[14px] text-white placeholder-white/35 font-normal"
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
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#990026] to-[#f47f48] hover:from-[#b3002d] hover:to-[#5c0017] text-white font-medium text-[15px] shadow-lg shadow-[#990026]/25 active:scale-[0.98] transition-all"
              >
                {mode === 'register' ? 'Register' : 'Login'}
              </button>
            </div>
          </form>

          {/* Switch between Login & Register */}
          <div className="mt-4 text-center text-[13px] text-white/60">
            {mode === 'register' ? (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                  }}
                  className="text-[#990026] hover:underline font-semibold ml-1 focus:outline-none"
                >
                  Login
                </button>
              </span>
            ) : (
              <span>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setError(null);
                  }}
                  className="text-[#990026] hover:underline font-semibold ml-1 focus:outline-none"
                >
                  Register
                </button>
              </span>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
