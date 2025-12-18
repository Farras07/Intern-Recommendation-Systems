import { adminDb as db } from '@/lib/firebase-admin';
import InternalServerError from '@/exceptions/InternalServerError';
import NotFoundError from '@/exceptions/NotFoundError';
import BaseError from '@/exceptions/BaseError';
import { nanoid } from 'nanoid';
import {
  BatchPayloadAddType,
  BatchPayloadUpdateType,
} from '@/types/BatchTypes';

export default class BatchServices {
  _db: typeof db;

  constructor(database: any) {
    this._db = database;
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
