import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';
import { User } from '../../entity/User';

@Exclude()
export class DeleteUserUseCaseDto {
  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsDate()
  removedAt: Date;

  static newFromUser(user: User): DeleteUserUseCaseDto {
    const deleteUserUseCaseDto: DeleteUserUseCaseDto = plainToClass(
      DeleteUserUseCaseDto,
      user,
    );
    return deleteUserUseCaseDto;
  }
}
