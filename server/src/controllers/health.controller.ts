import { Request, Response } from 'express';
import { isDatabaseConnected } from '../config/database.js';

export const healthController = {
  checkHealth(_req: Request, res: Response) {
    const dbConnected = isDatabaseConnected();
    const uptimeSeconds = Math.floor(process.uptime());

    const healthStatus = {
      status: dbConnected ? 'healthy' : 'degraded',
      service: 'TrustLens API',
      timestamp: new Date().toISOString(),
      uptimeSeconds,
      database: {
        status: dbConnected ? 'connected' : 'disconnected',
      },
      aiProvider: {
        patternIntelligence: 'active',
      },
    };

    const httpStatus = dbConnected ? 200 : 503;
    return res.status(httpStatus).json(healthStatus);
  },
};
