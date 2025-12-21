export const runtime = 'nodejs';

import { internRegisterSlugRouter } from '@/app/api/routers';

export const { GET, PUT, DELETE } = internRegisterSlugRouter();
