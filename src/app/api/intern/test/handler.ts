// import InternServices from '@/Services/InternServices';
export const runtime = 'nodejs';
import { Success, Failed } from '@/types/ResponseTypes';
import EmailServices from '@/Services/EmailServices';
import ResMiddleware from '@/app/api/middleware/response.middleware';
import AuthMiddleware from '@/app/api/middleware/auth.middleware';
import RegisterServices from '@/Services/RegisterServices';
import BatchServices from '@/Services/BatchServices';

// type InternServicesType = InstanceType<typeof InternServices>;
type BatchServicesType = InstanceType<typeof BatchServices>;
type RegisterServicesType = InstanceType<typeof RegisterServices>;
type EmailServicesType = InstanceType<typeof EmailServices>;

export default class InternRegisterHandler {
  _service: RegisterServicesType;
  _emailService: EmailServicesType;
  _batchService: BatchServicesType;

  constructor(
    registerService: RegisterServicesType,
    BatchService: BatchServicesType,
  ) {
    this._service = registerService;
    this._batchService = BatchService;
    this._emailService = new EmailServices();
  }

  POST = ResMiddleware(async (req: Request) => {
    try {
      const payload = await req.json();
      console.log(payload);
      await Promise.all(
        payload.map(async (data: any) => {
          await this._service.testRegisterVacancy(data);
        }),
      );

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
  });
}
