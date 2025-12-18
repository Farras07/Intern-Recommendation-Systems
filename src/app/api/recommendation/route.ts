export const runtime = 'nodejs';
import RecommendationServices from '@/Services/RecommendationServices';
import RecommendationHandler from './handler';
import InternServices from '@/Services/InternServices';
import { adminDb as db } from '@/lib/firebase-admin';
import MeetServices from '@/Services/MeetServices';

let recommendationHandler: RecommendationHandler;

function getHandler() {
  if (!recommendationHandler) {
    const recommendationServices = new RecommendationServices(db);
    const internServices = new InternServices(db);
    const meetServices = new MeetServices(internServices);
    recommendationHandler = new RecommendationHandler(
      recommendationServices,
      internServices,
      meetServices,
    );
  }
  return recommendationHandler;
}

export async function GET(req: Request, context: any) {
  const handler = getHandler();
  return handler.GET(req, context);
}

export async function POST(req: Request, context: any) {
  const handler = getHandler();
  return handler.POST(req, context);
}
