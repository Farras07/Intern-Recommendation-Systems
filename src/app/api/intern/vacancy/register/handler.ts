import InternServices from '@/Services/InternServices';
import { Success, Failed } from '@/types/ResponseTypes';
import DriveServices from '@/Services/DriveServices';

type InternServicesType = InstanceType<typeof InternServices>;
type DriveServicesType = InstanceType<typeof DriveServices>;

export default class InternRegisterHandler {
  _service: InternServicesType;
  _drive: DriveServicesType;
  constructor(
    InternService: InternServicesType,
    driveService: DriveServicesType,
  ) {
    this._service = InternService;
    this._drive = driveService;
  }

  async POST(req: Request) {
    try {
      const payload = await req.json();
      await this._service.registerVacancy(payload);
      return Success({
        statusCode: 201,
        message: 'Intern Register Success',
      });
    } catch (error: any) {
      return Failed({
        statusCode: error.statusCode,
        message: error.message,
      });
    }
  }
}
