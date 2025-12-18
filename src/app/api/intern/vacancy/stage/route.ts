export const runtime = 'nodejs';
import BatchServices from '@/Services/BatchServices';
import InternStageHandler from './handler';
import { adminDb as db } from '@/lib/firebase-admin';

let internStageHandler: InternStageHandler;

function getHandler() {
  if (!internStageHandler) {
    const batchServices = new BatchServices(db);
    internStageHandler = new InternStageHandler(batchServices);
  }
  return internStageHandler;
}

export async function GET(req: Request, context: any) {
  const handler = getHandler();
  return handler.GET(req, context);
}
