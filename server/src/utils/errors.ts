export class AppError extends Error {
  public statusCode: number;
  public details?: any;
  public isOperational: boolean;

  constructor(statusCode: number, message: string, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(404, message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(401, message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden: Access denied') {
    super(403, message);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad request', details?: any) {
    super(400, message, details);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict: Resource already exists') {
    super(409, message);
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Too many requests. Please try again later.') {
    super(429, message);
  }
}
