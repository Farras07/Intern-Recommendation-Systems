// app/api/intern/batch/route.ts
export const runtime = 'nodejs';

import { internBatchRouter } from '@/app/api/routers';

// export const { POST, GET, PUT, DELETE } = internBatchRouter();

export async function POST(req: Request, ctx: any) {
  return internBatchRouter().POST(req, ctx);
}
export async function GET(req: Request, ctx: any) {
  return internBatchRouter().GET(req, ctx);
}
export async function PUT(req: Request, ctx: any) {
  return internBatchRouter().PUT(req, ctx);
}
export async function DELETE(req: Request, ctx: any) {
  return internBatchRouter().DELETE(req, ctx);
}
