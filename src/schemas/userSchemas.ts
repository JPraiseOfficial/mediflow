import { z } from "zod";
import { Role } from "@prisma/client";

export const createUserSchema = z.object({
  email: z.string().email("Please, input a correct email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.nativeEnum(Role),
});

export const updateUserSchema = createUserSchema.partial();

export const paramsIdSchema = z.object({
  id: z.preprocess((val) => {
    if (typeof val === "string" && val.length) return Number(val);
    if (typeof val === "number") return val;
    return NaN;
  }, z.number().int().positive()),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
