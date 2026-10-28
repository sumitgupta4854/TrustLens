import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { authApi } from '../services/api';
import { Button } from '../components/ui/Button';
import { Shield, CheckCircle2, AlertCircle } from 'lucide-react';
import { Spinner } from '../components/ui';

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError('No verification token provided in URL.');
      return;
    }

    const verify = async () => {
      try {
        await authApi.verifyEmail(token);
        setSuccess(true);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Verification failed or token expired.');
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-ivory-100 dark:bg-navy-950">
      <div className="card p-8 max-w-md w-full border border-ivory-300 dark:border-navy-700 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto">
          <Shield className="w-6 h-6" />
        </div>

        <h2 className="text-xl font-bold text-text-lightPrimary dark:text-text-darkPrimary">
          Email Verification
        </h2>

        {loading && (
          <div className="py-6 flex flex-col items-center gap-3">
            <Spinner className="w-6 h-6 text-teal-500" />
            <p className="text-sm text-text-lightSecondary dark:text-text-darkSecondary">
              Confirming your security token…
            </p>
          </div>
        )}

        {!loading && success && (
          <div className="space-y-4 py-2">
            <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-sm text-text-lightPrimary dark:text-text-darkPrimary font-medium">
              Your email has been verified successfully!
            </p>
            <Link to="/login">
              <Button variant="primary" size="md" className="w-full">
                Continue to Login
              </Button>
            </Link>
          </div>
        )}

        {!loading && error && (
          <div className="space-y-4 py-2">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <p className="text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
            <Link to="/login">
              <Button variant="secondary" size="md" className="w-full">
                Return to Login
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
