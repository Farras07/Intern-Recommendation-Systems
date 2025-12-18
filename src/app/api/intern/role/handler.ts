// import InternServices from '@/Services/InternServices';
export const runtime = 'nodejs';
import RoleServices from '@/Services/RoleServices';
import ResMiddleware from '@/app/api/middleware/response.middleware';
import AuthMiddleware from '@/app/api/middleware/auth.middleware';
import InvariantError from '@/exceptions/InvariantError';

type RoleServicesType = InstanceType<typeof RoleServices>;

export default class InternRoleHandler {
  _service: RoleServicesType;
  constructor(RoleService: RoleServicesType) {
    this._service = RoleService;
  }

  POST = ResMiddleware(
    AuthMiddleware(
      async (req: Request) => {
        const payload = await req.json();
        await this._service.createRole(payload);
        return {
          statusCode: 201,
          message: 'Intern Role Successfully Created',
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
        const { id: roleId } = payload;
        console.log(roleId);
        // const { searchParams } = new URL(req.url);
        // const roleId = searchParams.get('id');
        // console.log(roleId)
        if (!roleId)
          throw new InvariantError("Query params role id doesn't exist");
        await this._service.deleteRole(roleId);
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
