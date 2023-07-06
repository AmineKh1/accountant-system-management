import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, Role, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create.dto';
import { UpdateUserDto } from './dto/update.dto';
const bcrypt = require("bcrypt");

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async findOne(where: Prisma.UserWhereUniqueInput,): Promise<User | undefined> {
    return this.prisma.user.findUnique({
      where,
    });
  }

  async create(data: CreateUserDto) {
    try {
      return await this.prisma.user.create({
        data: {
          email: data.email,
          password: await bcrypt.hash(data.password, 12),
          role: data.role,
        }
      });
    }
    catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException(error.meta.cause, HttpStatus.FORBIDDEN)
      }
    }

  }
  async delete(userId: number, where: Prisma.UserWhereUniqueInput): Promise<User> {
    if (userId == where.id)
      throw new HttpException("You can't delete your account.", 401);
    try {
      return await this.prisma.user.delete({
        where,
      });
    }
    catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException(error.meta.cause, HttpStatus.FORBIDDEN)
      }
    }
  }
  async update(id: number, data: UpdateUserDto) {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: {
          email: data.email,
          name: data.username,
          password: await bcrypt.hash(data.password, 12),
          role: data.role,
        }
      })
    }
    catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException(error.meta.cause, HttpStatus.FORBIDDEN)
      }
    }
  }
}