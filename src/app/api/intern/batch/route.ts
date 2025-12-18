export const runtime = 'nodejs';
import { internBatchRouter } from '../../route';

export const { POST, GET, DELETE, PUT } = internBatchRouter();
