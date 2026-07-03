import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, CheckCircle2 } from 'lucide-react';

const AUTH_FEATURES = [
  'Secure escrow fund holding',
  'Role-based client & freelancer access',
  'Admin oversight and dispute resolution',
];

const AuthLayout = ({ children, title, subtitle, footer }) => (
  <div className="min-h-screen grid lg:grid-cols-2">
    <div className="hidden lg:flex flex-col justify-between bg-primary text-primary-foreground p-12">
      <Link to="/" className="flex items-center gap-2 font-semibold w-fit">
        <div className="w-9 h-9 bg-white/10 rounded-md flex items-center justify-center">
          <Shield size={18} />
        </div>
        MCA App
      </Link>

      <div>
        <h1 className="text-3xl font-semibold tracking-tight mb-4 leading-tight">
          Secure payments for every freelance job
        </h1>
        <p className="text-primary-foreground/70 mb-8 max-w-md">
          Hold funds in escrow until work is approved. Built for clients, freelancers, and platform admins.
        </p>
        <ul className="space-y-3">
          {AUTH_FEATURES.map((feature) => (
            <li key={feature} className="flex items-center gap-3 text-sm text-primary-foreground/80">
              <CheckCircle2 size={16} className="shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <p className="text-xs text-primary-foreground/50">
        © {new Date().getFullYear()} MCA App Escrow Platform
      </p>
    </div>

    <div className="flex flex-col justify-center items-center p-6 sm:p-10 bg-white">
      <div className="lg:hidden mb-8">
        <Link to="/" className="flex items-center gap-2 font-semibold text-foreground">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <Shield size={16} className="text-primary-foreground" />
          </div>
          MCA App
        </Link>
      </div>

      <div className="w-full max-w-md animate-fade-in">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-2">{title}</h2>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>

        {children}

        {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
      </div>
    </div>
  </div>
);

export default AuthLayout;
