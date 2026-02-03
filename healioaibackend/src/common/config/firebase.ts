import * as admin from 'firebase-admin';
import { env } from './env';
import { logger } from '../logger/logger';

export function initializeFirebase() {
  try {
    if (admin.apps.length > 0) {
      return;
    }

    if (env.FIREBASE_PROJECT_ID && env.FIREBASE_CLIENT_EMAIL && env.FIREBASE_PRIVATE_KEY) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: env.FIREBASE_PROJECT_ID,
          clientEmail: env.FIREBASE_CLIENT_EMAIL,
          privateKey: env.FIREBASE_PRIVATE_KEY,
        }),
      });
      logger.info('Firebase Admin initialized with credentials');
    } else {
      // Fallback to application default credentials (useful for local dev with GOOGLE_APPLICATION_CREDENTIALS)
      admin.initializeApp();
      logger.info('Firebase Admin initialized with default credentials');
    }
  } catch (error) {
    logger.error('Error initializing Firebase Admin:', error);
    // Don't throw here to allow app to start even if firebase fails, 
    // but auth middleware will fail requests.
  }
}
