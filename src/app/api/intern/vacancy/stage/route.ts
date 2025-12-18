export const runtime = 'nodejs';
import BatchServices from '@/Services/BatchServices';
import InternStageHandler from './handler';
import { adminDb as db } from '@/lib/firebase-admin';

const batchServices = new BatchServices(db);
const internStageHandler = new InternStageHandler(batchServices);
export const GET = internStageHandler.GET.bind(internStageHandler);

// import { internStageRouter } from '../../../route';
// export const { GET } = internStageRouter();
