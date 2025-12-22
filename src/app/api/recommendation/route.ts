export const runtime = 'nodejs';
// import { recommendationRouter } from '@/app/api/routers';

// export const { POST, GET } = recommendationRouter();

export async function POST(req: Request, ctx: any) {
  const { recommendationRouter } = await import('@/app/api/routers');
  return recommendationRouter().POST(req, ctx);
}
export async function GET(req: Request, ctx: any) {
  const { recommendationRouter } = await import('@/app/api/routers');
  return recommendationRouter().GET(req, ctx);
}
