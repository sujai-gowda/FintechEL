import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Lock,
  Shield,
  Wallet,
  Briefcase,
  Scale,
  ChevronRight,
} from 'lucide-react';
import LandingHeader from '../components/landing/LandingHeader';
import LandingFooter from '../components/landing/LandingFooter';
import {
  HERO,
  PILLARS,
  FEATURES,
  WORKFLOW_STEPS,
  ROLE_SECTIONS,
  TOOLS,
  FAQ_ITEMS,
} from '../constants/landing';

const EscrowCheckoutMockup = () => (
  <div className="relative mx-auto w-full max-w-sm">
    <div className="card p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Escrow checkout</span>
        <Shield size={16} className="text-foreground" />
      </div>

      <div className="space-y-4">
        <div className="bg-muted rounded-md p-4">
          <p className="text-xs text-muted-foreground mb-1">Job</p>
          <p className="text-sm font-medium text-foreground">Build React dashboard</p>
          <p className="text-xs text-muted-foreground mt-2">Freelancer: user2</p>
        </div>

        <div className="flex justify-between items-center py-2 border-y border-border">
          <span className="text-sm text-muted-foreground">Amount held</span>
          <span className="text-lg font-semibold text-foreground">$2,500 USD</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <CheckCircle2 size={14} className="text-foreground" />
            Funds secured in escrow
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Lock size={14} className="text-foreground" />
            Released on client approval
          </div>
        </div>

        <button type="button" className="btn-primary w-full h-10">
          Fund escrow
        </button>
      </div>
    </div>

    <div className="absolute -z-10 -top-4 -right-4 w-full h-full bg-muted rounded-lg border border-border" />
  </div>
);

const Home = () => (
  <div className="min-h-screen bg-white text-foreground">
    <LandingHeader />

    <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="animate-fade-in">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
            {HERO.eyebrow}
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground leading-tight mb-6">
            {HERO.title}
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-lg">
            {HERO.description}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/register" className="btn-primary h-11 px-6 gap-2">
              {HERO.primaryCta}
              <ArrowRight size={16} />
            </Link>
            <a href="#how-it-works" className="btn-secondary h-11 px-6">
              {HERO.secondaryCta}
            </a>
          </div>
        </div>

        <div className="animate-slide-up lg:justify-self-end w-full">
          <EscrowCheckoutMockup />
        </div>
      </div>
    </section>

    <section className="border-y border-border bg-muted/30">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold tracking-tight mb-3">Simple. Secure. Flexible.</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Simplify escrow setup. Simplify compliance. Get back to delivering great work.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {PILLARS.map(({ title, subtitle, description }) => (
            <div key={title} className="card p-6">
              <h3 className="text-xl font-semibold mb-1">{title}.</h3>
              <p className="text-sm font-medium text-foreground mb-3">{subtitle}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section id="features" className="max-w-6xl mx-auto px-6 py-16 md:py-20">
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight mb-4">
            Flexible escrow integration
          </h2>
          <p className="text-muted-foreground mb-8">
            Three clear paths to move from job posting to protected payment — whether you are a client, freelancer, or admin.
          </p>

          <div className="space-y-4">
            {FEATURES.map(({ title, description }) => (
              <div key={title} className="flex gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center shrink-0">
                  <CheckCircle2 size={18} className="text-foreground" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">{title}</h3>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-8">
          <h3 className="text-lg font-semibold mb-6">Platform capabilities</h3>
          <ul className="space-y-4">
            {[
              { icon: Wallet, label: 'Multi-currency wallets with admin balance assignment' },
              { icon: Briefcase, label: 'Job marketplace with create, edit, and delete' },
              { icon: Shield, label: 'Escrow states: HELD → SUBMITTED → RELEASED' },
              { icon: Scale, label: 'Dispute resolution and refund flows' },
            ].map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-start gap-3 text-sm">
                <Icon size={18} className="text-foreground mt-0.5 shrink-0" />
                <span className="text-muted-foreground">{label}</span>
              </li>
            ))}
          </ul>
          <Link to="/register" className="btn-primary w-full mt-8 h-10 gap-2">
            Explore the platform
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </section>

    <section id="how-it-works" className="bg-primary text-primary-foreground">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold tracking-tight mb-3">Boost trust with escrow checkout</h2>
          <p className="text-primary-foreground/70 max-w-xl mx-auto">
            Offer clients and freelancers a payment flow that protects both sides until work is done.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {WORKFLOW_STEPS.map(({ step, title, description }) => (
            <div key={step} className="border border-white/10 rounded-lg p-6 bg-white/5">
              <span className="text-xs font-mono text-primary-foreground/50">{step}</span>
              <h3 className="text-lg font-semibold mt-2 mb-2">{title}</h3>
              <p className="text-sm text-primary-foreground/70">{description}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/register" className="inline-flex items-center justify-center rounded-md bg-white text-primary px-6 h-11 text-sm font-medium hover:bg-white/90 transition-colors gap-2">
            Sign up free
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>

    <section className="max-w-6xl mx-auto px-6 py-16 md:py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-semibold tracking-tight mb-3">Built for every role</h2>
        <p className="text-muted-foreground">One platform for clients, freelancers, and administrators.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {ROLE_SECTIONS.map(({ id, title, description, points }) => (
          <div key={id} id={id} className="card p-6 flex flex-col">
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground mb-5 flex-grow">{description}</p>
            <ul className="space-y-2">
              {points.map((point) => (
                <li key={point} className="flex items-center gap-2 text-sm text-foreground">
                  <CheckCircle2 size={14} className="text-muted-foreground shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>

    <section className="border-y border-border bg-muted/30">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold tracking-tight mb-3">Tools to run your escrow business</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {TOOLS.map(({ title, description }) => (
            <div key={title} className="card p-6 text-center">
              <h3 className="font-semibold mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section id="faq" className="max-w-3xl mx-auto px-6 py-16 md:py-20">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-semibold tracking-tight mb-3">Frequently asked questions</h2>
      </div>

      <div className="space-y-4">
        {FAQ_ITEMS.map(({ question, answer }) => (
          <div key={question} className="card p-6">
            <h3 className="font-medium text-foreground mb-2">{question}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{answer}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="bg-primary text-primary-foreground">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
          One platform for secure freelance payments
        </h2>
        <p className="text-primary-foreground/70 mb-8 max-w-lg mx-auto">
          Post jobs, hold funds in escrow, and release payments with confidence.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/register" className="inline-flex items-center justify-center rounded-md bg-white text-primary px-6 h-11 text-sm font-medium hover:bg-white/90 transition-colors">
            Get started
          </Link>
          <Link to="/login" className="inline-flex items-center justify-center rounded-md border border-white/30 text-primary-foreground px-6 h-11 text-sm font-medium hover:bg-white/10 transition-colors">
            Log in
          </Link>
        </div>
      </div>
    </section>

    <LandingFooter />
  </div>
);

export default Home;
