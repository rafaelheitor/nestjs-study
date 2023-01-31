import { User } from 'src/Core/Domain/user/entity/User';
import { EditUserPort } from '../useCase/EditUserPort';

export interface UserRepositoryPort {
  save(user: User): Promise<User>;
  edit(user: User): Promise<User>;
  getAll(): Promise<User[]>;
  getByEmail(email: string): Promise<User>;
  delete(email: string): void;
}
