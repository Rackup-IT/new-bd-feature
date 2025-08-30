export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly payload?: unknown;

  constructor(statusCode: number, message: string, payload?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.payload = payload;

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
