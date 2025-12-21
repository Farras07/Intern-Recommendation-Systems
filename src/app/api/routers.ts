// app/api/routers.ts
import UserServices from '@/Services/UserServices';
import DriveServices from '@/Services/DriveServices';
import InternServices from '@/Services/InternServices';
import RecommendationServices from '@/Services/RecommendationServices';
import MeetServices from '@/Services/MeetServices';
import BatchServices from '@/Services/BatchServices';
import RoleServices from '@/Services/RoleServices';
import VacancyServices from '@/Services/VacancyServices';
import RegisterServices from '@/Services/RegisterServices';

import { getAdminDb } from '@/lib/firebase-admin';
import { drive } from '@/lib/gapi';

import UserHandler from './user/handler';
import InternRoleHandler from './intern/role/handler';
import InternBatchHandler from './intern/batch/handler';
import InternBatchSlugHandler from './intern/batch/[id]/handler';
import InternRegisterHandler from './intern/vacancy/register/handler';
import InternStageHandler from './intern/vacancy/stage/handler';
import InternRegisterSlugHandler from './intern/vacancy/register/[id]/handler';
import InternVacancyHandler from './intern/vacancy/handler';
import RecommendationHandler from './recommendation/handler';
import TestRegisterHandler from './intern/test/handler';

/* =======================
   Lazy factory helpers
======================= */

function createCommon() {
  const db = getAdminDb();

  const batchServices = new BatchServices(db);
  const roleServices = new RoleServices(db);
  const vacancyServices = new VacancyServices(db);
  const registerServices = new RegisterServices(db);
  const internServices = new InternServices(db);
  const recommendationServices = new RecommendationServices(db);
  const meetServices = new MeetServices(internServices);
  const driveServices = new DriveServices(drive);
  const userServices = new UserServices(db);

  return {
    db,
    batchServices,
    roleServices,
    vacancyServices,
    registerServices,
    internServices,
    recommendationServices,
    meetServices,
    driveServices,
    userServices,
  };
}

/* =======================
   Routers
======================= */

export function userRouter() {
  const { userServices } = createCommon();
  const handler = new UserHandler(userServices);
  return {
    POST: handler.POST.bind(handler),
    GET: handler.GET.bind(handler),
    PUT: handler.PUT.bind(handler),
    DELETE: handler.DELETE.bind(handler),
  };
}

export function internBatchRouter() {
  const { batchServices } = createCommon();
  const handler = new InternBatchHandler(batchServices);
  return {
    POST: handler.POST.bind(handler),
    GET: handler.GET.bind(handler),
    PUT: handler.PUT.bind(handler),
    DELETE: handler.DELETE.bind(handler),
  };
}

export function internBatchSlugRouter() {
  const { batchServices } = createCommon();
  const handler = new InternBatchSlugHandler(batchServices);
  return {
    PUT: handler.PUT.bind(handler),
  };
}

export function internRoleRouter() {
  const { roleServices } = createCommon();
  const handler = new InternRoleHandler(roleServices);
  return {
    POST: handler.POST.bind(handler),
    GET: handler.GET.bind(handler),
    PUT: handler.PUT.bind(handler),
    DELETE: handler.DELETE.bind(handler),
  };
}

export function internVacancyRouter() {
  const { vacancyServices } = createCommon();
  const handler = new InternVacancyHandler(vacancyServices);
  return {
    POST: handler.POST.bind(handler),
    GET: handler.GET.bind(handler),
    PUT: handler.PUT.bind(handler),
    DELETE: handler.DELETE.bind(handler),
  };
}

export function internRegisterRouter() {
  const { registerServices, batchServices } = createCommon();
  const handler = new InternRegisterHandler(registerServices, batchServices);
  return {
    POST: handler.POST.bind(handler),
    GET: handler.GET.bind(handler),
  };
}

export function internRegisterSlugRouter() {
  const { internServices } = createCommon();
  const handler = new InternRegisterSlugHandler(internServices);
  return {
    GET: handler.GET.bind(handler),
    PUT: handler.PUT.bind(handler),
    DELETE: handler.DELETE.bind(handler),
  };
}

export function internStageRouter() {
  const { batchServices } = createCommon();
  const handler = new InternStageHandler(batchServices);
  return {
    GET: handler.GET.bind(handler),
  };
}

export function recommendationRouter() {
  const { recommendationServices, internServices, meetServices } =
    createCommon();
  const handler = new RecommendationHandler(
    recommendationServices,
    internServices,
    meetServices,
  );
  return {
    GET: handler.GET.bind(handler),
    POST: handler.POST.bind(handler),
  };
}

export function testInternRegisterRouter() {
  const { registerServices, batchServices } = createCommon();
  const handler = new TestRegisterHandler(registerServices, batchServices);
  return {
    POST: handler.POST.bind(handler),
    GET: handler.GET.bind(handler),
  };
}
