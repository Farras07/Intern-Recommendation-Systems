import InvariantError from '@/exceptions/InvariantError';
import RecommendationServices from '@/Services/RecommendationServices';
import { Success, Failed } from '@/types/ResponseTypes';
import sendEmail from '@/Services/EmailServices';
import InternServices from '@/Services/InternServices';
import NotFoundError from '@/exceptions/NotFoundError';
import { VacancyRegisType } from '@/types/registDataTypes';
import MeetServices from '@/Services/MeetServices';
import ResMiddleware from '@/app/middleware/response.middleware';
import AuthMiddleware from '@/app/middleware/auth.middleware';

type RecomServicesType = InstanceType<typeof RecommendationServices>;
type InternServicesType = InstanceType<typeof InternServices>;
type MeetServicesType = InstanceType<typeof MeetServices>;

export default class RecommendationHandler {
  _service: RecomServicesType;
  _internService: InternServicesType;
  _meetService: MeetServicesType;
  constructor(
    RecomService: RecomServicesType,
    internService: InternServicesType,
    meetService: MeetServicesType,
  ) {
    this._service = RecomService;
    this._internService = internService;
    this._meetService = meetService;
  }

  GET = ResMiddleware(
    AuthMiddleware(
      async (req: Request) => {
        const { searchParams } = new URL(req.url);
        const batchId = searchParams.get('batchId') || '';
        const stage = searchParams.get('stage') || '';
        const altData =
          await this._internService.getRegistrationByBatchId(batchId);
        if (altData.length === 0)
          throw new NotFoundError('Registration Data Not Found');
        const vacancyIds =
          await this._internService.getVacancyIdsByBatchId(batchId);

        const vacGroupData = vacancyIds.map(idVac => {
          const list = altData
            .map(alt => {
              const vacancy = alt.vacancy.find(
                (vac: VacancyRegisType) => vac.id === idVac,
              );
              if (vacancy) {
                return {
                  applyId: alt.id,
                  candidateName: alt.name,
                  candidateEmail: alt.email,
                  ...vacancy, // merge with the vacancy data
                };
              }
              return null;
            })
            .filter(Boolean); // remove nulls

          return {
            id: idVac,
            list,
          };
        });

        const {
          weightResult: criteriaWeight,
          resultMatrix: criteriaWeightMatrix,
        } = await this._service.ahpCriteriasWeight();

        const recommendation = await Promise.all(
          vacGroupData.map(async vacGroup => {
            const vacancyData = (
              await this._internService.getSpecificVacancy(vacGroup.id, true)
            )[0];
            const role = await this._internService.getSpecificRoleById(
              vacancyData.role,
            );
            const vacancySkills = vacancyData.skills;
            const ahpGlobalWeightResult =
              await this._service.ahpSubcriteriaWeight(
                criteriaWeight,
                criteriaWeightMatrix,
                vacancySkills,
              );
            let topsisRank;

            if (stage == 'selection_1')
              topsisRank = await this._service.topsisSelection1(
                vacGroup.list,
                ahpGlobalWeightResult,
              );
            // else if (stage == 'selection_2') topsisRank = await this._service.topsisSelection1(vacGroup.list, ahpGlobalWeightResult)
            else throw new InvariantError('Stage Query Param is Wrong!!');

            return { id: vacGroup.id, role: role.title, rank: topsisRank };
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

  POST = ResMiddleware(
    AuthMiddleware(
      async (req: Request) => {
        const payload = await req.json();
        await this._meetService.createMeet(payload);
        return {
          statusCode: 200,
          message: 'Create Meet Room Success',
        };
      },
      { authorizeRole: ['Admin'] },
    ),
  );
}
