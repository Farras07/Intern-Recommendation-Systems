import InternServices from '@/Services/InternServices';
import { Success } from '@/types/ResponseTypes';
import ResMiddleware from '@/app/middleware/response.middleware';
import AuthMiddleware from '@/app/middleware/auth.middleware';

type InternServicesType = InstanceType<typeof InternServices>;

export default class InternRegisterSlugHandler {
  _service: InternServicesType;

  constructor(InternService: InternServicesType) {
    this._service = InternService;
  }

  GET = ResMiddleware(
    AuthMiddleware(
      async (req: Request, { params }: { params: { id: string } }) => {
        const { id } = await params;
        const regisData = await this._service.getSpecificRegistration(id);

        return {
          statusCode: 200,
          message: 'Get Intern Registration Data Success',
          data: regisData,
        };
      },
    ),
  );

  PUT = ResMiddleware(
    AuthMiddleware(
      async (req: Request, { params }: { params: { id: string } }) => {
        const { id } = await params;
        const payload = await req.json();
        await this._service.updateRegistrationData(id, payload);
        return Success({
          statusCode: 200,
          message: 'Update Intern Registration Data Success',
        });
      },
    ),
  );

  DELETE = ResMiddleware(
    AuthMiddleware(
      async (req: Request, { params }: { params: { id: string } }) => {
        const { id } = await params;
        await this._service.deleteRegistrationData(id);
        return Success({
          statusCode: 200,
          message: 'Update Intern Registration Data Success',
        });
      },
      { authorizeRole: ['Admin'] },
    ),
  );
}
