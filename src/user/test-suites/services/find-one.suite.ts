import { NotFoundException } from '@nestjs/common';
import { UserService } from '../../user.service';
import { PrismaMockType } from '../../../../test/mocks/prisma.mock';
import { userFactory } from '../../../../test/factories/user.factory';

export const findOneTests = (
  getContext: () => { service: UserService; prisma: PrismaMockType },
) => {
  describe('user.service.findOne', () => {
    it('should return a user if found', async () => {
      const { service, prisma } = getContext();
      const user = userFactory({
        id: 1,
        email: 'test@example.com',
        role: 'INTAKE',
      });

      prisma.user.findUnique.mockResolvedValue(user);

      const result = await service.findOne(1);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: {
          id: true,
          email: true,
          role: true,
        },
      });
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user is not found', async () => {
      const { service, prisma } = getContext();
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });
};
