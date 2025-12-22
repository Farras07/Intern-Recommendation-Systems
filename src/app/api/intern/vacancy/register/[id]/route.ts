export const runtime = 'nodejs';

// import { internRegisterSlugRouter } from '@/app/api/routers';

// export const { GET, PUT, DELETE } = internRegisterSlugRouter();
export async function GET(req: Request, ctx: any) {
  const { internRegisterSlugRouter } = await import('@/app/api/routers');
  return internRegisterSlugRouter().GET(req, ctx);
}
export async function PUT(req: Request, ctx: any) {
  const { internRegisterSlugRouter } = await import('@/app/api/routers');
  return internRegisterSlugRouter().PUT(req, ctx);
}
export async function DELETE(req: Request, ctx: any) {
  const { internRegisterSlugRouter } = await import('@/app/api/routers');
  return internRegisterSlugRouter().DELETE(req, ctx);
}
