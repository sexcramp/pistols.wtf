// Local storage & profile state manager for pistols.wtf

// Showcase testing profile (configured for /ares and /aizen)
export const SHOWCASE_PROFILE = {
  username: 'ares',
  displayName: 'ares',
  bio: 'PRODIGY',
  avatarUrl: '/avatar.jpg',
  wallpaperUrl: '/wallpaper.jpg',
  uid: 1,
  views: 3700,
  badges: ['owner', 'premium'],
  discordId: '',
  discordStatus: null,
  theme: {
    primaryColor: '#990026',
    cardBackground: 'rgba(0, 0, 0, 0.45)',
    cardBorder: 'rgba(255, 255, 255, 0.08)',
    cardBlur: 28,
    cardRadius: '42px',
    tilt: true,
    monochromeBadges: false,
    monochromeBadgeColor: '#ffffff',
  },
  audio: {
    enabled: true,
    autoplayOnClick: true,
    title: 'After Dark',
    artist: 'Mr.Kitty',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
    volume: 0.6,
  },
  links: []
};

// Factory for a clean, brand new claimed profile with zero placeholder assets
export const createBlankProfile = (username) => {
  const clean = username?.toLowerCase().replace(/[^a-z0-9_-]/g, '') || 'user';
  return {
    username: clean,
    displayName: clean,
    bio: '',
    avatarUrl: '', // NO avatar until user sets one
    wallpaperUrl: '', // Solid black background by default
    uid: Math.floor(Math.random() * 899) + 100,
    views: 0,
    badges: [], // NO badges until user adds one
    discordId: '',
    discordStatus: null,
    theme: {
      primaryColor: '#990026',
      cardBackground: 'rgba(0, 0, 0, 0.45)',
      cardBorder: 'rgba(255, 255, 255, 0.08)',
      cardBlur: 28,
      cardRadius: '38px',
      tilt: true,
      monochromeBadges: false,
      monochromeBadgeColor: '#ffffff',
    },
    audio: {
      enabled: false,
      url: '',
      title: '',
      artist: '',
      volume: 0.6,
    },
    links: []
  };
};

export const getStoredProfiles = () => {
  try {
    const raw = localStorage.getItem('pistols_wtf_profiles');
    if (raw) {
      const parsed = JSON.parse(raw);
      // Ensure testing profiles are available
      if (!parsed.ares) {
        parsed.ares = { ...SHOWCASE_PROFILE, username: 'ares', displayName: 'ares' };
      }
      if (!parsed.aizen) {
        parsed.aizen = { ...SHOWCASE_PROFILE, username: 'aizen', displayName: 'aizen' };
      }
      return parsed;
    }
  } catch (e) {
    console.error('Error reading profiles from localStorage', e);
  }
  return { 
    ares: { ...SHOWCASE_PROFILE, username: 'ares', displayName: 'ares' },
    aizen: { ...SHOWCASE_PROFILE, username: 'aizen', displayName: 'aizen' }
  };
};

export const getProfileByUsername = (username) => {
  const profiles = getStoredProfiles();
  const cleanUsername = username?.toLowerCase().replace('@', '') || 'ares';
  
  if (profiles[cleanUsername]) {
    return profiles[cleanUsername];
  }

  // Pre-configured showcase profile for /ares and /aizen
  if (cleanUsername === 'ares' || cleanUsername === 'bloodare') {
    return {
      ...SHOWCASE_PROFILE,
      username: 'ares',
      displayName: 'ares',
    };
  }

  if (cleanUsername === 'aizen') {
    return {
      ...SHOWCASE_PROFILE,
      username: 'aizen',
      displayName: 'aizen',
    };
  }
  
  // For any new claimed or unconfigured user: Return pure blank profile
  return createBlankProfile(cleanUsername);
};

export const saveProfile = (profile) => {
  try {
    const profiles = getStoredProfiles();
    const cleanUsername = (profile.username || 'ares').toLowerCase().replace('@', '');
    profiles[cleanUsername] = {
      ...profile,
      username: cleanUsername,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem('pistols_wtf_profiles', JSON.stringify(profiles));
    localStorage.setItem('pistols_wtf_current_user', cleanUsername);
    return true;
  } catch (e) {
    console.error('Error saving profile', e);
    return false;
  }
};

export const getCurrentUser = () => {
  try {
    const username = localStorage.getItem('pistols_wtf_current_user') || 'ares';
    return getProfileByUsername(username);
  } catch (e) {
    return { ...SHOWCASE_PROFILE, username: 'ares', displayName: 'ares' };
  }
};

export const incrementProfileViews = (username) => {
  try {
    const profiles = getStoredProfiles();
    const cleanUsername = (username || 'ares').toLowerCase().replace('@', '');
    if (profiles[cleanUsername]) {
      profiles[cleanUsername].views = (profiles[cleanUsername].views || 0) + 1;
      localStorage.setItem('pistols_wtf_profiles', JSON.stringify(profiles));
    }
  } catch (e) {
    console.error('Error incrementing views', e);
  }
};
