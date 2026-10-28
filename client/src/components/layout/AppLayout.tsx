import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Shield,
  LayoutDashboard,
  MessageCircle,
  Search,
  Bookmark,
  MessageSquareReply,
  CheckSquare,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  BarChart3,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ThemeToggle } from '../ui/ThemeToggle';
import { cn } from '../../utils';

const navItems = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'AI Safety Chat', href: '/chat', icon: MessageCircle },
  { label: 'Analyze Conversation', href: '/analyze', icon: Search },
  { label: 'Analysis Trends', href: '/analyze?tab=dashboard', icon: BarChart3 },
  { label: 'Boundary Tracker', href: '/boundaries', icon: Bookmark },
  { label: 'Reply Coach', href: '/reply-coach', icon: MessageSquareReply },
  { label: 'Safety Checklist', href: '/safety-checklist', icon: CheckSquare },
  { label: 'Settings', href: '/settings', icon: Settings },
];

function Logo() {
  return (
    <Link to="/dashboard" className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-xl bg-teal-500 flex items-center justify-center shadow-soft-sm">
        <Shield className="w-4.5 h-4.5 text-white" />
      </div>
      <span className="font-bold text-lg text-txt-lightPrimary dark:text-txt-darkPrimary tracking-tight">
        Trust<span className="text-teal-500">Lens</span>
      </span>
    </Link>
  );
}

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col bg-white dark:bg-midnight-900 border-r border-lightbg-300 dark:border-midnight-700',
        'transition-all duration-300 ease-in-out h-screen sticky top-0 shrink-0',
        collapsed ? 'w-16' : 'w-60'
      )}
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-lightbg-300 dark:border-midnight-700 h-16">
        {!collapsed && <Logo />}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-lightbg-200 dark:hover:bg-midnight-850 text-txt-lightSecondary dark:text-txt-darkSecondary transition-colors ml-auto"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2" aria-label="App navigation">
        {navItems.map(({ label, href, icon: Icon }) => {
          const currentPath = location.pathname + location.search;
          const isActive =
            href.includes('?')
              ? currentPath === href
              : location.pathname === href && !location.search.includes('tab=dashboard');
          return (
            <Link
              key={href}
              to={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 transition-all duration-150 group',
                isActive
                  ? 'bg-teal-100 dark:bg-teal-500/20 text-teal-800 dark:text-teal-300 font-semibold'
                  : 'text-txt-lightSecondary dark:text-txt-darkSecondary hover:bg-lightbg-200 dark:hover:bg-midnight-850 hover:text-txt-lightPrimary dark:hover:text-txt-darkPrimary'
              )}
              title={collapsed ? label : undefined}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className={cn('w-4.5 h-4.5 shrink-0', isActive ? 'text-teal-600 dark:text-teal-400' : '')} />
              {!collapsed && <span className="text-sm">{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-3 border-t border-lightbg-300 dark:border-midnight-700 space-y-2">
        {!collapsed && (
          <div className="px-3 py-2">
            <p className="text-xs font-semibold text-txt-lightPrimary dark:text-txt-darkPrimary truncate">
              {user?.name}
            </p>
            <p className="text-xs text-txt-lightSecondary dark:text-txt-darkSecondary truncate">
              {user?.email}
            </p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={cn(
            'flex items-center gap-3 px-3 py-2 w-full rounded-xl transition-all duration-150',
            'text-txt-lightSecondary dark:text-txt-darkSecondary hover:text-coral-500 dark:hover:text-coral-400 hover:bg-coral-50 dark:hover:bg-coral-400/10'
          )}
          title={collapsed ? 'Log out' : undefined}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Log out</span>}
        </button>
      </div>
    </aside>
  );
}

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setOpen(false);
  };

  return (
    <>
      <header className="lg:hidden sticky top-0 z-40 bg-white dark:bg-midnight-900 border-b border-lightbg-300 dark:border-midnight-700 h-14 flex items-center justify-between px-3 sm:px-4 max-w-full">
        <Logo />
        <div className="flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle />
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-xl hover:bg-lightbg-200 dark:hover:bg-midnight-850 text-txt-lightSecondary dark:text-txt-darkSecondary min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Drawer overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative bg-white dark:bg-midnight-900 w-[85vw] max-w-xs h-full shadow-xl flex flex-col animate-slide-in-left overflow-y-auto">
            <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-lightbg-300 dark:border-midnight-700">
              <Logo />
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-lg hover:bg-lightbg-200 dark:hover:bg-midnight-850 text-txt-lightSecondary min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-3 px-2">
              {navItems.map(({ label, href, icon: Icon }) => {
                const currentPath = location.pathname + location.search;
                const isActive =
                  href.includes('?')
                    ? currentPath === href
                    : location.pathname === href && !location.search.includes('tab=dashboard');
                return (
                  <Link
                    key={href}
                    to={href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-3 rounded-xl mb-0.5 transition-all min-h-[44px]',
                      isActive
                        ? 'bg-teal-100 dark:bg-teal-500/20 text-teal-800 dark:text-teal-300 font-semibold'
                        : 'text-txt-lightSecondary dark:text-txt-darkSecondary hover:bg-lightbg-200 dark:hover:bg-midnight-850'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon className={cn('w-4.5 h-4.5 shrink-0', isActive ? 'text-teal-600 dark:text-teal-400' : '')} />
                    <span className="text-sm font-medium">{label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-lightbg-300 dark:border-midnight-700 space-y-2">
              <div>
                <p className="text-sm font-semibold text-txt-lightPrimary dark:text-txt-darkPrimary">{user?.name}</p>
                <p className="text-xs text-txt-lightSecondary dark:text-txt-darkSecondary">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2 w-full rounded-xl text-coral-600 dark:text-coral-400 hover:bg-coral-50 dark:hover:bg-coral-400/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Log out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function AppTopBar() {
  const location = useLocation();
  const { user } = useAuth();

  const currentPage = navItems.find((n) => n.href === location.pathname)?.label || 'TrustLens';

  return (
    <header className="hidden lg:flex items-center justify-between h-14 px-6 bg-white dark:bg-midnight-900 border-b border-lightbg-300 dark:border-midnight-700 sticky top-0 z-30">
      <h1 className="text-sm font-semibold text-txt-lightPrimary dark:text-txt-darkPrimary">{currentPage}</h1>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Link to="/settings" className="text-sm font-medium text-txt-lightSecondary dark:text-txt-darkSecondary hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
          {user?.name}
        </Link>
      </div>
    </header>
  );
}
