import InvariantError from '@/exceptions/InvariantError';
import BatchServices from '@/Services/BatchServices';
import ResMiddleware from '@/app/api/middleware/response.middleware';
import AuthMiddleware from '@/app/api/middleware/auth.middleware';
// import InternServices from '@/Services/InternServices';

type BatchServicesType = InstanceType<typeof BatchServices>;

export default class InternBatchSlugHandler {
  _service: BatchServicesType;
  constructor(batchService: BatchServicesType) {
    this._service = batchService;
  }
  PUT = ResMiddleware(
    AuthMiddleware(
      async (req: Request, { params }: { params: { id: string } }) => {
        const { id } = await params;
        const { stage } = await req.json();

        if (!id) throw new InvariantError("id doesn't exist as path url");
        if (!stage)
          throw new InvariantError("Stage doesn't exist in body property");

        await this._service.updateBatchStage(stage, id);

        return {
          statusCode: 200,
          message: 'Intern Batch Stage Successfully Updated',
        };
      },
      { authorizeRole: ['Admin'] },
    ),
  );
}
