export const runtime = 'nodejs';
import BatchServices from '@/Services/BatchServices';
import InternBatchHandler from './handler';
import { adminDb as db } from '@/lib/firebase-admin';

let internBatchHandler: InternBatchHandler;

function getHandler() {
  if (!internBatchHandler) {
    const batchServices = new BatchServices(db);
    internBatchHandler = new InternBatchHandler(batchServices);
  }
  return internBatchHandler;
}

export async function POST(req: Request, context: any) {
  const handler = getHandler();
  return handler.POST(req, context);
}

export async function GET(req: Request, context: any) {
  const handler = getHandler();
  return handler.GET(req, context);
}

export async function PUT(req: Request, context: any) {
  const handler = getHandler();
  return handler.PUT(req, context);
}

export async function DELETE(req: Request, context: any) {
  const handler = getHandler();
  return handler.DELETE(req, context);
}
