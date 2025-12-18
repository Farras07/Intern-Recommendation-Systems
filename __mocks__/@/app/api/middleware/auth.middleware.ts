export default function AuthMiddleware(handler: any, _permittedRole?: any) {
  return async (req: Request, ctx?: any) => {
    // Fake session object for handlers that expect it
    const mockSession = {
      user: {
        id: 'user-123',
        role: 'Admin',
        verified: true,
      },
      token: {
        exp: Date.now() / 1000 + 3600, // not expired
      },
    };

    // Simply call handler without any auth logic
    return handler(req, ctx, mockSession);
  };
}
