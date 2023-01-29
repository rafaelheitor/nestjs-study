import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsOptional } from 'class-validator';
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
  @IsOptional()
  public createdAt: Date;

  @Expose()
  @IsOptional()
  public editedAt: Date;

  public static newFromUser(user: User): UserUsecaseDto {
    return plainToClass(UserUsecaseDto, user);
  }

  public static newListFromUser(users: User[]): UserUsecaseDto[] {
    return users.map((user) => this.newFromUser(user));
  }
}
