import { ConflictException, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { UserService } from '../../user.service';
import { PrismaMockType } from '../../../../test/mocks/prisma.mock';
import { userFactory } from '../../../../test/factories/user.factory';

export const updateTests = (
  getContext: () => { service: UserService; prisma: PrismaMockType },
) => {
  describe('update', () => {
    it('should update a user successfully', async () => {
      const { service, prisma } = getContext();
      const updateUserDto: UpdateUserDto = { email: 'new@example.com' };
      const existingUser = userFactory({
        id: 1,
        email: 'old@example.com',
        password: 'hash',
      });

      prisma.user.findUnique.mockResolvedValueOnce(existingUser); // Check user exists
      prisma.user.findUnique.mockResolvedValueOnce(null); // Check email uniqueness
      prisma.user.update.mockResolvedValue({
        ...existingUser,
        email: updateUserDto.email!,
      });

      const result = await service.update(1, updateUserDto);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateUserDto,
        select: { id: true, email: true, role: true },
      });
      expect(result.email).toEqual(updateUserDto.email);
    });

    it('should throw NotFoundException if user to update does not exist', async () => {
      const { service, prisma } = getContext();
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.update(999, { email: 'test@example.com' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if new email is already taken', async () => {
      const { service, prisma } = getContext();
      const updateUserDto: UpdateUserDto = { email: 'taken@example.com' };
      const existingUser = userFactory({
        id: 1,
        email: 'old@example.com',
        password: 'hash',
      });

      prisma.user.findUnique.mockResolvedValueOnce(existingUser); // User exists
      prisma.user.findUnique.mockResolvedValueOnce({
        ...existingUser,
        id: 2,
        email: 'taken@example.com',
      }); // Email taken by another

      await expect(service.update(1, updateUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });
};
