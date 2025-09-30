import InvariantError from '@/exceptions/InvariantError';
import InternServices from '@/Services/InternServices';
import { Success, Failed } from '@/types/ResponseTypes';

type InternServicesType = InstanceType<typeof InternServices>;

export default class InternBatchSlugHandler {
  _service: InternServicesType;
  constructor(InternService: InternServicesType) {
    this._service = InternService;
  }
  async PUT(req: Request, { params }: { params: { id: string } }) {
    try {
      const { id } = await params;
      const { stage } = await req.json();
      if (!id) throw new InvariantError("id doesn't exist as path url");
      if (!stage)
        throw new InvariantError("Stage doesn't exist in body property");
      await this._service.updateBatchStage(stage, id);
      return Success({
        statusCode: 200,
        message: 'Intern Role Successfully Updated',
      });
    } catch (error: any) {
      return Failed({
        statusCode: error.statusCode,
        message: error.message,
      });
    }
  }
}
