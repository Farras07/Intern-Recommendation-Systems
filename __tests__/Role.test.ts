import { POST, GET, DELETE, PUT } from '@/app/api/intern/role/route';
import RoleServices from '@/Services/RoleServices';
import { adminDb } from '../__mocks__/@/lib/firebase-admin';
import { jobRoleType } from '@/types/JobTypes';

jest.mock('@/lib/firebase-admin');
jest.mock('@/app/api/middleware/auth.middleware');

function checkData(data: any) {
  expect(data).toHaveProperty('id');
  expect(data).toHaveProperty('title');
  expect(data).toHaveProperty('description');
}

describe('Intern Role Services Test', () => {
  const roleServices = new RoleServices(adminDb);

  it('Should have createRole method', async () => {
    expect(typeof roleServices.createRole).toBe('function');
  });
  it('Should have getAllRole method', async () => {
    expect(typeof roleServices.getAllRole).toBe('function');
  });
  //   it('Should have getSpecificRoleById method', async () => {
  //     expect(typeof roleServices.getSpecificRoleById).toBe("function");
  //   })
  //   it('Should have getSpecificRoleByTitle method', async () => {
  //     expect(typeof roleServices.getSpecificRoleByTitle).toBe("function");
  //   })
  it('Should have updateRole method', async () => {
    expect(typeof roleServices.updateRole).toBe('function');
  });
  it('Should have deleteRole method', async () => {
    expect(typeof roleServices.deleteRole).toBe('function');
  });
});

describe('Intern Role API Handler Test', () => {
  it('Get All Intern Role', async () => {
    const req = new Request('http://localhost/api/intern/role', {
      method: 'GET',
    });

    const res = await GET(req);
    const json = await res.json();

    expect(json).toHaveProperty('status');
    expect(json.status).toBe('Success');
    expect(json).toHaveProperty('data');

    expect(json.data).toHaveProperty('roles');
    expect(json.data.roles.length).toBeGreaterThan(0);

    json.data.roles.forEach((item: jobRoleType) => {
      checkData(item);
    });
  });

  // it('Get Intern Role by Id', async () => {
  //     const req = new Request('http://localhost/api/intern/role?id=role-123', {
  //         method: 'GET',
  //     });

  //     const res = await GET(req);
  //     const json = await res.json();

  //     expect(json).toHaveProperty('status');
  //     expect(json.status).toBe('Success');
  //     expect(json).toHaveProperty('data')

  //     expect(json.data).toHaveProperty('role')
  //     checkData(json.data.role)

  // })

  it('Add Intern Role', async () => {
    const bodyReq = {
      id: 'role-12345',
      title: 'Designer',
      description:
        'Menjalankan operasional bisnis proses perusahaan dengan sigap',
    };
    const req = new Request('http://localhost/api/intern/role', {
      method: 'POST',
      body: JSON.stringify(bodyReq),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(json).toHaveProperty('status');
    expect(json.status).toBe('Success');
  });

  it('Update Intern Role', async () => {
    const bodyReq = {
      id: 'role-123',
      title: 'Videographer',
      description:
        'Menjalankan operasional bisnis proses perusahaan dengan sigap',
    };
    const req = new Request('http://localhost/api/intern/role', {
      method: 'PUT',
      body: JSON.stringify(bodyReq),
    });

    const res = await PUT(req);
    const json = await res.json();

    expect(json).toHaveProperty('status');
    expect(json.status).toBe('Success');
  });

  it('Delete Intern Role', async () => {
    const req = new Request('http://localhost/api/intern/role', {
      method: 'DELETE',
      body: JSON.stringify({ id: 'role-123' }),
    });

    const res = await DELETE(req);
    const json = await res.json();

    expect(json).toHaveProperty('status');
    expect(json.status).toBe('Success');
  });
});
