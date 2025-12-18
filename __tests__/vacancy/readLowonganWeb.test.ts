import { POST, GET, DELETE, PUT } from '@/app/api/intern/vacancy/route';
import VacancyServices from '@/Services/VacancyServices';
import { adminDb } from '../../__mocks__/@/lib/firebase-admin';
import { jobRoleType } from '@/types/JobTypes';

jest.mock('@/lib/firebase-admin');
jest.mock('@/app/api/middleware/auth.middleware');

function checkProperties(data: any) {
  expect(data).toHaveProperty('id');

  expect(data).toHaveProperty('batch');
  expect(data.batch).toHaveProperty('id');
  expect(data.batch).toHaveProperty('name');
  expect(data.batch).toHaveProperty('startDate');
  expect(data.batch).toHaveProperty('endDate');
  expect(data.batch).toHaveProperty('stage');

  expect(data).toHaveProperty('role');
  expect(data.role).toHaveProperty('id');
  expect(data.role).toHaveProperty('title');

  expect(data).toHaveProperty('skills');
  expect(data.skills.length).toBeGreaterThan(0);
  data.skills.forEach((item: { priority: number; skillName: string }) => {
    expect(item).toHaveProperty('priority');
    expect(item).toHaveProperty('skillName');
  });
}

describe('Read Lowongan Test', () => {
  const vacancyServices = new VacancyServices(adminDb);

  it('Should have getOpenVacancy method', async () => {
    expect(typeof vacancyServices.getOpenVacancy).toBe('function');
  });

  it('GET Open Vacancy API Handler Test', async () => {
    const req = new Request('http://localhost/api/intern/vacancy?filter=open', {
      method: 'GET',
    });

    const res = await GET(req);
    const json = await res.json();

    expect(json).toHaveProperty('status');
    console.log(json);
    expect(json.status).toBe('Success');
    expect(json).toHaveProperty('data');

    expect(json.data).toHaveProperty('vacancy');
    expect(Array.isArray(json.data.vacancy)).toBe(true);
    expect(json.data.vacancy.length).toBeGreaterThan(0);

    json.data.vacancy.forEach((item: jobRoleType) => {
      checkProperties(item);
    });
  });
});
