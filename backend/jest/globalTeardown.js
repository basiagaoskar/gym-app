import mongoose from 'mongoose';

export default async () => {
  await mongoose.disconnect();
  if (global.__MONGOINSTANCE) {
    await global.__MONGOINSTANCE.stop();
    console.log('Jest MongoDB Test Server stopped.');
  }
};