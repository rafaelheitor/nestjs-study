import { User } from '../../../core/domain/user/entity/user.entity';
import { UserRepositoryPort } from '../../../core/domain/user/port/persistence/userRepositoryPort';

export class UserRepositoryInMemory implements UserRepositoryPort {
  public users: User[];

  constructor() {
    this.users = [];
  }

  async save(user: User): Promise<User> {
    const savedUser: User = await User.new({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
    });

    this.users.push(savedUser);
    return savedUser;
  }
  edit(id: string, user: User) {
    throw new Error('Method not implemented.');
  }
  getAll(): Promise<User[]> {
    throw new Error('Method not implemented.');
  }
  async getByEmail(email: string): Promise<User> | undefined {
    const user: User = this.users.find((user) => user.getEmail() === email);
    return user;
  }
  delete(id: string): Promise<User> {
    throw new Error('Method not implemented.');
  }
}
