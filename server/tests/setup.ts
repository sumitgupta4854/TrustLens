import { beforeAll, afterAll, beforeEach } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { connectDatabase, disconnectDatabase } from '../src/config/database.js';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await connectDatabase(uri);
}, 35000);

beforeEach(async () => {
  if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) {
      await collection.deleteMany({});
    }
  }
});

afterAll(async () => {
  await disconnectDatabase();
  if (mongoServer) {
    await mongoServer.stop();
  }
});
