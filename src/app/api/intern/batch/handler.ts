import BatchServices from '@/Services/BatchServices';
import ResMiddleware from '@/app/api/middleware/response.middleware';
import AuthMiddleware from '@/app/api/middleware/auth.middleware';
import InvariantError from '@/exceptions/InvariantError';

type BatchServicesType = InstanceType<typeof BatchServices>;

export default class InternBatchHandler {
  _service: BatchServicesType;
  constructor(batchServices: BatchServicesType) {
    this._service = batchServices;
  }

  POST = ResMiddleware(
    AuthMiddleware(
      async (req: Request) => {
        const payload = await req.json();
        await this._service.createBatch(payload);
        return {
          statusCode: 201,
          message: 'Intern Batch Successfully Created',
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
          message: 'Batch Updated Successfully',
        };
      },
      { authorizeRole: ['Admin'] },
    ),
  );

  DELETE = ResMiddleware(
    AuthMiddleware(
      async (req: Request) => {
        const { searchParams } = new URL(req.url);
        const batchId = searchParams.get('id');
        if (!batchId)
          throw new InvariantError("Query Params Batch Id doesn't exist");
        await this._service.deleteBatch(batchId);
        return {
          statusCode: 200,
          message: 'Intern batch Successfully Deleted',
        };
      },
      { authorizeRole: ['Admin'] },
    ),
  );
}
