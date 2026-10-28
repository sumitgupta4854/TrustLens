import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import routes from './routes/index.js';
import { errorHandler } from './middleware/error.middleware.js';
import { apiLimiter } from './middleware/rateLimiter.middleware.js';

export const app = express();

// Security Headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows flexible API usage
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS configuration
const allowedOrigins = [
  env.APP_BASE_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in development for local testing
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Cookie Parser
app.use(cookieParser());

// Request Body Parsing with Size Limits (Defense in Depth)
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Global API rate limit
app.use('/api', apiLimiter);

// Mount API Routes
app.use('/api', routes);

// 404 Route Handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

export default app;
