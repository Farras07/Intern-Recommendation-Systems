import { getAdminDb } from '@/lib/firebase-admin';
import InternalServerError from '@/exceptions/InternalServerError';
import NotFoundError from '@/exceptions/NotFoundError';
import BaseError from '@/exceptions/BaseError';
import { nanoid } from 'nanoid';
import { BatchResponseType } from '@/types/BatchTypes';
import { VacancyRegisType } from '@/types/registDataTypes';
import { Encrypt, Decrypt } from '@/lib/privacy';
import RoleServices from './RoleServices';
import VacancyServices from './VacancyServices';

const db = getAdminDb();

export default class RegisterServices {
  private _db: typeof db;
  private _roleServices: RoleServices;
  private _vacancyServices: VacancyServices;

  constructor(database: typeof db) {
    this._db = database;
    this._roleServices = new RoleServices(this._db);
    this._vacancyServices = new VacancyServices(this._db);
  }

  /* ================================
   * CREATE REGISTRATION
   * ================================ */
  async registerVacancy(data: any) {
    try {
      const id = `apply-${nanoid(5)}`;
      const { cv, phone, vacancy = [], ...rest } = data;

      const encryptedVacancy = vacancy.map((vac: VacancyRegisType) => ({
        ...vac,
        achievement: {
          ...vac.achievement,
          cert: Encrypt(vac.achievement.cert),
        },
        portfolio: {
          ...vac.portfolio,
          link: Encrypt(vac.portfolio.link),
        },
      }));

      await this._db
        .collection('register')
        .doc(id)
        .set({
          id,
          cv: Encrypt(cv),
          phone: Encrypt(phone),
          vacancy: encryptedVacancy,
          ...rest,
        });
    } catch (error) {
      this._throwError(error);
    }
  }

  /* ================================
   * GET REGISTRATION BY BATCH
   * ================================ */
  async getRegistration(batchData: BatchResponseType[], role?: string) {
    try {
      const results = await Promise.all(
        batchData.map(async batch => {
          const snap = await this._db
            .collection('register')
            .where('batch', '==', batch.batchId)
            .get();

          if (snap.empty) return [];

          return Promise.all(
            snap.docs.map(async (doc: any) => {
              const regis = doc.data();

              const enrichedVacancy = await Promise.all(
                (regis.vacancy ?? []).map(async (vac: VacancyRegisType) => {
                  const vacancyData =
                    await this._vacancyServices.getSpecificVacancy(vac.id);
                  const roleData = await this._roleServices.getSpecificRoleById(
                    vacancyData[0].role,
                  );

                  return {
                    ...vac,
                    achievement: {
                      ...vac.achievement,
                      cert: Decrypt(vac.achievement.cert),
                    },
                    portfolio: {
                      ...vac.portfolio,
                      link: Decrypt(vac.portfolio.link),
                    },
                    role: {
                      id: roleData.id,
                      title: roleData.title,
                    },
                  };
                }),
              );

              if (role && !enrichedVacancy.some(v => v.role.id === role)) {
                return null;
              }

              return {
                ...regis,
                cv: Decrypt(regis.cv),
                phone: Decrypt(regis.phone),
                vacancy: enrichedVacancy,
              };
            }),
          );
        }),
      );

      return results.flat().filter(Boolean);
    } catch (error) {
      this._throwError(error);
    }
  }

  /* ================================
   * GET BY BATCH ID
   * ================================ */
  async getRegistrationByBatchId(batchId: string) {
    try {
      const snap = await this._db
        .collection('register')
        .where('batch', '==', batchId)
        .get();

      if (snap.empty) return [];

      return snap.docs.map((doc: any) => {
        const data = doc.data();
        return {
          ...data,
          cv: Decrypt(data.cv),
          phone: Decrypt(data.phone),
        };
      });
    } catch (error) {
      this._throwError(error);
    }
  }

  /* ================================
   * GET SPECIFIC REGISTRATION
   * ================================ */
  async getSpecificRegistration(id: string) {
    try {
      const snap = await this._db
        .collection('register')
        .where('id', '==', id)
        .get();

      if (snap.empty) throw new NotFoundError('Data Not Found!');

      const regis = snap.docs[0].data();

      const enrichedVacancy = await Promise.all(
        regis.vacancy.map(async (vac: VacancyRegisType) => {
          const vacancyData = await this._vacancyServices.getSpecificVacancy(
            vac.id,
          );
          const roleData = await this._roleServices.getSpecificRoleById(
            vacancyData[0].role,
          );

          return {
            ...vac,
            achievement: {
              ...vac.achievement,
              cert: Decrypt(vac.achievement.cert),
            },
            portfolio: {
              ...vac.portfolio,
              link: Decrypt(vac.portfolio.link),
            },
            role: {
              id: roleData.id,
              title: roleData.title,
            },
          };
        }),
      );

      return {
        ...regis,
        cv: Decrypt(regis.cv),
        phone: Decrypt(regis.phone),
        vacancy: enrichedVacancy,
      };
    } catch (error) {
      this._throwError(error);
    }
  }

  /* ================================
   * UPDATE REGISTRATION
   * ================================ */
  async updateRegistrationData(id: string, data: any) {
    try {
      const payload: any = { ...data };

      if (payload.phone) payload.phone = Encrypt(payload.phone);

      if (payload.vacancy) {
        payload.vacancy = payload.vacancy.map((vac: VacancyRegisType) => ({
          ...vac,
          achievement: {
            ...vac.achievement,
            cert: Encrypt(vac.achievement.cert),
          },
          portfolio: {
            ...vac.portfolio,
            link: Encrypt(vac.portfolio.link),
          },
        }));
      }

      await this._db.collection('register').doc(id).update(payload);
    } catch (error) {
      this._throwError(error);
    }
  }

  /* ================================
   * DELETE REGISTRATION
   * ================================ */
  async deleteRegistrationData(id: string) {
    try {
      await this._db.collection('register').doc(id).delete();
    } catch (error) {
      this._throwError(error);
    }
  }

  /* ================================
   * ERROR HANDLER
   * ================================ */
  private _throwError(error: unknown): never {
    if (error instanceof BaseError) throw error;
    throw new InternalServerError(`Internal Server Error: ${error}`);
  }
}
