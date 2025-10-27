import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import AuthenticationError from '@/exceptions/AuthenticationError';
import UserServices from '@/Services/UserServices';
import { adminDb as db } from '@/lib/firebase-admin';
import { Timestamp } from 'next/dist/server/lib/cache-handlers/types';
import { JWT } from 'next-auth/jwt';

const userServices = new UserServices(db);

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_FIREBASE_CLIENTID ?? '',
      clientSecret: process.env.NEXT_PUBLIC_FIREBASE_CLIENTSECRET ?? '',
      authorization: {
        params: {
          scope: [
            'openid',
            'email',
            'profile',
            'https://www.googleapis.com/auth/calendar',
            'https://www.googleapis.com/auth/calendar.events',
          ].join(' '),
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
      if (account && user) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.idToken = account.id_token;
        token.id = (user as any).id ?? '';
        token.role = (user as any).role ?? 'user';

        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          accessTokenExpires:
            Date.now() + (Number(account.expires_in) ?? 3600) * 1000,
          user,
        };
      }

      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      // if (user) {
      //   token.id = (user as any).id ?? '';
      //   token.role = (user as any).role ?? 'user';
      // }
      return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      try {
        if (!session.user?.email)
          throw new AuthenticationError('Please login first!');
        const userData = await userServices.getUser(session.user.email);
        if (userData) {
          session.user.id = token.id as string;
          const data = Array.isArray(userData) ? userData[0] : userData;
          session.user.role = data?.role ?? null;
          session.user.verified = data?.verified ?? false;
          session.token = {
            accessToken: token.accessToken as string,
            refreshToken: token.refreshToken as string,
            idToken: token.idToken as string,
            exp: token.exp as Timestamp,
          };
        }
        return session;
      } catch (error: any) {
        if (error.statusCode === 404) return session;
        throw error;
      }
    },
    async signIn() {
      return true;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

async function refreshAccessToken(token: JWT) {
  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_FIREBASE_CLIENTID!,
        client_secret: process.env.NEXT_PUBLIC_FIREBASE_CLIENTSECRET!,
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken as string,
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) throw refreshedTokens;

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // fallback
    };
  } catch (error) {
    console.error('Error refreshing access token', error);
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}
