import dotenv from 'dotenv';

dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: parseInt(process.env.PORT ?? '3000', 10),
  MONGODB_URI: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/healioai',
  LOG_LEVEL: process.env.LOG_LEVEL ?? 'info',
  API_PREFIX: process.env.API_PREFIX ?? '/api',
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
} as const;

export const isDev = env.NODE_ENV === 'development';
export const isProd = env.NODE_ENV === 'production';
