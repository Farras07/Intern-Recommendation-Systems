import { POST, GET, DELETE, PUT } from '@/app/api/intern/batch/route';
import { BatchResponseType } from '@/types/BatchTypes';
import BatchServices from '@/Services/BatchServices';
import { adminDb } from '../__mocks__/@/lib/firebase-admin';

jest.mock('@/lib/firebase-admin');
jest.mock('@/app/api/middleware/auth.middleware');

function checkData(data: any) {
  expect(data).toHaveProperty('batchId');
  expect(data).toHaveProperty('batchName');
  expect(data).toHaveProperty('endDate');
  expect(data).toHaveProperty('stage');
  expect(data).toHaveProperty('startDate');
}

describe('Services Intern Batch Test', () => {
  const batchServices = new BatchServices(adminDb);

  it('Should have createBatch method', async () => {
    expect(typeof batchServices.createBatch).toBe('function');
  });
  it('Should have getBatches method', async () => {
    expect(typeof batchServices.getBatches).toBe('function');
  });
  // it('Should have getSpecificBatch method', async () => {
  //     expect(typeof batchServices.getSpecificBatch).toBe("function");
  // })
  // it('Should have getOpenBatch method', async () => {
  //     expect(typeof batchServices.getOpenBatch).toBe("function");
  // })
  // it('Should have updateBatchStage method', async () => {
  //     expect(typeof batchServices.updateBatchStage).toBe("function");
  // })
  it('Should have updateBatch method', async () => {
    expect(typeof batchServices.updateBatch).toBe('function');
  });
  it('Should have deleteBatch method', async () => {
    expect(typeof batchServices.deleteBatch).toBe('function');
  });
});

describe('Intern Batch API Handler Test', () => {
  it('Get All Intern Batch', async () => {
    const req = new Request('http://localhost/api/intern/batch', {
      method: 'GET',
    });

    const res = await GET(req);
    const json = await res.json();

    expect(json).toHaveProperty('status');
    expect(json.status).toBe('Success');
    expect(json).toHaveProperty('data');
    expect(json.data).toHaveProperty('batches');

    expect(json.data.batches.length).toBeGreaterThan(0);

    json.data.batches.forEach((item: BatchResponseType) => {
      checkData(item);
    });
  });

  // it('Get Intern Batch by Id', async () => {
  //     const req = new Request('http://localhost/api/intern/batch?id=batch-123', {
  //         method: 'GET',
  //     });

  //     const res = await GET(req);
  //     const json = await res.json();

  //     expect(json).toHaveProperty('status');
  //     expect(json.status).toBe('Success');
  //     expect(json).toHaveProperty('data')
  //     expect(json.data).toHaveProperty('batch')
  //     checkData(json.data.batch)
  // })

  it('Add Intern Batch', async () => {
    const bodyReq = {
      batchId: 'batch-123',
      batchName: 'Rekrutment Batch 1 - 2024',
      endDate: '2025-11-11T15:00:00.000Z',
      stage: 'Registration',
      startDate: '2025-10-27T20:00:00.000Z',
    };
    const req = new Request('http://localhost/api/intern/batch', {
      method: 'POST',
      body: JSON.stringify(bodyReq),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(json).toHaveProperty('status');
    expect(json.status).toBe('Success');
  });

  it('Update Intern Batch', async () => {
    const bodyReq = {
      batchId: 'batch-123',
      batchName: 'Rekrutment Batch 1 - 2024',
      endDate: '2025-11-11T15:00:00.000Z',
      stage: 'Finished',
      startDate: '2025-10-27T20:00:00.000Z',
    };
    const req = new Request('http://localhost/api/intern/batch', {
      method: 'PUT',
      body: JSON.stringify(bodyReq),
    });

    const res = await PUT(req);
    const json = await res.json();

    expect(json).toHaveProperty('status');
    expect(json.status).toBe('Success');
  });

  // it('Update Intern Batch Stage', async () => {
  //     const req = new Request('http://localhost/api/intern/batch/batch-123', {
  //         method: 'PUT',
  //         body: JSON.stringify({ stage: 'Finished' })
  //     });

  //     const res = await PUT(req);
  //     const json = await res.json();

  //     expect(json).toHaveProperty('status');
  //     expect(json.status).toBe('Success');
  // })

  it('Delete Intern Batch', async () => {
    const req = new Request('http://localhost/api/intern/batch?id=batch-123', {
      method: 'DELETE',
    });

    const res = await DELETE(req);
    const json = await res.json();

    expect(json).toHaveProperty('status');
    expect(json.status).toBe('Success');
  });
});
