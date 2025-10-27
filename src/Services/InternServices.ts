import { adminDb as db } from '@/lib/firebase-admin';
import InternalServerError from '@/exceptions/InternalServerError';
import NotFoundError from '@/exceptions/NotFoundError';
import BaseError from '@/exceptions/BaseError';
import { nanoid } from 'nanoid';
import { jobRoleType } from '@/types/JobTypes';
import InvariantError from '@/exceptions/InvariantError';
import {
  BatchPayloadAddType,
  BatchPayloadUpdateType,
  BatchResponseType,
} from '@/types/BatchTypes';
import { formatLocalDateTimeServer } from '@/hooks/date-format.hooks';
import { firestore } from 'firebase-admin';
import { VacancyRegisType } from '@/types/registDataTypes';
import EmailServices from './EmailServices';
import { generateAcceptedCandidatesPDF } from '@/lib/pdfGenerator';
import {
  RankRecommendationType,
  RecommendationType,
} from '@/types/RecommendationTypes';
type EmailServicesType = InstanceType<typeof EmailServices>;

export default class InternServices {
  _db: typeof db;
  private _emailServices: EmailServicesType;

  constructor(database: any) {
    this._db = database;
    this._emailServices = new EmailServices();
  }

  async createRole(payload: any) {
    try {
      const isRoleExist = await this.getSpecificRoleByTitle(payload.title);
      if (!isRoleExist) throw new InvariantError('Role has Existed');
      const id = `role-${nanoid(5)}`;
      await this._db
        .collection('role')
        .doc(id)
        .set({
          id,
          ...payload,
        });
    } catch (error) {
      if (!(error instanceof BaseError)) {
        throw new InternalServerError(`Internal Server Error: ${error}`);
      }
      throw error;
    }
  }

  async getAllRole() {
    try {
      const snapshot = await this._db.collection('role').get();
      if (snapshot.empty) throw new NotFoundError('Intern Roles Not Found');
      const internRoles = snapshot.docs.map(doc => ({
        ...doc.data(),
      }));
      return internRoles;
    } catch (error) {
      if (!(error instanceof BaseError)) {
        throw new InternalServerError(`Internal Server Error: ${error}`);
      }
      throw error;
    }
  }
  async getSpecificRoleByTitle(title: string) {
    try {
      const snapshot = await this._db
        .collection('role')
        .where('title', '==', title)
        .get();
      if (snapshot.empty) return true;
      else return false;
    } catch (error) {
      if (!(error instanceof BaseError)) {
        throw new InternalServerError(`Internal Server Error: ${error}`);
      }
      throw error;
    }
  }
  async getSpecificRoleById(id: string) {
    try {
      const snapshot = await this._db
        .collection('role')
        .where('id', '==', id)
        .get();
      if (snapshot.empty) throw new NotFoundError("Role doesn't exist!");
      const roles = snapshot.docs.map(doc => ({
        ...doc.data(),
      }));
      return roles[0];
    } catch (error) {
      if (!(error instanceof BaseError)) {
        throw new InternalServerError(`Internal Server Error: ${error}`);
      }
      throw error;
    }
  }

  async deleteRole(title: string) {
    try {
      await db.collection('role').doc(title).delete();
    } catch (error) {
      if (!(error instanceof BaseError)) {
        throw new InternalServerError(`Internal Server Error: ${error}`);
      }
      throw error;
    }
  }

  async updateRole(payload: jobRoleType) {
    try {
      const { id, title, description } = payload;
      await db.collection('role').doc(id).update({
        title,
        description,
      });
    } catch (error) {
      if (!(error instanceof BaseError)) {
        throw new InternalServerError(`Internal Server Error: ${error}`);
      }
      throw error;
    }
  }

