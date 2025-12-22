export const runtime = 'nodejs';
// import { internRegisterRouter } from '@/app/api/routers';

// export const { POST, GET } = internRegisterRouter();
export async function POST(req: Request, ctx: any) {
  const { internRegisterRouter } = await import('@/app/api/routers');
  return internRegisterRouter().POST(req, ctx);
}
export async function GET(req: Request, ctx: any) {
  const { internRegisterRouter } = await import('@/app/api/routers');
  return internRegisterRouter().GET(req, ctx);
}
