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
} from '@/types/BatchTypes';
import { formatLocalDateTimeServer } from '@/hooks/date-format.hooks';
import { firestore } from 'firebase-admin';

export default class InternServices {
  _db: typeof db;
  constructor(database: any) {
    this._db = database;
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

  // async createBatch(payload: BatchPayloadAddType) {
  //   try {
  //     const id = `batch-${nanoid(5)}`;
  //     const startDatePart = formatLocalDateTimeServer(
  //       payload.batchStartDate,
  //     ).split(',');
  //     const endDatePart = formatLocalDateTimeServer(payload.batchEndDate).split(
  //       ',',
  //     );

  //     const formattedStartDate = `${startDatePart[0]},${startDatePart[1]},${startDatePart[2]},${payload.batchStartTime}`;
  //     const formattedEndDate = `${endDatePart[0]},${endDatePart[1]},${endDatePart[2]}, ${payload.batchEndTime}`;

  //     await this._db.collection('batch').doc(id).set({
  //       batchId: id,
  //       batchName: payload.batchName,
  //       startDate: formattedStartDate,
  //       endDate: formattedEndDate,
  //     });
  //   } catch (error) {
  //     if (!(error instanceof BaseError)) {
  //       throw new InternalServerError(`Internal Server Error: ${error}`);
  //     }
  //     throw error;
  //   }
  // }
  async createBatch(payload: BatchPayloadAddType) {
    try {
      const id = `batch-${nanoid(5)}`;
      const startDatePart = formatLocalDateTimeServer(
        payload.batchStartDate,
      ).split(',');
      const endDatePart = formatLocalDateTimeServer(payload.batchEndDate).split(
        ',',
      );

      console.log(startDatePart);
      console.log(endDatePart);

      const formattedStartDate = new Date(
        `${startDatePart[0]},${startDatePart[1]},${startDatePart[2]},${payload.batchStartTime}`,
      );
      const formattedEndDate = new Date(
        `${endDatePart[0]},${endDatePart[1]},${endDatePart[2]}, ${payload.batchEndTime}`,
      );

      console.log(new Date(formattedStartDate));
      await this._db
        .collection('batch')
        .doc(id)
        .set({
          batchId: id,
          batchName: payload.batchName,
          startDate: firestore.Timestamp.fromDate(formattedStartDate),
          endDate: firestore.Timestamp.fromDate(formattedEndDate),
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
      console.log(payload);
      const { batchId } = payload;
      const startDatePart = formatLocalDateTimeServer(
        payload.batchStartDate,
      ).split(',');
      const endDatePart = formatLocalDateTimeServer(payload.batchEndDate).split(
        ',',
      );

      const formattedStartDate = new Date(
        `${startDatePart[0]},${startDatePart[1]},${startDatePart[2]}, ${payload.batchStartTime}`,
      );
      const formattedEndDate = new Date(
        `${endDatePart[0]},${endDatePart[1]},${endDatePart[2]}, ${payload.batchEndTime}`,
      );

      await this._db
        .collection('batch')
        .doc(batchId)
        .update({
          batchId,
          batchName: payload.batchName,
          startDate: firestore.Timestamp.fromDate(formattedStartDate),
          endDate: firestore.Timestamp.fromDate(formattedEndDate),
        });
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
  async getOpenVacancy() {
    try {
      const currentTime = new Date();

      // Step 1: Get batches that haven't ended yet
      const batchSnap = await this._db
        .collection('batch')
        .where('endDate', '>', currentTime)
        .get();

      if (batchSnap.empty) throw new NotFoundError('No active batch found!');

      // Step 2: Filter in-memory by startDate < now
      const openBatches = batchSnap.docs
        .map(doc => doc.data())
        .filter(batch => batch.startDate.toDate() < currentTime);

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
                  startDate: batch.startDate._seconds,
                  endDate: batch.endDate._seconds,
                  status: 'Hiring',
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
      console.log('brooooo');
      const { batch, role, id, skills } = payload;
      console.log(payload);

      await db.collection('vacancy').doc(id).update({
        id,
        batch,
        role,
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
      console.log(data);
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
}
