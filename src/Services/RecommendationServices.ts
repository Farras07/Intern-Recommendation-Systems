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

  async topsisSelection(payload: any, ahpWeight: any) {
    try {
      const topsisCalc = await this._topsisContext.calcTopsisSelection2(
        payload,
        ahpWeight,
      );
      return topsisCalc;
    } catch (error) {
      if (!(error instanceof BaseError)) {
        throw new InternalServerError(`Internal Server Error: ${error}`);
      }
      throw error;
    }
  }

  async handleSameTopsisRank(candidate: any) {
    try {
      const sortedCandidate = candidate
        .sort((a: any, b: any) => {
          // sort by rank
          if (a.rank !== b.rank) return a.rank - b.rank;

          // sort by choice
          if (a.rolePriority !== b.rolePriority)
            return a.rolePriority - b.rolePriority;

          //sort by Interview Value
          const intvIdxA = a.matrixLabel.indexOf('Interview');
          const intvIdxB = b.matrixLabel.indexOf('Interview');
          const diffIntv =
            intvIdxA !== -1 && intvIdxB !== -1
              ? b.matrix[intvIdxB] - a.matrix[intvIdxA]
              : 0;
          if (diffIntv !== 0) return diffIntv;

          //sort by Experience Value
          const expIdxA = a.matrixLabel.indexOf('Experience');
          const expIdxB = b.matrixLabel.indexOf('Experience');
          const diffExp =
            expIdxA !== -1 && expIdxB !== -1
              ? b.matrix[expIdxB] - a.matrix[expIdxA]
              : 0;
          if (diffExp !== 0) return diffExp;

          //sort by Portfolio Value
          const portIdxA = a.matrixLabel.indexOf('Portfolio');
          const portIdxB = b.matrixLabel.indexOf('Portfolio');
          const diffPort =
            portIdxA !== -1 && portIdxB !== -1
              ? b.matrix[portIdxB] - a.matrix[portIdxA]
              : 0;
          if (diffPort !== 0) return diffPort;

          //sort by applyTime
          return (
            new Date(a.applyTime).getTime() - new Date(b.applyTime).getTime()
          );
        })
        .map((item: any, index: number) => ({
          ...item,
          rank: index + 1,
        }));

      return sortedCandidate;
    } catch (error) {
      throw error;
    }
  }
}
