import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { EditUserDto } from './dto/editUser.dto';
import { UserRepository } from '../user/repository/User.repository';

@Injectable()
export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async signup(dto: AuthDto) {
   const user = this.userRepository.save(dto)
    return user
  }
  
  // async signin(dto: AuthDto) {
  //   const user = await this.prisma.user.findUnique({
  //     where: {
  //       email: dto.email,
  //     },
  //   });

  //   if (!user) throw new ForbiddenException('Email ou senha inválidos');

  //   const passwordMatches = await argon.verify(user.hash, dto.password);
    
  //   if(!passwordMatches) throw new ForbiddenException('Email ou senha inválidos')

  //   delete user.hash
  //   return user
  // }

  async edit(id: number, dto: EditUserDto){
    const editedUser = this.userRepository.edit(id, dto)
    return editedUser
  }
}
