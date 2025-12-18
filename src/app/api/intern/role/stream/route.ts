export const runtime = 'nodejs';
import InternServices from '@/Services/InternServices';
import InternRoleStreamHandler from './handler';
import { adminDb as db } from '@/lib/firebase-admin';

const internServices = new InternServices(db);
const internRoleStreamHandler = new InternRoleStreamHandler(internServices);

export const GET = internRoleStreamHandler.GET.bind(internRoleStreamHandler);

// import { internRoleStreamRouter } from '../../../route';

// export const { GET } = internRoleStreamRouter();
