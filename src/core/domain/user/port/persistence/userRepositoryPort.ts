import { User } from '@core/Domain/user/entity/User';

export interface UserRepositoryPort {
  save(user: User): Promise<User>;
  edit(user: User): Promise<User>;
  getAll(): Promise<User[]>;
  getByEmail(email: string): Promise<User>;
  delete(email: string): void;
}
