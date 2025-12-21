// app/api/intern/batch/route.ts
export const runtime = 'nodejs';

import { internBatchRouter } from '@/app/api/routers';

export const { POST, GET, PUT, DELETE } = internBatchRouter();
