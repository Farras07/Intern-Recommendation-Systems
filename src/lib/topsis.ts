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
      const criteriaMatrix = candidatesData.map((candidate: any) => {
        const exp = Number(candidate.exp);
        const portfolioValue = candidate.portfolio.rate
          ? Number(candidate.portfolio.rate)
          : 1;
        const skillRate = candidate.skills.map((skill: any) =>
          Number(skill.rate),
        );
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
      // const nRows = numericMatrix.length;

      // 3️⃣ Normalize matrix
      const normalizedMatrix = numericMatrix.map(row =>
        row.map((value, j) => {
          const numValue = Number(value);
          const colValues = numericMatrix.map(r => Number(r[j]));
          const denom = Math.sqrt(colValues.reduce((sum, v) => sum + v * v, 0));
          return denom === 0 ? 0 : numValue / denom;
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
        const sp = Math.sqrt(
          row.reduce((sum, v, j) => {
            const diff = Number(v) - Number(ideal[j]);
            return sum + diff * diff;
          }, 0),
        );

        const sn = Math.sqrt(
          row.reduce((sum, v, j) => {
            const diff = Number(v) - Number(negativeIdeal[j]);
            return sum + diff * diff;
          }, 0),
        );

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
      // const sameScoreCount = 0;

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
  async calcTopsisSelection2(
    candidatesData: candidateDataProps[],
    ahpWeight: Record<string, number>,
  ) {
    try {
      // 1️⃣ Flatten all vacancies into one array
      const criteriaMatrix = candidatesData.map((candidate: any) => {
        const exp = Number(candidate.exp);
        const interviewValue = candidate.interviewRate;
        const portfolioValue = candidate.portfolio.rate
          ? Number(candidate.portfolio.rate)
          : 1;
        const skillRate = candidate.skills.map((skill: any) =>
          Number(skill.rate),
        );
        const achievementValues = [
          Number(candidate.achievement.lvlRate),
          Number(candidate.achievement.champRate),
        ];
        const matrixLabel = Object.keys(ahpWeight);
        return {
          vacancyId: candidate.id,
          applyId: candidate.applyId,
          candidateName: candidate.candidateName,
          candidateEmail: candidate.candidateEmail,
          matrixLabel: matrixLabel,
          matrix: [
            interviewValue,
            exp,
            portfolioValue,
            ...skillRate,
            ...achievementValues,
          ],
        };
      });

      // 2️⃣ Build numeric matrix
      const numericMatrix = criteriaMatrix.map(v => v.matrix);
      const nCriteria = numericMatrix[0].length;
      // const nRows = numericMatrix.length;

      // 3️⃣ Normalize matrix
      const normalizedMatrix = numericMatrix.map(row =>
        row.map((value, j) => {
          const numValue = Number(value);
          const colValues = numericMatrix.map(r => Number(r[j]));
          const denom = Math.sqrt(colValues.reduce((sum, v) => sum + v * v, 0));
          return denom === 0 ? 0 : numValue / denom;
        }),
      );

      // 4️⃣ Multiply by weights
      const weightArray = Object.entries(ahpWeight).map(([_, value]) => value);
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
        const sp = Math.sqrt(
          row.reduce((sum, v, j) => {
            const diff = Number(v) - Number(ideal[j]);
            return sum + diff * diff;
          }, 0),
        );

        const sn = Math.sqrt(
          row.reduce((sum, v, j) => {
            const diff = Number(v) - Number(negativeIdeal[j]);
            return sum + diff * diff;
          }, 0),
        );

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
      // const sameScoreCount = 0;

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
