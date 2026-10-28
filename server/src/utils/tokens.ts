import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export interface AccessTokenPayload {
  userId: string;
  email: string;
}

/**
 * Creates a SHA-256 hash of a raw token for safe storage in MongoDB
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Generates a cryptographically random token string
 */
export function generateRandomToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString('hex');
}

/**
 * Signs a short-lived JWT access token
 */
export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: (env.JWT_ACCESS_EXPIRY || '15m') as any,
  });
}

/**
 * Verifies a JWT access token
 */
export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;
}

/**
 * Generates a rotating refresh token, its hash, and expiry date
 */
export function generateRefreshToken() {
  const rawToken = generateRandomToken(40);
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + env.JWT_REFRESH_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

  return {
    rawToken,
    tokenHash,
    expiresAt,
  };
}

/**
 * Generates an email verification token (expires in 24 hours)
 */
export function generateVerificationToken() {
  const rawToken = generateRandomToken(32);
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  return {
    rawToken,
    tokenHash,
    expiresAt,
  };
}

/**
 * Generates a password reset token (expires in 1 hour)
 */
export function generatePasswordResetToken() {
  const rawToken = generateRandomToken(32);
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  return {
    rawToken,
    tokenHash,
    expiresAt,
  };
}
