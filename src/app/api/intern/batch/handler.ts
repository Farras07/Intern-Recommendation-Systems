import InternServices from '@/Services/InternServices';
import { Success, Failed } from '@/types/ResponseTypes';
import ResMiddleware from '@/app/middleware/response.middleware';
import AuthMiddleware from '@/app/middleware/auth.middleware';

type InternServicesType = InstanceType<typeof InternServices>;

export default class InternBatchHandler {
  _service: InternServicesType;
  constructor(InternService: InternServicesType) {
    this._service = InternService;
  }

  POST = ResMiddleware(
    AuthMiddleware(
      async (req: Request) => {
        const payload = await req.json();
        const newBatchId = await this._service.createBatch(payload);
        return {
          statusCode: 201,
          message: 'Intern Batch Successfully Created',
          data: {
            id: newBatchId,
          },
        };
      },
      { authorizeRole: ['Admin'] },
    ),
  );

  GET = ResMiddleware(
    AuthMiddleware(async (req: Request) => {
      const { searchParams } = new URL(req.url);
      const batchId = searchParams.get('id');
      if (!batchId) {
        const batchesData = await this._service.getBatches();
        return {
          statusCode: 200,
          message: 'Get Intern Batch Success',
          data: {
            batches: batchesData,
          },
        };
      } else {
        const batchData = await this._service.getSpecificBatch(batchId);
        return {
          statusCode: 200,
          message: 'Get Intern Batch Success',
          data: {
            batch: batchData,
          },
        };
      }
    }),
  );

  PUT = ResMiddleware(
    AuthMiddleware(
      async (req: Request) => {
        const payload = await req.json();
        await this._service.updateBatch(payload);
        return {
          statusCode: 200,
          message: 'Batch Update Successfully Updated',
        };
      },
      { authorizeRole: ['Admin'] },
    ),
  );

  DELETE = ResMiddleware(
    AuthMiddleware(
      async (req: Request) => {
        const payload = await req.json();
        const { batchId } = payload;
        await this._service.deleteBatch(batchId);
        return {
          statusCode: 200,
          message: 'Intern batch Successfully Deleted',
          data: {},
        };
      },
      { authorizeRole: ['Admin'] },
    ),
  );
}
