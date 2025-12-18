export const runtime = 'nodejs';
import { adminDb as db } from '@/lib/firebase-admin';
import InternRoleHandler from './handler';
import RoleServices from '@/Services/RoleServices';

let internRoleHandler: InternRoleHandler;

function getHandler() {
  if (!internRoleHandler) {
    const roleServices = new RoleServices(db);
    internRoleHandler = new InternRoleHandler(roleServices);
  }
  return internRoleHandler;
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
