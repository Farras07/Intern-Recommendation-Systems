export type VacancyTypes = {
  id: string;
  batchId: string;
  role: string;
  startDate: string;
  endDate: string;
  status: 'Pending' | 'Hiring' | 'Done' | 'Failed';
};
export type VacancyResponseTypes = {
  id: string;
  batchId: string;
  role: string;
  startDate: string;
  endDate: string;
  status: 'Pending' | 'Hiring' | 'Done' | 'Failed';
  createdAt: string;
};

export type jobRoleType = {
  id: string;
  title: string;
  description: string;
};

export type VacancyLandingType = {
  role: jobRoleType;
  batch: {
    id: string;
    name: string;
    stage: string;
    startDate: number;
    endDate: number;
  };
  status: 'Pending' | 'Hiring' | 'Done' | 'Failed';
  deadline?: string;
};
