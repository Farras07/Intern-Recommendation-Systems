export const runtime = 'nodejs';
import { adminDb as db } from '@/lib/firebase-admin';
import InternRoleHandler from './handler';
import RoleServices from '@/Services/RoleServices';

const roleServices = new RoleServices(db);
const internRoleHandler = new InternRoleHandler(roleServices);

export const POST = internRoleHandler.POST.bind(internRoleHandler);
export const GET = internRoleHandler.GET.bind(internRoleHandler);
export const PUT = internRoleHandler.PUT.bind(internRoleHandler);
export const DELETE = internRoleHandler.DELETE.bind(internRoleHandler);

// import { internRoleRouter } from '../../route';
// export const { POST, GET, DELETE, PUT } = internRoleRouter();
