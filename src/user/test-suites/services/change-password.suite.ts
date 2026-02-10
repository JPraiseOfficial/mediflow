import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from '../../dto/change-password.dto';
import { UserService } from '../../user.service';
import { PrismaMockType } from '../../../../test/mocks/prisma.mock';
import { userFactory } from '../../../../test/factories/user.factory';

export const changePasswordTests = (
  getContext: () => { service: UserService; prisma: PrismaMockType },
) => {
  describe('changePassword', () => {
    const changePasswordDto: ChangePasswordDto = {
      oldPassword: 'oldPass',
      newPassword: 'newPass',
      confirmPassword: 'newPass',
    };

    it('should change password successfully', async () => {
      const { service, prisma } = getContext();
      const user = userFactory({
        password: 'hashedOldPass',
      });

      prisma.user.findUnique.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedNewPass');
      prisma.user.update.mockResolvedValue({
        ...user,
        password: 'hashedNewPass',
      });

      const result = await service.changePassword(1, changePasswordDto);

      expect(bcrypt.compare).toHaveBeenCalledWith('oldPass', 'hashedOldPass');
      expect(bcrypt.hash).toHaveBeenCalledWith('newPass', 10);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { password: 'hashedNewPass' },
      });
      expect(result.message).toEqual('Password changed successfully');
    });

    it('should throw NotFoundException if user not found', async () => {
      const { service, prisma } = getContext();
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(
        service.changePassword(999, changePasswordDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if old password is invalid', async () => {
      const { service, prisma } = getContext();
      prisma.user.findUnique.mockResolvedValue(
        userFactory({
          password: 'hashedOldPass',
        }),
      );

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.changePassword(1, changePasswordDto),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
};
