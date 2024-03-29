import { Exclude, Expose, plainToClass } from 'class-transformer';
import { User } from '../../entity/User';

@Exclude()
export class UserUsecaseDto {
  @Expose()
  public id: string;

  @Expose()
  public name: string;

  @Expose()
  public email: string;

  @Expose()
  public createdAt: Date;

  public static newFromUser(user: User): UserUsecaseDto {
    return plainToClass(UserUsecaseDto, user);
  }

  public static newListFromUser(users: User[]): UserUsecaseDto[] {
    return users.map((user) => this.newFromUser(user));
  }
}
