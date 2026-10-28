import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProtectedLayout, PublicLayout } from './components/layout/RouteLayouts';

// Pages
import { LandingPage } from './pages/Landing';
import { LoginPage } from './pages/Login';
import { RegisterPage } from './pages/Register';
import { VerifyEmailPage } from './pages/VerifyEmail';
import { ForgotPasswordPage } from './pages/ForgotPassword';
import { ResetPasswordPage } from './pages/ResetPassword';
import { DashboardPage } from './pages/Dashboard';
import { AnalyzerPage } from './pages/Analyzer';
import { ChatPage } from './pages/ChatPage';
import { BoundaryTrackerPage } from './pages/BoundaryTracker';
import { ReplyCoachPage } from './pages/ReplyCoachPage';
import { SafetyChecklistPage } from './pages/SafetyChecklistPage';
import { HistoryPage } from './pages/HistoryPage';
import { SettingsPage } from './pages/SettingsPage';
import { SafetyGuidePage } from './pages/SafetyGuidePage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Marketing & Information Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/verify-email" element={<VerifyEmailPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/safety-guide" element={<SafetyGuidePage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
            </Route>

            {/* Authenticated Workspace Routes */}
            <Route element={<ProtectedLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/analyze" element={<AnalyzerPage />} />
              <Route path="/analysis-dashboard" element={<Navigate to="/analyze?tab=dashboard" replace />} />
              <Route path="/boundaries" element={<BoundaryTrackerPage />} />
              <Route path="/reply-coach" element={<ReplyCoachPage />} />
              <Route path="/safety-checklist" element={<SafetyChecklistPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
