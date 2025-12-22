// app/api/middleware/auth.middleware.ts
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import AuthenticationError from '@/exceptions/AuthenticationError';
import AuthorizationError from '@/exceptions/AuthorizationError';

type HandlerFunction = (req: Request, ctx?: any, session?: any) => Promise<any>;
type optionsAuth = {
  authorizeRole: string[];
  sessionAuthOnly?: boolean;
};

export default function AuthMiddleware(
  handler: HandlerFunction,
  permittedRole?: optionsAuth,
) {
  return async (req: Request, ctx?: any) => {
    const session = await getServerSession(authOptions);
    const { authorizeRole = [], sessionAuthOnly = false } = permittedRole || {};

    if (!session) throw new AuthenticationError('Please login first!');

    if (!session.user.verified) {
      throw new AuthorizationError(
        'You are not verified user to access this resource!',
      );
    }

    if (sessionAuthOnly) return handler(req, ctx, session);

    const hasPermission = authorizeRole.includes(session.user.role);
    if (permittedRole && !hasPermission) {
      throw new AuthorizationError(
        'You are not authorized to access this resource!',
      );
    }

    // ✅ FIX: guard token before accessing exp
    if (!session.token || typeof session.token.exp !== 'number') {
      throw new AuthenticationError('Invalid session token. Please relogin.');
    }

    const currentTime = Date.now();
    const tokenExpired = session.token.exp * 1000;

    if (currentTime > tokenExpired) {
      throw new AuthenticationError(
        'Your session token expired!. Please Relogin',
      );
    }

    return handler(req, ctx, session);
  };
}
