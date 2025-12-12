import type { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError.js";

export default function globalErrorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Operational, trusted error
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      error: err.message,
      details: err.details,
    });
  }

  // Programming or unknown error
  console.error("UNEXPECTED ERROR:", err);

  return res.status(500).json({
    error: "Something went wrong. Please, try again later",
  });
}
