import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, LogOut } from 'lucide-react';
import { formatINR } from '../../constants/currency';

const DashboardLayout = ({ children, navItems, title, subtitle, wallet }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-white border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <Shield size={16} className="text-primary-foreground" />
            </div>
            FintechEL
          </div>
          {wallet && (
            <div className="hidden sm:flex items-center gap-2 text-sm bg-muted px-3 py-1.5 rounded-md">
              <span className="text-muted-foreground">Wallet:</span>
              <span className="font-semibold">{formatINR(wallet.balance)}</span>
            </div>
          )}
          <div className="flex items-center gap-3">
            <span className="text-xs badge badge-secondary hidden sm:inline">{user?.role}</span>
            <button onClick={logout} className="btn-secondary h-8 px-3 text-xs gap-1">
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-56 shrink-0">
            <nav className="card p-2 space-y-1">
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

          <main className="flex-1 min-w-0">
            {(title || subtitle) && (
              <div className="mb-6">
                {title && <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>}
                {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
              </div>
            )}
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
