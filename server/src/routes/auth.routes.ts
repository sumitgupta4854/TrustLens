import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { authLimiter } from '../middleware/rateLimiter.middleware.js';
import { validateBody } from '../middleware/validate.middleware.js';
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  resendVerificationSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../validators/auth.schema.js';

const router = Router();

router.post(
  '/register',
  authLimiter,
  validateBody(registerSchema),
  authController.register
);

router.post(
  '/login',
  authLimiter,
  validateBody(loginSchema),
  authController.login
);

router.post('/refresh', authController.refresh);

router.post('/logout', authController.logout);

router.post('/logout-all', requireAuth, authController.logoutAll);

router.get('/me', requireAuth, authController.me);

router.post(
  '/verify-email',
  authLimiter,
  validateBody(verifyEmailSchema),
  authController.verifyEmail
);

router.post(
  '/resend-verification',
  authLimiter,
  validateBody(resendVerificationSchema),
  authController.resendVerification
);

router.post(
  '/forgot-password',
  authLimiter,
  validateBody(forgotPasswordSchema),
  authController.forgotPassword
);

router.post(
  '/reset-password',
  authLimiter,
  validateBody(resetPasswordSchema),
  authController.resetPassword
);

export default router;
