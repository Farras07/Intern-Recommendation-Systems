// app/api/intern/batch/[id]/route.ts
export const runtime = 'nodejs';
// import { internBatchSlugRouter } from '@/app/api/routers';

export async function PUT(req: Request, ctx: any) {
  const { internBatchSlugRouter } = await import('@/app/api/routers');
  return internBatchSlugRouter().PUT(req, ctx);
}
