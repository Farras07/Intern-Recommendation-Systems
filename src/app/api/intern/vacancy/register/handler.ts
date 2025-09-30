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
  async GET(req: Request) {
    let registData;
    try {
      const { searchParams } = new URL(req.url);
      const batchType = searchParams.get('batchType');
      const roleId = searchParams.get('role');
      if (batchType == 'active') {
        const activeBatch = await this._service.getActiveBatch();
        if (roleId)
          registData = await this._service.getRegistration(activeBatch, roleId);
        else registData = await this._service.getRegistration(activeBatch);
      } else {
        const allBatch = await this._service.getBatches();
        if (roleId)
          registData = await this._service.getRegistration(allBatch, roleId);
        else registData = await this._service.getRegistration(allBatch);
      }
      return Success({
        statusCode: 200,
        message: 'Get Intern Register Success',
        data: registData,
      });
    } catch (error: any) {
      return Failed({
        statusCode: error.statusCode,
        message: error.message,
      });
    }
  }
}
