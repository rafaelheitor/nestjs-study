import { Injectable } from '@nestjs/common';
import { User } from '../Entity/User';
import { IUserRepository } from './usecase/UserRepository.usecase';
import { PrismaService } from '../../prisma/prisma.service';
import * as argon from 'argon2';
import { AuthDto } from '../../auth/dto/auth.dto';
import { EditUserDto } from 'src/auth/dto/editUser.dto';

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

    return editedUser
  }
}
