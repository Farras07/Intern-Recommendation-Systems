// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions, DefaultSession  } from "next-auth";
import type { NextRequest } from "next/server"
import GoogleProvider from "next-auth/providers/google";
import AuthenticationError from "@/exceptions/AuthenticationError";
import UserServices from "@/Services/UserServices";
import AuthorizationError from "@/exceptions/AuthorizationError";
import { adminDb as db } from "@/lib/firebase-admin";
import NotFoundError from "@/exceptions/NotFoundError";

const userServices = new UserServices(db)

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_FIREBASE_CLIENTID|| "",
      clientSecret: process.env.NEXT_PUBLIC_FIREBASE_CLIENTSECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  pages: {
    signIn: "/login/handler",
    signOut: "/",
    verifyRequest: "/auth/verify",
    newUser: "/dashboard",
  },
  callbacks: {
    async jwt({ token, user }) {
      // First time the JWT callback runs, the user object is available
      if (user) {
        token.id = user.id;   // Custom ID from your DB or provider
        token.role = user.role || "user"; // Default role
      }
      return token;
    },
    async session({ session, token }) {
      try {
        if (!session.user.email) throw new AuthenticationError("Please Login First!");
        const userData = await userServices.getUser(session.user.email)
        if (userData) {
          session.user.id = token.id as string;
          session.user.role = userData.role;
          session.user.verified = userData.verified;
        }
        return session;

      } catch (error: any) {
        if (error.statusCode === 404) {
          return session
        }
        throw error
      }
    },

    async signIn({ user, credentials, account, profile }) {
      return true
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
