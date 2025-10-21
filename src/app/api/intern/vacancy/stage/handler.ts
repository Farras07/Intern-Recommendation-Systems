import InternServices from '@/Services/InternServices';
import { Success, Failed } from '@/types/ResponseTypes';
import ResMiddleware from '@/app/middleware/response.middleware';
import AuthMiddleware from '@/app/middleware/auth.middleware';

type InternServicesType = InstanceType<typeof InternServices>;

export default class InternStageHandler {
  _service: InternServicesType;
  constructor(InternService: InternServicesType) {
    this._service = InternService;
  }

  GET = ResMiddleware(
    AuthMiddleware(async () => {
      const activeBatchStage = await this._service.getActiveBatchStage();
      return {
        statusCode: 200,
        message: 'Get Intern Batch Stage Success',
        data: activeBatchStage,
      };
    }),
  );
}
