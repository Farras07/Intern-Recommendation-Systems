export const runtime = 'nodejs';
import { recommendationRouter } from '@/app/api/routers';

export const { POST, GET } = recommendationRouter();
