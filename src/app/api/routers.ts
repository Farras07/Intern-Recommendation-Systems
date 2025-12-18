// app/api/routers.ts (renamed from route.ts)
import UserServices from '@/Services/UserServices';
import DriveServices from '@/Services/DriveServices';
import InternServices from '@/Services/InternServices';
import RecommendationServices from '@/Services/RecommendationServices';
import MeetServices from '@/Services/MeetServices';
import { adminDb as db } from '@/lib/firebase-admin';
import { drive } from '@/lib/gapi';
import UserHandler from './user/handler';
import InternRoleHandler from './intern/role/handler';
import InternRoleStreamHandler from './intern/role/stream/handler';
import InternBatchHandler from './intern/batch/handler';
import InternBatchSlugHandler from './intern/batch/[id]/handler';
import InternRegisterHandler from './intern/vacancy/register/handler';
import InternStageHandler from './intern/vacancy/stage/handler';
import InternRegisterSlugHandler from './intern/vacancy/register/[id]/handler';
import InternBatchStreamHandler from './intern/batch/stream/handler';
import InternVacancyHandler from './intern/vacancy/handler';
import InternVacancyStreamHandler from './intern/vacancy/stream/handler';
import RecommendationHandler from './recommendation/handler';
import BatchServices from '@/Services/BatchServices';
import RoleServices from '@/Services/RoleServices';
import VacancyServices from '@/Services/VacancyServices';
import RegisterServices from '@/Services/RegisterServices';
import TestRegisterHandler from './intern/test/handler';

const userServices = new UserServices(db);
const userHandler = new UserHandler(userServices);
const batchServices = new BatchServices(db);
const roleServices = new RoleServices(db);
const vacancyServices = new VacancyServices(db);
const registerService = new RegisterServices(db);
const driveServices = new DriveServices(drive);

const testRegisterHandler = new TestRegisterHandler(
  registerService,
  batchServices,
);

const internServices = new InternServices(db);
const meetServices = new MeetServices(internServices);
const internVacancyHandler = new InternVacancyHandler(vacancyServices);
const internStageHandler = new InternStageHandler(batchServices);
const internRoleHandler = new InternRoleHandler(roleServices);
const internBatchHandler = new InternBatchHandler(batchServices);
const internBatchSlugHandler = new InternBatchSlugHandler(batchServices);
const internRegisterSlugHandler = new InternRegisterSlugHandler(internServices);
const internRegisterHandler = new InternRegisterHandler(
  registerService,
  batchServices,
);
const internBatchStreamHandler = new InternBatchStreamHandler(internServices);
const internRoleStreamHandler = new InternRoleStreamHandler(internServices);
const internVacancyStreamHandler = new InternVacancyStreamHandler(
  internServices,
);

const recommendationServices = new RecommendationServices(db);
const recommendationHandler = new RecommendationHandler(
  recommendationServices,
  internServices,
  meetServices,
);

export function testInternRegisterRouter() {
  const POST = testRegisterHandler.POST.bind(testRegisterHandler);
  const GET = testRegisterHandler.GET.bind(testRegisterHandler);
  return { POST, GET };
}
export function userRouter() {
  const POST = userHandler.POST.bind(userHandler);
  const GET = userHandler.GET.bind(userHandler);
  const PUT = userHandler.PUT.bind(userHandler);
  const DELETE = userHandler.DELETE.bind(userHandler);
  return { POST, GET, PUT, DELETE };
}
export function internRegisterRouter() {
  const POST = internRegisterHandler.POST.bind(internRegisterHandler);
  const GET = internRegisterHandler.GET.bind(internRegisterHandler);
  return { POST, GET };
}
export function internRegisterSlugRouter() {
  const GET = internRegisterSlugHandler.GET.bind(internRegisterSlugHandler);
  const PUT = internRegisterSlugHandler.PUT.bind(internRegisterSlugHandler);
  const DELETE = internRegisterSlugHandler.DELETE.bind(
    internRegisterSlugHandler,
  );
  return { GET, PUT, DELETE };
}
export function internVacancyRouter() {
  const POST = internVacancyHandler.POST.bind(internVacancyHandler);
  const DELETE = internVacancyHandler.DELETE.bind(internVacancyHandler);
  const PUT = internVacancyHandler.PUT.bind(internVacancyHandler);
  const GET = internVacancyHandler.GET.bind(internVacancyHandler);

  return { POST, DELETE, PUT, GET };
}
export function internRoleRouter() {
  const POST = internRoleHandler.POST.bind(internRoleHandler);
  const GET = internRoleHandler.GET.bind(internRoleHandler);
  const DELETE = internRoleHandler.DELETE.bind(internRoleHandler);
  const PUT = internRoleHandler.PUT.bind(internRoleHandler);

  return { POST, GET, DELETE, PUT };
}
export function internBatchRouter() {
  const POST = internBatchHandler.POST.bind(internBatchHandler);
  const GET = internBatchHandler.GET.bind(internBatchHandler);
  const DELETE = internBatchHandler.DELETE.bind(internBatchHandler);
  const PUT = internBatchHandler.PUT.bind(internBatchHandler);

  return { POST, GET, DELETE, PUT };
}
export function internBatchSlugRouter() {
  const PUT = internBatchSlugHandler.PUT.bind(internBatchSlugHandler);

  return { PUT };
}
export function recommendationRouter() {
  const GET = recommendationHandler.GET.bind(recommendationHandler);
  const POST = recommendationHandler.POST.bind(recommendationHandler);
  return { GET, POST };
}
export function internStageRouter() {
  const GET = internStageHandler.GET.bind(internStageHandler);
  return { GET };
}
export function internVacancyStreamRouter() {
  const GET = internVacancyStreamHandler.GET.bind(internVacancyStreamHandler);
  return { GET };
}
export function internBatchStreamRouter() {
  const GET = internBatchStreamHandler.GET.bind(internBatchStreamHandler);
  return { GET };
}
export function internRoleStreamRouter() {
  const GET = internRoleStreamHandler.GET.bind(internRoleStreamHandler);
  return { GET };
}
