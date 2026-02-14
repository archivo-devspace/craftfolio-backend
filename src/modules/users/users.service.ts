import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { hashPassword } from 'src/common/utils/helpers';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { Status } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: CreateUserDto): Promise<UserEntity> {
    const existingUser = await this.findUserByEmail(data.email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }
    const hashedPassword = await hashPassword(data.password);
    const newUser = await this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
    const userEntity = new UserEntity(newUser);
    return userEntity;
  }

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { email, deletedAt: null },
    });
    if (!user) {
      return null;
    }
    return new UserEntity(user);
  }

  async findUserById(id: string): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({
      where: { id ,deletedAt: null },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return new UserEntity(user);
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<UserEntity> {
    const updatedUser = await this.prisma.user.update({
      where: { id, deletedAt: null },
      data,
    });
    return new UserEntity(updatedUser);
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id, deletedAt: null },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.prisma.user.update({
      where: { id },
      data: { status: Status.DELETED, deletedAt: new Date() },
    });
  }
}
