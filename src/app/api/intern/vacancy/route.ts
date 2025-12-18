export const runtime = 'nodejs';
import VacancyServices from '@/Services/VacancyServices';
import InternVacancyHandler from './handler';
import { adminDb as db } from '@/lib/firebase-admin';

const vacancyServices = new VacancyServices(db);

const internVacancyHandler = new InternVacancyHandler(vacancyServices);

export const POST = internVacancyHandler.POST.bind(internVacancyHandler);
export const GET = internVacancyHandler.GET.bind(internVacancyHandler);
export const PUT = internVacancyHandler.PUT.bind(internVacancyHandler);
export const DELETE = internVacancyHandler.DELETE.bind(internVacancyHandler);

// import { internVacancyRouter } from '../../route';

// export const { POST, DELETE, PUT, GET } = internVacancyRouter();
