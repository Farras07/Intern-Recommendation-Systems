import { Timestamp } from 'next/dist/server/lib/cache-handlers/types';

export interface BatchItemType {
  batch: {
    id: string;
    name: string;
    startDate: Timestamp;
    endDate: Timestamp;
    status: string;
  };
}
export interface RoleItemType {
  role: {
    id: string;
    title: string;
  };
}
export interface SkillsItemType {
  skills: {
    priority: number;
    skillName: string;
  }[];
}

export interface FormVacancyItemType
  extends BatchItemType,
    RoleItemType,
    SkillsItemType {
  id: string;
}
