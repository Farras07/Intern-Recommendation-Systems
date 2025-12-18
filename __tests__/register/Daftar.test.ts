import { RegistDataTypes, VacancyRegisType } from '@/types/registDataTypes';
import { POST } from '@/app/api/intern/vacancy/register/route';
import { adminDb } from '../../__mocks__/@/lib/firebase-admin';
import RegisterServices from '@/Services/RegisterServices';
import EmailServices from '@/Services/EmailServices';

jest.mock('@/lib/firebase-admin');
jest.mock('@/app/api/middleware/auth.middleware');
jest.mock('@/lib/privacy', () => ({
  Encrypt: (t: string) => `enc-${t}`,
  Decrypt: (t: string) => t.replace(/^enc-/, ''),
}));

describe('Register(daftar magang) test', () => {
  const registerServices = new RegisterServices(adminDb);
  const emailServices = new EmailServices();

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

  it('Register Services should have registerVacancy method', async () => {
    expect(typeof registerServices.registerVacancy).toBe('function');
  });

  it('Email Services Should have sendEmail method', async () => {
    expect(typeof emailServices.sendEmail).toBe('function');
  });

  it('POST Register API Handler', async () => {
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
