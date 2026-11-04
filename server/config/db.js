import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongodInstance = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/autox_db';
  try {
    // Attempt standard connection first with 3 second serverSelectionTimeout
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[AUTOX Database] Connected to MongoDB host: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    // If running in development or testing and no external MongoDB is running, use embedded MongoMemoryServer
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[AUTOX Database] Local MongoDB at ${uri} was unreachable (${error.message}).`);
      console.log(`[AUTOX Database] Starting embedded zero-config MongoDB instance for development...`);
      try {
        mongodInstance = await MongoMemoryServer.create();
        const memUri = mongodInstance.getUri();
        const conn = await mongoose.connect(memUri);
        console.log(`[AUTOX Database] Connected to embedded MongoDB at: ${memUri}`);
        return conn;
      } catch (memErr) {
        console.error(`[AUTOX Database] Failed to initialize embedded MongoDB: ${memErr.message}`);
        throw memErr;
      }
    } else {
      console.error(`[AUTOX Database] Critical connection error in production: ${error.message}`);
      process.exit(1);
    }
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongodInstance) {
    await mongodInstance.stop();
  }
};

