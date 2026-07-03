import React, { useState, useEffect } from 'react';
import { Download, X, Shield } from 'lucide-react';
import { usePWAInstall } from '../context/PWAInstallContext';

/**
 * InstallPrompt — PWA install banner at bottom of screen.
 * Dismissed state persisted in localStorage.
 */
const InstallPrompt = () => {
  const { canInstall, isInstalled, install } = usePWAInstall();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed || isInstalled) return undefined;

    if (!canInstall) return undefined;

    const timer = setTimeout(() => setShowBanner(true), 2000);
    return () => clearTimeout(timer);
  }, [canInstall, isInstalled]);

  const handleInstall = async () => {
    const { outcome } = await install();
    if (outcome === 'accepted') {
      setShowBanner(false);
      localStorage.setItem('pwa-install-dismissed', 'true');
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!showBanner || isInstalled) return null;

  return (
    <div
      role="banner"
      aria-label="Install MCA App"
      className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-safe animate-slide-up"
      style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}
    >
      <div className="max-w-md mx-auto bg-white border border-border rounded-xl shadow-lg p-4 flex items-center gap-3">
        <div className="w-11 h-11 bg-primary rounded-xl flex items-center justify-center shrink-0">
          <Shield size={20} className="text-primary-foreground" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground leading-tight">Install MCA App</p>
          <p className="text-xs text-muted-foreground mt-0.5">Add to home screen for quick access</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            id="pwa-install-btn"
            type="button"
            onClick={handleInstall}
            className="btn-primary h-8 px-3 text-xs gap-1.5"
            aria-label="Install app"
          >
            <Download size={12} />
            Install
          </button>
          <button
            id="pwa-dismiss-btn"
            type="button"
            onClick={handleDismiss}
            className="w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Dismiss install prompt"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;
