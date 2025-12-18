export const runtime = 'nodejs';
import RegisterServices from '@/Services/RegisterServices';
import InternRegisterHandler from './handler';
import { adminDb as db } from '@/lib/firebase-admin';
import BatchServices from '@/Services/BatchServices';

const registerService = new RegisterServices(db);
const batchServices = new BatchServices(db);

const internRegisterHandler = new InternRegisterHandler(
  registerService,
  batchServices,
);

export const POST = internRegisterHandler.POST.bind(internRegisterHandler);
export const GET = internRegisterHandler.GET.bind(internRegisterHandler);

// import { internRegisterRouter } from '../../../route';
// export const { POST, GET } = internRegisterRouter();
