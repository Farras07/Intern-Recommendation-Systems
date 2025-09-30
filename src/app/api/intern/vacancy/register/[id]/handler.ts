import InternServices from '@/Services/InternServices';
import { Success, Failed } from '@/types/ResponseTypes';

type InternServicesType = InstanceType<typeof InternServices>;

export default class InternRegisterSlugHandler {
  _service: InternServicesType;

  constructor(InternService: InternServicesType) {
    this._service = InternService;
  }

  async GET(req: Request, { params }: { params: { id: string } }) {
    try {
      const { id } = await params;
      const regisData = await this._service.getSpecificRegistration(id);

      return Success({
        statusCode: 200,
        message: 'Get Intern Registration Data Success',
        data: regisData,
      });
    } catch (error: any) {
      return Failed({
        statusCode: error.statusCode,
        message: error.message,
      });
    }
  }
  async PUT(req: Request, { params }: { params: { id: string } }) {
    try {
      const { id } = await params;
      const payload = await req.json();
      await this._service.updateRegistrationData(id, payload);
      return Success({
        statusCode: 200,
        message: 'Update Intern Registration Data Success',
      });
    } catch (error: any) {
      return Failed({
        statusCode: error.statusCode,
        message: error.message,
      });
    }
  }
}
