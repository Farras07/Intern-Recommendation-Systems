import BaseError from './BaseError';

export default class ClientError extends BaseError {
  constructor(message: string, statusCode: number = 400) {
    super(message, statusCode);
    this.name = 'ClientError';
  }
}
