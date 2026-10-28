import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../utils/errors.js';
import { verifyAccessToken } from '../utils/tokens.js';
import { User, IUser } from '../models/User.js';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Authentication required. Missing Bearer token.');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedError('Malformed authorization header.');
    }

    let payload;
    try {
      payload = verifyAccessToken(token);
    } catch (err: any) {
      throw new UnauthorizedError('Access token is invalid or has expired.');
    }

    const user = await User.findById(payload.userId);
    if (!user) {
      throw new UnauthorizedError('The user associated with this token no longer exists.');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

export async function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      if (token) {
        try {
          const payload = verifyAccessToken(token);
          const user = await User.findById(payload.userId);
          if (user) {
            req.user = user;
          }
        } catch {
          // Token invalid; proceed as unauthenticated
        }
      }
    }
    next();
  } catch {
    next();
  }
}
