import type { Request, Response, NextFunction } from "express";
import * as services from "../services/users.js";
import type { CreateUserInput } from "../schemas/userSchemas.js";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, role } = req.body as CreateUserInput;
    const user = await services.createUser({
      email,
      password,
      role,
    });
    return res.status(201).json({ message: "User Created Successfully", user });
  } catch (err: any) {
    return next(err);
  }
};

export const listUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await services.getUsers();
    return res.json(users);
  } catch (err: any) {
    return next(err);
  }
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    const user = await services.getUserById(id);
    return res.json(user);
  } catch (err: any) {
    return next(err);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    const data = req.body;
    const updatedUser = await services.updateUser(id, data);
    return res.json({ message: "User updated successfully", updatedUser });
  } catch (err: any) {
    return next(err);
  }
};

export const removeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    await services.deleteUser(id);
    return res.status(204).send();
  } catch (err: any) {
    return next(err);
  }
};
