import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// Load from server/.env or root .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(8787),
  APP_BASE_URL: z.string().default('http://localhost:5173'),
  API_BASE_URL: z.string().default('http://localhost:8787'),
  MONGODB_URI: z.string().default('mongodb://127.0.0.1:27017/trustlens'),
  JWT_ACCESS_SECRET: z.string().default('trustlens_dev_jwt_access_secret_key_92837190382'),
  JWT_REFRESH_SECRET: z.string().default('trustlens_dev_jwt_refresh_secret_key_10293847291'),
  JWT_ACCESS_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_EXPIRY_DAYS: z.coerce.number().default(7),
  LLM_API_KEY: z.string().optional().default(''),
  LLM_BASE_URL: z.string().default('https://api.openai.com/v1'),
  LLM_MODEL: z.string().default('gpt-4o-mini'),
  EMAIL_PROVIDER: z.string().default('console'),
  EMAIL_PROVIDER_API_KEY: z.string().optional().default(''),
  EMAIL_FROM: z.string().default('noreply@trustlens.app'),
});

const parsedEnv = envSchema.safeParse(process.cwd() ? process.env : {});

if (!parsedEnv.success) {
  console.error('❌ Environment validation failed:', parsedEnv.error.format());
  // In production, refuse to start with bad environment
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
}

export const env = parsedEnv.success ? parsedEnv.data : envSchema.parse({});
