import { google } from 'googleapis';

const auth = new google.auth.JWT({
  email: process.env.NEXTAUTH_FIREBASE_CLIENT_EMAIL,
  key: process.env.NEXTAUTH_FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});

// const auth = new google.auth.GoogleAuth({
//   keyFile: "credential.json", // path to your downloaded service account JSON
//   scopes: ["https://www.googleapis.com/auth/drive.file"],
// });

const drive = google.drive({ version: 'v3', auth });
export { drive };
