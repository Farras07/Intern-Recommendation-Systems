export const runtime = 'nodejs';
// import { userRouter } from '@/app/api/routers';

// export const { POST, GET, PUT, DELETE } = userRouter();

export async function POST(req: Request, ctx: any) {
  const { userRouter } = await import('@/app/api/routers');
  return userRouter().POST(req, ctx);
}
export async function GET(req: Request, ctx: any) {
  const { userRouter } = await import('@/app/api/routers');
  return userRouter().GET(req, ctx);
}
export async function PUT(req: Request, ctx: any) {
  const { userRouter } = await import('@/app/api/routers');
  return userRouter().PUT(req, ctx);
}
export async function DELETE(req: Request, ctx: any) {
  const { userRouter } = await import('@/app/api/routers');
  return userRouter().DELETE(req, ctx);
}
