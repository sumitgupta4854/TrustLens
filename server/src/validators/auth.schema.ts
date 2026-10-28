import { z } from 'zod';

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(60, 'Name must be at most 60 characters'),
  email: z
    .string()
    .trim()
    .email('Invalid email address')
    .toLowerCase(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be at most 128 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Invalid email address')
    .toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});

export const verifyEmailSchema = z.object({
  token: z.string().min(10, 'Invalid verification token'),
});

export const resendVerificationSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Invalid email address')
    .toLowerCase(),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Invalid email address')
    .toLowerCase(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(10, 'Invalid reset token'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be at most 128 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(60, 'Name must be at most 60 characters')
    .optional(),
  currentPassword: z.string().min(1).optional(),
  newPassword: z
    .string()
    .min(8, 'New password must be at least 8 characters')
    .max(128)
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number')
    .optional(),
});
