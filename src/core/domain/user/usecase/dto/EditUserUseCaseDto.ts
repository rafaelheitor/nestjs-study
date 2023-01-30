import { Exclude, Expose, plainToClass } from 'class-transformer';
import { User } from '../../entity/User';

@Exclude()
export class EditUserUseCaseDto {
  @Expose()
  public name: string;

  @Expose()
  public email: string;

  @Expose()
  public createdAt: string;

  @Expose()
  public editedAt: Date;

  public static newFromUser(user: User): EditUserUseCaseDto {
    return plainToClass(EditUserUseCaseDto, user);
  }
}