  async createBatch(payload: BatchPayloadAddType) {
    try {
      const id = `batch-${nanoid(5)}`;
      await this._db.collection('batch').doc(id).set({
        batchId: id,
        batchName: payload.batchName,
        startDate: payload.batchStartDate,
        endDate: payload.batchEndDate,
        stage: 'Registration',
      });
    } catch (error) {
      if (!(error instanceof BaseError)) {
        throw new InternalServerError(`Internal Server Error: ${error}`);
      }
      throw error;
    }
  }
  async getBatches() {
    try {
      const snapshot = await this._db.collection('batch').get();
      if (snapshot.empty) throw new NotFoundError('Batch Not Found');
      const internBatches = snapshot.docs.map(doc => ({
        ...doc.data(),
      }));
      return internBatches;
    } catch (error) {
      if (!(error instanceof BaseError)) {
        throw new InternalServerError(`Internal Server Error: ${error}`);
      }
      throw error;
    }
  }
  async getSpecificBatch(batchId: string) {
    try {
      const snapshot = await this._db
        .collection('batch')
        .where('batchId', '==', batchId)
        .get();
      if (snapshot.empty) throw new NotFoundError('Batch Not Found');
      const internBatches = snapshot.docs.map(doc => ({
        ...doc.data(),
      }));
      return internBatches[0];
    } catch (error) {
      if (!(error instanceof BaseError)) {
        throw new InternalServerError(`Internal Server Error: ${error}`);
      }
      throw error;
    }
  }
  async deleteBatch(batchId: string) {
    try {
      await db.collection('batch').doc(batchId).delete();
    } catch (error) {
      if (!(error instanceof BaseError)) {
        throw new InternalServerError(`Internal Server Error: ${error}`);
      }
      throw error;
    }
  }

  async updateBatch(payload: BatchPayloadUpdateType) {
    try {
      const { batchId } = payload;
      await this._db.collection('batch').doc(batchId).update({
        batchId,
        batchName: payload.batchName,
        startDate: payload.batchStartDate,
        endDate: payload.batchEndDate,
      });
    } catch (error) {
      console.log(error);
      if (!(error instanceof BaseError)) {
        throw new InternalServerError(`Internal Server Error: ${error}`);
      }
      throw error;
    }
  }
  async updateBatchStage(stage: string, id: string) {
    try {
      await this._db.collection('batch').doc(id).update({ stage });
    } catch (error) {
      if (!(error instanceof BaseError)) {
        throw new InternalServerError(`Internal Server Error: ${error}`);
      }
      throw error;
    }
  }

  async getOpenBatch() {
    try {
      const currentTime = new Date();
      const batchSnap = await this._db
        .collection('batch')
        .where('endDate', '>', currentTime)
        .get();

      const batchOpen = batchSnap.docs
        .map(doc => doc.data())
        .filter(batch => batch.startDate.toDate() < currentTime);

      if (batchSnap.empty) throw new NotFoundError('No active batch found!');
      return batchOpen;
    } catch (error) {
      if (!(error instanceof BaseError)) {
        throw new InternalServerError(`Internal Server Error: ${error}`);
      }
      throw error;
    }
  }
  async getActiveBatch() {
    try {
      const batchSnap = await this._db
        .collection('batch')
        .where('stage', '==', 'Registration')
        .get();

      if (batchSnap.empty) throw new NotFoundError('No active batch found!');
      const batchActiveData = batchSnap.docs.map(doc => doc.data());

      return batchActiveData;
    } catch (error) {
      if (!(error instanceof BaseError)) {
        throw new InternalServerError(`Internal Server Error: ${error}`);
      }
      throw error;
    }
  }
  async getActiveBatchStage() {
    try {
      const batchStageSnap = await this._db
        .collection('batch')
        .where('stage', '!=', 'Finished')
        .select('batchId', 'stage')
        .get();

      if (batchStageSnap.empty)
        throw new NotFoundError('There are no active Batch!');

      const batchActiveData = batchStageSnap.docs.map(doc => doc.data());
      return batchActiveData;
    } catch (error) {
      if (!(error instanceof BaseError)) {
        throw new InternalServerError(`Internal Server Error: ${error}`);
      }
      throw error;
    }
  }

