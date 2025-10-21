import InvariantError from '@/exceptions/InvariantError';
import InternServices from '@/Services/InternServices';
import { Success, Failed } from '@/types/ResponseTypes';
import ResMiddleware from '@/app/middleware/response.middleware';
import AuthMiddleware from '@/app/middleware/auth.middleware';

type InternServicesType = InstanceType<typeof InternServices>;

export default class InternBatchSlugHandler {
  _service: InternServicesType;
  constructor(InternService: InternServicesType) {
    this._service = InternService;
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
