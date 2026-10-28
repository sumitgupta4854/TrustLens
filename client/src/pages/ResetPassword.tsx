import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { authApi } from '../services/api';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui';
import { Shield } from 'lucide-react';
import { getApiErrorMessage } from '../utils';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!token) {
      setError('Invalid or missing password reset token.');
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword(token, password);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 bg-ivory-100 dark:bg-navy-950">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card p-8 border border-ivory-300 dark:border-navy-700 bg-white dark:bg-navy-900 shadow-soft-lg text-center">
          <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center shadow-glow-teal mx-auto mb-4">
            <Shield className="w-5 h-5 text-white" />
          </div>

          <h2 className="text-xl font-bold text-text-lightPrimary dark:text-text-darkPrimary">
            Set New Password
          </h2>
          <p className="mt-1 text-xs text-text-lightSecondary dark:text-text-darkSecondary mb-6">
            Choose a strong password with at least 8 characters.
          </p>

          {error && <Alert type="error" className="mb-4">{error}</Alert>}

          {success ? (
            <Alert type="success">
              Password reset successfully! Redirecting you to sign in…
            </Alert>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <Input
                label="New Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 chars, 1 uppercase, 1 number"
                required
              />
              <Input
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your new password"
                required
              />
              <Button type="submit" variant="primary" size="md" loading={loading} className="w-full">
                Update Password
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
