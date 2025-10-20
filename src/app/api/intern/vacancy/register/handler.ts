import InternServices from '@/Services/InternServices';
import { Success, Failed } from '@/types/ResponseTypes';
import DriveServices from '@/Services/DriveServices';
import EmailServices from '@/Services/EmailServices';

type InternServicesType = InstanceType<typeof InternServices>;
type DriveServicesType = InstanceType<typeof DriveServices>;
type EmailServicesType = InstanceType<typeof EmailServices>;

export default class InternRegisterHandler {
  _service: InternServicesType;
  _drive: DriveServicesType;
  _emailService: EmailServicesType;
  constructor(
    InternService: InternServicesType,
    driveService: DriveServicesType,
  ) {
    this._service = InternService;
    this._drive = driveService;
    this._emailService = new EmailServices();
  }

  async POST(req: Request) {
    try {
      const payload = await req.json();
      console.log(payload);
      await this._service.registerVacancy(payload);
      await this._emailService.sendEmail({
        email: payload.email,
        name: payload.name,
      });
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
      const batchId = searchParams.get('batchId');
      if (batchType == 'active') {
        const activeBatch = await this._service.getActiveBatch();
        if (roleId)
          registData = await this._service.getRegistration(activeBatch, roleId);
        else registData = await this._service.getRegistration(activeBatch);
      } else {
        if (roleId || batchId) {
          if (roleId) {
            const allBatch = await this._service.getBatches();
            registData = await this._service.getRegistration(allBatch, roleId);
          } else if (batchId) {
            registData = await this._service.getRegistrationByBatchId(batchId);
          }
        } else {
          const allBatch = await this._service.getBatches();
          registData = await this._service.getRegistration(allBatch);
        }
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
