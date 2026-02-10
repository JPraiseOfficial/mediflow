import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { prismaMock, PrismaMockType } from '../../test/mocks/prisma.mock';
import { mockReset } from 'jest-mock-extended';
import { createTests } from './test-suites/services/create.suite';
import { findAllTests } from './test-suites/services/find-all.suite';
import { findOneTests } from './test-suites/services/find-one.suite';
import { updateTests } from './test-suites/services/update.suite';
import { changePasswordTests } from './test-suites/services/change-password.suite';
import { removeTests } from './test-suites/services/remove.suite';

jest.mock('bcrypt');

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaMockType;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = prismaMock;
  });

  afterEach(() => {
    jest.restoreAllMocks();
    mockReset(prisma); // Clears prisma call history and results
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Execute imported tests
  createTests(() => ({ service, prisma }));
  findAllTests(() => ({ service, prisma }));
  findOneTests(() => ({ service, prisma }));
  updateTests(() => ({ service, prisma }));
  changePasswordTests(() => ({ service, prisma }));
  removeTests(() => ({ service, prisma }));
});
