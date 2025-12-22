export const runtime = 'nodejs';

import RecommendationServices from '@/Services/RecommendationServices';
import InternServices from '@/Services/InternServices';
import NotFoundError from '@/exceptions/NotFoundError';
import { VacancyRegisType, RegistDataTypes } from '@/types/registDataTypes';
import MeetServices from '@/Services/MeetServices';
import ResMiddleware from '@/app/api/middleware/response.middleware';
import AuthMiddleware from '@/app/api/middleware/auth.middleware';
import { stageOrder } from '@/constant/stages.items';
import { Failed } from '@/types/ResponseTypes';
import BaseError from '@/exceptions/BaseError';
import RegisterServices from '@/Services/RegisterServices';
import VacancyServices from '@/Services/VacancyServices';
import RoleServices from '@/Services/RoleServices';
import { getAdminDb } from '@/lib/firebase-admin';

type RecomServicesType = InstanceType<typeof RecommendationServices>;
type InternServicesType = InstanceType<typeof InternServices>;
type MeetServicesType = InstanceType<typeof MeetServices>;
type RegisterServicesType = InstanceType<typeof RegisterServices>;
type VacancyServicesType = InstanceType<typeof VacancyServices>;
type RoleServicesType = InstanceType<typeof RoleServices>;

const db = getAdminDb();

export default class RecommendationHandler {
  _service: RecomServicesType;
  _internService: InternServicesType;
  _meetService: MeetServicesType;
  _registerService: RegisterServicesType;
  _vacancyService: VacancyServicesType;
  _roleService: RoleServicesType;

  constructor(
    RecomService: RecomServicesType,
    internService: InternServicesType,
    meetService: MeetServicesType,
  ) {
    this._service = RecomService;
    this._registerService = new RegisterServices(db);
    this._vacancyService = new VacancyServices(db);
    this._roleService = new RoleServices(db);
    this._internService = internService;
    this._meetService = meetService;
  }

  GET = ResMiddleware(
    AuthMiddleware(
      async (req: Request) => {
        const { searchParams } = new URL(req.url);
        const batchId = searchParams.get('batchId') || '';
        const stage = searchParams.get('stage') || '';
        const internData =
          await this._registerService.getRegistrationByBatchId(batchId);
        const regStage = stage.replace('_', ' ');
        const lastStageIndex = stageOrder.indexOf(regStage);
        const altData = internData.map((candidate: RegistDataTypes) => {
          const filteredVacancy = candidate.vacancy.filter(
            (vac: VacancyRegisType) => {
              const vacStageIndex = stageOrder.indexOf(vac.lastStage);
              return vacStageIndex >= lastStageIndex;
            },
          );

          return {
            ...candidate,
            vacancy: filteredVacancy,
          };
        });

        if (altData.length === 0)
          throw new NotFoundError('Registration Data Not Found');
        const vacancyIds =
          await this._vacancyService.getVacancyIdsByBatchId(batchId);

        const vacGroupData = vacancyIds
          .map((idVac: any) => {
            const list = altData
              .map((alt: any) => {
                const vacancy = alt.vacancy.find(
                  (vac: VacancyRegisType) => vac.id === idVac,
                );
                if (vacancy) {
                  return {
                    applyId: alt.id,
                    candidateName: alt.name,
                    candidateEmail: alt.email,
                    applyTime: alt.applyTime,
                    ...vacancy,
                  };
                }
                return null;
              })
              .filter(Boolean);

            return {
              id: idVac,
              list,
            };
          })
          .filter((v: any) => v.list.length > 0);

        const {
          weightResult: criteriaWeight,
          resultMatrix: criteriaWeightMatrix,
        } = await this._service.ahpCriteriasWeight();

        const recommendation = await Promise.all(
          vacGroupData.map(async (vacGroup: any) => {
            const vacancyData = (
              await this._vacancyService.getSpecificVacancy(vacGroup.id, true)
            )[0];
            const role = await this._roleService.getSpecificRoleById(
              vacancyData.role,
            );
            const vacancySkills = vacancyData.skills;
            const ahpGlobalWeightResult =
              await this._service.ahpSubcriteriaWeight(
                criteriaWeight,
                criteriaWeightMatrix,
                vacancySkills,
              );
            console.log('ahpCriteriaWeight :', criteriaWeight);
            console.log('ahpGlobalWeightResult :', ahpGlobalWeightResult);
            const topsisRank = await this._service.topsisSelection(
              vacGroup.list,
              ahpGlobalWeightResult,
            );

            const fixSortedCandidate =
              await this._service.handleSameTopsisRank(topsisRank);
            return {
              id: vacGroup.id,
              role: role.title,
              rank: fixSortedCandidate,
            };
          }),
        );

        return {
          statusCode: 200,
          message: 'Get Recommendation Successfully',
          data: recommendation,
        };
      },
      { authorizeRole: ['Admin', 'Judge'] },
    ),
  );

  POST = AuthMiddleware(
    async (req: Request) => {
      try {
        const payload = await req.json();
        const { searchParams } = new URL(req.url);
        const stageFinal = searchParams.get('final') || '';
        const { candidates } = payload;

        if (stageFinal) {
          const { pdfBuffer, rejectedCandidates } =
            await this._internService.handleAcceptanceCandidate(payload);
          await this._meetService._sendRejectionEmails(
            rejectedCandidates,
            candidates.batch,
          );

          // return new Response(pdfBuffer, {
          //   headers: {
          //     'Content-Type': 'application/pdf',
          //     'Content-Disposition':
          //       'attachment; filename="Accepted_Candidates.pdf"',
          //   },
          // });

          return new Response(new Uint8Array(pdfBuffer), {
            headers: {
              'Content-Type': 'application/pdf',
              'Content-Disposition':
                'attachment; filename="Accepted_Candidates.pdf"',
            },
          });

          // return Success({
          //   statusCode: 200,
          //   message: 'Acceptance email has been sent to participant',
          // })
        } else {
          const pdfBuffer = await this._meetService.createMeet(payload);
          // return new Response(pdfBuffer, {
          //   headers: {
          //     'Content-Type': 'application/pdf',
          //     'Content-Disposition':
          //       'attachment; filename="Interview_List.pdf"',
          //   },
          // });

          return new Response(new Uint8Array(pdfBuffer), {
            headers: {
              'Content-Type': 'application/pdf',
              'Content-Disposition':
                'attachment; filename="Interview_List.pdf"',
            },
          });
        }
      } catch (error: any) {
        console.log(error);
        if (error instanceof BaseError) {
          return Failed({
            statusCode: error.statusCode,
            message: error.message,
          });
        }
        return Failed({
          statusCode: 500,
          message: `Internal Server Error: ${error}`,
        });
      }
    },
    { authorizeRole: ['Admin'] },
  );
}
