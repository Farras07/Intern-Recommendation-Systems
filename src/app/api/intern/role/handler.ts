import InternServices from '@/Services/InternServices';
import ResMiddleware from '@/app/middleware/response.middleware';
import AuthMiddleware from '@/app/middleware/auth.middleware';

type InternServicesType = InstanceType<typeof InternServices>;

export default class InternRoleHandler {
  _service: InternServicesType;
  constructor(InternService: InternServicesType) {
    this._service = InternService;
  }

  POST = ResMiddleware(
    AuthMiddleware(
      async (req: Request) => {
        const payload = await req.json();
        const newUserId = await this._service.createRole(payload);
        return {
          statusCode: 201,
          message: 'Intern Role Successfully Created',
          data: {
            id: newUserId,
          },
        };
      },
      { authorizeRole: ['Admin'] },
    ),
  );

  GET = ResMiddleware(
    AuthMiddleware(async (req: Request) => {
      const { searchParams } = new URL(req.url);
      const roleId = searchParams.get('id');
      if (!roleId) {
        const internRoles = await this._service.getAllRole();
        return {
          statusCode: 200,
          message: 'Get Intern Role Success',
          data: {
            roles: internRoles,
          },
        };
      } else {
        const internRoles = await this._service.getSpecificRoleById(roleId);
        return {
          statusCode: 200,
          message: 'Get Intern Role Success',
          data: {
            role: internRoles,
          },
        };
      }
    }),
  );

  DELETE = ResMiddleware(
    AuthMiddleware(
      async (req: Request) => {
        const payload = await req.json();
        const { id } = payload;
        await this._service.deleteRole(id);
        return {
          statusCode: 200,
          message: 'Delete Intern Role Success',
        };
      },
      { authorizeRole: ['Admin'] },
    ),
  );

  PUT = ResMiddleware(
    AuthMiddleware(
      async (req: Request) => {
        const payload = await req.json();
        await this._service.updateRole(payload);
        return {
          statusCode: 200,
          message: 'Update Intern Role Success',
        };
      },
      { authorizeRole: ['Admin'] },
    ),
  );
}
