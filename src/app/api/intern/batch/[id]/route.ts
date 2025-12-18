export const runtime = 'nodejs';
import BatchServices from '@/Services/BatchServices';
import { adminDb as db } from '@/lib/firebase-admin';
import InternBatchSlugHandler from './handler';

let internBatchSlugHandler: InternBatchSlugHandler;

function getHandler() {
  if (!internBatchSlugHandler) {
    const batchServices = new BatchServices(db);
    internBatchSlugHandler = new InternBatchSlugHandler(batchServices);
  }
  return internBatchSlugHandler;
}

export async function PUT(req: Request, context: any) {
  const handler = getHandler();
  return handler.PUT(req, context);
}
