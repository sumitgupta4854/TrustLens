import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui';
import { Shield, CheckCircle2 } from 'lucide-react';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { getApiErrorMessage } from '../utils';

export function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const res = await register(name, email, password);
      setSuccessMessage(res.message || 'Account created successfully! Check your email for verification.');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
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
          Create your account
        </h2>
        <p className="mt-1 text-sm text-text-lightSecondary dark:text-text-darkSecondary">
          Set your personal boundaries and stay safe while dating
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card p-8 border border-ivory-300 dark:border-navy-700 bg-white dark:bg-navy-900 shadow-soft-lg">
          {error && (
            <Alert type="error" className="mb-6">
              {error}
            </Alert>
          )}

          {successMessage && (
            <Alert type="success" className="mb-6">
              {successMessage}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Full Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Parker"
              required
              autoComplete="name"
            />

            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.com"
              required
              autoComplete="email"
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters, 1 uppercase, 1 number"
              required
              autoComplete="new-password"
              hint="Must include at least 8 characters, an uppercase letter, and a number."
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={loading}
              className="w-full mt-2"
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-ivory-200 dark:border-navy-800 text-center">
            <p className="text-xs text-text-lightSecondary dark:text-text-darkSecondary">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-teal-600 dark:text-teal-400 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
