// Local storage & profile state manager for whose.baby

const DEFAULT_PROFILE = {
  username: 'ares',
  displayName: 'Ares',
  bio: 'Living in the noise • Building whose.baby ✦\nDesigner & Developer',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
  bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
  uid: 1,
  views: 1337,
  badges: ['verified', 'early', 'owner'],
  discordId: '712345678901234567',
  discordStatus: {
    status: 'dnd', // online, idle, dnd, offline
    activity: 'Playing Spotify',
    details: 'After Dark - Mr. Kitty',
    state: 'whose.baby/ares'
  },
  theme: {
    primaryColor: '#EE6F35',
    cardBackground: 'rgba(17, 17, 17, 0.75)',
    cardBorder: 'rgba(238, 111, 53, 0.25)',
    cardBlur: 20,
    cardRadius: '24px',
    backgroundEffect: 'stars', // 'stars', 'rain', 'grid', 'none'
    fontFamily: 'Plus Jakarta Sans',
    glowIntensity: 'medium', // 'low', 'medium', 'high', 'none'
    showViews: true,
    showBadges: true,
    typewriterBio: true,
  },
  audio: {
    enabled: true,
    autoplayOnClick: true,
    title: 'After Dark',
    artist: 'Mr.Kitty',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
    volume: 0.6,
  },
  links: [
    { id: '1', title: 'Discord Community', url: 'https://discord.gg', icon: 'discord', clicks: 342 },
    { id: '2', title: 'Spotify Playlist', url: 'https://spotify.com', icon: 'spotify', clicks: 215 },
    { id: '3', title: 'GitHub Profile', url: 'https://github.com/sexcramp', icon: 'github', clicks: 189 },
    { id: '4', title: 'Telegram Channel', url: 'https://t.me', icon: 'telegram', clicks: 120 },
    { id: '5', title: 'Instagram', url: 'https://instagram.com', icon: 'instagram', clicks: 94 },
  ]
};

export const getStoredProfiles = () => {
  try {
    const raw = localStorage.getItem('whose_baby_profiles');
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading profiles from localStorage', e);
  }
  return { ares: DEFAULT_PROFILE };
};

export const getProfileByUsername = (username) => {
  const profiles = getStoredProfiles();
  const cleanUsername = username?.toLowerCase().replace('@', '') || 'ares';
  
  if (profiles[cleanUsername]) {
    return profiles[cleanUsername];
  }
  
  // Return default profile configured with that requested username
  return {
    ...DEFAULT_PROFILE,
    username: cleanUsername,
    displayName: cleanUsername.charAt(0).toUpperCase() + cleanUsername.slice(1),
    bio: `Welcome to my whose.baby link! ✨\nCustomize me in the dashboard.`,
    views: Math.floor(Math.random() * 50) + 1,
    uid: Math.floor(Math.random() * 899) + 100,
  };
};

export const saveProfile = (profile) => {
  try {
    const profiles = getStoredProfiles();
    const cleanUsername = profile.username.toLowerCase().replace('@', '');
    profiles[cleanUsername] = {
      ...profile,
      username: cleanUsername,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem('whose_baby_profiles', JSON.stringify(profiles));
    localStorage.setItem('whose_baby_current_user', cleanUsername);
    return true;
  } catch (e) {
    console.error('Error saving profile', e);
    return false;
  }
};

export const getCurrentUser = () => {
  try {
    const username = localStorage.getItem('whose_baby_current_user') || 'ares';
    return getProfileByUsername(username);
  } catch (e) {
    return DEFAULT_PROFILE;
  }
};

export const incrementProfileViews = (username) => {
  try {
    const profiles = getStoredProfiles();
    const cleanUsername = username.toLowerCase().replace('@', '');
    if (profiles[cleanUsername]) {
      profiles[cleanUsername].views = (profiles[cleanUsername].views || 0) + 1;
      localStorage.setItem('whose_baby_profiles', JSON.stringify(profiles));
    }
  } catch (e) {}
};
