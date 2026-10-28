import { app } from './app.js';
import { env } from './config/env.js';
import { connectDatabase } from './config/database.js';
import { logger } from './utils/logger.js';

async function bootstrap() {
  try {
    logger.info(`Starting TrustLens API Server in [${env.NODE_ENV}] mode...`);

    // Connect to MongoDB Atlas
    try {
      await connectDatabase();
    } catch (dbErr) {
      logger.error('Failed initial MongoDB connection. Starting server in degraded mode for recovery.', dbErr);
    }

    const server = app.listen(env.PORT, () => {
      logger.info(`🚀 TrustLens API Server actively listening on port ${env.PORT}`);
      logger.info(`🔗 API Health Endpoint: http://localhost:${env.PORT}/api/health`);
    });

    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Gracefully shutting down TrustLens API...`);
      server.close(() => {
        logger.info('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    logger.error('Fatal startup error in TrustLens server:', error);
    process.exit(1);
  }
}

bootstrap();
