export const runtime = 'nodejs';
import BatchServices from '@/Services/BatchServices';
import { adminDb as db } from '@/lib/firebase-admin';
import InternBatchSlugHandler from './handler';

const batchServices = new BatchServices(db);
const internBatchSlugHandler = new InternBatchSlugHandler(batchServices);

export const PUT = internBatchSlugHandler.PUT.bind(internBatchSlugHandler);
// import { internBatchSlugRouter } from '../../../route';

// export const { PUT } = internBatchSlugRouter();
