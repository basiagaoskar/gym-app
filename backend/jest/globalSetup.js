import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

export default async () => {
  const mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
  console.log(`Jest MongoDB Test Server connected at: ${mongoUri}`);

  global.__MONGOINSTANCE = mongoServer;
};