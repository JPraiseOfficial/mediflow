import { UserService } from '../../user.service';
import { PrismaMockType } from '../../../../test/mocks/prisma.mock';
import { userFactory } from '../../../../test/factories/user.factory';

export const findAllTests = (
  getContext: () => { service: UserService; prisma: PrismaMockType },
) => {
  describe('findAll', () => {
    it('should return paginated users and metadata', async () => {
      const { service, prisma } = getContext();
      const page = 1;
      const limit = 10;
      const users = [
        userFactory({
          id: 1,
          email: 'test@example.com',
          role: 'INTAKE',
        }),
        userFactory({
          id: 2,
          email: 'test2@example.com',
          role: 'DOCTOR',
        }),
      ];
      const total = 2;

      prisma.user.findMany.mockResolvedValue(users);
      prisma.user.count.mockResolvedValue(total);

      const result = await service.findAll(page, limit);

      expect(prisma.user.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        select: {
          id: true,
          email: true,
          role: true,
        },
      });
      expect(prisma.user.count).toHaveBeenCalled();
      expect(result.data).toEqual(users);
      expect(result.meta.total).toEqual(total);
      expect(result.meta.pages).toEqual(1);
    });
  });
};
