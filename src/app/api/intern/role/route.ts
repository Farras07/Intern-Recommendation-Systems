export const runtime = 'nodejs';
import { internRoleRouter } from '@/app/api/routers';

export const { POST, GET, PUT, DELETE } = internRoleRouter();
