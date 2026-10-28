import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { userApi, authApi } from '../services/api';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui';
import {
  User as UserIcon,
  Shield,
  Key,
  Palette,
  LogOut,
  Trash2,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { getApiErrorMessage } from '../utils';

export function SettingsPage() {
  const { user, logout, logoutAll, refreshUser } = useAuth();
  const { theme, setTheme } = useTheme();

  // Profile update state
  const [name, setName] = useState(user?.name || '');
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Password update state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Account deletion state
  const [deleteConfirmPassword, setDeleteConfirmPassword] = useState('');
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Email resend state
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setProfileMessage(null);
    setProfileLoading(true);

    try {
      await userApi.updateProfile({ name });
      await refreshUser();
      setProfileMessage('Name updated successfully.');
    } catch (err: any) {
      setProfileError(getApiErrorMessage(err));
    } finally {
      setProfileLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordMessage(null);

    if (newPassword !== confirmNewPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setPasswordLoading(true);
    try {
      await userApi.updateProfile({ currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setPasswordMessage('Password changed successfully. Other active sessions were invalidated.');
    } catch (err: any) {
      setPasswordError(getApiErrorMessage(err));
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!user?.email) return;
    try {
      await authApi.resendVerification(user.email);
      setResendStatus('Verification link sent. Check your inbox.');
    } catch (err: any) {
      setResendStatus(getApiErrorMessage(err));
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setDeleteError(null);
    setDeleteLoading(true);

    try {
      await userApi.deleteAccount(deleteConfirmPassword);
      window.location.href = '/';
    } catch (err: any) {
      setDeleteError(getApiErrorMessage(err));
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-lightPrimary dark:text-text-darkPrimary tracking-tight">
          Account & Privacy Settings
        </h1>
        <p className="text-sm text-text-lightSecondary dark:text-text-darkSecondary mt-1 leading-relaxed">
          Manage your personal details, security credentials, appearance, and data deletion.
        </p>
      </div>

      {/* Profile Section */}
      <div className="card p-6 border border-ivory-300 dark:border-navy-700 bg-white dark:bg-navy-900 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-ivory-200 dark:border-navy-800">
          <UserIcon className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          <h2 className="text-base font-semibold text-text-lightPrimary dark:text-text-darkPrimary">
            Profile Details
          </h2>
        </div>

        {profileMessage && <Alert type="success">{profileMessage}</Alert>}
        {profileError && <Alert type="error">{profileError}</Alert>}

        <form onSubmit={handleUpdateName} className="space-y-4 max-w-md">
          <Input
            label="Display Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div>
            <label className="text-sm font-medium text-text-lightPrimary dark:text-text-darkPrimary block mb-1">
              Email Address
            </label>
            <div className="flex items-center justify-between p-3 rounded-xl bg-ivory-100 dark:bg-navy-800 border border-ivory-300 dark:border-navy-700 text-sm">
              <span className="font-mono text-text-lightPrimary dark:text-text-darkPrimary">
                {user?.email}
              </span>
              <div className="flex items-center gap-2">
                {user?.emailVerified ? (
                  <span className="badge-low flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    className="text-xs text-amber-600 dark:text-amber-400 font-semibold hover:underline"
                  >
                    Resend Verification Link
                  </button>
                )}
              </div>
            </div>
            {resendStatus && (
              <p className="text-xs text-teal-600 dark:text-teal-400 mt-1">{resendStatus}</p>
            )}
          </div>

          <Button type="submit" variant="primary" size="sm" loading={profileLoading}>
            Save Profile
          </Button>
        </form>
      </div>

      {/* Password Management */}
      <div className="card p-6 border border-ivory-300 dark:border-navy-700 bg-white dark:bg-navy-900 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-ivory-200 dark:border-navy-800">
          <Key className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          <h2 className="text-base font-semibold text-text-lightPrimary dark:text-text-darkPrimary">
            Change Password
          </h2>
        </div>

        {passwordMessage && <Alert type="success">{passwordMessage}</Alert>}
        {passwordError && <Alert type="error">{passwordError}</Alert>}

        <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
          <Input
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />

          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="At least 8 chars, 1 uppercase, 1 number"
            required
          />

          <Input
            label="Confirm New Password"
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
          />

          <Button type="submit" variant="secondary" size="sm" loading={passwordLoading}>
            Update Password
          </Button>
        </form>
      </div>

      {/* Theme Preference */}
      <div className="card p-6 border border-ivory-300 dark:border-navy-700 bg-white dark:bg-navy-900 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-ivory-200 dark:border-navy-800">
          <Palette className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          <h2 className="text-base font-semibold text-text-lightPrimary dark:text-text-darkPrimary">
            Display Theme
          </h2>
        </div>
        <div className="flex items-center justify-between max-w-md">
          <span className="text-sm text-text-lightSecondary dark:text-text-darkSecondary">
            Switch between Light, Dark, or System mode:
          </span>
          <ThemeToggle />
        </div>
      </div>

      {/* Session Management */}
      <div className="card p-6 border border-ivory-300 dark:border-navy-700 bg-white dark:bg-navy-900 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-ivory-200 dark:border-navy-800">
          <LogOut className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          <h2 className="text-base font-semibold text-text-lightPrimary dark:text-text-darkPrimary">
            Session Security
          </h2>
        </div>
        <p className="text-xs text-text-lightSecondary dark:text-text-darkSecondary leading-relaxed max-w-md">
          Log out of this browser or terminate all active sessions across all devices simultaneously.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" size="sm" onClick={() => logout()}>
            Log Out Current Device
          </Button>
          <Button variant="ghost" size="sm" onClick={() => logoutAll()}>
            Log Out All Devices
          </Button>
        </div>
      </div>

      {/* Danger Zone: Account Deletion */}
      <div className="card p-6 border border-red-200 dark:border-red-900/50 bg-red-50/10 dark:bg-red-950/10 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400">
          <AlertTriangle className="w-5 h-5" />
          <h2 className="text-base font-semibold">Delete Account & Permanent Data Purge</h2>
        </div>
        <p className="text-xs text-text-lightSecondary dark:text-text-darkSecondary leading-relaxed max-w-lg">
          Permanently deletes your user profile, all defined personal boundaries, saved analysis history, and active session tokens. This action is irreversible.
        </p>

        {deleteError && <Alert type="error">{deleteError}</Alert>}

        {!showDeleteConfirm ? (
          <Button variant="danger" size="sm" onClick={() => setShowDeleteConfirm(true)}>
            Initiate Account Deletion
          </Button>
        ) : (
          <form onSubmit={handleDeleteAccount} className="space-y-4 max-w-md pt-2">
            <Input
              label="Enter Password to Confirm Deletion"
              type="password"
              value={deleteConfirmPassword}
              onChange={(e) => setDeleteConfirmPassword(e.target.value)}
              placeholder="Your current account password"
              required
            />
            <div className="flex items-center gap-3">
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="danger" size="sm" loading={deleteLoading}>
                Permanently Delete Everything
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
