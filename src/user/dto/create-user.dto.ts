import { Role } from '../../../generated/prisma/client';
import { IsEmail, IsEnum, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Please, provide a valid email address' })
  email: string;

  @IsString({})
  password: string;

  @IsEnum(Role)
  role: Role;
}
