export const runtime = 'nodejs';
// import { internVacancyRouter } from '@/app/api/routers';

// export const { POST, GET, PUT, DELETE } = internVacancyRouter();
export async function POST(req: Request, ctx: any) {
  const { internVacancyRouter } = await import('@/app/api/routers');
  return internVacancyRouter().POST(req, ctx);
}
export async function GET(req: Request, ctx: any) {
  const { internVacancyRouter } = await import('@/app/api/routers');
  return internVacancyRouter().GET(req, ctx);
}
export async function PUT(req: Request, ctx: any) {
  const { internVacancyRouter } = await import('@/app/api/routers');
  return internVacancyRouter().PUT(req, ctx);
}
export async function DELETE(req: Request, ctx: any) {
  const { internVacancyRouter } = await import('@/app/api/routers');
  return internVacancyRouter().DELETE(req, ctx);
}
