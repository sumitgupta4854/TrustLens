import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { RefreshSession } from '../models/RefreshSession.js';
import { Boundary } from '../models/Boundary.js';
import { SafetyAnalysis } from '../models/SafetyAnalysis.js';
import { EmailVerificationToken } from '../models/EmailVerificationToken.js';
import { PasswordResetToken } from '../models/PasswordResetToken.js';
import { BadRequestError, UnauthorizedError } from '../utils/errors.js';
import { env } from '../config/env.js';

export const userController = {
  // GET /api/users/me
  async getProfile(req: Request, res: Response, next: NextFunction) {
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

  // PATCH /api/users/me
  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required.');
      }

      const { name, currentPassword, newPassword } = req.body;
      const user = await User.findById(req.user._id);
      if (!user) {
        throw new UnauthorizedError('User account not found.');
      }

      // Update name if supplied
      if (name) {
        user.name = name.trim();
      }

      // If user wants to change password
      if (newPassword) {
        if (!currentPassword) {
          throw new BadRequestError('Current password is required to set a new password.');
        }
        const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isMatch) {
          throw new BadRequestError('Current password provided is incorrect.');
        }

        const salt = await bcrypt.genSalt(12);
        user.passwordHash = await bcrypt.hash(newPassword, salt);

        // Invalidate old sessions upon password change
        await RefreshSession.updateMany(
          { userId: user._id, revokedAt: null },
          { $set: { revokedAt: new Date() } }
        );
      }

      await user.save();

      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully.',
        user: user.toSafeObject(),
      });
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/users/me
  async deleteAccount(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required.');
      }

      const { confirmPassword } = req.body;
      if (!confirmPassword) {
        throw new BadRequestError('Password confirmation is required to delete your account.');
      }

      const user = await User.findById(req.user._id);
      if (!user) {
        throw new UnauthorizedError('User account not found.');
      }

      const isMatch = await bcrypt.compare(confirmPassword, user.passwordHash);
      if (!isMatch) {
        throw new BadRequestError('Incorrect password. Account deletion aborted.');
      }

      const userId = user._id;

      // Safe cascading cleanup: delete all user data
      await Promise.all([
        Boundary.deleteMany({ userId }),
        SafetyAnalysis.deleteMany({ userId }),
        RefreshSession.deleteMany({ userId }),
        EmailVerificationToken.deleteMany({ userId }),
        PasswordResetToken.deleteMany({ userId }),
        User.deleteOne({ _id: userId }),
      ]);

      // Clear refresh cookie
      const isProduction = env.NODE_ENV === 'production';
      res.clearCookie('trustlens_refresh', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'strict' : 'lax',
        path: '/api/auth',
      });

      return res.status(200).json({
        success: true,
        message: 'Your account and all associated data have been permanently deleted.',
      });
    } catch (error) {
      next(error);
    }
  },
};
