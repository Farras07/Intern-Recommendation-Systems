import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import AuthenticationError from '@/exceptions/AuthenticationError';
import AuthorizationError from '@/exceptions/AuthorizationError';

type HandlerFunction = (req: Request, ctx?: any, session?: any) => Promise<any>;
type authorizeRoleProps = {
  authorizeRole: string[];
};

export default function AuthMiddleware(
  handler: HandlerFunction,
  permittedRole?: authorizeRoleProps,
) {
  return async (req: Request, ctx?: any) => {
    const session = await getServerSession(authOptions);

    if (!session) throw new AuthenticationError('Please login first!');

    const currentTime = Date.now();
    const tokenExpired = session?.token.exp * 1000;
    if (currentTime > tokenExpired)
      throw new AuthenticationError(
        'Your session token expired!. Please Relogin',
      );
    if (!session.user.verified) {
      throw new AuthorizationError(
        'You are not verified user to access this resource!',
      );
    }

    const { authorizeRole = [] } = permittedRole || {};
    const hasPermission = authorizeRole.includes(session.user.role);
    if (permittedRole && !hasPermission) {
      throw new AuthorizationError(
        'You are not authorized to access this resource!',
      );
    }

    // pass session to next handler
    return handler(req, ctx, session);
  };
}