  async createVacancy(payload: any) {
    try {
      // const isRoleExist = await this.getSpecificRoleByTitle(payload.title)
      // if (!isRoleExist) throw new InvariantError("Role has Existed")
      const id = `vacancy-${nanoid(5)}`;
      await this._db
        .collection('vacancy')
        .doc(id)
        .set({
          id,
          ...payload,
        });
    } catch (error) {
      if (!(error instanceof BaseError)) {
        throw new InternalServerError(`Internal Server Error: ${error}`);
      }
      throw error;
    }
  }
  async getSpecificVacancy(id: string, allField?: boolean) {
    try {
      if (allField) {
        const vacancySnap = await this._db
          .collection('vacancy')
          .where('id', '==', id)
          .get();

        if (vacancySnap.empty) throw new NotFoundError('Vacancy Not Found!');
        const vacancyData = vacancySnap.docs.map(docs => docs.data());
        return vacancyData;
      } else {
        const vacancySnap = await this._db
          .collection('vacancy')
          .where('id', '==', id)
          .select('role')
          .get();
        if (vacancySnap.empty) throw new NotFoundError('Vacancy Not Found!');
        const vacancyData = vacancySnap.docs.map(docs => docs.data());
        return vacancyData;
      }
    } catch (error) {
      if (!(error instanceof BaseError)) {
        throw new InternalServerError(`Internal Server Error: ${error}`);
      }
      throw error;
    }
  }
  async getVacancyIdsByBatchId(batchId: string) {
    try {
      const vacancySnap = await this._db
        .collection('vacancy')
        .where('batch', '==', batchId)
        .select('id')
        .get();
      if (vacancySnap.empty) throw new NotFoundError('Vacancy Not Found!');
      const vacancyData = vacancySnap.docs.map(docs => docs.data().id);
      return vacancyData;
    } catch (error) {
      if (!(error instanceof BaseError)) {
        throw new InternalServerError(`Internal Server Error: ${error}`);
      }
      throw error;
    }
  }

  async getOpenVacancy() {
    try {
      const currentTime = new Date();

      // Step 1: Get batches that haven't ended yet
      const batchSnap = await this._db.collection('batch').get(); // no need for Firestore '>' query if it's a string; filter later

      if (batchSnap.empty) throw new NotFoundError('No active batch found!');

      // Step 2: Filter in-memory by startDate <= now < endDate
      const openBatches = batchSnap.docs
        .map(doc => doc.data())
        .filter(batch => {
          const startDate = new Date(batch.startDate);
          const endDate = new Date(batch.endDate);
          return startDate <= currentTime && currentTime <= endDate;
        });

      if (openBatches.length === 0) throw new NotFoundError('No open batches!');

      // Step 3: For each batch, fetch its vacancies
      const openVacancies = await Promise.all(
        openBatches.map(async batch => {
          const vacancySnap = await this._db
            .collection('vacancy')
            .where('batch', '==', batch.batchId)
            .get();

          if (vacancySnap.empty) return [];

          // Step 4: For each vacancy, fetch its role
          const vacanciesWithRole = await Promise.all(
            vacancySnap.docs.map(async vacDoc => {
              const vacancy = vacDoc.data();

              const roleSnap = await this._db
                .collection('role')
                .where('id', '==', vacancy.role)
                .get();

              const role = roleSnap.empty ? null : roleSnap.docs[0].data();

              return {
                ...vacancy,
                batch: {
                  id: batch.batchId,
                  name: batch.batchName,
                  startDate: batch.startDate,
                  endDate: batch.endDate,
                  stage: batch.stage,
                },
                role: {
                  id: role?.id,
                  title: role?.title,
                },
              };
            }),
          );

          return vacanciesWithRole;
        }),
      );

      // Flatten array of arrays
      const result = openVacancies.flat();
      return result;
    } catch (error) {
      if (!(error instanceof BaseError)) {
        throw new InternalServerError(`Internal Server Error: ${error}`);
      }
      throw error;
    }
  }

  async deleteVacancy(vacancyId: string) {
    try {
      await db.collection('vacancy').doc(vacancyId).delete();
    } catch (error) {
      if (!(error instanceof BaseError)) {
        throw new InternalServerError(`Internal Server Error: ${error}`);
      }
      throw error;
    }
  }
  async updateVacancy(payload: any) {
    try {
      const { id, skills } = payload;

      await db.collection('vacancy').doc(id).update({
        skills,
      });
    } catch (error) {
      if (!(error instanceof BaseError)) {
        throw new InternalServerError(`Internal Server Error: ${error}`);
      }
      throw error;
    }
  }

