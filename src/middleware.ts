import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  // Get token from NextAuth (server-side)
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  // If user not logged in, redirect
  if (!token || !token.verified) {
    const url = req.nextUrl.clone();
    url.pathname = '/warning';
    return NextResponse.redirect(url);
  }
  // If verified → continue
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
