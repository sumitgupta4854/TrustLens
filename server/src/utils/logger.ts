// Sensitive data redaction logger
const SENSITIVE_KEYS = [
  'password',
  'passwordHash',
  'token',
  'accessToken',
  'refreshToken',
  'authorization',
  'cookie',
  'secret',
  'key',
  'apiKey',
  'conversation',
  'rawText',
  'content',
];

function redactSensitive(data: any): any {
  if (data === null || data === undefined) return data;
  if (typeof data === 'string') {
    // Redact Bearer tokens
    let sanitized = data.replace(/Bearer\s+[A-Za-z0-9\-_.]+/gi, 'Bearer [REDACTED]');
    // Redact JWT patterns
    sanitized = sanitized.replace(/eyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+/g, '[JWT_REDACTED]');
    return sanitized;
  }
  if (Array.isArray(data)) {
    return data.map(redactSensitive);
  }
  if (typeof data === 'object') {
    const cleaned: Record<string, any> = {};
    for (const [key, val] of Object.entries(data)) {
      if (SENSITIVE_KEYS.some((sk) => key.toLowerCase().includes(sk.toLowerCase()))) {
        cleaned[key] = '[REDACTED]';
      } else {
        cleaned[key] = redactSensitive(val);
      }
    }
    return cleaned;
  }
  return data;
}

export const logger = {
  info: (message: string, meta?: any) => {
    if (meta) {
      console.log(`[INFO] ${new Date().toISOString()} - ${message}`, redactSensitive(meta));
    } else {
      console.log(`[INFO] ${new Date().toISOString()} - ${message}`);
    }
  },
  warn: (message: string, meta?: any) => {
    if (meta) {
      console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, redactSensitive(meta));
    } else {
      console.warn(`[WARN] ${new Date().toISOString()} - ${message}`);
    }
  },
  error: (message: string, error?: any) => {
    if (error) {
      const errObj = error instanceof Error
        ? { message: error.message, stack: error.stack }
        : error;
      console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, redactSensitive(errObj));
    } else {
      console.error(`[ERROR] ${new Date().toISOString()} - ${message}`);
    }
  },
  debug: (message: string, meta?: any) => {
    if (process.env.NODE_ENV !== 'production') {
      if (meta) {
        console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`, redactSensitive(meta));
      } else {
        console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`);
      }
    }
  },
};
