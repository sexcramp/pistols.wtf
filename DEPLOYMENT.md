# pistols.wtf — Deployment & Architecture Guide

This guide details everything configured for **pistols.wtf**, instructions for deploying to **Vercel** with 0 funds, and the roadmap for post-deployment features.

---

## 🚀 1. What Has Been Completed Before Deployment

### 1. Route Flow & Protection
- **Flow**: `Landing Page (/)` ➔ `Login Page (/login & /register)` ➔ `Dashboard Page (/dashboard)`.
- **Protected Routes**:
  - Visiting `/dashboard` without being logged in immediately redirects to `/login`.
  - Logged in users visiting `/dashboard` have their session remembered and enter directly.
  - Logged in users visiting `/login` or `/register` are redirected straight into `/dashboard`.
  - Browser back/forward history properly updates URL and views without flashing or desync.

### 2. Login Page with Google & Discord Bot Authorization
- **Official Google Sign-In**:
  - Device Google Account Chooser dialog showing device Gmail accounts or custom Gmail typing.
  - Standard Google permission disclosure (*name, email, profile picture*).
  - Automatically initializes account with Google display name and email.
- **Discord Bot Authorization**:
  - Authorizes the pistols.wtf bot to sync user status, Discord avatar, and Spotify activity.
  - Grants the pistols.wtf server role.
  - Discord is **optional**: users can sign in with Google or credentials first and link Discord later.
- **Direct Credentials Form**:
  - Standard username/password registration and login with real-time `pistols.wtf/yourname` preview.

### 3. Dashboard Features (guns.lol & feds.lol inspired)
- **PFP & Wallpaper Device Upload System**:
  - Real file inputs (`<input type="file" accept="image/*">`) allowing users to upload images directly from device storage.
  - Client-side image optimization (HTML5 Canvas compression) ensuring fast uploads and zero storage quota crashes while preserving GIF animations.
  - Option to enter external image URLs or sync directly with Discord PFP.
  - Solid black default background with wallpaper reset toggle.
- **Links System**:
  - Add links with platform icons (Discord, Spotify, GitHub, Instagram, YouTube, X/Twitter, TikTok, Telegram, Twitch, Kick, Steam, Soundcloud, Custom Website).
  - Reorder links up and down with dedicated order controls.
  - In-place Edit Link modal and Delete with live preview.
- **Guns.lol / Feds.lol Badge Suite**:
  - Badges: `Owner 👑`, `Developer 💻`, `Staff 🛡️`, `Verified ✔️`, `Premium 💎`, `Supporter 💖`, `OG Member ⚡`, `Halloween 🎃`, `Bug Hunter 🐛`.
  - Full monochrome badge toggle with customizable color picker.
- **Profile Appearance & Settings**:
  - 3D Card Tilt toggle (moving card on hover).
  - Layout switchers (Floating Avatar, Stacked, Compact Row).
  - Audio player with track upload and click-to-enter splash screen.
  - Working Logout button that clears session and returns to landing.

### 4. Vercel SPA Routing Configuration
- `vercel.json` rewrites all sub-routes (`/login`, `/register`, `/dashboard`, `/:username`) to `/index.html` for single-page routing without 404 errors.

---

## 📦 2. How to Deploy to Vercel (100% Free)

Since you don't have funds right now, Vercel's free tier provides unlimited bandwidth and automatic CI/CD from your GitHub repository:

1. **Push your code to GitHub** (already configured to `sexcramp/pistols.wtf`).
2. Go to [https://vercel.com](https://vercel.com) and log in with your GitHub account (`sexcramp`).
3. Click **"Add New..."** ➔ **"Project"**.
4. Select the **`pistols.wtf`** repository and click **"Import"**.
5. Leave all build settings as default:
   - **Framework Preset**: `Vite`
   - **Build Command**: `node node_modules/vite/bin/vite.js build` (or `npm run build`)
   - **Output Directory**: `dist`
6. Click **"Deploy"**.
7. In ~30 seconds, your site will be live at `https://pistols-wtf.vercel.app`!

### Connecting Your Custom Domain (`pistols.wtf`):
1. In your Vercel Project Dashboard, navigate to **Settings** ➔ **Domains**.
2. Enter `pistols.wtf` (and `www.pistols.wtf`) and click **Add**.
3. In your domain registrar (Namecheap, Cloudflare, etc.), add the DNS records shown by Vercel:
   - **A Record**: `@` pointing to `76.76.21.21`
   - **CNAME Record**: `www` pointing to `cname.vercel-dns.com`

---

## 🔮 3. What to Configure After Deployment

Once the site is deployed and you want to scale up:

1. **Free Cloud Database & Storage (Supabase)**:
   - Create a free project at [supabase.com](https://supabase.com).
   - In Vercel Project Settings ➔ **Environment Variables**, add:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
   - This allows users who create accounts on one device to access their biolinks across all devices.

2. **Official Google Cloud OAuth**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
   - Create an OAuth 2.0 Web Client ID with Authorized Origin: `https://pistols.wtf`.
   - Add `VITE_GOOGLE_CLIENT_ID` in Vercel.

3. **Discord Bot & Lanyard Status Integration**:
   - In [Discord Developer Portal](https://discord.com/developers/applications), set OAuth2 Redirect to `https://pistols.wtf/dashboard`.
   - Users who join your Discord server will have their live Spotify song, custom status, and online presence streamed via the public Lanyard API (`api.lanyard.rest`).
