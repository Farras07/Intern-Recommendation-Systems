import { POST, GET, DELETE, PUT } from '@/app/api/intern/vacancy/route';
import VacancyServices from '@/Services/VacancyServices';
import { adminDb } from '../__mocks__/@/lib/firebase-admin';
import { jobRoleType } from '@/types/JobTypes';

jest.mock('@/lib/firebase-admin');
jest.mock('@/app/api/middleware/auth.middleware');

function checkData(data: any) {
  expect(data).toHaveProperty('id');
  expect(data).toHaveProperty('batch');
  // expect(data).toHaveProperty('role');

  expect(data).toHaveProperty('skills');
  expect(data.skills.length).toBeGreaterThan(0);
  data.skills.forEach((item: { priority: number; skillName: string }) => {
    expect(item).toHaveProperty('priority');
    expect(item).toHaveProperty('skillName');
  });
}

describe('Intern Vacancy Services Test', () => {
  const vacancyServices = new VacancyServices(adminDb);

  it('Should have createVacancy method', async () => {
    expect(typeof vacancyServices.createVacancy).toBe('function');
  });

  it('Should have getAllVacancy method', async () => {
    expect(typeof vacancyServices.getAllVacancy).toBe('function');
  });

  // it('Should have getOpenVacancy method', async () => {
  //   expect(typeof vacancyServices.getOpenVacancy).toBe("function");
  // })

  // it('Should have getSpecificVacancy method', async () => {
  //   expect(typeof vacancyServices.getSpecificVacancy).toBe("function");
  // })

  // it('Should have getVacancyIdsByBatchId method', async () => {
  //   expect(typeof vacancyServices.getVacancyIdsByBatchId).toBe("function");
  // })

  it('Should have updateVacancy method', async () => {
    expect(typeof vacancyServices.updateVacancy).toBe('function');
  });

  it('Should have deleteVacancy method', async () => {
    expect(typeof vacancyServices.deleteVacancy).toBe('function');
  });
});

describe('Intern Vacancy API Handler Test', () => {
  it('Get All Intern Vacancy', async () => {
    const req = new Request('http://localhost/api/intern/vacancy?filter=all', {
      method: 'GET',
    });

    const res = await GET(req);
    const json = await res.json();

    expect(json).toHaveProperty('status');
    expect(json.status).toBe('Success');
    expect(json).toHaveProperty('data');

    expect(json.data).toHaveProperty('vacancy');
    expect(Array.isArray(json.data.vacancy)).toBe(true);
    expect(json.data.vacancy.length).toBeGreaterThan(0);

    json.data.vacancy.forEach((item: jobRoleType) => {
      checkData(item);
    });
  });
  it('Add Intern Vacancy', async () => {
    const bodyReq = {
      id: 'vacancy-123456',
      batch: 'batch-124',
      role: 'role-124',
      skills: [
        {
          priority: 1,
          skillName: 'Copywriting',
        },
        {
          priority: 2,
          skillName: 'Content Planning',
        },
        {
          priority: 2,
          skillName: 'Content Creation',
        },
      ],
    };

    const req = new Request('http://localhost/api/intern/vacancy', {
      method: 'POST',
      body: JSON.stringify(bodyReq),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(json).toHaveProperty('status');
    expect(json.status).toBe('Success');
  });

  it('Update Intern Vacancy', async () => {
    const bodyReq = {
      id: 'vacancy-12345',
      skills: [
        {
          priority: 1,
          skillName: 'Copywriting',
        },
        {
          priority: 2,
          skillName: 'Content Planning',
        },
        {
          priority: 3,
          skillName: 'Content Scheduling',
        },
      ],
    };

    const req = new Request('http://localhost/api/intern/vacancy', {
      method: 'PUT',
      body: JSON.stringify(bodyReq),
    });

    const res = await PUT(req);
    const json = await res.json();

    expect(json).toHaveProperty('status');
    expect(json.status).toBe('Success');
  });

  it('Delete Intern Vacancy', async () => {
    const req = new Request(
      'http://localhost/api/intern/vacancy?id=vacancy-1234',
      {
        method: 'DELETE',
      },
    );

    const res = await DELETE(req);
    const json = await res.json();

    expect(json).toHaveProperty('status');
    expect(json.status).toBe('Success');
  });
});
