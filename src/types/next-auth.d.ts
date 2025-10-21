// types/next-auth.d.ts
import { DefaultSession } from 'next-auth';
import { Timestamp } from 'next/dist/server/lib/cache-handlers/types';

declare module 'next-auth' {
  interface Session {
    token: {
      accessToken: string;
      refreshToken: string;
      idToken: string;
      exp: Timestamp;
    };
    user: {
      id: string;
      role: string;
      verified: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    role: string;
    verified: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
  }
}