  async registerVacancy(data: any) {
    try {
      const id = `apply-${nanoid(5)}`;
      await this._db
        .collection('register')
        .doc(id)
        .set({
          id,
          ...data,
        });
    } catch (error) {
      if (!(error instanceof BaseError)) {
        throw new InternalServerError(`Internal Server Error: ${error}`);
      }
      throw error;
    }
  }
  async getRegistration(batchData: any, role?: string) {
    try {
      const registData = await Promise.all(
        batchData.map(async (data: BatchResponseType) => {
          const batchSnap = await this._db
            .collection('register')
            .where('batch', '==', data.batchId)
            .get();

          if (batchSnap.empty) return [];

          // raw register data
          const batchRegistData = batchSnap.docs.map(doc => doc.data());

          // enrich vacancy with role
          const enrichedRegistData = await Promise.all(
            batchRegistData.map(async regis => {
              const enrichedVacancies = await Promise.all(
                (regis.vacancy ?? []).map(async (vacancy: VacancyRegisType) => {
                  const roleVac = await this.getSpecificVacancy(vacancy.id);
                  const roleData = await this.getSpecificRoleById(
                    roleVac[0].role,
                  );

                  return {
                    ...vacancy,
                    role: {
                      id: roleData.id,
                      title: roleData.title,
                    },
                  };
                }),
              );

              if (role) {
                const hasRole = enrichedVacancies.some(v => v.role.id === role);
                if (!hasRole) return null; // skip this regis if no match
              }

              return {
                ...regis,
                vacancy: enrichedVacancies,
              };
            }),
          );

          return enrichedRegistData.filter(r => r !== null);
        }),
      );

      return registData.flat();
    } catch (error) {
      if (!(error instanceof BaseError)) {
        throw new InternalServerError(`Internal Server Error: ${error}`);
      }
      throw error;
    }
  }

  async getRegistrationByBatchId(batchId: string) {
    try {
      const regisSnap = await this._db
        .collection('register')
        .where('batch', '==', batchId)
        .get();
      if (regisSnap.empty) return [];
      const regisData = regisSnap.docs.map(doc => doc.data());
      return regisData;
    } catch (error) {
      if (!(error instanceof BaseError)) {
        throw new InternalServerError(`Internal Server Error: ${error}`);
      }
      throw error;
    }
  }

  async getSpecificRegistration(id: string) {
    try {
      const regisSnap = await this._db
        .collection('register')
        .where('id', '==', id)
        .get();

      if (regisSnap.empty) throw new NotFoundError('Data Not Found!');
      const regisData = regisSnap.docs.map(doc => doc.data())[0];
      const enrichedRegisData = await Promise.all(
        regisData.vacancy.map(async (data: VacancyRegisType) => {
          const roleVac = await this.getSpecificVacancy(data.id);
          const roleData = await this.getSpecificRoleById(roleVac[0].role);
          return {
            ...data,
            role: {
              id: roleData.id,
              title: roleData.title,
            },
          };
        }),
      );
      return { ...regisData, vacancy: enrichedRegisData };
    } catch (error) {
      if (!(error instanceof BaseError)) {
        throw new InternalServerError(`Internal Server Error: ${error}`);
      }
      throw error;
    }
  }

  async updateRegistrationData(id: string, data: any) {
    try {
      await db
        .collection('register')
        .doc(id)
        .update({
          ...data,
        });
    } catch (error) {
      if (!(error instanceof BaseError)) {
        throw new InternalServerError(`Internal Server Error: ${error}`);
      }
      throw error;
    }
  }

  async deleteRegistrationData(id: string) {
    try {
      await db.collection('register').doc(id).delete();
    } catch (error) {
      if (!(error instanceof BaseError)) {
        throw new InternalServerError(`Internal Server Error: ${error}`);
      }
      throw error;
    }
  }

