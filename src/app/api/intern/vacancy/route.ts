export const runtime = 'nodejs';
import { internVacancyRouter } from '@/app/api/routers';

export const { POST, GET, PUT, DELETE } = internVacancyRouter();
