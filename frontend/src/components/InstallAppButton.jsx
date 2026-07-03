import React from 'react';
import { Download } from 'lucide-react';
import { usePWAInstall } from '../context/PWAInstallContext';

/**
 * Navbar Install App button — visible only when the browser supports install
 * and the app is not already installed.
 */
const InstallAppButton = ({ className = '' }) => {
  const { canInstall, isInstalled, install } = usePWAInstall();

  if (isInstalled || !canInstall) return null;

  const handleClick = async () => {
    const { outcome } = await install();
    if (outcome === 'unavailable') {
      // iOS Safari and some browsers don't support beforeinstallprompt
      alert(
        'To install MCA App:\n\n' +
          '• Android Chrome: Menu → Install App\n' +
          '• iPhone Safari: Share → Add to Home Screen',
      );
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`btn-secondary h-8 px-3 text-xs gap-1.5 shrink-0 ${className}`}
      aria-label="Install MCA App"
    >
      <Download size={14} />
      Install App
    </button>
  );
};

export default InstallAppButton;