  async streamVacancyData() {
    const encoder = new TextEncoder();
    let keepAlive: NodeJS.Timeout;
    let unsubscribe: () => void;

    const stream = new ReadableStream({
      start(controller) {
        // Send initial connection event
        controller.enqueue(
          encoder.encode('event: connected\ndata: Connected to SSE\n\n'),
        );

        // Firestore listener
        unsubscribe = db.collection('vacancy').onSnapshot(snapshot => {
          const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          controller.enqueue(
            encoder.encode(
              `event: vacancy_update\ndata: ${JSON.stringify(data)}\n\n`,
            ),
          );
        });

        // Keep-alive ping every 30 seconds
        keepAlive = setInterval(() => {
          try {
            controller.enqueue(encoder.encode('event: ping\ndata: {}\n\n'));
          } catch {
            // Ignore errors when stream is closed
          }
        }, 30000);
      },

      cancel() {
        // Cleanup when the client disconnects
        clearInterval(keepAlive);
        if (unsubscribe) unsubscribe();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    });
  }
  async streamRoleData() {
    const encoder = new TextEncoder();
    let keepAlive: NodeJS.Timeout;
    let unsubscribe: () => void;

    const stream = new ReadableStream({
      start(controller) {
        // Send initial connection event
        controller.enqueue(
          encoder.encode('event: connected\ndata: Connected to SSE\n\n'),
        );

        // Firestore listener
        unsubscribe = db.collection('role').onSnapshot(snapshot => {
          const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          controller.enqueue(
            encoder.encode(
              `event: roles_update\ndata: ${JSON.stringify(data)}\n\n`,
            ),
          );
        });

        // Keep-alive ping every 30 seconds
        keepAlive = setInterval(() => {
          try {
            controller.enqueue(encoder.encode('event: ping\ndata: {}\n\n'));
          } catch {
            // Ignore errors when stream is closed
          }
        }, 30000);
      },

      cancel() {
        // Cleanup when the client disconnects
        clearInterval(keepAlive);
        if (unsubscribe) unsubscribe();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    });
  }
  async streamBatchData() {
    const encoder = new TextEncoder();
    let keepAlive: NodeJS.Timeout;
    let unsubscribe: () => void;

    const stream = new ReadableStream({
      start(controller) {
        // Send initial connection event
        controller.enqueue(
          encoder.encode('event: connected\ndata: Connected to SSE\n\n'),
        );

        // Firestore listener
        unsubscribe = db.collection('batch').onSnapshot(snapshot => {
          const data = snapshot.docs.map(doc => ({
            ...doc.data(),
          }));
          controller.enqueue(
            encoder.encode(
              `event: batch_update\ndata: ${JSON.stringify(data)}\n\n`,
            ),
          );
        });

        // Keep-alive ping every 30 seconds
        keepAlive = setInterval(() => {
          try {
            controller.enqueue(encoder.encode('event: ping\ndata: {}\n\n'));
          } catch {
            // Ignore errors when stream is closed
          }
        }, 30000);
      },

      cancel() {
        // Cleanup when the client disconnects
        clearInterval(keepAlive);
        if (unsubscribe) unsubscribe();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    });
  }

  async sendAcceptanceEmail(payload: any) {
    try {
      const { candidates, values } = payload;
      const { recommendation } = candidates;
      const data = recommendation.map((recom: RecommendationType) => {
        const topRank = recom.rank
          .sort(
            (a: RankRecommendationType, b: RankRecommendationType) =>
              a.rank - b.rank,
          )
          .slice(0, values.candidateAmount);
        return {
          ...recom,
          rank: topRank,
        };
      });
      const regisData: any[] = [];
      const pdfBuffer = await generateAcceptedCandidatesPDF(
        data,
        candidates.batch,
      );
      for (const recom of data) {
        for (const rankData of recom.rank) {
          const alreadyFetched = regisData.some(r => r.id === rankData.applyId);
          if (!alreadyFetched) {
            const registrationData = await this.getSpecificRegistration(
              rankData.applyId,
            );
            regisData.push(registrationData);
          }
          await this._emailServices.sendAcceptanceEmail(
            rankData.candidateName,
            rankData.candidateEmail,
            candidates.batch,
            recom.role,
            pdfBuffer,
          );
        }
      }
      // Update vacancies in DB
      for (const recom of data) {
        for (const rankData of recom.rank) {
          const regisIndex = regisData.findIndex(
            r => r.id === rankData.applyId,
          );
          if (regisIndex === -1) continue;

          const regis = regisData[regisIndex];
          const updatedVacancies = regis.vacancy.map((vac: any) =>
            vac.id === rankData.vacancyId
              ? { ...vac, lastStage: 'Finished' }
              : vac,
          );

          regisData[regisIndex] = { ...regis, vacancy: updatedVacancies };

          await this.updateRegistrationData(rankData.applyId, {
            vacancy: updatedVacancies,
          });
        }
      }
    } catch (error) {
      if (!(error instanceof BaseError)) {
        throw new InternalServerError(`Internal Server Error: ${error}`);
      }
      throw error;
    }
  }
}
