import { CriteriaOptionsType } from '@/types/CriteriaTypes';

export const experienceOptions: CriteriaOptionsType[] = [
  { label: 'No Experience', value: 1 },
  { label: '<1 Year(s) ', value: 2 },
  { label: '>2 Year(s)', value: 3 },
];

export const likertScale: CriteriaOptionsType[] = [
  { label: 'Sangat Buruk/ Tidak Ada', value: 1 },
  { label: 'Buruk', value: 2 },
  { label: 'Sedang', value: 3 },
  { label: 'Baik', value: 4 },
  { label: 'Sangat Baik', value: 5 },
];
export const championshipLevel: CriteriaOptionsType[] = [
  { label: 'Tidak Ada', value: 1 },
  { label: 'Regional', value: 2 },
  { label: 'Nasional', value: 3 },
  { label: 'Internasional', value: 4 },
];
export const champion: CriteriaOptionsType[] = [
  { label: 'Tidak Ada', value: 1 },
  { label: 'Juara 3', value: 2 },
  { label: 'Juara 2', value: 3 },
  { label: 'Juara 1', value: 4 },
];
export const skillProficiency: CriteriaOptionsType[] = [
  { label: 'Inexpert', value: 1 },
  { label: 'expert', value: 2 },
];
