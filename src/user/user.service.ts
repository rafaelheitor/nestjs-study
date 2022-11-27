import { Injectable } from '@nestjs/common';
import { AuthDto } from './dto';
import { EditUserDto } from './dto';
import { UserRepository } from './repository/';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async new(dto: AuthDto) {
    const user = this.userRepository.save(dto);
    return user;
  }

  async edit(id: number, dto: EditUserDto) {
    const editedUser = this.userRepository.edit(id, dto);
    return editedUser;
  }

  async getAll() {
    const allUsers = this.userRepository.getAll();
    return allUsers;
  }

  async delete(id: number) {
    const deletedUser = this.userRepository.delete(id);
    return deletedUser;
  }
}
