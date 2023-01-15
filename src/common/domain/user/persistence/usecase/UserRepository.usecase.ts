import { User } from '../../Entity/User';
import { AuthDto } from '../../../../../user/dto/auth.dto';
import { EditUserDto } from '../../../../../user/dto/editUser.dto';

export interface IUserRepository {
  save(user: AuthDto): Promise<User>;
  edit(id: number, payload: EditUserDto): Promise<User>;
  getAll(): Promise<User[]>;
  getByEmail(email: string): Promise<User>
  delete(id: number): Promise<User>
}
