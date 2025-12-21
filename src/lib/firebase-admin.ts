import admin from 'firebase-admin';

let adminDb: FirebaseFirestore.Firestore | null = null;

export function getAdminDb() {
  if (adminDb) return adminDb;

  const projectId = process.env.NEXTAUTH_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.NEXTAUTH_FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.NEXTAUTH_FIREBASE_PRIVATE_KEY?.replace(
    /\\n/g,
    '\n',
  );

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
