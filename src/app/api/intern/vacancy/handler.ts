import InternServices from '@/Services/InternServices';
import { Success, Failed } from '@/types/ResponseTypes';
import InvariantError from '@/exceptions/InvariantError';

type InternServicesType = InstanceType<typeof InternServices>;

export default class InternVacancyHandler {
  _service: InternServicesType;
  constructor(InternService: InternServicesType) {
    this._service = InternService;
  }

  async POST(req: Request) {
    try {
      const payload = await req.json();
      const newUserId = await this._service.createVacancy(payload);
      return Success({
        statusCode: 201,
        message: 'Intern Vacancy Successfully Created',
        data: {
          id: newUserId,
        },
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
      const vacancyId = searchParams.get('id');
      if (!vacancyId)
        throw new InvariantError('Pass the vacancy ID on params query id!');
      await this._service.deleteVacancy(vacancyId);
      return Success({
        statusCode: 200,
        message: 'Intern Vacancy Successfully Deleted',
        data: {},
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
      const payload = await req.json();
      await this._service.updateVacancy(payload);
      return Success({
        statusCode: 200,
        message: 'Intern Vacancy Successfully Deleted',
        data: {},
      });
    } catch (error: any) {
      return Failed({
        statusCode: error.statusCode,
        message: error.message,
      });
    }
  }
}
