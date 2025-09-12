// lib/firebase-admin.ts
import admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
        clientEmail: process.env.NEXTAUTH_FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.NEXTAUTH_FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
    console.log('Firebase Admin initialized successfully');

  } catch(error) {
    console.error('Firebase Admin initialization error:', error);

  }
}

export const adminDb = admin.firestore();