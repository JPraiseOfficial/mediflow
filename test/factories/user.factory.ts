import { Role, User } from '@prisma/client';

export const userFactory = (overrides?: Partial<User>): User => {
  return {
    id: 1,
    email: 'test@example.com',
    password: 'password123',
    role: Role.INTAKE,
    createdAt: new Date(),
    ...overrides,
  };
};
