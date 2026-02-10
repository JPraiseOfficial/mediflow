import { NotFoundException } from '@nestjs/common';
import { UserService } from '../../user.service';
import { PrismaMockType } from '../../../../test/mocks/prisma.mock';
import { userFactory } from '../../../../test/factories/user.factory';

export const removeTests = (
  getContext: () => { service: UserService; prisma: PrismaMockType },
) => {
  describe('remove', () => {
    it('should delete a user successfully', async () => {
      const { service, prisma } = getContext();
      const user = userFactory({
        id: 1,
        email: 'test@example.com',
        role: 'INTAKE',
      });

      prisma.user.findUnique.mockResolvedValue(user);
      prisma.user.delete.mockResolvedValue(user);

      const result = await service.remove(1);

      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { id: 1 },
        select: {
          id: true,
          email: true,
          role: true,
        },
      });
      expect(result.message).toEqual('User deleted successfully');
    });

    it('should throw NotFoundException if user not found', async () => {
      const { service, prisma } = getContext();
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
};
