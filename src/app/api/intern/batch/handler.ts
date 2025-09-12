import InternServices from '@/Services/InternServices';
import { Success, Failed } from '@/types/ResponseTypes';

type InternServicesType = InstanceType<typeof InternServices>;

export default class InternBatchHandler {
  _service: InternServicesType;
  constructor(InternService: InternServicesType) {
    this._service = InternService;
  }

  async POST(req: Request) {
    try {
      const payload = await req.json();
      const newBatchId = await this._service.createBatch(payload);
      return Success({
        statusCode: 201,
        message: 'Intern Batch Successfully Created',
        data: {
          id: newBatchId,
        },
      });
    } catch (error: any) {
      return Failed({
        statusCode: error.statusCode,
        message: error.message,
      });
    }
  }
  async GET(req: Request) {
    try {
      const { searchParams } = new URL(req.url);
      const batchName = searchParams.get('name');
      console.log(batchName);
      if (!batchName) {
        const batchesData = await this._service.getBatches();
        return Success({
          statusCode: 200,
          message: 'Get Intern Batch Success',
          data: {
            batches: batchesData,
          },
        });
      } else {
        const batchData = await this._service.getSpecificBatch(batchName);
        return Success({
          statusCode: 200,
          message: 'Get Intern Batch Success',
          data: {
            batch: batchData,
          },
        });
      }
    } catch (error: any) {
      return Failed({
        statusCode: error.statusCode,
        message: error.message,
      });
    }
  }
  async PUT(req: Request) {
    try {
      const payload = await req.json();
      await this._service.updateBatch(payload);
      return Success({
        statusCode: 201,
        message: 'Intern Role Successfully Created',
        data: {},
      });
    } catch (error: any) {
      return Failed({
        statusCode: error.statusCode,
        message: error.message,
      });
    }
  }
  async DELETE(req: Request) {
    try {
      const payload = await req.json();
      const { batchId } = payload;
      await this._service.deleteBatch(batchId);
      return Success({
        statusCode: 200,
        message: 'Intern batch Successfully Deleted',
        data: {},
      });
    } catch (error: any) {
      return Failed({
        statusCode: error.statusCode,
        message: error.message,
      });
    }
  }
}
