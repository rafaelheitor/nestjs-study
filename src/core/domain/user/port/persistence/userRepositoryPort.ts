import { User } from 'src/Core/Domain/user/entity/user.entity';

export interface UserRepositoryPort {
  save(user: User): Promise<User>;
  edit(id: string, user: User);
  getAll(): Promise<User[]>;
  getByEmail(email: string): Promise<User>;
  delete(id: string): Promise<User>;
}
