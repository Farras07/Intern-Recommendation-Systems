export const runtime = 'nodejs';
// import { testInternRegisterRouter } from '@/app/api/routers';

// export const { POST } = testInternRegisterRouter();
export async function POST(req: Request, ctx: any) {
  const { testInternRegisterRouter } = await import('@/app/api/routers');
  return testInternRegisterRouter().POST(req, ctx);
}
