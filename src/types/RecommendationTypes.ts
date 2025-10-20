export type SkillsPriorityType = {
  priority: number;
  skillName: string;
};

export type RecommendationType = {
  id: string;
  role: string;
  interviewDate: string;
  rank: {
    vacancyId: string;
    applyId: string;
    candidateName: string;
    candidateEmail: string;
    matrixLabel: string[];
    matrix: number[];
    topsisScore: number;
    rank?: number;
  };
};

export type ShortlistRecommendationType = {
  candidateAmount: number;
  interviewDate: string;
  interviewStartTime: string;
  durationTime: number;
  interviewer: {
    role: string;
    judgesEmail: string[];
  }[];
};
