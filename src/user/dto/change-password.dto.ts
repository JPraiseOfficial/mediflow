import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Match } from '../../common/decorators/match.decorator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @IsString()
  @MinLength(6)
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  @Match('newPassword', { message: 'Passwords do not match' })
  confirmPassword: string;
}
