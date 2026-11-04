import { beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoTestServer;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test_jwt_secret_key_12345';
  
  // Isolated in-memory MongoDB for tests so development database is NEVER cleared
  mongoTestServer = await MongoMemoryServer.create();
  const uri = mongoTestServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoTestServer) {
    await mongoTestServer.stop();
  }
});
