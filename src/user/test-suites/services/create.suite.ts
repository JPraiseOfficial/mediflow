import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UserService } from '../../user.service';
import { PrismaMockType } from '../../../../test/mocks/prisma.mock';
import { userFactory } from '../../../../test/factories/user.factory';

export const createTests = (
  getContext: () => { service: UserService; prisma: PrismaMockType },
) => {
  describe('user.service.create', () => {
    it('should create a user successfully', async () => {
      const { service, prisma } = getContext();
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        role: 'INTAKE',
      };

      const hashedPassword = 'hashedPassword';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const user = userFactory({
        ...createUserDto,
        password: hashedPassword,
      });

      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue(user);

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
      const { service, prisma } = getContext();
      const createUserDto: CreateUserDto = {
        email: 'existing@example.com',
        password: 'password123',
        role: 'INTAKE',
      };

      prisma.user.findUnique.mockResolvedValue(
        userFactory({
          email: createUserDto.email,
          role: 'DOCTOR',
          password: 'hashedPassword',
        }),
      );

      await expect(service.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
      expect(prisma.user.create).not.toHaveBeenCalled();
    });
  });
};
