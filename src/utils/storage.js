// Local storage & profile state manager for pistols.wtf

// Showcase testing profile (configured only for /ares)
export const SHOWCASE_PROFILE = {
  username: 'ares',
  displayName: 'ares',
  bio: 'PRODIGY',
  avatarUrl: '', // Zero random dude PFP
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
    bio: '', // NO description
    avatarUrl: '', // NO avatar
    wallpaperUrl: '', // Solid black background by default
    uid: Math.floor(Math.random() * 899) + 100,
    views: 0,
    badges: [], // NO badges
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
    links: [] // NO links
  };
};

export const getStoredProfiles = () => {
  try {
    const raw = localStorage.getItem('pistols_wtf_profiles');
    if (raw) {
      const parsed = JSON.parse(raw);
      // Ensure showcase profile /ares exists and has no old dude avatar
      if (!parsed.ares) {
        parsed.ares = { ...SHOWCASE_PROFILE, username: 'ares', displayName: 'ares' };
      } else if (parsed.ares.avatarUrl === '/avatar.jpg' || parsed.ares.avatarUrl?.includes('unsplash')) {
        parsed.ares.avatarUrl = '';
      }
      return parsed;
    }
  } catch (e) {
    console.error('Error reading profiles from localStorage', e);
  }
  return { 
    ares: { ...SHOWCASE_PROFILE, username: 'ares', displayName: 'ares' }
  };
};

export const isUsernameClaimed = (username) => {
  if (!username) return false;
  const clean = username.toLowerCase().replace(/[^a-z0-9_-]/g, '');
  if (!clean) return false;
  if (clean === 'ares') return true;
  const profiles = getStoredProfiles();
  return Boolean(profiles[clean]);
};

export const getProfileByUsername = (username) => {
  if (!username) return null;
  const cleanUsername = username.toLowerCase().replace(/[^a-z0-9_-]/g, '');
  if (!cleanUsername) return null;

  const profiles = getStoredProfiles();
  if (profiles[cleanUsername]) {
    return profiles[cleanUsername];
  }

  // Pre-configured showcase profile only for /ares
  if (cleanUsername === 'ares') {
    return {
      ...SHOWCASE_PROFILE,
      username: 'ares',
      displayName: 'ares',
    };
  }

  // Any other username is NOT claimed (returns null)
  return null;
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
