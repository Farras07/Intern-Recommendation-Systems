import InternServices from '@/Services/InternServices';
import { Success, Failed } from '@/types/ResponseTypes';
import InvariantError from '@/exceptions/InvariantError';
import ResMiddleware from '@/app/middleware/response.middleware';
import AuthMiddleware from '@/app/middleware/auth.middleware';

type InternServicesType = InstanceType<typeof InternServices>;

export default class InternVacancyHandler {
  _service: InternServicesType;
  constructor(InternService: InternServicesType) {
    this._service = InternService;
  }

  POST = ResMiddleware(
    AuthMiddleware(async (req: Request) => {
      const payload = await req.json();
      const newUserId = await this._service.createVacancy(payload);
      return {
        statusCode: 201,
        message: 'Intern Vacancy Successfully Created',
        data: {
          id: newUserId,
        },
      };
    }),
  );

  GET = ResMiddleware(
    AuthMiddleware(async (req: Request) => {
      const { searchParams } = new URL(req.url);
      // const filter = searchParams.get('filter');
      const vacancy = await this._service.getOpenVacancy();
      return {
        statusCode: 200,
        message: 'Intern Vacancy Successfully Retrieved',
        data: {
          vacancy,
        },
      };
    }),
  );

  DELETE = ResMiddleware(
    AuthMiddleware(async (req: Request) => {
      const { searchParams } = new URL(req.url);
      const vacancyId = searchParams.get('id');
      if (!vacancyId)
        throw new InvariantError('Pass the vacancy ID on params query id!');
      await this._service.deleteVacancy(vacancyId);
      return {
        statusCode: 200,
        message: 'Intern Vacancy Successfully Deleted',
      };
    }),
  );

  PUT = ResMiddleware(
    AuthMiddleware(async (req: Request) => {
      const payload = await req.json();
      await this._service.updateVacancy(payload);
      return {
        statusCode: 200,
        message: 'Intern Vacancy Successfully Deleted',
      };
    }),
  );
}
