import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

let isConnected = false;

function maskMongoUri(uri: string): string {
  try {
    return uri.replace(
      /\/\/([^:/]+):([^@/]+)@/,
      '//***:***@'
    );
  } catch {
    return 'mongodb://[credentials_masked]';
  }
}

export async function connectDatabase(
  customUri?: string
): Promise<typeof mongoose> {
  const uri = customUri || env.MONGODB_URI;

  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    return mongoose;
  }

  try {
    logger.info(
      `Connecting to MongoDB Atlas at ${maskMongoUri(uri)}...`
    );

    await mongoose.connect(uri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = true;

    logger.info('Successfully connected to MongoDB Atlas');

    mongoose.connection.on('error', (err: Error) => {
      logger.error('MongoDB Atlas runtime error:', err);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB Atlas disconnected');
      isConnected = false;
    });

    return mongoose;
  } catch (error) {
    isConnected = false;
    logger.error('Failed to connect to MongoDB Atlas:', error);
    throw error;
  }
}

export async function disconnectDatabase(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    isConnected = false;
    logger.info('Disconnected from MongoDB');
  }
}

export function isDatabaseConnected(): boolean {
  return mongoose.connection.readyState === 1;
}