// import InternServices from '@/Services/InternServices';
import InvariantError from '@/exceptions/InvariantError';
import ResMiddleware from '@/app/api/middleware/response.middleware';
import AuthMiddleware from '@/app/api/middleware/auth.middleware';
import VacancyServices from '@/Services/VacancyServices';

type VacancyServicesType = InstanceType<typeof VacancyServices>;

export default class InternVacancyHandler {
  _service: VacancyServicesType;
  constructor(vacancyService: VacancyServicesType) {
    this._service = vacancyService;
  }

  POST = ResMiddleware(
    AuthMiddleware(async (req: Request) => {
      const payload = await req.json();
      await this._service.createVacancy(payload);
      return {
        statusCode: 201,
        message: 'Intern Vacancy Successfully Created',
      };
    }),
  );

  GET = ResMiddleware(async (req: Request) => {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get('filter');

    let vacancy;

    if (filter && filter === 'all')
      vacancy = await this._service.getAllVacancy();
    else vacancy = await this._service.getOpenVacancy();

    return {
      statusCode: 200,
      message: 'Intern Vacancy Successfully Retrieved',
      data: {
        vacancy,
      },
    };
  });

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
