import type { Request, Response, NextFunction } from "express";
import type z from "zod";
import AppError from "../utils/AppError";

export const validate = (
  schema: z.ZodSchema,
  property: "body" | "params" | "query" = "body"
) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const toValidate = req[property];
    const result = schema.safeParse(toValidate);
    if (!result.success) {
      const errors = result.error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      return next(new AppError("Validation failed", 400, errors));
    }
    // Replace the property with the parsed/coerced data
    req[property] = result.data;
    return next();
  };
};
