// lib/firebase-admin.ts
import admin from 'firebase-admin';

const projectId = process.env.NEXTAUTH_FIREBASE_PROJECT_ID;
const clientEmail = process.env.NEXTAUTH_FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.NEXTAUTH_FIREBASE_PRIVATE_KEY?.replace(
  /\\n/g,
  '\n',
);

if (process.env.NODE_ENV !== 'test') {
  if (!admin.apps.length) {
    try {
      if (!projectId || !clientEmail || !privateKey) {
        throw new Error('Missing Firebase Admin environment variables');
      }

      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });

      console.log('✅ Firebase Admin initialized successfully');
    } catch (error) {
      console.error('❌ Firebase Admin initialization error:', error);
    }
  }
}

export const adminDb = admin.firestore();
