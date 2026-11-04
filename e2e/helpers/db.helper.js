import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), 'server', '.env') });

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/autox_db';

let isConnected = false;

export async function getDbConnection() {
  if (!isConnected && mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGO_URI);
    isConnected = true;
  }
  return mongoose.connection.db;
}

export async function findOrderByNumber(orderNumber) {
  const db = await getDbConnection();
  return db.collection('orders').findOne({ orderNumber });
}

export async function findLatestOrder() {
  const db = await getDbConnection();
  return db.collection('orders').find().sort({ createdAt: -1 }).limit(1).next();
}

export async function getProductById(productId) {
  const db = await getDbConnection();
  const { ObjectId } = mongoose.Types;
  return db.collection('products').findOne({ _id: new ObjectId(productId) });
}

export async function getProductBySlug(slug) {
  const db = await getDbConnection();
  return db.collection('products').findOne({ slug });
}

export async function getCouponByCode(code) {
  const db = await getDbConnection();
  return db.collection('coupons').findOne({ code: code.toUpperCase() });
}

export async function closeDbConnection() {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
  }
}
