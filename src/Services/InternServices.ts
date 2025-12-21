import { getAdminDb } from '@/lib/firebase-admin';

import InternalServerError from '@/exceptions/InternalServerError';
import NotFoundError from '@/exceptions/NotFoundError';
import BaseError from '@/exceptions/BaseError';
import InvariantError from '@/exceptions/InvariantError';

import { nanoid } from 'nanoid';

import { jobRoleType } from '@/types/JobTypes';
import {
  BatchPayloadAddType,
  BatchPayloadUpdateType,
  BatchResponseType,
} from '@/types/BatchTypes';
import { VacancyRegisType } from '@/types/registDataTypes';
import {
  RankRecommendationType,
  RecommendationType,
} from '@/types/RecommendationTypes';

import EmailServices from './EmailServices';
import { generateAcceptedCandidatesPDF } from '@/lib/pdfGenerator';
import { Encrypt, Decrypt } from '@/lib/privacy';

type EmailServicesType = InstanceType<typeof EmailServices>;
const db = getAdminDb();

export default class InternServices {
  private _db: FirebaseFirestore.Firestore;
  private _emailServices: EmailServicesType;

  constructor(database = db) {
    this._db = database;
    this._emailServices = new EmailServices();
  }

  /* ===================== ROLE ===================== */

  async createRole(payload: jobRoleType) {
    try {
      const exists = await this.getSpecificRoleByTitle(payload.title);
      if (exists) throw new InvariantError('Role already exists');

      const id = `role-${nanoid(5)}`;

      await this._db
        .collection('role')
        .doc(id)
        .set({
          ...payload,
          id,
        });
    } catch (error) {
      this._handleError(error);
    }
  }

  async getAllRole() {
    try {
      const snap = await this._db.collection('role').get();
      if (snap.empty) throw new NotFoundError('Intern Roles Not Found');
      return snap.docs.map(d => d.data());
    } catch (error) {
      this._handleError(error);
    }
  }

  async getSpecificRoleByTitle(title: string): Promise<boolean> {
    try {
      const snap = await this._db
        .collection('role')
        .where('title', '==', title)
        .limit(1)
        .get();

      return !snap.empty;
    } catch (error) {
      this._handleError(error);
    }
  }

  async getSpecificRoleById(id: string) {
    try {
      const doc = await this._db.collection('role').doc(id).get();
      if (!doc.exists) throw new NotFoundError("Role doesn't exist");
      return doc.data();
    } catch (error) {
      this._handleError(error);
    }
  }

  async deleteRole(roleId: string) {
    try {
      await this._db.collection('role').doc(roleId).delete();
    } catch (error) {
      this._handleError(error);
    }
  }

  async updateRole(payload: jobRoleType) {
    try {
      const { id, title, description } = payload;
      await this._db.collection('role').doc(id).update({ title, description });
    } catch (error) {
      this._handleError(error);
    }
  }

  /* ===================== BATCH ===================== */

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
      const snap = await this._db.collection('batch').get();
      if (snap.empty) throw new NotFoundError('Batch Not Found');
      return snap.docs.map(d => d.data());
    } catch (error) {
      this._handleError(error);
    }
  }

  async getSpecificBatch(batchId: string) {
    try {
      const doc = await this._db.collection('batch').doc(batchId).get();
      if (!doc.exists) throw new NotFoundError('Batch Not Found');
      return doc.data();
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
      await this._db.collection('batch').doc(payload.batchId).update({
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

  /* ===================== VACANCY ===================== */

  async createVacancy(payload: any) {
    try {
      const id = `vacancy-${nanoid(5)}`;
      await this._db
        .collection('vacancy')
        .doc(id)
        .set({ id, ...payload });
    } catch (error) {
      this._handleError(error);
    }
  }

  async getAllVacancy() {
    try {
      const snap = await this._db.collection('vacancy').get();
      if (snap.empty) throw new NotFoundError('Vacancies Not Found');
      return snap.docs.map(d => d.data());
    } catch (error) {
      this._handleError(error);
    }
  }

  async deleteVacancy(vacancyId: string) {
    try {
      await this._db.collection('vacancy').doc(vacancyId).delete();
    } catch (error) {
      this._handleError(error);
    }
  }

  async updateVacancy(payload: { id: string; skills: string[] }) {
    try {
      await this._db.collection('vacancy').doc(payload.id).update({
        skills: payload.skills,
      });
    } catch (error) {
      this._handleError(error);
    }
  }

  /* ===================== REGISTRATION ===================== */

  async registerVacancy(data: any) {
    try {
      const id = `apply-${nanoid(5)}`;

      const encryptedVacancy = data.vacancy.map((v: VacancyRegisType) => ({
        ...v,
        achievement: {
          ...v.achievement,
          cert: Encrypt(v.achievement.cert),
        },
        portfolio: {
          ...v.portfolio,
          link: Encrypt(v.portfolio.link),
        },
      }));

      await this._db
        .collection('register')
        .doc(id)
        .set({
          ...data,
          id,
          cv: Encrypt(data.cv),
          phone: Encrypt(data.phone),
          vacancy: encryptedVacancy,
        });
    } catch (error) {
      this._handleError(error);
    }
  }

  /* ===================== ACCEPTANCE ===================== */

  async handleAcceptanceCandidate(payload: any) {
    try {
      const { candidates, values } = payload;
      const excludedCandidates: any[] = [];

      const data = candidates.recommendation.map(
        (recom: RecommendationType) => {
          const limit =
            values.shortlist.find((s: any) => s.role === recom.role)
              ?.candidateAmount ?? recom.rank.length;

          const sorted = [...recom.rank].sort((a, b) => a.rank - b.rank);

          const accepted = sorted.slice(0, limit);
          const rejected = sorted.slice(limit);

          rejected.forEach(r =>
            excludedCandidates.push({ ...r, role: recom.role }),
          );

          return { ...recom, rank: accepted };
        },
      );

      const pdfBuffer = await generateAcceptedCandidatesPDF(
        data,
        candidates.batch,
      );

      for (const recom of data) {
        for (const r of recom.rank) {
          await this._emailServices.sendAcceptanceEmail(
            r.candidateName,
            r.candidateEmail,
            candidates.batch,
            recom.role,
            pdfBuffer,
          );
        }
      }

      return { pdfBuffer, rejectedCandidates: excludedCandidates };
    } catch (error) {
      this._handleError(error);
    }
  }

  /* ===================== HELPER ===================== */

  private _handleError(error: unknown): never {
    if (error instanceof BaseError) throw error;
    throw new InternalServerError(`Internal Server Error: ${error}`);
  }
}
