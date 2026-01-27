import dotenv from 'dotenv';

dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: parseInt(process.env.PORT ?? '3000', 10),
  MONGODB_URI: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/healioai',
  LOG_LEVEL: process.env.LOG_LEVEL ?? 'info',
  API_PREFIX: process.env.API_PREFIX ?? '/api',
} as const;

export const isDev = env.NODE_ENV === 'development';
export const isProd = env.NODE_ENV === 'production';
