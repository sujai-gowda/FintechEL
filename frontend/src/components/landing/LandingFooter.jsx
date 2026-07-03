import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { FOOTER_LINKS } from '../../constants/landing';

const LandingFooter = () => (
  <footer className="border-t border-border bg-muted/30">
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between gap-8">
        <div>
          <Link to="/" className="flex items-center gap-2 font-semibold text-foreground mb-3">
            <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
              <Shield size={14} className="text-primary-foreground" />
            </div>
            MCA App
          </Link>
          <p className="text-sm text-muted-foreground max-w-xs">
            Secure escrow checkout for freelance jobs. Hold funds safely until work is approved.
          </p>
        </div>

        <div className="flex flex-wrap gap-8">
          {FOOTER_LINKS.map(({ label, href }) => (
            <a key={href} href={href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {label}
            </a>
          ))}
          <Link to="/register" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Sign up
          </Link>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-border text-xs text-muted-foreground">
        © {new Date().getFullYear()} MCA App Escrow Platform. Demo project for educational use.
      </div>
    </div>
  </footer>
);

export default LandingFooter;
