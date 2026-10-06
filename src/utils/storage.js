// Local storage & profile state manager for pistols.wtf
// Version 3: Clean state isolation, sequential UID (1 = ares, 2, 3...), zero default assets for new users

const STORAGE_KEY = 'pistols_wtf_v3_profiles';
const CURRENT_USER_KEY = 'pistols_wtf_v3_current_user';

// Showcase testing profile (configured only for /ares)
export const SHOWCASE_PROFILE = {
  username: 'ares',
  displayName: 'ares',
  bio: 'PRODIGY',
  avatarUrl: '', // Zero random dude PFP
  wallpaperUrl: '/wallpaper.jpg',
  uid: 1, // Ares is member #1
  views: 3700,
  badges: ['owner', 'premium'],
  discordId: '',
  discordStatus: null, // NO Spotify or fake Discord activity
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
  links: [] // Pure clean
};

// Calculates the next sequential member UID (ares = 1, next = 2, next = 3...)
export const getNextUid = () => {
  try {
    const profiles = getStoredProfiles();
    const existingUids = Object.values(profiles)
      .map(p => Number(p.uid))
      .filter(u => !isNaN(u) && u > 0);
    const max = existingUids.length > 0 ? Math.max(...existingUids) : 1;
    return max + 1;
  } catch (e) {
    return 2;
  }
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
    uid: getNextUid(), // Sequential member count: 2, 3, 4...
    views: 0, // Freshly claimed account starts strictly at 0 views
    badges: [], // NO badges (no owner, no verified, no premium)
    discordId: '',
    discordStatus: null, // NO Discord status, NO Spotify activity
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
    if (typeof window !== 'undefined') {
      // Purge legacy storage keys that contain old mock profiles or fake Spotify states
      localStorage.removeItem('whose_baby_profiles');
      localStorage.removeItem('pistols_wtf_profiles');

      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (!parsed.ares) {
          parsed.ares = { ...SHOWCASE_PROFILE };
        }
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading profiles from localStorage', e);
  }
  return { 
    ares: { ...SHOWCASE_PROFILE }
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

  // Any other username is UNCLAIMED (returns null)
  return null;
};

export const saveProfile = (profile) => {
  try {
    const profiles = getStoredProfiles();
    const cleanUsername = (profile.username || 'ares').toLowerCase().replace(/[^a-z0-9_-]/g, '');
    profiles[cleanUsername] = {
      ...profile,
      username: cleanUsername,
      updatedAt: new Date().toISOString()
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
      localStorage.setItem(CURRENT_USER_KEY, cleanUsername);
    }
    return true;
  } catch (e) {
    console.error('Error saving profile', e);
    return false;
  }
};

export const getCurrentUser = () => {
  try {
    if (typeof window !== 'undefined') {
      const username = localStorage.getItem(CURRENT_USER_KEY) || 'ares';
      return getProfileByUsername(username) || { ...SHOWCASE_PROFILE };
    }
  } catch (e) {
    // fallback
  }
  return { ...SHOWCASE_PROFILE };
};

export const incrementProfileViews = (username) => {
  try {
    const cleanUsername = username?.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    if (!cleanUsername) return;
    const profiles = getStoredProfiles();
    if (profiles[cleanUsername]) {
      profiles[cleanUsername].views = (Number(profiles[cleanUsername].views) || 0) + 1;
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
      }
    }
  } catch (e) {
    console.error('Error incrementing views', e);
  }
};
