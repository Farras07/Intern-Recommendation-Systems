export const runtime = 'nodejs';
import InternRegisterSlugHandler from './handler';
import { adminDb as db } from '@/lib/firebase-admin';
import InternServices from '@/Services/InternServices';

let internRegisterSlugHandler: InternRegisterSlugHandler;

function getHandler() {
  if (!internRegisterSlugHandler) {
    const internServices = new InternServices(db);
    internRegisterSlugHandler = new InternRegisterSlugHandler(internServices);
  }
  return internRegisterSlugHandler;
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
