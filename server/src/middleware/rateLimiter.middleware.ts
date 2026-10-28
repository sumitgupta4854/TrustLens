import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';

const isTest = env.NODE_ENV === 'test';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isTest ? 1000 : 20, // max 20 auth attempts per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many authentication attempts. Please try again in 15 minutes.',
  },
});

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isTest ? 5000 : 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests. Please slow down.',
  },
});

export const analyzeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isTest ? 1000 : 30, // 30 analyses per 15 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Analysis rate limit reached. Please wait a few minutes before submitting again.',
  },
});
