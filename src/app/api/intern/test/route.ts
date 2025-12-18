export const runtime = 'nodejs';

export async function POST(req: Request, context: any) {
  const { adminDb: db } = await import('@/lib/firebase-admin');
  const BatchServices = (await import('@/Services/BatchServices')).default;
  const TestRegisterHandler = (await import('./handler')).default;
  const RegisterServices = (await import('@/Services/RegisterServices'))
    .default;

  const registerService = new RegisterServices(db);
  const batchServices = new BatchServices(db);
  const handler = new TestRegisterHandler(registerService, batchServices);

  return handler.POST(req, context);
}

export async function GET(req: Request, context: any) {
  const { adminDb: db } = await import('@/lib/firebase-admin');
  const BatchServices = (await import('@/Services/BatchServices')).default;
  const TestRegisterHandler = (await import('./handler')).default;
  const RegisterServices = (await import('@/Services/RegisterServices'))
    .default;

  const registerService = new RegisterServices(db);
  const batchServices = new BatchServices(db);
  const handler = new TestRegisterHandler(registerService, batchServices);

  return handler.GET(req, context);
}
