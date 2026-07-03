# 7. PWA Implementation

## 7.1 What Is a PWA?

A **Progressive Web Application** is a web app that uses modern browser capabilities to deliver an app-like experience: installable, offline-capable, and launchable in standalone mode without a browser address bar.

MCA App is built as a PWA using **React + Vite** with **vite-plugin-pwa** — no separate native mobile app is required.

## 7.2 PWA Features Implemented

| Feature | Implementation | File(s) |
|---------|----------------|---------|
| Web App Manifest | App name, icons, theme, standalone display | `public/manifest.json`, `vite.config.js` |
| Service Worker | Workbox-generated SW; caches app shell | vite-plugin-pwa |
| Offline fallback | Static page when network unavailable | `public/offline.html` |
| Install prompt | `beforeinstallprompt` banner | `InstallPrompt.jsx` |
| Install button | Navbar button triggers native dialog | `InstallAppButton.jsx` |
| Shared install state | Context provider for install availability | `PWAInstallContext.jsx` |
| Auto update | Silent SW update on new deployment | `main.jsx` → `registerSW` |
| Safe areas | iPhone notch and home bar padding | `index.css`, `DashboardLayout.jsx` |
| Apple PWA meta | Add to Home Screen on iOS | `index.html` |

## 7.3 Install Flow

### Chrome / Edge (Android & Desktop)

1. User visits the app in Chrome
2. Browser fires `beforeinstallprompt` event
3. **Install App** button appears in navbar
4. User clicks button → native install dialog
5. App added to home screen / desktop; opens in standalone mode

### iOS Safari

Safari does not support `beforeinstallprompt`. Users install manually:

1. Open app in Safari
2. Tap **Share** → **Add to Home Screen**
3. App icon appears on home screen

## 7.4 Offline Behaviour

| Resource | Strategy |
|----------|----------|
| Static assets (JS, CSS, HTML, icons) | Cached by service worker |
| API calls (`/api/*`) | Network-first — never cached |
| Navigation | Falls back to `index.html` app shell |
| No network at all | Shows `offline.html` fallback page |

## 7.5 Manifest Configuration

```json
{
  "name": "MCA App — Secure Escrow Platform",
  "short_name": "MCA App",
  "display": "standalone",
  "theme_color": "#18181b",
  "background_color": "#ffffff",
  "start_url": "/"
}
```

Icons: 192×192, 512×512 (maskable), 180×180 Apple touch icon.

## 7.6 Mobile-First UI

- Bottom tab bar on screens below `lg` breakpoint
- Sidebar navigation on desktop
- Wallet balance strip on mobile header area
- Touch-optimized buttons (`touch-action: manipulation`)
- Responsive tables with horizontal scroll on small screens

## 7.7 Production Requirements

For PWA install to work in production:

- Serve over **HTTPS**
- Valid manifest and service worker registered
- Icons meeting minimum size requirements
- Meets Chrome installability criteria (engagement heuristics may apply)
