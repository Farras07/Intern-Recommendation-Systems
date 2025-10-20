import { RegistDataTypes } from '@/types/registDataTypes';
import { sum, sqrt } from 'mathjs';

type candidateDataProps = RegistDataTypes & {
  applyId: string;
  candidateName: string;
  candidateEmail: string;
};

export default class TOPSIS {
  async calcTopsisSelection1(
    candidatesData: candidateDataProps[],
    ahpWeight: Record<string, number>,
  ) {
    try {
      // 1️⃣ Flatten all vacancies into one array
      const criteriaMatrix = candidatesData.map(candidate => {
        const exp = Number(candidate.exp);
        const portfolioValue = candidate.portfolioRate
          ? Number(candidate.portfolioRate)
          : 1;
        const skillRate = candidate.skills.map(skill => Number(skill.rate));
        const achievementValues = [
          Number(candidate.achievement.lvlRate),
          Number(candidate.achievement.champRate),
        ];
        const matrixLabel = Object.keys(ahpWeight).filter(
          label => label !== 'Interview',
        );

        return {
          vacancyId: candidate.id,
          applyId: candidate.applyId,
          candidateName: candidate.candidateName,
          candidateEmail: candidate.candidateEmail,
          matrixLabel: matrixLabel,
          matrix: [exp, portfolioValue, ...skillRate, ...achievementValues],
        };
      });

      // 2️⃣ Build numeric matrix
      const numericMatrix = criteriaMatrix.map(v => v.matrix);
      const nCriteria = numericMatrix[0].length;
      const nRows = numericMatrix.length;

      // 3️⃣ Normalize matrix
      const normalizedMatrix = numericMatrix.map(row =>
        row.map((value, j) => {
          const colValues = numericMatrix.map(r => r[j]);
          const denom = sqrt(sum(colValues.map(v => v * v)));
          return denom === 0 ? 0 : value / denom;
        }),
      );

      // 4️⃣ Multiply by weights
      const weightArray = Object.entries(ahpWeight)
        .filter(([key]) => key !== 'Interview') // skip Interview
        .map(([_, value]) => value);
      const weightedMatrix = normalizedMatrix.map(row =>
        row.map((v, j) => v * weightArray[j]),
      );

      // 5️⃣ Determine ideal and negative-ideal solutions
      const ideal = Array(nCriteria)
        .fill(0)
        .map((_, j) => Math.max(...weightedMatrix.map(r => r[j])));
      const negativeIdeal = Array(nCriteria)
        .fill(0)
        .map((_, j) => Math.min(...weightedMatrix.map(r => r[j])));

      // 6️⃣ Calculate distances and TOPSIS scores
      const distances = weightedMatrix.map(row => {
        const sp = sqrt(sum(row.map((v, j) => (v - ideal[j]) ** 2)));
        const sn = sqrt(sum(row.map((v, j) => (v - negativeIdeal[j]) ** 2)));
        return { sp, sn, score: sn / (sp + sn) };
      });

      // 7️⃣ Map scores back to vacancies
      const result = criteriaMatrix.map((v, i) => ({
        ...v,
        topsisScore: distances[i].score,
      }));

      // 8️⃣ Sort by TOPSIS score descending
      result.sort((a, b) => b.topsisScore - a.topsisScore);

      let currentRank = 0;
      let prevScore: number | null = null;
      const sameScoreCount = 0;

      const rankedResult = result.map(item => {
        if (item.topsisScore !== prevScore) currentRank = currentRank + 1;
        prevScore = item.topsisScore;
        return { ...item, rank: currentRank };
      });

      return rankedResult;
    } catch (error) {
      throw error;
    }
  }
}
