import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
      verified: boolean;
    } & DefaultSession['user'];
    token: {
      accessToken: string;
      refreshToken: string;
      idToken: string;
      exp: any;
      // verified: boolean
    };
  }

  interface User extends DefaultUser {
    id: string;
    role: string;
    verified: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    verified: boolean;
    accessToken?: string;
    refreshToken?: string;
    idToken?: string;
    accessTokenExpires?: number;
  }
}
