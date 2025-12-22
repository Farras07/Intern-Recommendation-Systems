export const runtime = 'nodejs';

// import { internStageRouter } from '@/app/api/routers';

// export const { GET } = internStageRouter();
export async function GET(req: Request, ctx: any) {
  const { internStageRouter } = await import('@/app/api/routers');
  return internStageRouter().GET(req, ctx);
}
