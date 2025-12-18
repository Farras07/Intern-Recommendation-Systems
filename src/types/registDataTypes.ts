export type RegistDataTypes = {
  batch: string;
  cv: string;
  educationInstitution: string;
  email: string;
  id: string;
  name: string;
  phone: string;
  applyTime: string;
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
  rolePriority: number;
  role?: {
    id: string;
    title: string;
  };
  portfolio: {
    link: string;
    rate: number;
  };
  interviewRate: string;
  skills: {
    rate: string;
    skillName: string;
  }[];
};
