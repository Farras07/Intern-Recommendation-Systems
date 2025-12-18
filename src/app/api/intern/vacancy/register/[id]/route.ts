export const runtime = 'nodejs';
import InternRegisterSlugHandler from './handler';
import { adminDb as db } from '@/lib/firebase-admin';
import InternServices from '@/Services/InternServices';

const internServices = new InternServices(db);
const internRegisterSlugHandler = new InternRegisterSlugHandler(internServices);

export const GET = internRegisterSlugHandler.GET.bind(
  internRegisterSlugHandler,
);
export const PUT = internRegisterSlugHandler.PUT.bind(
  internRegisterSlugHandler,
);
export const DELETE = internRegisterSlugHandler.DELETE.bind(
  internRegisterSlugHandler,
);

// import { internRegisterSlugRouter } from '../../../../route';
// export const { GET, PUT, DELETE } = internRegisterSlugRouter();
