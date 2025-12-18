export const runtime = 'nodejs';
import BatchServices from '@/Services/BatchServices';
import InternBatchHandler from './handler';
import { adminDb as db } from '@/lib/firebase-admin';

const batchServices = new BatchServices(db);
const internBatchHandler = new InternBatchHandler(batchServices);

export const POST = internBatchHandler.POST.bind(internBatchHandler);
export const GET = internBatchHandler.GET.bind(internBatchHandler);
export const PUT = internBatchHandler.PUT.bind(internBatchHandler);
export const DELETE = internBatchHandler.DELETE.bind(internBatchHandler);

// import { internBatchRouter } from '../../route';
// export const { POST, GET, DELETE, PUT } = internBatchRouter();
