import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaService } from '../../src/prisma/prisma.service';

export const prismaMock = mockDeep<PrismaService>();
export type PrismaMockType = DeepMockProxy<PrismaService>;
