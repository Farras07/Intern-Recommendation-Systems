// app/api/user/route.ts
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

const userServices = new UserServices(db);
const userHandler = new UserHandler(userServices);

const driveServices = new DriveServices(drive);

const internServices = new InternServices(db);
const meetServices = new MeetServices(internServices);
const internVacancyHandler = new InternVacancyHandler(internServices);
const internStageHandler = new InternStageHandler(internServices);
const internRoleHandler = new InternRoleHandler(internServices);
const internBatchHandler = new InternBatchHandler(internServices);
const internBatchSlugHandler = new InternBatchSlugHandler(internServices);
const internRegisterSlugHandler = new InternRegisterSlugHandler(internServices);
const internRegisterHandler = new InternRegisterHandler(
  internServices,
  driveServices,
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
