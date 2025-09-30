export type RegistDataTypes = VacancyRegisType & {
  batch: string;
  cv: string;
  educationInstitution: string;
  email: string;
  id: string;
  name: string;
  phone: string;
  interviewRate?: string;
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
  portofolioLink: string;
  role?: {
    id: string;
    title: string;
  };
  skills: {
    priority: number;
    rate: string;
    skillName: string;
  }[];
};
