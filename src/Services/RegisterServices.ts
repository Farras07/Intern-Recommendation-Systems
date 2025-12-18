import { adminDb as db } from '@/lib/firebase-admin';
import InternalServerError from '@/exceptions/InternalServerError';
import NotFoundError from '@/exceptions/NotFoundError';
import BaseError from '@/exceptions/BaseError';
import { nanoid } from 'nanoid';
import { BatchResponseType } from '@/types/BatchTypes';
import { VacancyRegisType } from '@/types/registDataTypes';
import { Encrypt, Decrypt } from '@/lib/privacy';
import RoleServices from './RoleServices';
import VacancyServices from './VacancyServices';

type RoleServicesType = InstanceType<typeof RoleServices>;
type VacancyServicesType = InstanceType<typeof VacancyServices>;

export default class RegisterServices {
  _db: typeof db;
  private _roleServices: RoleServicesType;
  private _vacancyServices: VacancyServicesType;

  constructor(database: any) {
    this._db = database;
    this._roleServices = new RoleServices(this._db);
    this._vacancyServices = new VacancyServices(this._db);
  }

  async registerVacancy(data: any) {
    try {
      const id = `apply-${nanoid(5)}`;
      const { cv, phone, vacancy, ...rest } = data;
      const encryptedCV = Encrypt(cv);
      const encryptedPhone = Encrypt(phone);

      const fixVacancy = vacancy.map((vac: VacancyRegisType) => {
        vac.achievement.cert = Encrypt(vac.achievement.cert);
        vac.portfolio.link = Encrypt(vac.portfolio.link);
        return vac;
      });
      await this._db
        .collection('register')
        .doc(id)
        .set({
          id,
          cv: encryptedCV,
          phone: encryptedPhone,
          vacancy: fixVacancy,
          ...rest,
        });
    } catch (error) {
      if (!(error instanceof BaseError)) {
        throw new InternalServerError(`Internal Server Error: ${error}`);
      }
      throw error;
    }
  }
  async testRegisterVacancy(data: any) {
    try {
      const id = `apply-${nanoid(5)}`;
      const { cv, phone, vacancy, ...rest } = data;
      const encryptedCV = Encrypt(cv);
      const encryptedPhone = Encrypt(phone);

      const fixVacancy = vacancy.map((vac: VacancyRegisType) => {
        vac.achievement.cert = Encrypt(vac.achievement.cert);
        vac.portfolio.link = Encrypt(vac.portfolio.link);
        return vac;
      });
      await this._db
        .collection('register')
        .doc(id)
        .set({
          id,
          cv: encryptedCV,
          phone: encryptedPhone,
          vacancy: fixVacancy,
          ...rest,
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
                  const roleVac =
                    await this._vacancyServices.getSpecificVacancy(vacancy.id);
                  const roleData = await this._roleServices.getSpecificRoleById(
                    roleVac[0].role,
                  );

                  const decryptedCert = Decrypt(vacancy.achievement.cert);
                  const decryptedLink = Decrypt(vacancy.portfolio.link);

                  return {
                    ...vacancy,
                    achievement: {
                      ...vacancy.achievement,
                      cert: decryptedCert,
                    },
                    portfolio: {
                      ...vacancy.portfolio,
                      link: decryptedLink,
                    },
                    role: {
                      id: roleData.id,
                      title: roleData.title,
                    },
                  };
                }),
              );

              if (role) {
                const hasRole = enrichedVacancies.some(v => v.role.id === role);
                if (!hasRole) return null;
              }
              regis.cv = Decrypt(regis.cv);
              regis.phone = Decrypt(regis.phone);
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
      console.log(error);
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
      const fixData = regisData.map((data: any) => {
        return {
          ...data,
          cv: Decrypt(data.cv),
          phone: Decrypt(data.phone),
        };
      });
      return fixData;
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
          const roleVac = await this._vacancyServices.getSpecificVacancy(
            data.id,
          );
          const roleData = await this._roleServices.getSpecificRoleById(
            roleVac[0].role,
          );
          data.portfolio.link = Decrypt(data.portfolio.link);
          data.achievement.cert = Decrypt(data.achievement.cert);
          return {
            ...data,
            role: {
              id: roleData.id,
              title: roleData.title,
            },
          };
        }),
      );
      regisData.cv = Decrypt(regisData.cv);
      regisData.phone = Decrypt(regisData.phone);
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
      if (data.phone) {
        data.phone = Encrypt(data.phone);
      }
      if (data.vacancy) {
        data.vacancy = data.vacancy.map((vac: VacancyRegisType) => {
          const { ...restData } = vac;
          restData.achievement.cert = Encrypt(restData.achievement.cert);
          restData.portfolio.link = Encrypt(restData.portfolio.link);
          return restData;
        });
      }

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
}
