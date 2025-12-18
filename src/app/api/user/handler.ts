import InvariantError from '@/exceptions/InvariantError';
import UserServices from '@/Services/UserServices';
import EmailServices from '@/Services/EmailServices';
import ResMiddleware from '@/app/api/middleware/response.middleware';
import AuthMiddleware from '@/app/api/middleware/auth.middleware';

type UserServicesType = InstanceType<typeof UserServices>;
type EmailServicesType = InstanceType<typeof EmailServices>;

export default class UserHandler {
  _service: UserServicesType;
  _emailService: EmailServicesType;
  constructor(UserService: UserServicesType) {
    this._service = UserService;
    this._emailService = new EmailServices();
  }

  // API User POST / Create User (Admin/Judge)
  POST = ResMiddleware(async (req: Request) => {
    const payload = await req.json();
    await this._service.createUser(payload);
    if (payload.verified)
      await this._emailService.sendEmail({
        email: payload.email,
        role: payload.role,
      });

    return {
      statusCode: 201,
      message: 'User Successfully Created',
    };
  });

  GET = ResMiddleware(async (req: Request) => {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const role = searchParams.get('role');
    const verified = searchParams.get('verified');
    let user;
    if (email) user = await this._service.getUser(email);
    else if (role) {
      if (verified && verified == 'true')
        user = await this._service.getVerifiedUser(role);
      if (verified && verified == 'false')
        user = await this._service.getUnverifiedUser(role);
      else user = await this._service.getUserByRole(role);
    } else if (verified && verified == 'true')
      user = await this._service.getVerifiedUser();
    else if (verified && verified == 'false')
      user = await this._service.getUnverifiedUser();
    else user = await this._service.getUser();
    return {
      statusCode: 200,
      message: 'Get User Successfully',
      data: user,
    };
  });

  PUT = ResMiddleware(
    AuthMiddleware(
      async (req: Request) => {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('id');
        const payload = await req.json();
        if (!userId)
          throw new InvariantError("id doesn't exist as query params");

        await this._service.updateRole(userId, payload);
        return {
          statusCode: 200,
          message: 'Update User Successfully',
        };
      },
      { authorizeRole: ['Admin'], sessionAuthOnly: true },
    ),
  );

  DELETE = ResMiddleware(
    AuthMiddleware(
      async (req: Request) => {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('id');
        if (!userId)
          throw new InvariantError("id doesn't exist as query params");
        await this._service.deleteUserById(userId);
        return {
          statusCode: 200,
          message: 'Delete User Successfully',
        };
      },
      { authorizeRole: ['Admin'] },
    ),
  );
}
