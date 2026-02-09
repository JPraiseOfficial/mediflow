import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { prismaMock, PrismaMockType } from '../../test/mocks/prisma.mock';
import { ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { mockReset } from 'jest-mock-extended';

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

  describe('create', () => {
    it('should create a user successfully', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        role: 'INTAKE',
      };

      const hashedPassword = 'hashedPassword';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({
        id: 1,
        ...createUserDto,
        password: hashedPassword,
        createdAt: new Date(),
      });

      const result = await service.create(createUserDto);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: { ...createUserDto, password: hashedPassword },
      });
      expect(result.email).toEqual(createUserDto.email);
    });

    it('should throw ConflictException if email already exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'existing@example.com',
        password: 'password123',
        role: 'INTAKE',
      };

      prisma.user.findUnique.mockResolvedValue({
        id: 1,
        email: createUserDto.email,
        role: 'DOCTOR',
        password: 'hashedPassword',
        createdAt: new Date(),
      });

      await expect(service.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
      expect(prisma.user.create).not.toHaveBeenCalled();
    });
  });
});
