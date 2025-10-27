export type RegistDataTypes = {
  batch: string;
  cv: string;
  educationInstitution: string;
  email: string;
  id: string;
  name: string;
  phone: string;
  vacancy: VacancyRegisType[];
};

export type VacancyRegisType = {
  achievement: {
    cert: string;
    champRate: string;
    lvlRate: string;
  };
  exp: string;
  id: string;
  lastStage: string;
  portfolio: {
    link: string;
    rate: number;
  };
  interviewRate: string;
  role?: {
    id: string;
    title: string;
  };
  skills: {
    priority?: number;
    rate: string;
    skillName: string;
  }[];
};
