import { adminDb as db } from '@/lib/firebase-admin';
import InternalServerError from '@/exceptions/InternalServerError';
import BaseError from '@/exceptions/BaseError';
import AHP from '@/lib/ahp';
import TOPSIS from '@/lib/topsis';

export default class InternServices {
  _db: typeof db;
  _ahpContext: AHP;
  _topsisContext: TOPSIS;
  constructor(database: any) {
    this._db = database;
    this._ahpContext = new AHP();
    this._topsisContext = new TOPSIS();
  }

  async ahpCriteriasWeight() {
    try {
      const criteriasWeight = this._ahpContext.calcAhpCriteriaWeight();
      return criteriasWeight;
    } catch (error) {
      if (!(error instanceof BaseError)) {
        throw new InternalServerError(`Internal Server Error: ${error}`);
      }
      throw error;
    }
  }

  async ahpSubcriteriaWeight(
    criteriaWeight: any,
    criteriaWeightMatrix: any,
    vacancySkills: any,
  ) {
    try {
      const weightSubCriteriaWeight = this._ahpContext.calcSubcriteriaAhpWeight(
        criteriaWeight,
        criteriaWeightMatrix,
        vacancySkills,
      );
      return weightSubCriteriaWeight;
    } catch (error) {
      if (!(error instanceof BaseError)) {
        throw new InternalServerError(`Internal Server Error: ${error}`);
      }
      throw error;
    }
  }

  async ahpWeight(payload: any) {
    try {
      const ahpWeight = await this._ahpContext.calcAhpWeight(payload);
      return ahpWeight;
    } catch (error) {
      if (!(error instanceof BaseError)) {
        throw new InternalServerError(`Internal Server Error: ${error}`);
      }
      throw error;
    }
  }

  async topsisSelection(payload: any, ahpWeight: any, selectionStepNum: 1 | 2) {
    try {
      if (selectionStepNum === 1) {
        const topsisCalc = await this._topsisContext.calcTopsisSelection1(
          payload,
          ahpWeight,
        );
        return topsisCalc;
      } else {
        const topsisCalc = await this._topsisContext.calcTopsisSelection2(
          payload,
          ahpWeight,
        );
        return topsisCalc;
      }
    } catch (error) {
      if (!(error instanceof BaseError)) {
        throw new InternalServerError(`Internal Server Error: ${error}`);
      }
      throw error;
    }
  }
}
