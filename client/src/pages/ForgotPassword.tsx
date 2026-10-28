import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../services/api';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui';
import { Shield, ArrowLeft } from 'lucide-react';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { getApiErrorMessage } from '../utils';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await authApi.forgotPassword(email);
      setSubmitted(true);
    } catch (err: any) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 bg-ivory-100 dark:bg-navy-950">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card p-8 border border-ivory-300 dark:border-navy-700 bg-white dark:bg-navy-900 shadow-soft-lg text-center">
          <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center shadow-glow-teal mx-auto mb-4">
            <Shield className="w-5 h-5 text-white" />
          </div>

          <h2 className="text-xl font-bold text-text-lightPrimary dark:text-text-darkPrimary">
            Reset Password
          </h2>
          <p className="mt-1 text-xs text-text-lightSecondary dark:text-text-darkSecondary mb-6">
            Enter your email to receive a secure, single-use password reset link.
          </p>

          {error && <Alert type="error" className="mb-4">{error}</Alert>}

          {submitted ? (
            <div className="space-y-4">
              <Alert type="success">
                If an account exists with that email, password reset instructions have been sent. Check your inbox.
              </Alert>
              <Link to="/login">
                <Button variant="secondary" size="md" className="w-full">
                  Return to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <Input
                label="Registered Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
              <Button type="submit" variant="primary" size="md" loading={loading} className="w-full">
                Send Reset Instructions
              </Button>
              <div className="text-center pt-2">
                <Link to="/login" className="text-xs text-violet-600 dark:text-violet-400 hover:underline inline-flex items-center gap-1">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
