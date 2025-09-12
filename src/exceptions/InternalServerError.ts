import BaseError from "./BaseError"

export default class InternalServerError extends BaseError {
  constructor (message: string, statusCode: number = 500) {
    super(message, statusCode)
    this.name = 'InternalServerError'
  }
}
