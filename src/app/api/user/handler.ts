import UserServices from '@/Services/UserServices';
import { Success, Failed } from '@/types/ResponseTypes';

type UserServicesType = InstanceType<typeof UserServices>;

export default class UserHandler {
  _service: UserServicesType;
  constructor(UserService: UserServicesType) {
    this._service = UserService;
  }

  async POST(req: Request) {
    try {
      const payload = await req.json();
      const newUserId = await this._service.createUser(payload);
      return Success({
        statusCode: 201,
        message: 'User Successfully Created',
        data: {
          id: newUserId,
        },
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
      else user = await this._service.getUser();

      return Response.json(
        {
          data: {
            user,
          },
          status: 'Success',
        },
        { status: 200 },
      );
    } catch (error: any) {
      return Failed({
        statusCode: error.statusCode,
        message: error.message,
      });
    }
  }
}
