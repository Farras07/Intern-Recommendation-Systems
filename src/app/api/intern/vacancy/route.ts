export const runtime = 'nodejs';
import VacancyServices from '@/Services/VacancyServices';
import InternVacancyHandler from './handler';
import { adminDb as db } from '@/lib/firebase-admin';

let internVacancyHandler: InternVacancyHandler;

function getHandler() {
  if (!internVacancyHandler) {
    const vacancyServices = new VacancyServices(db);
    internVacancyHandler = new InternVacancyHandler(vacancyServices);
  }
  return internVacancyHandler;
}

export async function POST(req: Request, context: any) {
  const handler = getHandler();
  return handler.POST(req, context);
}

export async function GET(req: Request, context: any) {
  const handler = getHandler();
  return handler.GET(req, context);
}

export async function PUT(req: Request, context: any) {
  const handler = getHandler();
  return handler.PUT(req, context);
}

export async function DELETE(req: Request, context: any) {
  const handler = getHandler();
  return handler.DELETE(req, context);
}
