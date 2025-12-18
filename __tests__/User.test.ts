import { GET, DELETE, PUT, POST } from '@/app/api/user/route';
import UserServices from '@/Services/UserServices';
import { adminDb } from '../__mocks__/@/lib/firebase-admin';
import { userData } from '@/types/UserTypes';

jest.mock('@/lib/firebase-admin');
jest.mock('@/app/api/middleware/auth.middleware');
jest.mock('@/services/EmailServices');

function checkData(data: any) {
  expect(data).toHaveProperty('id');
  expect(data).toHaveProperty('name');
  expect(data).toHaveProperty('email');
  expect(data).toHaveProperty('role');
  expect(data).toHaveProperty('verified');
  expect(data).toHaveProperty('createdAt');
}

describe('User Services Test', () => {
  const userServices = new UserServices(adminDb);

  it('Should have createUser method', async () => {
    expect(typeof userServices.createUser).toBe('function');
  });
  it('Should have getUser method', async () => {
    expect(typeof userServices.getUser).toBe('function');
  });
  it('Should have getUserByRole method', async () => {
    expect(typeof userServices.getUserByRole).toBe('function');
  });
  it('Should have getVerifiedUser method', async () => {
    expect(typeof userServices.getVerifiedUser).toBe('function');
  });
  it('Should have getUnverifiedUser method', async () => {
    expect(typeof userServices.getUnverifiedUser).toBe('function');
  });
  it('Should have updateRole method', async () => {
    expect(typeof userServices.updateRole).toBe('function');
  });
  it('Should have deleteUserById method', async () => {
    expect(typeof userServices.deleteUserById).toBe('function');
  });
});

describe('User API Handler Test', () => {
  it('GET user data by role', async () => {
    const req = new Request('http://localhost/api/user?role=Judge', {
      method: 'GET',
    });

    const res = await GET(req);
    const json = await res.json();

    expect(json).toHaveProperty('status');
    expect(json.status).toBe('Success');
    expect(json).toHaveProperty('data');

    expect(Array.isArray(json.data)).toBe(true);
    expect(json.data.length).toBeGreaterThan(0);

    // Check properties for each object in the array
    json.data.forEach((item: userData) => {
      checkData(item);
    });
  });

  it('GET user data by email', async () => {
    const req = new Request(
      'http://localhost/api/user?email=test2@example.com',
      {
        method: 'GET',
      },
    );

    const res = await GET(req);
    const json = await res.json();

    expect(json).toHaveProperty('status');
    expect(json.status).toBe('Success');
    expect(json).toHaveProperty('data');

    checkData(json.data);
  });

  it('Add user data', async () => {
    const bodyReq = {
      id: 'user-12345',
      email: 'test3@example.com',
      role: 'Admin',
      image: 'https://lh3.googleusercontent.com/a/r3ff3ef3r3vv',
      verified: true,
      name: 'John Doe',
      createdAt: {
        _seconds: 1762064307,
        _nanoseconds: 724000000,
      },
    };

    const req = new Request('http://localhost/api/user', {
      method: 'POST',
      body: JSON.stringify(bodyReq),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(json).toHaveProperty('status');
    expect(json.status).toBe('Success');
  });

  it('UPDATE user data', async () => {
    const req = new Request('http://localhost/api/user?id=user-223', {
      method: 'PUT',
      body: JSON.stringify({ verified: false }),
    });

    const res = await PUT(req);
    const json = await res.json();

    expect(json).toHaveProperty('status');
    expect(json.status).toBe('Success');
  });

  it('DELETE user data', async () => {
    const req = new Request('http://localhost/api/user?id=user-123', {
      method: 'DELETE',
    });

    const res = await DELETE(req);
    const json = await res.json();

    expect(json).toHaveProperty('status');
    expect(json.status).toBe('Success');
  });
});
