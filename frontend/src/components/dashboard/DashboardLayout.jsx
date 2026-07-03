import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, LogOut } from 'lucide-react';
import { formatINR } from '../../constants/currency';
import InstallAppButton from '../InstallAppButton';

const DashboardLayout = ({ children, navItems, title, subtitle, wallet }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-muted/30">
      {/* ── Top Header ─────────────────────────────────────────────── */}
      <header className="bg-white border-b border-border sticky top-0 z-40"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <Shield size={16} className="text-primary-foreground" />
            </div>
            MCA App
          </div>
          {wallet && (
            <div className="hidden sm:flex items-center gap-2 text-sm bg-muted px-3 py-1.5 rounded-md">
              <span className="text-muted-foreground">Wallet:</span>
              <span className="font-semibold">{formatINR(wallet.balance)}</span>
            </div>
          )}
          <div className="flex items-center gap-2 sm:gap-3">
            <InstallAppButton />
            <span className="text-xs badge badge-secondary hidden sm:inline">{user?.role}</span>
            <button onClick={logout} className="btn-secondary h-8 px-3 text-xs gap-1">
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* ── Page Body ──────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6
                      pb-24 lg:pb-6">
        {/* Mobile: wallet balance strip */}
        {wallet && (
          <div className="flex sm:hidden items-center justify-between bg-white border border-border rounded-lg px-4 py-2.5 mb-4 text-sm">
            <span className="text-muted-foreground">Wallet balance</span>
            <span className="font-semibold">{formatINR(wallet.balance)}</span>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* ── Desktop Sidebar (hidden on mobile) ─────────────────── */}
          <aside className="hidden lg:block lg:w-56 shrink-0">
            <nav className="card p-2 space-y-1 sticky top-20">
              {navItems.map(({ label, path, icon: Icon }) => (
                <button
                  key={path}
                  type="button"
                  onClick={() => navigate(path)}
                  className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === path
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </nav>
          </aside>

          {/* ── Main Content ────────────────────────────────────────── */}
          <main className="flex-1 min-w-0">
            {(title || subtitle) && (
              <div className="mb-6">
                {title && <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">{title}</h1>}
                {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
              </div>
            )}
            {children}
          </main>
        </div>
      </div>

      {/* ── Mobile Bottom Tab Bar (hidden on desktop) ─────────────── */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        aria-label="Mobile navigation"
      >
        <div className="flex items-stretch">
          {navItems.slice(0, 5).map(({ label, path, icon: Icon }) => {
            const active = location.pathname === path;
            return (
              <button
                key={path}
                type="button"
                onClick={() => navigate(path)}
                className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 min-h-[56px] text-[10px] font-medium transition-colors ${
                  active
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                aria-label={label}
                aria-current={active ? 'page' : undefined}
              >
                <Icon size={20} strokeWidth={active ? 2.5 : 1.75} />
                <span className="leading-none">{label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default DashboardLayout;

