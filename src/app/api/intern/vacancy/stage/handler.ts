import InternServices from '@/Services/InternServices';
import { Success, Failed } from '@/types/ResponseTypes';

type InternServicesType = InstanceType<typeof InternServices>;

export default class InternStageHandler {
  _service: InternServicesType;
  constructor(InternService: InternServicesType) {
    this._service = InternService;
  }

  async GET() {
    try {
      const activeBatchStage = await this._service.getActiveBatchStage();

      return Success({
        statusCode: 200,
        message: 'Get Intern Batch Stage Success',
        data: activeBatchStage,
      });
    } catch (error: any) {
      return Failed({
        statusCode: error.statusCode,
        message: error.message,
      });
    }
  }
}
