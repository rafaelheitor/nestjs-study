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

  async getOne(id: string): Promise<User> {
    return this.users.find((user) => user.getId() === id);
  }

  async getAll(): Promise<User[]> {
    return this.users;
  }

  async edit(id: string, requestUser: User): Promise<User> {
    const foundUser = this.getOne(id);
    
    if(foundUser != null){
      this.delete(requestUser.getId());
      const savedUser = this.save(requestUser);
      return savedUser;
    }

    return null
  }

  async getByEmail(email: string): Promise<User> | undefined {
    const user: User = this.users.find((user) => user.getEmail() === email);
    return user;
  }
  
  async delete(id: string): Promise<void> {
     const foundUser = this.getOne(id);
    
    if(foundUser != null){
        this.users.filter(user => user.id != id)     
     }
  }
}
