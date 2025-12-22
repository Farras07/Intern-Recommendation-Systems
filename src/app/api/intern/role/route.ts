export const runtime = 'nodejs';
import { internRoleRouter } from '@/app/api/routers';

// export const { POST, GET, PUT, DELETE } = internRoleRouter();
export async function POST(req: Request, ctx: any) {
  const { internRoleRouter } = await import('@/app/api/routers');
  return internRoleRouter().POST(req, ctx);
}
export async function GET(req: Request, ctx: any) {
  const { internRoleRouter } = await import('@/app/api/routers');
  return internRoleRouter().GET(req, ctx);
}
export async function PUT(req: Request, ctx: any) {
  const { internRoleRouter } = await import('@/app/api/routers');
  return internRoleRouter().PUT(req, ctx);
}
export async function DELETE(req: Request, ctx: any) {
  const { internRoleRouter } = await import('@/app/api/routers');
  return internRoleRouter().DELETE(req, ctx);
}
