export const runtime = 'nodejs';
import UserServices from '@/Services/UserServices';
import UserHandler from './handler';
import { adminDb as db } from '@/lib/firebase-admin';

const userServices = new UserServices(db);
const userHandler = new UserHandler(userServices);

export const POST = userHandler.POST.bind(userHandler);
export const GET = userHandler.GET.bind(userHandler);
export const PUT = userHandler.PUT.bind(userHandler);
export const DELETE = userHandler.DELETE.bind(userHandler);

// import { userRouter } from '../route';
// export const { POST, GET, PUT, DELETE } = userRouter();
