import prisma from "../lib/prisma.js";
import type { CreateUserInput } from "../schemas/userSchemas.js";
import type { User } from "../types/index.js";
import AppError from "../utils/AppError.js";

export const createUser = async (data: CreateUserInput): Promise<User> => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new AppError("Email already exists", 409);
  }
  const created = await prisma.user.create({ data });
  return {
    id: created.id,
    email: created.email,
    role: created.role,
  };
};

export const getUserById = async (id: number): Promise<User | null> => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (user) {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  } else {
    throw new AppError("User not found!", 404);
  }
};

export const getUsers = async (take = 50, skip = 0): Promise<User[]> => {
  const users = await prisma.user.findMany({
    take,
    skip,
    orderBy: { createdAt: "desc" },
  });
  return users.map((user) => ({
    id: user.id,
    email: user.email,
    role: user.role,
  }));
};

export const updateUser = async (
  id: number,
  data: Partial<CreateUserInput>
): Promise<User> => {
  // Check if User exists
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new AppError("User not found!", 404);
  }
  // Check for duplicate email if email is changed
  if (data.email) {
    const existingEmail = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingEmail) {
      throw new AppError("Email already exists", 409);
    }
  }

  // updates user with new details
  const updated = await prisma.user.update({ where: { id }, data });
  return {
    id: updated.id,
    email: updated.email,
    role: updated.role,
  };
};

export const deleteUser = async (id: number) => {
  // Check if user exists
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new AppError("User not found!", 404);
  }

  // Deletes user
  await prisma.user.delete({ where: { id } });
  return;
};
