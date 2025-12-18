// import InternServices from '@/Services/InternServices';
import ResMiddleware from '@/app/api/middleware/response.middleware';
import AuthMiddleware from '@/app/api/middleware/auth.middleware';
import BatchServices from '@/Services/BatchServices';

type BatchServicesType = InstanceType<typeof BatchServices>;

export default class InternStageHandler {
  _service: BatchServicesType;
  constructor(batchService: BatchServicesType) {
    this._service = batchService;
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
