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
      console.log(error);
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

  async updateRole(id: string, payload: any) {
    try {
      await db.collection('users').doc(id).update(payload);
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
  async getVerifiedUser(role?: string) {
    try {
      let snapshot;
      if (role) {
        snapshot = await this._db
          .collection('users')
          .where('verified', '==', true)
          .where('role', '==', role)
          .get();
      } else {
        snapshot = await this._db
          .collection('users')
          .where('verified', '==', true)
          .get();
      }
      if (snapshot.empty) {
        throw new NotFoundError(`Not found Error : Data not found`);
      }

      const result = snapshot.docs.map(doc => doc.data());
      return result;
    } catch (error) {
      if (!(error instanceof BaseError)) {
        throw new InternalServerError(`Internal Server Error: ${error}`);
      }
      throw error;
    }
  }
  async getUnverifiedUser(role?: string) {
    try {
      let snapshot;
      if (role) {
        snapshot = await this._db
          .collection('users')
          .where('verified', '==', false)
          .where('role', '==', role)
          .get();
      } else {
        snapshot = await this._db
          .collection('users')
          .where('verified', '==', false)
          .get();
      }
      if (snapshot.empty) {
        // throw new NotFoundError(`Not found Error : Data not found`);
        return [];
      }

      return snapshot.docs.map(doc => doc.data());
    } catch (error) {
      if (!(error instanceof BaseError)) {
        throw new InternalServerError(`Internal Server Error: ${error}`);
      }
      throw error;
    }
  }
}
