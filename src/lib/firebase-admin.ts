// lib/firebase-admin.ts
import admin from 'firebase-admin';

let adminDb: FirebaseFirestore.Firestore | null = null;

export function getAdminDb() {
  // ✅ Prevent execution during build / edge analysis
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return null as any;
  }

  if (adminDb) return adminDb;

  const projectId = process.env.NEXTAUTH_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.NEXTAUTH_FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.NEXTAUTH_FIREBASE_PRIVATE_KEY?.replace(
    /\\n/g,
    '\n',
  );

  // ✅ Keep your logic, just delay the crash to runtime
  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Missing Firebase Admin environment variables');
  }

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  }

  adminDb = admin.firestore();
  return adminDb;
}
