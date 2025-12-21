import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import UserServices from '@/Services/UserServices';
import { getAdminDb as db } from '@/lib/firebase-admin';
import { JWT } from 'next-auth/jwt';

const userServices = new UserServices(db);

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.FIREBASE_CLIENTID ?? '',
      clientSecret: process.env.FIREBASE_CLIENTSECRET ?? '',
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
    signOut: '/login',
    // verifyRequest: '/auth/verify',
    newUser: '/dashboard',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.idToken = account.id_token;

        try {
          const userData = await userServices.getUser(user.email as string);
          const data = Array.isArray(userData) ? userData[0] : userData;
          token.id = data?.id ?? user.id;
          token.verified = data?.verified ?? false;
          token.role = data?.role ?? 'user';
        } catch (error: any) {
          token.verified = false;
        }

        return {
          ...token,
          accessTokenExpires:
            Date.now() + (Number(account.expires_in) ?? 3600) * 1000,
        };
      }

      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }
      return await refreshAccessToken(token);
    },

    // Session Configuration in Auth Options
    async session({ session, token }) {
      try {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.verified = token.verified ?? false;
        session.token = {
          accessToken: token.accessToken!,
          refreshToken: token.refreshToken!,
          idToken: token.idToken!,
          exp: token.exp,
        };
        return session;
      } catch (error: any) {
        // if (error.statusCode === 404) return session;
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
        client_id: process.env.FIREBASE_CLIENTID!,
        client_secret: process.env.FIREBASE_CLIENTSECRET!,
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
