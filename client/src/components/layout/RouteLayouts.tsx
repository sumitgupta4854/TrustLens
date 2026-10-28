import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { AppSidebar, AppTopBar, MobileNav } from './AppLayout';
import { Spinner } from '../ui';

export function ProtectedLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-lightbg-100 dark:bg-midnight-950">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="w-8 h-8 text-teal-500" />
          <p className="text-sm text-txt-lightSecondary dark:text-txt-darkSecondary">Loading TrustLens…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen h-[100dvh] overflow-hidden bg-lightbg-100 dark:bg-midnight-950 max-w-full">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden max-w-full">
        <MobileNav />
        <AppTopBar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 lg:p-6 min-w-0" id="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-lightbg-100 dark:bg-midnight-950">
      <Outlet />
    </div>
  );
}
