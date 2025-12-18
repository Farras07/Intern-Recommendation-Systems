import { RegistDataTypes, VacancyRegisType } from '@/types/registDataTypes';
import { POST, GET } from '@/app/api/intern/vacancy/register/route';
import { adminDb } from '../__mocks__/@/lib/firebase-admin';
import RegisterServices from '@/Services/RegisterServices';

jest.mock('@/lib/firebase-admin');
jest.mock('@/app/api/middleware/auth.middleware');
jest.mock('@/lib/privacy', () => ({
  Encrypt: (t: string) => `enc-${t}`,
  Decrypt: (t: string) => t.replace(/^enc-/, ''),
}));

function checkData(data: RegistDataTypes) {
  expect(data).toHaveProperty('id');
  expect(data).toHaveProperty('cv');
  expect(data).toHaveProperty('name');
  expect(data).toHaveProperty('email');
  expect(data).toHaveProperty('educationInstitution');
  expect(data).toHaveProperty('batch');
  expect(data).toHaveProperty('applyTime');
  expect(data).toHaveProperty('phone');
  expect(data).toHaveProperty('vacancy');

  expect(data.vacancy.length).toBeGreaterThan(0);
  data.vacancy.forEach((item: VacancyRegisType) => {
    expect(item).toHaveProperty('interviewRate');
    expect(item).toHaveProperty('id');
    expect(item).toHaveProperty('rolePriority');
    expect(item).toHaveProperty('lastStage');
    expect(item).toHaveProperty('exp');
    expect(item).toHaveProperty('achievement');
    expect(item).toHaveProperty('portfolio');
    expect(item).toHaveProperty('skills');
    expect(item).toHaveProperty('role');

    expect(item.achievement).toHaveProperty('lvlRate');
    expect(item.achievement).toHaveProperty('cert');
    expect(item.achievement).toHaveProperty('champRate');

    expect(item.portfolio).toHaveProperty('rate');
    expect(item.portfolio).toHaveProperty('link');

    item.skills.forEach((skill: { skillName: string; rate: string }) => {
      expect(skill).toHaveProperty('skillName');
      expect(skill).toHaveProperty('rate');
    });
  });
}

describe('Intern Register Services Test', () => {
  const registerServices = new RegisterServices(adminDb);

  it('Should have getRegistration method', async () => {
    expect(typeof registerServices.getRegistration).toBe('function');
  });

  //   it('Should have getRegistrationByBatchId method', async () => {
  //     expect(typeof registerServices.getRegistrationByBatchId).toBe("function");
  //   })

  //   it('Should have getSpecificRegistration method', async () => {
  //     expect(typeof registerServices.getSpecificRegistration).toBe("function");
  //   })

  it('Should have updateRegistrationData method', async () => {
    expect(typeof registerServices.updateRegistrationData).toBe('function');
  });

  it('Should have registerVacancy method', async () => {
    expect(typeof registerServices.registerVacancy).toBe('function');
  });

  it('Should have deleteRegistrationData method', async () => {
    expect(typeof registerServices.deleteRegistrationData).toBe('function');
  });
});

describe('Intern Register API Handler Test', () => {
  it('Get All Register', async () => {
    const req = new Request('http://localhost/api/intern/vacancy/register', {
      method: 'GET',
    });

    const res = await GET(req);
    const json = await res.json();
    console.log(json);

    expect(json).toHaveProperty('status');
    expect(json.status).toBe('Success');
    expect(json).toHaveProperty('data');

    expect(Array.isArray(json.data)).toBe(true);
    expect(json.data.length).toBeGreaterThan(0);
    json.data.forEach((item: RegistDataTypes) => {
      checkData(item);
    });
  });
  // it('Get Register by Role Id', async () => {
  //     const req = new Request('http://localhost/api/intern/vacancy/register?role=role-123', {
  //         method: 'GET',
  //     });

  //     const res = await GET(req);
  //     const json = await res.json();
  //     console.log(json)

  //     expect(json).toHaveProperty('status');
  //     expect(json.status).toBe('Success');
  //     expect(json).toHaveProperty('data')

  //     expect(Array.isArray(json.data)).toBe(true);
  //     expect(json.data.length).toBeGreaterThan(0);
  //     json.data.forEach((item: RegistDataTypes) => {
  //         checkData(item)
  //     });
  // })
  // it('Get Register by Batch Id', async () => {
  //     const req = new Request('http://localhost/api/intern/vacancy/register?batch=batch-123', {
  //         method: 'GET',
  //     });

  //     const res = await GET(req);
  //     const json = await res.json();
  //     console.log(json)

  //     expect(json).toHaveProperty('status');
  //     expect(json.status).toBe('Success');
  //     expect(json).toHaveProperty('data')

  //     expect(Array.isArray(json.data)).toBe(true);
  //     expect(json.data.length).toBeGreaterThan(0);
  //     json.data.forEach((item: RegistDataTypes) => {
  //         checkData(item)
  //     });
  // })
  // it('Get Register by Batch Id and Role Id', async () => {
  //     const req = new Request('http://localhost/api/intern/vacancy/register?batch=batch-123&role=role-123', {
  //         method: 'GET',
  //     });

  //     const res = await GET(req);
  //     const json = await res.json();
  //     console.log(json)

  //     expect(json).toHaveProperty('status');
  //     expect(json.status).toBe('Success');
  //     expect(json).toHaveProperty('data')

  //     expect(Array.isArray(json.data)).toBe(true);
  //     expect(json.data.length).toBeGreaterThan(0);
  //     json.data.forEach((item: RegistDataTypes) => {
  //         checkData(item)
  //     });
  // })

  it('Add Register', async () => {
    const bodyReq = {
      cv: 'https://google.com',
      name: 'Example1',
      email: 'rfrvnevrf3r@gmail.com',
      educationInstitution: 'UPN Veteran Jawa Timur',
      batch: 'batch-123',
      applyTime: '2025-11-09T22:46:09.508Z',
      phone: '081240232324',
      vacancy: [
        {
          interviewRate: 1,
          id: 'vacancy-1234',
          achievement: {
            lvlRate: '1',
            cert: 'https://google.com',
            champRate: '1',
          },
          rolePriority: 1,
          portfolio: {
            rate: 1,
            link: 'https://google.com',
          },
          lastStage: 'Interview',
          exp: '2',
          skills: [
            {
              skillName: 'Word',
              rate: '2',
            },
            {
              skillName: 'Excel',
              rate: '2',
            },
          ],
          role: {
            id: 'role-123',
            title: 'Operational',
          },
        },
        {
          portfolio: {
            link: 'https://google.com',
            rate: 1,
          },
          exp: '2',
          interviewRate: 1,
          rolePriority: 2,
          achievement: {
            cert: 'https://google.com',
            lvlRate: '1',
            champRate: '1',
          },
          lastStage: 'Interview',
          skills: [
            {
              skillName: 'Capcut',
              rate: '2',
            },
            {
              skillName: 'Adobe Premiere',
              rate: '2',
            },
            {
              skillName: 'Adobe Illustrator',
              rate: '2',
            },
          ],
          id: 'vacancy-12345',
          role: {
            id: 'role-1234',
            title: 'Social Media Specialist',
          },
        },
      ],
    };
    const req = new Request('http://localhost/api/intern/vacancy/register', {
      method: 'POST',
      body: JSON.stringify(bodyReq),
    });

    const res = await POST(req);
    const json = await res.json();
    console.log(json);

    expect(json).toHaveProperty('status');
    expect(json.status).toBe('Success');
  });
});
