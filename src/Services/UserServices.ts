import { adminDb as db } from '@/lib/firebase-admin';
import InternalServerError from '@/exceptions/InternalServerError';
import NotFoundError from '@/exceptions/NotFoundError';
import BaseError from '@/exceptions/BaseError';
import { nanoid } from 'nanoid';

export default class UserServices {
  _db: typeof db;
  constructor(database: any) {
    this._db = database;
  }

  async createUser(payload: any) {
    try {
      const id = `user-${nanoid(5)}`;
      await this._db
        .collection('users')
        .doc(id)
        .set({
          ...payload,
          id,
          createdAt: new Date(),
        });
    } catch (error) {
      if (!(error instanceof BaseError)) {
        throw new InternalServerError(`Internal Server Error: ${error}`);
      }
      throw error;
    }
  }

  async getUser(email?: string) {
    try {
      if (email) {
        const snapshot = await this._db
          .collection('users')
          .where('email', '==', email)
          .limit(1)
          .get();
        if (snapshot.empty) {
          throw new NotFoundError(`Not found Error : Data(${email}) not found`);
        }

        const doc = snapshot.docs[0];
        return {
          ...doc.data(),
        };
      } else {
        const snapshot = await this._db.collection('users').get();
        if (snapshot.empty) {
          throw new NotFoundError(`Not found Error : Data not found`);
        }

        const users = snapshot.docs.map(doc => ({
          ...doc.data(),
        }));

        return users;
      }
    } catch (error) {
      if (!(error instanceof BaseError)) {
        throw new InternalServerError(`Internal Server Error: ${error}`);
      }
      throw error;
    }
  }

  async getUserByRole(role: string) {
    try {
      const snapshot = await this._db
        .collection('users')
        .where('role', '==', role)
        .get();

      if (snapshot.empty)
        throw new NotFoundError(`Not found Error : Data not found`);
      const users = snapshot.docs.map(doc => doc.data());
      return users;
    } catch (error) {
      if (!(error instanceof BaseError)) {
        throw new InternalServerError(`Internal Server Error: ${error}`);
      }
      throw error;
    }
  }

  async updateUserRole(id: string, role: string) {
    try {
      await db.collection('users').doc(id).update({ role });
    } catch (error) {
      if (!(error instanceof BaseError)) {
        throw new InternalServerError(`Internal Server Error: ${error}`);
      }
      throw error;
    }
  }

  async deleteUserById(id: string) {
    try {
      await db.collection('users').doc(id).delete();
    } catch (error) {
      if (!(error instanceof BaseError)) {
        throw new InternalServerError(`Internal Server Error: ${error}`);
      }
      throw error;
    }
  }
}
