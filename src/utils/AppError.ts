export default class AppError extends Error {
  statusCode: number;
  status: "fail" | "error";
  details: unknown;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500, details?: unknown) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.details = details;
    this.isOperational = true;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
