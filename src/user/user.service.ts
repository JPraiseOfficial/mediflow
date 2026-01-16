import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    // Check if user email exists
    const existingEmail = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });
    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    // Hash User's Password
    const salt = 10;
    const passwordHash = await bcrypt.hash(createUserDto.password, salt);

    // Create the user and returns user info
    const user = await this.prisma.user.create({
      data: { ...createUserDto, password: passwordHash },
    });
    return user;
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const take = limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take,
        select: {
          id: true,
          email: true,
          role: true,
        },
      }),
      this.prisma.user.count(),
    ]);

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: number, data: UpdateUserDto) {
    // Only allow updating email and role
    const { email } = data;

    // Check if user exists
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    // Check if email already exists
    if (email && email !== user.email) {
      const existingEmail = await this.prisma.user.findUnique({
        where: { email },
      });
      if (existingEmail) throw new ConflictException('Email already exists');
    }

    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        role: true,
      },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
