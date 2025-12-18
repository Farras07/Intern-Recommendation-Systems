export const runtime = 'nodejs';
import InternServices from '@/Services/InternServices';
import InternBatchStreamHandler from './handler';
import { adminDb as db } from '@/lib/firebase-admin';

const internServices = new InternServices(db);
const internBatchStreamHandler = new InternBatchStreamHandler(internServices);

export const GET = internBatchStreamHandler.GET.bind(internBatchStreamHandler);

// import { internBatchStreamRouter } from '../../../route';
// export const { GET } = internBatchStreamRouter();
