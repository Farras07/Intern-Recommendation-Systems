import dbData from '../../data.json';

export const initializeApp = jest.fn();
export const credential = { cert: jest.fn() };

// allow dynamic collection access
const db: Record<string, any[]> = dbData as unknown as Record<string, any[]>;

const fakeDoc = (data: any) => ({
  data: () => data,
});

const FakeSnapshot = (docs: any[]) => ({
  empty: docs.length === 0,
  docs: docs.map(doc => fakeDoc(doc)),
});

const createCollectionMock = (collectionName: string) => {
  const items = db[collectionName] || [];

  return {
    doc: jest.fn(() => ({
      set: jest.fn(async () => {}),
      update: jest.fn(async () => {}),
      delete: jest.fn(async () => true),
    })),

    where: jest.fn((field: string, op: string, value: any) => {
      const filtered1 = items.filter((item: any) => item[field] === value);

      return {
        where: jest.fn((field2: string, op2: string, value2: any) => {
          const filtered2 = filtered1.filter(
            (item: any) => item[field2] === value2,
          );
          return { get: jest.fn(async () => FakeSnapshot(filtered2)) };
        }),

        limit: jest.fn(() => ({
          get: jest.fn(async () => FakeSnapshot(filtered1)),
        })),

        select: jest.fn(() => ({
          get: jest.fn(async () => FakeSnapshot(filtered1)),
        })),

        get: jest.fn(async () => FakeSnapshot(filtered1)),
      };
    }),

    get: jest.fn(async () => FakeSnapshot(items)),
  };
};

export const adminDb = {
  collection: jest.fn((name: string) => createCollectionMock(name)),
};
