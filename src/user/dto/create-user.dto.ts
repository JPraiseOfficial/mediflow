import { Role } from '../../../generated/prisma/client';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Please, provide a valid email address' })
  email: string;

  @IsString({})
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsEnum(Role)
  role: Role;
}
