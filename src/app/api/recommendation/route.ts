export const runtime = 'nodejs';
import RecommendationServices from '@/Services/RecommendationServices';
import RecommendationHandler from './handler';
import InternServices from '@/Services/InternServices';
import { adminDb as db } from '@/lib/firebase-admin';
import MeetServices from '@/Services/MeetServices';

const recommendationServices = new RecommendationServices(db);
const internServices = new InternServices(db);
const meetServices = new MeetServices(internServices);

const recommendationHandler = new RecommendationHandler(
  recommendationServices,
  internServices,
  meetServices,
);

export const GET = recommendationHandler.GET.bind(recommendationHandler);
export const POST = recommendationHandler.POST.bind(recommendationHandler);
// import { recommendationRouter } from '../route';

// export const { GET, POST } = recommendationRouter();
