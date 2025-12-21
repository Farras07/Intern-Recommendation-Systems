import InternalServerError from '@/exceptions/InternalServerError';
import NotFoundError from '@/exceptions/NotFoundError';
import BaseError from '@/exceptions/BaseError';
import { nanoid } from 'nanoid';
import {
  BatchPayloadAddType,
  BatchPayloadUpdateType,
} from '@/types/BatchTypes';

export default class BatchServices {
  private _db: FirebaseFirestore.Firestore;

  constructor(database: FirebaseFirestore.Firestore) {
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
      this._handleError(error);
    }
  }

  async getBatches() {
    try {
      const snapshot = await this._db.collection('batch').get();
      if (snapshot.empty) throw new NotFoundError('Batch Not Found');

      return snapshot.docs.map(doc => doc.data());
    } catch (error) {
      this._handleError(error);
    }
  }

  async getSpecificBatch(batchId: string) {
    try {
      const snapshot = await this._db
        .collection('batch')
        .where('batchId', '==', batchId)
        .limit(1)
        .get();

      if (snapshot.empty) throw new NotFoundError('Batch Not Found');

      return snapshot.docs[0].data();
    } catch (error) {
      this._handleError(error);
    }
  }

  async deleteBatch(batchId: string) {
    try {
      await this._db.collection('batch').doc(batchId).delete();
    } catch (error) {
      this._handleError(error);
    }
  }

  async updateBatch(payload: BatchPayloadUpdateType) {
    try {
      const { batchId } = payload;

      await this._db.collection('batch').doc(batchId).update({
        batchName: payload.batchName,
        startDate: payload.batchStartDate,
        endDate: payload.batchEndDate,
      });
    } catch (error) {
      this._handleError(error);
    }
  }

  async updateBatchStage(stage: string, id: string) {
    try {
      await this._db.collection('batch').doc(id).update({ stage });
    } catch (error) {
      this._handleError(error);
    }
  }

  async getOpenBatch() {
    try {
      const now = new Date();

      const snapshot = await this._db
        .collection('batch')
        .where('endDate', '>', now)
        .get();

      if (snapshot.empty) throw new NotFoundError('No active batch found!');

      return snapshot.docs
        .map(doc => doc.data())
        .filter(batch => {
          const startDate =
            typeof batch.startDate?.toDate === 'function'
              ? batch.startDate.toDate()
              : new Date(batch.startDate);

          return startDate < now;
        });
    } catch (error) {
      this._handleError(error);
    }
  }

  async getActiveBatch() {
    try {
      const snapshot = await this._db
        .collection('batch')
        .where('stage', '==', 'Registration')
        .get();

      if (snapshot.empty) throw new NotFoundError('No active batch found!');

      return snapshot.docs.map(doc => doc.data());
    } catch (error) {
      this._handleError(error);
    }
  }

  async getActiveBatchStage() {
    try {
      const snapshot = await this._db
        .collection('batch')
        .where('stage', '!=', 'Finished')
        .select('batchId', 'stage')
        .get();

      if (snapshot.empty) throw new NotFoundError('There are no active Batch!');

      return snapshot.docs.map(doc => doc.data());
    } catch (error) {
      this._handleError(error);
    }
  }

  async streamBatchData() {
    const encoder = new TextEncoder();
    let keepAlive: NodeJS.Timeout;
    let unsubscribe: () => void;

    const stream = new ReadableStream({
      start: controller => {
        controller.enqueue(
          encoder.encode('event: connected\ndata: Connected\n\n'),
        );

        unsubscribe = this._db.collection('batch').onSnapshot(snapshot => {
          const data = snapshot.docs.map(doc => doc.data());
          controller.enqueue(
            encoder.encode(
              `event: batch_update\ndata: ${JSON.stringify(data)}\n\n`,
            ),
          );
        });

        keepAlive = setInterval(() => {
          controller.enqueue(encoder.encode('event: ping\ndata: {}\n\n'));
        }, 30000);
      },

      cancel() {
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

  private _handleError(error: unknown): never {
    if (error instanceof BaseError) throw error;
    throw new InternalServerError(`Internal Server Error: ${error}`);
  }
}
