import InternVacancyStreamHandler from './handler';
import InternServices from '@/Services/InternServices';
import { adminDb as db } from '@/lib/firebase-admin';

const internServices = new InternServices(db);
const internVacancyStreamHandler = new InternVacancyStreamHandler(
  internServices,
);

export const GET = internVacancyStreamHandler.GET.bind(
  internVacancyStreamHandler,
);

// import { internVacancyStreamRouter } from '../../../route';

// export const { GET } = internVacancyStreamRouter();
