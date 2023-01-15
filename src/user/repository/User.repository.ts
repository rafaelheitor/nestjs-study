import { Injectable } from '@nestjs/common';
import { User } from '../../common/domain/user/Entity/User';
import { IUserRepository } from '../../common/domain/user/persistence/usecase/UserRepository.usecase';
import { PrismaService } from '../../prisma/prisma.service';
import * as argon from 'argon2';
import { AuthDto } from '../dto/auth.dto';
import { EditUserDto } from 'src/user/dto/editUser.dto';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  async save(user: AuthDto): Promise<User> {
    const hash = await argon.hash(user.password);
    const savedUser = this.prisma.user.create({
      data: {
        email: user.email,
        hash: hash,
      },
    });

    delete (await savedUser).hash;
    return savedUser;
  }

  async edit(id: number, payload: EditUserDto): Promise<User> {
    const editedUser = this.prisma.user.update({
      where: { id: id },
      data: { firstName: payload.firstName, lastName: payload.lastName },
    });
    return editedUser;
  }

  async getByEmail(email: string): Promise<User> {
    const user = this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    return user;
  }

  async getOne(id: number): Promise<User> {
    const user = this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    return user;
  }

  async getAll(): Promise<User[]> {
    const allUsers = this.prisma.user.findMany();
    return allUsers;
  }

  async delete(id: number): Promise<User> {
    const deletedUser = this.prisma.user.delete({
      where: {
        id: id,
      },
    });

    return deletedUser;
  }
}
