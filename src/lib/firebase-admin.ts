// lib/firebase-admin.ts
import admin from 'firebase-admin';

console.log('Project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECTID);
console.log('Client Email:', process.env.NEXTAUTH_FIREBASE_CLIENT_EMAIL);
console.log(
  'Private Key:',
  process.env.NEXTAUTH_FIREBASE_PRIVATE_KEY?.substring(0, 20),
);
console.log('Email:', process.env.NEXT_PUBLIC_DEV_EMAIL);

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
        clientEmail: process.env.NEXTAUTH_FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.NEXTAUTH_FIREBASE_PRIVATE_KEY?.replace(
          /\\n/g,
          '\n',
        ),
      }),
    });
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
  }
}

export const adminDb = admin.firestore();
