// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import AuthenticationError from '@/exceptions/AuthenticationError';
import UserServices from '@/Services/UserServices';
import { adminDb as db } from '@/lib/firebase-admin';

const userServices = new UserServices(db);

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_FIREBASE_CLIENTID || '',
      clientSecret: process.env.NEXT_PUBLIC_FIREBASE_CLIENTSECRET || '',
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  pages: {
    signIn: '/login/handler',
    signOut: '/',
    verifyRequest: '/auth/verify',
    newUser: '/dashboard',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // First time the JWT callback runs, the user object is available
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token; // only on first login
        token.idToken = account.id_token;
      }
      if (user) {
        token.id = user.id; // Custom ID from your DB or provider
        token.role = user.role || 'user'; // Default role
      }
      return token;
    },
    async session({ session, token }) {
      try {
        if (!session.user.email)
          throw new AuthenticationError('Please Login First!');
        const userData = await userServices.getUser(session.user.email);
        if (userData) {
          session.user.id = token.id as string;
          session.user.role = userData.role;
          session.user.verified = userData.verified;
          session.accessToken = token.accessToken as string;
          session.refreshToken = token.refreshToken as string;
          session.idToken = token.idToken as string;
        }
        return session;
      } catch (error: any) {
        if (error.statusCode === 404) {
          return session;
        }
        throw error;
      }
    },

    async signIn() {
      return true;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
