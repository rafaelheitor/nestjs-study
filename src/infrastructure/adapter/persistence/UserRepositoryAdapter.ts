import { User } from '../../../core/domain/user/entity/User';
import { UserRepositoryPort } from '../../../core/domain/user/port/persistence/userRepositoryPort';

export class UserRepositoryInMemory implements UserRepositoryPort {
  public users: User[];

  constructor() {
    this.users = [];
  }

  async save(user: User): Promise<User> {
    const savedUser: User = await User.new({
      id: user.id,
      name: user.getName(),
      email: user.getEmail(),
      password: user.getPassword(),
    });

    this.users.push(user);
    return savedUser;
  }

  async edit(user: User): Promise<User> {
    const foundUser = await this.getByEmail(user.getEmail());
    const editedUser = await foundUser.edit({
      name: user.getName(),
      password: user.getPassword(),
    });
    await this.save(editedUser);
    return editedUser;
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
