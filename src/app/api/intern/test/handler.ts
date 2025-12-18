// import InternServices from '@/Services/InternServices';
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
        payload.map(async data => {
          await this._service.testRegisterVacancy(data);
        }),
      );
      // await this._emailService.sendEmail({
      //   email: payload.email,
      //   name: payload.name,
      // });
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

  GET = ResMiddleware(
    AuthMiddleware(
      async (req: Request) => {
        let registData;
        const { searchParams } = new URL(req.url);
        const roleId = searchParams.get('role');
        const batchId = searchParams.get('batchId');
        if (roleId && batchId) {
          const batchData = await this._batchService.getSpecificBatch(batchId);
          registData = await this._service.getRegistration([batchData], roleId);
        } else if (roleId || batchId) {
          if (roleId) {
            console.log('brooo');
            const allBatch = await this._batchService.getBatches();
            registData = await this._service.getRegistration(allBatch, roleId);
          } else if (batchId) {
            const batchData =
              await this._batchService.getSpecificBatch(batchId);
            registData = await this._service.getRegistration([batchData]);
          }
        } else {
          const allBatch = await this._batchService.getBatches();
          registData = await this._service.getRegistration(allBatch);
        }
        return {
          statusCode: 200,
          message: 'Get Intern Register Success',
          data: registData,
        };
      },
      { authorizeRole: ['Admin'] },
    ),
  );
}
