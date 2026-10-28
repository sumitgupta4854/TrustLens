import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui';
import { Shield, Lock, Mail, ArrowRight } from 'lucide-react';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { getApiErrorMessage } from '../utils';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-ivory-100 dark:bg-navy-950 px-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-xl bg-teal-500 flex items-center justify-center shadow-glow-teal">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-text-lightPrimary dark:text-text-darkPrimary">
            Trust<span className="text-teal-600 dark:text-teal-400">Lens</span>
          </span>
        </Link>
        <h2 className="text-2xl font-extrabold text-text-lightPrimary dark:text-text-darkPrimary tracking-tight">
          Welcome back
        </h2>
        <p className="mt-1 text-sm text-text-lightSecondary dark:text-text-darkSecondary">
          Sign in to access your boundaries and private workspace
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card p-8 border border-ivory-300 dark:border-navy-700 bg-white dark:bg-navy-900 shadow-soft-lg">
          {error && (
            <Alert type="error" className="mb-6">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-text-lightPrimary dark:text-text-darkPrimary">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={loading}
              className="w-full mt-2"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-ivory-200 dark:border-navy-800 text-center">
            <p className="text-xs text-text-lightSecondary dark:text-text-darkSecondary">
              Don't have a TrustLens account?{' '}
              <Link to="/register" className="font-semibold text-teal-600 dark:text-teal-400 hover:underline">
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
