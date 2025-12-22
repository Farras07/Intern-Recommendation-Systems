import { getAdminDb } from '@/lib/firebase-admin';
import InternalServerError from '@/exceptions/InternalServerError';
import NotFoundError from '@/exceptions/NotFoundError';
import BaseError from '@/exceptions/BaseError';
import { nanoid } from 'nanoid';
import { jobRoleType } from '@/types/JobTypes';
import InvariantError from '@/exceptions/InvariantError';
import EmailServices from './EmailServices';

const db = getAdminDb();

export default class RoleServices {
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
      const internRoles = snapshot.docs.map((doc: any) => ({
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
      const roles = snapshot.docs.map((doc: any) => ({
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
        unsubscribe = db.collection('role').onSnapshot((snapshot: any) => {
          const data = snapshot.docs.map((doc: any) => ({
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
}
