// Local storage & profile state manager for pistols.wtf

const DEFAULT_PROFILE = {
  username: 'aizen',
  displayName: 'aizen',
  bio: 'PRODIGY',
  avatarUrl: '/avatar.jpg',
  wallpaperUrl: '/wallpaper.jpg',
  uid: 1,
  views: 3700,
  badges: ['verified', 'early', 'owner', 'diamond', 'halloween', 'candy', 'sun'],
  discordId: '',
  discordStatus: null,
  theme: {
    primaryColor: '#990026',
    cardBackground: 'rgba(0, 0, 0, 0.45)',
    cardBorder: 'rgba(255, 255, 255, 0.08)',
    cardBlur: 28,
    cardRadius: '38px',
    tilt: true,
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

export const getStoredProfiles = () => {
  try {
    const raw = localStorage.getItem('pistols_wtf_profiles');
    if (raw) {
      const parsed = JSON.parse(raw);
      // Migrate or ensure aizen default has new assets
      if (!parsed.aizen) {
        parsed.aizen = { ...DEFAULT_PROFILE };
      }
      return parsed;
    }
  } catch (e) {
    console.error('Error reading profiles from localStorage', e);
  }
  return { 
    aizen: { ...DEFAULT_PROFILE },
    ares: { ...DEFAULT_PROFILE, username: 'ares', displayName: 'ares' }
  };
};

export const getProfileByUsername = (username) => {
  const profiles = getStoredProfiles();
  const cleanUsername = username?.toLowerCase().replace('@', '') || 'aizen';
  
  if (profiles[cleanUsername]) {
    return profiles[cleanUsername];
  }

  if (cleanUsername === 'ares' || cleanUsername === 'bloodare') {
    return {
      ...DEFAULT_PROFILE,
      username: cleanUsername,
      displayName: cleanUsername,
    };
  }
  
  // Return default profile configured with requested username
  return {
    ...DEFAULT_PROFILE,
    username: cleanUsername,
    displayName: cleanUsername,
    bio: 'PRODIGY',
    views: 3700,
    uid: Math.floor(Math.random() * 899) + 100,
  };
};

export const saveProfile = (profile) => {
  try {
    const profiles = getStoredProfiles();
    const cleanUsername = (profile.username || 'aizen').toLowerCase().replace('@', '');
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
    const username = localStorage.getItem('pistols_wtf_current_user') || 'aizen';
    return getProfileByUsername(username);
  } catch (e) {
    return DEFAULT_PROFILE;
  }
};

export const incrementProfileViews = (username) => {
  try {
    const profiles = getStoredProfiles();
    const cleanUsername = (username || 'aizen').toLowerCase().replace('@', '');
    if (profiles[cleanUsername]) {
      profiles[cleanUsername].views = (profiles[cleanUsername].views || 3700) + 1;
      localStorage.setItem('pistols_wtf_profiles', JSON.stringify(profiles));
    }
  } catch (e) {
    console.error('Error incrementing views', e);
  }
};
