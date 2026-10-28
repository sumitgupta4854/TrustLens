import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Eye,
  BookmarkCheck,
  MessageSquareReply,
  Compass,
  Lock,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  MessageCircle,
  Menu,
  X,
  BarChart3,
  Search,
  BookOpen,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { Button } from '../components/ui/Button';

export function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-lightbg-100 dark:bg-midnight-950 text-txt-lightPrimary dark:text-txt-darkPrimary selection:bg-teal-500/20">
      {/* Modern, High-Contrast Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/95 dark:bg-midnight-950/95 border-b border-lightbg-300 dark:border-midnight-700 shadow-soft-sm transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-teal-500 flex items-center justify-center shadow-soft-sm group-hover:scale-105 transition-transform duration-200">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-txt-lightPrimary dark:text-txt-darkPrimary">
              Trust<span className="text-teal-600 dark:text-teal-400">Lens</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-xs lg:text-sm font-semibold">
            <a
              href="#features"
              className="px-3 py-1.5 rounded-xl text-txt-lightSecondary dark:text-txt-darkSecondary hover:text-teal-700 dark:hover:text-teal-300 hover:bg-teal-500/10 transition-all duration-150"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="px-3 py-1.5 rounded-xl text-txt-lightSecondary dark:text-txt-darkSecondary hover:text-teal-700 dark:hover:text-teal-300 hover:bg-teal-500/10 transition-all duration-150"
            >
              How It Works
            </a>
            <Link
              to="/analyze"
              className="px-3 py-1.5 rounded-xl text-txt-lightSecondary dark:text-txt-darkSecondary hover:text-teal-700 dark:hover:text-teal-300 hover:bg-teal-500/10 transition-all duration-150 flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5 text-teal-500" />
              <span>Analyzer</span>
            </Link>
            <Link
              to="/analyze?tab=dashboard"
              className="px-3 py-1.5 rounded-xl text-txt-lightSecondary dark:text-txt-darkSecondary hover:text-teal-700 dark:hover:text-teal-300 hover:bg-teal-500/10 transition-all duration-150 flex items-center gap-1.5"
            >
              <BarChart3 className="w-3.5 h-3.5 text-teal-500" />
              <span>Analysis Dashboard</span>
            </Link>
            <Link
              to="/chat"
              className="px-3 py-1.5 rounded-xl text-teal-700 dark:text-teal-300 bg-teal-500/10 hover:bg-teal-500/20 transition-all duration-150 flex items-center gap-1.5 font-bold"
            >
              <MessageCircle className="w-3.5 h-3.5 text-teal-500" />
              <span>AI Chat</span>
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
            </Link>
            <Link
              to="/safety-guide"
              className="px-3 py-1.5 rounded-xl text-txt-lightSecondary dark:text-txt-darkSecondary hover:text-teal-700 dark:hover:text-teal-300 hover:bg-teal-500/10 transition-all duration-150"
            >
              Safety Guide
            </Link>
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Link to="/login">
              <Button variant="ghost" size="sm" className="font-semibold text-xs">
                Log In
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" size="sm" className="font-semibold text-xs shadow-soft-sm hover:shadow-soft-md">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu & Theme Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-txt-lightSecondary dark:text-txt-darkSecondary hover:bg-lightbg-200 dark:hover:bg-midnight-850 hover:text-txt-lightPrimary dark:hover:text-txt-darkPrimary transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-lightbg-300 dark:border-midnight-700 bg-white/98 dark:bg-midnight-950/98 px-4 pt-3 pb-6 space-y-3 shadow-soft-xl animate-fade-in-up">
            <nav className="flex flex-col space-y-1 text-sm font-semibold">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-xl hover:bg-teal-500/10 text-txt-lightPrimary dark:text-txt-darkPrimary flex items-center justify-between"
              >
                <span>Features</span>
                <ChevronRight className="w-4 h-4 text-txt-lightSecondary" />
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-xl hover:bg-teal-500/10 text-txt-lightPrimary dark:text-txt-darkPrimary flex items-center justify-between"
              >
                <span>How It Works</span>
                <ChevronRight className="w-4 h-4 text-txt-lightSecondary" />
              </a>
              <Link
                to="/analyze"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-xl hover:bg-teal-500/10 text-txt-lightPrimary dark:text-txt-darkPrimary flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-teal-500" />
                  <span>Conversation Analyzer</span>
                </span>
                <ChevronRight className="w-4 h-4 text-txt-lightSecondary" />
              </Link>
              <Link
                to="/analyze?tab=dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-xl hover:bg-teal-500/10 text-txt-lightPrimary dark:text-txt-darkPrimary flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-teal-500" />
                  <span>Analysis Dashboard</span>
                </span>
                <ChevronRight className="w-4 h-4 text-txt-lightSecondary" />
              </Link>
              <Link
                to="/chat"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-xl bg-teal-500/10 text-teal-700 dark:text-teal-300 flex items-center justify-between font-bold"
              >
                <span className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-teal-500" />
                  <span>AI Safety Chat</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500 text-white font-mono">LIVE</span>
              </Link>
              <Link
                to="/safety-guide"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-xl hover:bg-teal-500/10 text-txt-lightPrimary dark:text-txt-darkPrimary flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-teal-500" />
                  <span>Safety Guide</span>
                </span>
                <ChevronRight className="w-4 h-4 text-txt-lightSecondary" />
              </Link>
              <Link
                to="/privacy"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-xl hover:bg-teal-500/10 text-txt-lightPrimary dark:text-txt-darkPrimary flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-teal-500" />
                  <span>Privacy Policy</span>
                </span>
                <ChevronRight className="w-4 h-4 text-txt-lightSecondary" />
              </Link>
            </nav>

            <div className="pt-3 border-t border-lightbg-300 dark:border-midnight-700 flex flex-col gap-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="secondary" size="md" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" size="md" className="w-full shadow-soft-sm">
                  Create Free Account
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-100 dark:bg-teal-500/15 text-teal-800 dark:text-teal-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>AI-Powered Dating Safety Companion</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Understand the Pattern. <br />
              <span className="text-teal-600 dark:text-teal-400">Protect Your Boundaries.</span>
            </h1>

            <p className="text-base sm:text-lg text-txt-lightSecondary dark:text-txt-darkSecondary leading-relaxed max-w-2xl">
              AI-driven insights that help you recognize concerning conversation patterns, understand your personal boundaries, and make more confident decisions about your dating connections.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link to="/analyze">
                <Button variant="primary" size="lg" className="gap-2 shadow-soft-sm hover:shadow-soft-md">
                  <span>Analyze a Conversation</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/chat">
                <Button variant="coral" size="lg" className="gap-2 shadow-soft-sm hover:shadow-soft-md">
                  <MessageCircle className="w-4 h-4" />
                  <span>Talk with AI Safety Chat</span>
                </Button>
              </Link>
            </div>

            <div className="p-3.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs text-txt-lightPrimary dark:text-txt-darkPrimary flex items-center gap-3">
              <Lock className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
              <span>
                <strong>Privacy-First Guarantee:</strong> Raw conversation texts are processed strictly in memory and never stored in the database.
              </span>
            </div>
          </div>

          {/* Product Preview Visual */}
          <div className="lg:col-span-5">
            <div className="card p-5 border border-lightbg-300 dark:border-midnight-700 shadow-soft-xl bg-white dark:bg-midnight-900 relative">
              <div className="flex items-center justify-between pb-3 border-b border-lightbg-200 dark:border-midnight-800 text-xs font-medium">
                <span className="text-txt-lightSecondary dark:text-txt-darkSecondary flex items-center gap-1.5 font-semibold">
                  <Shield className="w-3.5 h-3.5 text-teal-500" />
                  TrustLens Live Intelligence
                </span>
                <span className="badge-moderate">Moderate Concern</span>
              </div>

              {/* Mock Chat Snippet */}
              <div className="my-4 space-y-2 text-xs">
                <div className="p-3 rounded-2xl bg-lightbg-200 dark:bg-midnight-800 text-txt-lightPrimary dark:text-txt-darkPrimary max-w-[85%] leading-relaxed">
                  "I had an emergency with my flight tickets... could you wire me $100? If you cared about me you wouldn't say no."
                </div>
                <div className="flex justify-end">
                  <div className="p-3 rounded-2xl bg-teal-600 text-white max-w-[80%] font-medium leading-relaxed">
                    "I don't send money or transfer funds to online connections."
                  </div>
                </div>
              </div>

              {/* Analysis Callout */}
              <div className="p-3.5 rounded-xl bg-coral-500/10 border border-coral-500/20 text-xs space-y-1.5">
                <div className="font-bold text-coral-600 dark:text-coral-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>Detected Pattern: Financial Urgency + Emotional Guilt</span>
                </div>
                <p className="text-txt-lightSecondary dark:text-txt-darkSecondary text-[11px] leading-relaxed">
                  Cross-checked against your boundary: <em>"I do not send money to someone I just met."</em> Status: <strong>Repeatedly challenged</strong>.
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-lightbg-200 dark:border-midnight-800 flex items-center justify-between text-xs">
                <span className="text-txt-lightSecondary dark:text-txt-darkSecondary font-medium">Reply Coach: Firm</span>
                <span className="text-coral-600 dark:text-coral-400 font-bold">"I do not send money. Please respect that."</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-midnight-900 border-y border-lightbg-300 dark:border-midnight-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs uppercase tracking-widest font-bold text-teal-600 dark:text-teal-400">Core Capabilities</h2>
            <p className="text-3xl font-extrabold text-txt-lightPrimary dark:text-txt-darkPrimary">
              Engineered for Relationship Safety & Peace of Mind
            </p>
            <p className="text-sm text-txt-lightSecondary dark:text-txt-darkSecondary">
              TrustLens combines multi-conversation intelligence with boundary awareness to keep you confident and secure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card p-6 border border-lightbg-300 dark:border-midnight-700 hover:border-teal-400 dark:hover:border-teal-500 transition-all duration-150">
              <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-500/20 flex items-center justify-center mb-4 text-teal-700 dark:text-teal-300">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold mb-2">AI Pattern Intelligence</h3>
              <p className="text-xs text-txt-lightSecondary dark:text-txt-darkSecondary leading-relaxed">
                Identifies repeated manipulation tactics like guilt-tripping, isolation, rushed pacing, and private photo pressure.
              </p>
            </div>

            <div className="card p-6 border border-lightbg-300 dark:border-midnight-700 hover:border-teal-400 dark:hover:border-teal-500 transition-all duration-150">
              <div className="w-10 h-10 rounded-xl bg-coral-500/15 flex items-center justify-center mb-4 text-coral-600 dark:text-coral-400">
                <BookmarkCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold mb-2">Boundary Tracker</h3>
              <p className="text-xs text-txt-lightSecondary dark:text-txt-darkSecondary leading-relaxed">
                Define your personal boundaries. TrustLens automatically cross-references conversation excerpts against your rules.
              </p>
            </div>

            <div className="card p-6 border border-lightbg-300 dark:border-midnight-700 hover:border-teal-400 dark:hover:border-teal-500 transition-all duration-150">
              <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-500/20 flex items-center justify-center mb-4 text-teal-700 dark:text-teal-300">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold mb-2">Cross-Conversation Trends</h3>
              <p className="text-xs text-txt-lightSecondary dark:text-txt-darkSecondary leading-relaxed">
                Centralized dashboard synthesizing recurring topics, sentiment progression, and overarching safety patterns.
              </p>
            </div>

            <div className="card p-6 border border-lightbg-300 dark:border-midnight-700 hover:border-teal-400 dark:hover:border-teal-500 transition-all duration-150">
              <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-500/20 flex items-center justify-center mb-4 text-teal-700 dark:text-teal-300">
                <MessageSquareReply className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold mb-2">AI Reply Coach</h3>
              <p className="text-xs text-txt-lightSecondary dark:text-txt-darkSecondary leading-relaxed">
                Provides gentle, firm, and direct pre-crafted boundary responses tailored to protect your comfort level.
              </p>
            </div>

            <div className="card p-6 border border-lightbg-300 dark:border-midnight-700 hover:border-teal-400 dark:hover:border-teal-500 transition-all duration-150">
              <div className="w-10 h-10 rounded-xl bg-coral-500/15 flex items-center justify-center mb-4 text-coral-600 dark:text-coral-400">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold mb-2">Interactive AI Safety Chat</h3>
              <p className="text-xs text-txt-lightSecondary dark:text-txt-darkSecondary leading-relaxed">
                Have a supportive dialogue with TrustLens AI to talk through confusing situations, boundary setting, and safe exits.
              </p>
            </div>

            <div className="card p-6 border border-lightbg-300 dark:border-midnight-700 hover:border-teal-400 dark:hover:border-teal-500 transition-all duration-150">
              <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-500/20 flex items-center justify-center mb-4 text-teal-700 dark:text-teal-300">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold mb-2">Privacy-First Architecture</h3>
              <p className="text-xs text-txt-lightSecondary dark:text-txt-darkSecondary leading-relaxed">
                Conversation texts are never logged or stored. Analysis history is strictly opt-in and stores structured findings only.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-xs uppercase tracking-widest font-bold text-teal-600 dark:text-teal-400">Simple 3-Step Flow</h2>
          <p className="text-3xl font-extrabold text-txt-lightPrimary dark:text-txt-darkPrimary">
            How TrustLens Works
          </p>
          <p className="text-sm text-txt-lightSecondary dark:text-txt-darkSecondary">
            Objective analysis in seconds without sacrificing your personal privacy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card p-6 border border-lightbg-300 dark:border-midnight-700 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-lg mx-auto">
              1
            </div>
            <h3 className="text-base font-bold">Select Feature & Paste Text</h3>
            <p className="text-xs text-txt-lightSecondary dark:text-txt-darkSecondary leading-relaxed">
              Choose your focus area from the dedicated Feature Dropdown and paste messages, with optional PII auto-redaction.
            </p>
          </div>

          <div className="card p-6 border border-lightbg-300 dark:border-midnight-700 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-coral-500/20 text-coral-600 dark:text-coral-400 flex items-center justify-center font-bold text-lg mx-auto">
              2
            </div>
            <h3 className="text-base font-bold">Review Evidence Insights</h3>
            <p className="text-xs text-txt-lightSecondary dark:text-txt-darkSecondary leading-relaxed">
              Examine identified patterns, exact excerpts, positive communication signals, and boundary checks.
            </p>
          </div>

          <div className="card p-6 border border-lightbg-300 dark:border-midnight-700 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-lg mx-auto">
              3
            </div>
            <h3 className="text-base font-bold">Explore Cross-Chat Dashboard</h3>
            <p className="text-xs text-txt-lightSecondary dark:text-txt-darkSecondary leading-relaxed">
              Track recurring topics, cross-conversation trends, and strategic relationship recommendations over time.
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Guarantee Banner */}
      <section className="py-16 bg-white dark:bg-midnight-900 border-t border-lightbg-300 dark:border-midnight-700">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-txt-lightPrimary dark:text-txt-darkPrimary">
            Our Responsible AI & Privacy Commitment
          </h2>
          <p className="text-sm text-txt-lightSecondary dark:text-txt-darkSecondary max-w-2xl mx-auto leading-relaxed">
            TrustLens does not claim to verify anyone's true identity, guarantee complete safety, or conclusively determine someone's character. We analyze message patterns so you can make informed decisions while retaining full ownership of your data.
          </p>
          <div className="pt-2">
            <Link to="/privacy">
              <Button variant="secondary" size="sm">Read Privacy Policy</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-lightbg-100 dark:bg-midnight-950 border-t border-lightbg-300 dark:border-midnight-700 text-xs text-txt-lightSecondary dark:text-txt-darkSecondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-teal-500" />
              <span className="font-bold text-txt-lightPrimary dark:text-txt-darkPrimary text-sm">TrustLens</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Don't Just Read the Message. Understand the Pattern.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-txt-lightPrimary dark:text-txt-darkPrimary mb-2">Product</h4>
            <ul className="space-y-1.5 font-medium">
              <li><Link to="/analyze" className="hover:text-teal-600 dark:hover:text-teal-400">Conversation Analyzer</Link></li>
              <li><Link to="/analyze?tab=dashboard" className="hover:text-teal-600 dark:hover:text-teal-400">Analysis Dashboard</Link></li>
              <li><Link to="/chat" className="hover:text-teal-600 dark:hover:text-teal-400">AI Safety Chat</Link></li>
              <li><Link to="/boundaries" className="hover:text-teal-600 dark:hover:text-teal-400">Boundary Tracker</Link></li>
              <li><Link to="/reply-coach" className="hover:text-teal-600 dark:hover:text-teal-400">Reply Coach</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-txt-lightPrimary dark:text-txt-darkPrimary mb-2">Guidance</h4>
            <ul className="space-y-1.5 font-medium">
              <li><Link to="/safety-guide" className="hover:text-teal-600 dark:hover:text-teal-400">Safety Guide</Link></li>
              <li><Link to="/privacy" className="hover:text-teal-600 dark:hover:text-teal-400">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-teal-600 dark:hover:text-teal-400">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-txt-lightPrimary dark:text-txt-darkPrimary mb-2">Security Architecture</h4>
            <p className="text-[11px] leading-relaxed">
              JWT token rotation, argon2/bcrypt password hashing, MongoDB Atlas isolation, and strict in-memory conversation analysis.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
