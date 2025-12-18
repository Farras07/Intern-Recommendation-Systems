export const runtime = 'nodejs';
import BatchServices from '@/Services/BatchServices';
import TestRegisterHandler from './handler';
import RegisterServices from '@/Services/RegisterServices';
import { adminDb as db } from '@/lib/firebase-admin';
const registerService = new RegisterServices(db);
const batchServices = new BatchServices(db);

const testRegisterHandler = new TestRegisterHandler(
  registerService,
  batchServices,
);
export const POST = testRegisterHandler.POST.bind(testRegisterHandler);
export const GET = testRegisterHandler.GET.bind(testRegisterHandler);

// import { testInternRegisterRouter } from '../../route';
// export const { POST, GET } = testInternRegisterRouter();
