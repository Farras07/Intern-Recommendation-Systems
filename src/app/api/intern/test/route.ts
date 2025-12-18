export const runtime = 'nodejs';
import BatchServices from '@/Services/BatchServices';
import TestRegisterHandler from './handler';
import RegisterServices from '@/Services/RegisterServices';
import { adminDb as db } from '@/lib/firebase-admin';

let testRegisterHandler: TestRegisterHandler;

function getHandler() {
  if (!testRegisterHandler) {
    const registerService = new RegisterServices(db);
    const batchServices = new BatchServices(db);
    testRegisterHandler = new TestRegisterHandler(
      registerService,
      batchServices,
    );
  }
  return testRegisterHandler;
}

export async function POST(req: Request) {
  const handler = getHandler();
  return handler.POST(req);
}

export async function GET(req: Request) {
  const handler = getHandler();
  return handler.GET(req);
}
