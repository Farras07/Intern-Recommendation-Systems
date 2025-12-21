export const runtime = 'nodejs';
import { internRegisterRouter } from '@/app/api/routers';

export const { POST, GET } = internRegisterRouter();
