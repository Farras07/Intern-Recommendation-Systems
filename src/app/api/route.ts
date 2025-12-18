// app/api/user/route.ts
export const runtime = 'nodejs';

import UserServices from '@/Services/UserServices';
import DriveServices from '@/Services/DriveServices';
import InternServices from '@/Services/InternServices';
import RecommendationServices from '@/Services/RecommendationServices';
import MeetServices from '@/Services/MeetServices';
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
import { adminDb as db } from '@/lib/firebase-admin';
import { drive } from '@/lib/gapi';

// Lazy initialization - only initialize when actually called
let servicesInitialized = false;
let userServices: UserServices;
let userHandler: UserHandler;
let batchServices: BatchServices;
let roleServices: RoleServices;
let vacancyServices: VacancyServices;
let registerService: RegisterServices;
let driveServices: DriveServices;
let testRegisterHandler: TestRegisterHandler;
let internServices: InternServices;
let meetServices: MeetServices;
let internVacancyHandler: InternVacancyHandler;
let internStageHandler: InternStageHandler;
let internRoleHandler: InternRoleHandler;
let internBatchHandler: InternBatchHandler;
let internBatchSlugHandler: InternBatchSlugHandler;
let internRegisterSlugHandler: InternRegisterSlugHandler;
let internRegisterHandler: InternRegisterHandler;
let internBatchStreamHandler: InternBatchStreamHandler;
let internRoleStreamHandler: InternRoleStreamHandler;
let internVacancyStreamHandler: InternVacancyStreamHandler;
let recommendationServices: RecommendationServices;
let recommendationHandler: RecommendationHandler;

function initializeServices() {
  if (servicesInitialized) return;

  userServices = new UserServices(db);
  userHandler = new UserHandler(userServices);
  batchServices = new BatchServices(db);
  roleServices = new RoleServices(db);
  vacancyServices = new VacancyServices(db);
  registerService = new RegisterServices(db);
  driveServices = new DriveServices(drive);

  testRegisterHandler = new TestRegisterHandler(registerService, batchServices);

  internServices = new InternServices(db);
  meetServices = new MeetServices(internServices);
  internVacancyHandler = new InternVacancyHandler(vacancyServices);
  internStageHandler = new InternStageHandler(batchServices);
  internRoleHandler = new InternRoleHandler(roleServices);
  internBatchHandler = new InternBatchHandler(batchServices);
  internBatchSlugHandler = new InternBatchSlugHandler(batchServices);
  internRegisterSlugHandler = new InternRegisterSlugHandler(internServices);
  internRegisterHandler = new InternRegisterHandler(
    registerService,
    batchServices,
  );
  internBatchStreamHandler = new InternBatchStreamHandler(internServices);
  internRoleStreamHandler = new InternRoleStreamHandler(internServices);
  internVacancyStreamHandler = new InternVacancyStreamHandler(internServices);

  recommendationServices = new RecommendationServices(db);
  recommendationHandler = new RecommendationHandler(
    recommendationServices,
    internServices,
    meetServices,
  );

  servicesInitialized = true;
}

export function testInternRegisterRouter() {
  initializeServices();
  const POST = testRegisterHandler.POST.bind(testRegisterHandler);
  const GET = testRegisterHandler.GET.bind(testRegisterHandler);
  return { POST, GET };
}

export function userRouter() {
  initializeServices();
  const POST = userHandler.POST.bind(userHandler);
  const GET = userHandler.GET.bind(userHandler);
  const PUT = userHandler.PUT.bind(userHandler);
  const DELETE = userHandler.DELETE.bind(userHandler);
  return { POST, GET, PUT, DELETE };
}

export function internRegisterRouter() {
  initializeServices();
  const POST = internRegisterHandler.POST.bind(internRegisterHandler);
  const GET = internRegisterHandler.GET.bind(internRegisterHandler);
  return { POST, GET };
}

export function internRegisterSlugRouter() {
  initializeServices();
  const GET = internRegisterSlugHandler.GET.bind(internRegisterSlugHandler);
  const PUT = internRegisterSlugHandler.PUT.bind(internRegisterSlugHandler);
  const DELETE = internRegisterSlugHandler.DELETE.bind(
    internRegisterSlugHandler,
  );
  return { GET, PUT, DELETE };
}

export function internVacancyRouter() {
  initializeServices();
  const POST = internVacancyHandler.POST.bind(internVacancyHandler);
  const DELETE = internVacancyHandler.DELETE.bind(internVacancyHandler);
  const PUT = internVacancyHandler.PUT.bind(internVacancyHandler);
  const GET = internVacancyHandler.GET.bind(internVacancyHandler);
  return { POST, DELETE, PUT, GET };
}

export function internRoleRouter() {
  initializeServices();
  const POST = internRoleHandler.POST.bind(internRoleHandler);
  const GET = internRoleHandler.GET.bind(internRoleHandler);
  const DELETE = internRoleHandler.DELETE.bind(internRoleHandler);
  const PUT = internRoleHandler.PUT.bind(internRoleHandler);
  return { POST, GET, DELETE, PUT };
}

export function internBatchRouter() {
  initializeServices();
  const POST = internBatchHandler.POST.bind(internBatchHandler);
  const GET = internBatchHandler.GET.bind(internBatchHandler);
  const DELETE = internBatchHandler.DELETE.bind(internBatchHandler);
  const PUT = internBatchHandler.PUT.bind(internBatchHandler);
  return { POST, GET, DELETE, PUT };
}

export function internBatchSlugRouter() {
  initializeServices();
  const PUT = internBatchSlugHandler.PUT.bind(internBatchSlugHandler);
  return { PUT };
}

export function recommendationRouter() {
  initializeServices();
  const GET = recommendationHandler.GET.bind(recommendationHandler);
  const POST = recommendationHandler.POST.bind(recommendationHandler);
  return { GET, POST };
}

export function internStageRouter() {
  initializeServices();
  const GET = internStageHandler.GET.bind(internStageHandler);
  return { GET };
}

export function internVacancyStreamRouter() {
  initializeServices();
  const GET = internVacancyStreamHandler.GET.bind(internVacancyStreamHandler);
  return { GET };
}

export function internBatchStreamRouter() {
  initializeServices();
  const GET = internBatchStreamHandler.GET.bind(internBatchStreamHandler);
  return { GET };
}

export function internRoleStreamRouter() {
  initializeServices();
  const GET = internRoleStreamHandler.GET.bind(internRoleStreamHandler);
  return { GET };
}
