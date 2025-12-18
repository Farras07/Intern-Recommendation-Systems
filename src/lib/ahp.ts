import InvariantError from '@/exceptions/InvariantError';
import { multiply, sum } from 'mathjs';

export default class AHP {
  RI: Record<number, number>;
  priorityIndexRecord: Record<number, number>;
  _parentComparisonMatrix: {
    label: string[];
    matrix: number[][];
  };
  _subcriteriaAchievementComparisonMatrix: {
    label: string[];
    matrix: number[][];
  };
  constructor() {
    this._parentComparisonMatrix = {
      label: ['Interview', 'Experience', 'Portfolio', 'Skill', 'Achievement'],
      matrix: [
        [1, 3, 3, 5, 7],
        [1 / 3, 1, 1, 3, 5],
        [1 / 3, 1, 1, 3, 5],
        [1 / 5, 1 / 3, 1 / 3, 1, 3],
        [1 / 7, 1 / 5, 1 / 5, 1 / 3, 1],
      ],
    };
    this._subcriteriaAchievementComparisonMatrix = {
      label: ['Level', 'Rank'],
      matrix: [
        [1, 3],
        [1 / 3, 1],
      ],
    };
    this.RI = { 1: 0, 2: 0, 3: 0.58, 4: 0.9, 5: 1.12, 6: 1.24, 7: 1.32 };
    this.priorityIndexRecord = { 1: 1, 2: 3, 3: 5, 4: 7, 5: 9 };
  }

  async calcAhpCriteriaWeight() {
    try {
      const n = this._parentComparisonMatrix.matrix.length;

      // Normalize columns
      const colSums = Array.from({ length: n }, (_, j) =>
        sum(this._parentComparisonMatrix.matrix.map(row => row[j])),
      );
      const norm = this._parentComparisonMatrix.matrix.map(row =>
        row.map((v, j) => v / colSums[j]),
      );

      // Average rows to get weights
      const parentweights = norm.map(row => sum(row) / n);

      const weightResult = parentweights.reduce(
        (acc, w, i) => {
          acc[this._parentComparisonMatrix.label[i]] = w;
          return acc;
        },
        {} as Record<string, number>,
      );

      const parentWeightIndicator = await this.calcConsistencyRatio(
        this._parentComparisonMatrix.matrix,
        parentweights,
      );

      console.log('CR Parent: ', parentWeightIndicator.CR);
      if (parentWeightIndicator.CR > 0.1)
        throw new InvariantError('AHP Weight is Not Consistent!');
      return { weightResult, resultMatrix: parentweights };
    } catch (error) {
      throw error;
    }
  }

  async calcSubcriteriaAhpWeight(
    criteriaWeight: any,
    criteriaWeightMatrix: any,
    vacPriority: [{ priority: number; skillName: string }],
  ) {
    try {
      const subAchievementWeight = await this.calcSubCriteriaWeight(
        this._subcriteriaAchievementComparisonMatrix.matrix,
      );
      const subAchievementWeightIndicator = await this.calcConsistencyRatio(
        this._subcriteriaAchievementComparisonMatrix.matrix,
        subAchievementWeight,
      );

      if (subAchievementWeightIndicator.CR > 0.1)
        throw new InvariantError('AHP Subcriteria Weight is Not Consistent!');

      const subSkillcomparisonMatrix = vacPriority.map(row =>
        vacPriority.map(
          col =>
            this.priorityIndexRecord[col.priority] /
            this.priorityIndexRecord[row.priority],
        ),
      );

      const subSkillComparisonLabel = vacPriority.map(data => data.skillName);

      const subSkillsWeight = await this.calcSubCriteriaWeight(
        subSkillcomparisonMatrix,
      );
      const subSkillsWeightIndicator = await this.calcConsistencyRatio(
        subSkillcomparisonMatrix,
        subSkillsWeight,
      );

      console.log('Weight subcriteria Skills: ', subSkillsWeight);
      console.log('CR subcriteria Skills: ', subSkillsWeightIndicator.CR);

      if (subSkillsWeightIndicator.CR > 0.1)
        throw new InvariantError('AHP Subcriteria Weight is Not Consistent!');

      const globalAchievementWeight = subAchievementWeight.map(
        weight => weight * criteriaWeight['Achievement'],
      );
      const globalSkillWeight = subSkillsWeight.map(
        weight => weight * criteriaWeight['Skill'],
      );

      const parentLabel = this._parentComparisonMatrix.label.filter(
        label => label !== 'Skill' && label !== 'Achievement',
      );

      const parentWeightRecord: Record<string, number> = {};
      parentLabel.forEach((label, i) => {
        parentWeightRecord[label] = criteriaWeightMatrix[i];
      });

      const skillWeightRecord: Record<string, number> = {};
      subSkillComparisonLabel.forEach((label, i) => {
        skillWeightRecord[label] = globalSkillWeight[i];
      });

      const achievementWeightRecord: Record<string, number> = {};
      this._subcriteriaAchievementComparisonMatrix.label.forEach((label, i) => {
        achievementWeightRecord[label] = globalAchievementWeight[i];
      });

      const globalWeightRecord: Record<string, number> = {
        ...parentWeightRecord,
        ...skillWeightRecord,
        ...achievementWeightRecord,
      };

      return globalWeightRecord;
    } catch (error) {
      throw error;
    }
  }

  async calcAhpWeight(vacPriority: [{ priority: number; skillName: string }]) {
    try {
      const n = this._parentComparisonMatrix.matrix.length;

      // Normalize columns
      const colSums = Array.from({ length: n }, (_, j) =>
        sum(this._parentComparisonMatrix.matrix.map(row => row[j])),
      );
      const norm = this._parentComparisonMatrix.matrix.map(row =>
        row.map((v, j) => v / colSums[j]),
      );

      // Average rows to get weights
      const parentweights = norm.map(row => sum(row) / n);

      const weightResult = parentweights.reduce(
        (acc, w, i) => {
          acc[this._parentComparisonMatrix.label[i]] = w;
          return acc;
        },
        {} as Record<string, number>,
      );

      const parentWeightIndicator = await this.calcConsistencyRatio(
        this._parentComparisonMatrix.matrix,
        parentweights,
      );
      if (parentWeightIndicator.CR > 0.1)
        throw new InvariantError('AHP Weight is Not Consistent!');
    } catch (error) {
      throw error;
    }
  }

  async calcConsistencyRatio(matrix: number[][], weights: any) {
    const n = matrix.length;
    const Aw = multiply(matrix, weights).valueOf() as number[];
    const lambdaMax = sum(Aw.map((v, i) => v / weights[i])) / n;
    // console.log('lambda: ', lambdaCoba)
    // console.log('n: ', n)
    const CI = (lambdaMax - n) / (n - 1);
    // console.log('RI: ',this.RI[n])
    const CR = CI / this.RI[n];
    return { lambdaMax, CI, CR };
  }

  async calcSubCriteriaWeight(matrix: number[][]) {
    const n = matrix.length;

    // Normalize columns
    const colSums = Array.from({ length: n }, (_, j) =>
      sum(matrix.map(row => row[j])),
    );
    const norm = matrix.map(row => row.map((v, j) => v / colSums[j]));

    // Average rows to get weights
    const subcriteriaweights = norm.map(row => sum(row) / n);

    return subcriteriaweights;
  }
}
