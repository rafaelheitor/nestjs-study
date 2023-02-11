import { User } from '@core/domain/user/entity/User';
import { UserRepositoryPort } from '@core/domain/user/port/persistence/userRepositoryPort';

export class UserRepositoryInMemory implements UserRepositoryPort {
  private static instance: UserRepositoryInMemory | null = null;
  public users: User[] = [];

  static async getInstance(): Promise<UserRepositoryInMemory> {
    if (UserRepositoryInMemory.instance === null) {
      UserRepositoryInMemory.instance = new UserRepositoryInMemory();
    }
    return UserRepositoryInMemory.instance;
  }

  async save(user: User): Promise<User> {
    const savedUser: User = user;

    this.users.push(savedUser);
    return savedUser;
  }

  async getById(id: string): Promise<User> {
    return this.users.find((user) => user.getId() === id);
  }

  async edit(requestUser: User): Promise<User> {
    this.delete(requestUser.getEmail());
    const savedUser = this.save(requestUser);
    return savedUser;
  }

  getAll(): Promise<User[]> {
    throw new Error('Method not implemented.');
  }
  async getByEmail(email: string): Promise<User> | undefined {
    const user: User = this.users.find((user) => user.getEmail() === email);
    return user;
  }
  delete(email: string): void {
    this.users = this.users.filter((user) => user.getEmail() !== email);
  }
}
