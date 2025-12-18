export const runtime = 'nodejs';
import RegisterServices from '@/Services/RegisterServices';
import InternRegisterHandler from './handler';
import { adminDb as db } from '@/lib/firebase-admin';
import BatchServices from '@/Services/BatchServices';

let internRegisterHandler: InternRegisterHandler;

function getHandler() {
  if (!internRegisterHandler) {
    const registerService = new RegisterServices(db);
    const batchServices = new BatchServices(db);
    internRegisterHandler = new InternRegisterHandler(
      registerService,
      batchServices,
    );
  }
  return internRegisterHandler;
}

export async function POST(req: Request, context: any) {
  const handler = getHandler();
  return handler.POST(req, context);
}

export async function GET(req: Request, context: any) {
  const handler = getHandler();
  return handler.GET(req, context);
}
