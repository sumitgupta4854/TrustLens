import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { RefreshSession } from '../models/RefreshSession.js';
import { EmailVerificationToken } from '../models/EmailVerificationToken.js';
import { PasswordResetToken } from '../models/PasswordResetToken.js';
import {
  hashToken,
  generateRandomToken,
  signAccessToken,
  generateRefreshToken,
  generateVerificationToken,
  generatePasswordResetToken,
} from '../utils/tokens.js';
import {
  BadRequestError,
  UnauthorizedError,
  ConflictError,
} from '../utils/errors.js';
import { emailService } from '../services/email.service.js';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

const COOKIE_NAME = 'trustlens_refresh';

function setRefreshCookie(res: Response, token: string, expiresAt: Date) {
  const isProduction = env.NODE_ENV === 'production';
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    expires: expiresAt,
    path: '/api/auth',
  });
}

function clearRefreshCookie(res: Response) {
  const isProduction = env.NODE_ENV === 'production';
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    path: '/api/auth',
  });
}

export const authController = {
  // POST /api/auth/register
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = req.body;
      const normalizedEmail = email.toLowerCase().trim();

      const existingUser = await User.findOne({ normalizedEmail });
      if (existingUser) {
        throw new ConflictError('An account with this email address already exists.');
      }

      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);

      const user = await User.create({
        name: name.trim(),
        normalizedEmail,
        passwordHash,
        emailVerified: false,
      });

      // Generate verification token
      const verification = generateVerificationToken();
      await EmailVerificationToken.create({
        userId: user._id,
        tokenHash: verification.tokenHash,
        expiresAt: verification.expiresAt,
      });

      // Send verification email
      emailService.sendVerificationEmail(user.normalizedEmail, verification.rawToken).catch((err) => {
        logger.error('Failed to send verification email on register:', err);
      });

      // Issue access token and initial refresh session
      const accessToken = signAccessToken({
        userId: user._id.toString(),
        email: user.normalizedEmail,
      });

      const refresh = generateRefreshToken();
      const tokenFamilyId = generateRandomToken(16);

      await RefreshSession.create({
        userId: user._id,
        tokenHash: refresh.tokenHash,
        tokenFamilyId,
        expiresAt: refresh.expiresAt,
      });

      setRefreshCookie(res, refresh.rawToken, refresh.expiresAt);

      return res.status(201).json({
        success: true,
        message: 'Account successfully created. Please check your email to verify your account.',
        user: user.toSafeObject(),
        accessToken,
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/auth/login
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const normalizedEmail = email.toLowerCase().trim();

      const user = await User.findOne({ normalizedEmail });
      if (!user) {
        throw new UnauthorizedError('Invalid email or password.');
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        throw new UnauthorizedError('Invalid email or password.');
      }

      const accessToken = signAccessToken({
        userId: user._id.toString(),
        email: user.normalizedEmail,
      });

      const refresh = generateRefreshToken();
      const tokenFamilyId = generateRandomToken(16);

      await RefreshSession.create({
        userId: user._id,
        tokenHash: refresh.tokenHash,
        tokenFamilyId,
        expiresAt: refresh.expiresAt,
      });

      setRefreshCookie(res, refresh.rawToken, refresh.expiresAt);

      return res.status(200).json({
        success: true,
        message: 'Successfully logged in.',
        user: user.toSafeObject(),
        accessToken,
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/auth/refresh
  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const rawToken = req.cookies?.[COOKIE_NAME] || req.body?.refreshToken;
      if (!rawToken) {
        throw new UnauthorizedError('No refresh token provided.');
      }

      const incomingHash = hashToken(rawToken);
      const existingSession = await RefreshSession.findOne({ tokenHash: incomingHash });

      if (!existingSession) {
        clearRefreshCookie(res);
        throw new UnauthorizedError('Invalid refresh session.');
      }

      // Check if session has expired
      if (existingSession.expiresAt.getTime() < Date.now()) {
        clearRefreshCookie(res);
        throw new UnauthorizedError('Refresh session has expired. Please log in again.');
      }

      // TOKEN REUSE DETECTION:
      // If session is already revoked or already replaced by another session,
      // compromise has occurred! Revoke the entire token family.
      if (existingSession.revokedAt || existingSession.replacedBySessionId) {
        logger.warn(
          `Security Alert: Refresh token reuse detected! Invalidating entire token family: ${existingSession.tokenFamilyId}`
        );
        await RefreshSession.updateMany(
          { tokenFamilyId: existingSession.tokenFamilyId },
          { $set: { revokedAt: new Date() } }
        );
        clearRefreshCookie(res);
        throw new UnauthorizedError(
          'Security alert: Revoked token was reused. All active sessions have been terminated. Please log in again.'
        );
      }

      const user = await User.findById(existingSession.userId);
      if (!user) {
        clearRefreshCookie(res);
        throw new UnauthorizedError('User account not found.');
      }

      // Rotate token: create new session in same family
      const newRefresh = generateRefreshToken();
      const newSession = await RefreshSession.create({
        userId: user._id,
        tokenHash: newRefresh.tokenHash,
        tokenFamilyId: existingSession.tokenFamilyId,
        expiresAt: newRefresh.expiresAt,
      });

      // Mark old session as replaced & revoked
      existingSession.revokedAt = new Date();
      existingSession.replacedBySessionId = newSession._id;
      existingSession.lastUsedAt = new Date();
      await existingSession.save();

      // Issue new access token
      const accessToken = signAccessToken({
        userId: user._id.toString(),
        email: user.normalizedEmail,
      });

      setRefreshCookie(res, newRefresh.rawToken, newRefresh.expiresAt);

      return res.status(200).json({
        success: true,
        accessToken,
        user: user.toSafeObject(),
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/auth/logout
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const rawToken = req.cookies?.[COOKIE_NAME] || req.body?.refreshToken;
      if (rawToken) {
        const tokenHash = hashToken(rawToken);
        await RefreshSession.updateOne(
          { tokenHash },
          { $set: { revokedAt: new Date() } }
        );
      }

      clearRefreshCookie(res);

      return res.status(200).json({
        success: true,
        message: 'Successfully logged out.',
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/auth/logout-all
  async logoutAll(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required.');
      }

      await RefreshSession.updateMany(
        { userId: req.user._id, revokedAt: null },
        { $set: { revokedAt: new Date() } }
      );

      clearRefreshCookie(res);

      return res.status(200).json({
        success: true,
        message: 'Successfully logged out from all active sessions.',
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/auth/me
  async me(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required.');
      }
      return res.status(200).json({
        success: true,
        user: req.user.toSafeObject(),
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/auth/verify-email
  async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.body;
      const incomingHash = hashToken(token);

      const verificationRecord = await EmailVerificationToken.findOne({
        tokenHash: incomingHash,
      });

      if (!verificationRecord || !verificationRecord.isValid()) {
        throw new BadRequestError('Verification token is invalid or has expired.');
      }

      verificationRecord.usedAt = new Date();
      await verificationRecord.save();

      const user = await User.findById(verificationRecord.userId);
      if (user) {
        user.emailVerified = true;
        await user.save();
      }

      return res.status(200).json({
        success: true,
        message: 'Email address successfully verified. Thank you!',
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/auth/resend-verification
  async resendVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const normalizedEmail = email.toLowerCase().trim();

      const user = await User.findOne({ normalizedEmail });
      if (user && !user.emailVerified) {
        // Invalidate old tokens
        await EmailVerificationToken.updateMany(
          { userId: user._id, usedAt: null },
          { $set: { usedAt: new Date() } }
        );

        const verification = generateVerificationToken();
        await EmailVerificationToken.create({
          userId: user._id,
          tokenHash: verification.tokenHash,
          expiresAt: verification.expiresAt,
        });

        emailService.sendVerificationEmail(user.normalizedEmail, verification.rawToken).catch((err) => {
          logger.error('Failed to resend verification email:', err);
        });
      }

      // Generic response prevents account enumeration
      return res.status(200).json({
        success: true,
        message: 'If an unverified account exists with that email, a verification link has been dispatched.',
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/auth/forgot-password
  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const normalizedEmail = email.toLowerCase().trim();

      const user = await User.findOne({ normalizedEmail });
      if (user) {
        // Invalidate old unused reset tokens
        await PasswordResetToken.updateMany(
          { userId: user._id, usedAt: null },
          { $set: { usedAt: new Date() } }
        );

        const reset = generatePasswordResetToken();
        await PasswordResetToken.create({
          userId: user._id,
          tokenHash: reset.tokenHash,
          expiresAt: reset.expiresAt,
        });

        emailService.sendPasswordResetEmail(user.normalizedEmail, reset.rawToken).catch((err) => {
          logger.error('Failed to send password reset email:', err);
        });
      }

      // Generic response prevents account enumeration
      return res.status(200).json({
        success: true,
        message: 'If an account matches that email address, password reset instructions have been sent.',
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/auth/reset-password
  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, password } = req.body;
      const incomingHash = hashToken(token);

      const resetRecord = await PasswordResetToken.findOne({
        tokenHash: incomingHash,
      });

      if (!resetRecord || !resetRecord.isValid()) {
        throw new BadRequestError('Password reset link is invalid or has expired.');
      }

      const user = await User.findById(resetRecord.userId);
      if (!user) {
        throw new BadRequestError('User account not found.');
      }

      // Update password
      const salt = await bcrypt.genSalt(12);
      user.passwordHash = await bcrypt.hash(password, salt);
      await user.save();

      // Mark token as used
      resetRecord.usedAt = new Date();
      await resetRecord.save();

      // Invalidate all refresh sessions for this user for security
      await RefreshSession.updateMany(
        { userId: user._id, revokedAt: null },
        { $set: { revokedAt: new Date() } }
      );
      clearRefreshCookie(res);

      return res.status(200).json({
        success: true,
        message: 'Your password has been successfully reset. Please log in with your new password.',
      });
    } catch (error) {
      next(error);
    }
  },
};
