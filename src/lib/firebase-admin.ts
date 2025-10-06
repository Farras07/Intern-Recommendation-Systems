// lib/firebase-admin.ts
import admin from 'firebase-admin';

const projectId =
  process.env.NEXTAUTH_FIREBASE_PROJECT_ID ||
  process.env.NEXT_PUBLIC_FIREBASE_PROJECTID;
const clientEmail = process.env.NEXTAUTH_FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.NEXTAUTH_FIREBASE_PRIVATE_KEY?.replace(
  /\\n/g,
  '\n',
);

console.log('🌱 Firebase Admin ENV:', {
  NODE_ENV: process.env.NODE_ENV,
  projectId: process.env.NEXTAUTH_FIREBASE_PROJECT_ID,
  clientEmail: process.env.NEXTAUTH_FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.NEXTAUTH_FIREBASE_PRIVATE_KEY
    ? '✅ Exists'
    : '❌ Missing',
});

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

export const adminDb = admin.firestore();
