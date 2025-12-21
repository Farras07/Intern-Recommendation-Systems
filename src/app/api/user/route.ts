export const runtime = 'nodejs';
import { userRouter } from '@/app/api/routers';

export const { POST, GET, PUT, DELETE } = userRouter();
