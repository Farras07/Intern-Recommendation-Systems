import InvariantError from '@/exceptions/InvariantError';
import UserServices from '@/Services/UserServices';
import { Success, Failed } from '@/types/ResponseTypes';
import sendEmail from '@/Services/EmailServices';
import EmailServices from '@/Services/EmailServices';

type UserServicesType = InstanceType<typeof UserServices>;
type EmailServicesType = InstanceType<typeof EmailServices>;

export default class UserHandler {
  _service: UserServicesType;
  _emailService: EmailServicesType;
  constructor(UserService: UserServicesType) {
    this._service = UserService;
    this._emailService = new EmailServices();
  }

  async POST(req: Request) {
    try {
      const payload = await req.json();
      await this._service.createUser(payload);
      if (payload.verified)
        await this._emailService.sendEmail({
          email: payload.email,
          role: payload.role,
        });

      return Success({
        statusCode: 201,
        message: 'User Successfully Created',
      });
    } catch (error: any) {
      return Failed({
        statusCode: error.statusCode,
        message: error.statusCode,
      });
    }
  }

  async GET(req: Request) {
    try {
      const { searchParams } = new URL(req.url);
      const email = searchParams.get('email');
      let user;
      if (email) user = await this._service.getUser(email);
      else {
        const role = searchParams.get('role');
        if (role) user = await this._service.getUserByRole(role);
        else user = await this._service.getUser();
      }

      return Success({
        statusCode: 200,
        message: 'Get User Successfully',
        data: user,
      });
    } catch (error: any) {
      return Failed({
        statusCode: error.statusCode,
        message: error.message,
      });
    }
  }

  async PUT(req: Request) {
    try {
      const { searchParams } = new URL(req.url);
      const userId = searchParams.get('id');
      const { role } = await req.json();
      if (!userId) throw new InvariantError("id doesn't exist as query params");

      await this._service.updateUserRole(userId, role);
      return Success({
        statusCode: 200,
        message: 'Update User Successfully',
      });
    } catch (error: any) {
      return Failed({
        statusCode: error.statusCode,
        message: error.message,
      });
    }
  }
  async DELETE(req: Request) {
    try {
      const { searchParams } = new URL(req.url);
      const userId = searchParams.get('id');
      if (!userId) throw new InvariantError("id doesn't exist as query params");
      await this._service.deleteUserById(userId);
      return Success({
        statusCode: 200,
        message: 'Delete User Successfully',
      });
    } catch (error: any) {
      return Failed({
        statusCode: error.statusCode,
        message: error.message,
      });
    }
  }
}
