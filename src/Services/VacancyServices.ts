import { getAdminDb } from '@/lib/firebase-admin';
import InternalServerError from '@/exceptions/InternalServerError';
import NotFoundError from '@/exceptions/NotFoundError';
import BaseError from '@/exceptions/BaseError';
import { nanoid } from 'nanoid';
import { BatchResponseType } from '@/types/BatchTypes';

const db = getAdminDb();

export default class VacancyServices {
  _db: typeof db;

  constructor(database: any) {
    this._db = database;
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
        const vacancyData = vacancySnap.docs.map((docs: any) => docs.data());
        return vacancyData;
      } else {
        const vacancySnap = await this._db
          .collection('vacancy')
          .where('id', '==', id)
          .select('role')
          .get();
        if (vacancySnap.empty) throw new NotFoundError('Vacancy Not Found!');
        const vacancyData = vacancySnap.docs.map((docs: any) => docs.data());
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
      const vacancyData = vacancySnap.docs.map((docs: any) => docs.data().id);
      return vacancyData;
    } catch (error) {
      if (!(error instanceof BaseError)) {
        throw new InternalServerError(`Internal Server Error: ${error}`);
      }
      throw error;
    }
  }

  async getAllVacancy() {
    try {
      const vacancySnap = await this._db.collection('vacancy').get();
      if (vacancySnap.empty) throw new NotFoundError('Vacancies Not Found!');
      const vacancyData = vacancySnap.docs.map((docs: any) => docs.data());
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
        .map((doc: any) => doc.data())
        .filter((batch: BatchResponseType) => {
          const startDate = new Date(batch.startDate);
          const endDate = new Date(batch.endDate);
          return (
            startDate <= currentTime &&
            currentTime <= endDate &&
            batch.stage == 'Registration'
          );
        });

      if (openBatches.length === 0) throw new NotFoundError('No open batches!');
      console.log(openBatches);

      // Step 3: For each batch, fetch its vacancies
      const openVacancies = await Promise.all(
        openBatches.map(async (batch: BatchResponseType) => {
          const vacancySnap = await this._db
            .collection('vacancy')
            .where('batch', '==', batch.batchId)
            .get();

          if (vacancySnap.empty) return [];

          // Step 4: For each vacancy, fetch its role
          const vacanciesWithRole = await Promise.all(
            vacancySnap.docs.map(async (vacDoc: any) => {
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
        unsubscribe = db.collection('vacancy').onSnapshot((snapshot: any) => {
          const data = snapshot.docs.map((doc: any) => ({
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
}
