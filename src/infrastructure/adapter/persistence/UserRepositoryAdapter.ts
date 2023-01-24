import { User } from 'src/Core/Domain/user/entity/user.entity';
import { UserRepositoryPort } from 'src/Core/Domain/user/port/persistence/userRepositoryPort';

export class UserRepositoryInMemory implements UserRepositoryPort {
  public users: User[];

  constructor() {
    this.users = [];
  }

  async save(user: User): Promise<User> {
    const savedUser = User.new(user);
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
    const user: User = this.users.find((user) => user.email === email);
    return user;
  }
  delete(id: string): Promise<User> {
    throw new Error('Method not implemented.');
  }
}