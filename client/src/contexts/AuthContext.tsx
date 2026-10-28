import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from '../types';
import { authApi, setAccessToken, getAccessToken } from '../services/api';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<{ user: User; message: string }>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await authApi.getMe();
      setUser(data.user);
    } catch {
      setUser(null);
      setAccessToken(null);
    }
  }, []);

  // Attempt token refresh on mount to restore session
  useEffect(() => {
    const tryRestoreSession = async () => {
      setIsLoading(true);
      try {
        // Try refreshing the access token using the HTTP-only cookie
        const { data } = await import('../services/api').then((m) =>
          m.default.post<{ accessToken: string; user: User }>('/auth/refresh')
        );
        setAccessToken(data.accessToken);
        setUser(data.user);
      } catch {
        setUser(null);
        setAccessToken(null);
      } finally {
        setIsLoading(false);
      }
    };
    tryRestoreSession();
  }, []);

  // Listen for session expiry events
  useEffect(() => {
    const handleExpiry = () => {
      setUser(null);
      setAccessToken(null);
    };
    window.addEventListener('auth:session-expired', handleExpiry);
    return () => window.removeEventListener('auth:session-expired', handleExpiry);
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await authApi.login({ email, password });
    setAccessToken(data.accessToken);
    setUser(data.user);
  };

  const register = async (name: string, email: string, password: string) => {
    const { data } = await authApi.register({ name, email, password });
    setAccessToken(data.accessToken);
    setUser(data.user);
    return { user: data.user, message: data.message || 'Account created' } as any;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  };

  const logoutAll = async () => {
    try {
      await authApi.logoutAll();
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        logoutAll,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
