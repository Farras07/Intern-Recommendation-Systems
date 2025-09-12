// app/api/user/route.ts
import UserServices from "@/Services/UserServices";
import InternServices from "@/Services/InternServices";
import { adminDb as db } from "@/lib/firebase-admin";
import UserHandler from "./user/handler";
import InternRoleHandler from './intern/role/handler'
import InternRoleStreamHandler from './intern/role/stream/handler'
import InternBatchHandler from './intern/batch/handler'
import InternBatchStreamHandler from './intern/batch/stream/handler'
import InternVacancyHandler from './intern/vacancy/handler'
import InternVacancyStreamHandler from './intern/vacancy/stream/handler'

const userServices = new UserServices(db);
const userHandler = new UserHandler(userServices);

const internServices = new InternServices(db);
const internVacancyHandler = new InternVacancyHandler(internServices)
const internRoleHandler = new InternRoleHandler(internServices)
const internBatchHandler = new InternBatchHandler(internServices)
const internBatchStreamHandler = new InternBatchStreamHandler(internServices)
const internRoleStreamHandler = new InternRoleStreamHandler(internServices)
const internVacancyStreamHandler = new InternVacancyStreamHandler(internServices)

export function userRouter () {
    const POST = userHandler.POST.bind(userHandler);
    const GET = userHandler.GET.bind(userHandler);
    return {POST, GET}

} 
export function internVacancyRouter () {
    const POST = internVacancyHandler.POST.bind(internVacancyHandler);
    const DELETE = internVacancyHandler.DELETE.bind(internVacancyHandler);
    const PUT = internVacancyHandler.PUT.bind(internVacancyHandler);

    return { POST, DELETE, PUT }
} 
export function internRoleRouter () {
    const POST = internRoleHandler.POST.bind(internRoleHandler);
    const GET = internRoleHandler.GET.bind(internRoleHandler);
    const DELETE = internRoleHandler.DELETE.bind(internRoleHandler);
    const PUT = internRoleHandler.PUT.bind(internRoleHandler);

    return { POST, GET, DELETE, PUT }
} 
export function internBatchRouter () {
    const POST = internBatchHandler.POST.bind(internBatchHandler);
    const GET = internBatchHandler.GET.bind(internBatchHandler);
    const DELETE = internBatchHandler.DELETE.bind(internBatchHandler);
    const PUT = internBatchHandler.PUT.bind(internBatchHandler);

    return { POST, GET, DELETE, PUT }
} 
export function internVacancyStreamRouter() {
    const GET = internVacancyStreamHandler.GET.bind(internVacancyStreamHandler)
    return { GET }
}
export function internBatchStreamRouter() {
    const GET = internBatchStreamHandler.GET.bind(internBatchStreamHandler)
    return { GET }
}
export function internRoleStreamRouter() {
    const GET = internRoleStreamHandler.GET.bind(internRoleStreamHandler)
    return { GET }
}
