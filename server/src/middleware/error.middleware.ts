import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // Handle Zod Schema Validation Errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: err.issues.map((i) => ({
        path: i.path.join('.'),
        message: i.message,
      })),
    });
  }

  // Handle Known Custom AppErrors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      ...(err.details ? { details: err.details } : {}),
    });
  }

  // Handle Mongo Duplicate Key Error (E11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    return res.status(409).json({
      success: false,
      error: `A record with this ${field} already exists.`,
    });
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: `Invalid identifier format for ${err.path}`,
    });
  }

  // Unhandled internal server errors
  logger.error('Unhandled Server Error:', err);

  return res.status(500).json({
    success: false,
    error:
      env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message || 'Internal server error',
  });
}
