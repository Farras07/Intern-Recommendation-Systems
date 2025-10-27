export type SkillsPriorityType = {
  priority: number;
  skillName: string;
};

export type RankRecommendationType = {
  vacancyId: string;
  applyId: string;
  candidateName: string;
  candidateEmail: string;
  matrixLabel: string[];
  matrix: number[];
  topsisScore: number;
  link?: string;
  interviewTime?: string;
  rank: number;
};

export type RecommendationType = {
  id: string;
  role: string;
  interviewDate?: string;
  rank: RankRecommendationType[];
};

export type ShortlistRecommendationType = {
  candidateAmount: number;
  interviewDate: string;
  interviewStartTime: string;
  durationTime: number;
  interviewer: InterviewerType[];
};

export type InterviewerType = {
  role: string;
  judgesEmail: string[];
};
