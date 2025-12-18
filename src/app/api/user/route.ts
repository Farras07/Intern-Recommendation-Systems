export const runtime = 'nodejs';
import UserServices from '@/Services/UserServices';
import UserHandler from './handler';
import { adminDb as db } from '@/lib/firebase-admin';

let userHandler: UserHandler;

function getHandler() {
  if (!userHandler) {
    const userServices = new UserServices(db);
    userHandler = new UserHandler(userServices);
  }
  return userHandler;
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
