import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsEmail, IsIn, IsOptional, IsString, Matches } from 'class-validator';
import { UseCaseValidatableAdapter } from '@core/common/adapter/usecase/UseCaseValidatableAdapter';
import { CreateUserPort } from '@core/Domain/user/port/useCase/CreateUserPort';
import { UserRoles } from '@core/common/enums/UserEnums';
import { Regex } from '@core/common/util/regex/Regex';

@Exclude()
export class CreateUserAdapter
  extends UseCaseValidatableAdapter
  implements CreateUserPort
{
  @Expose()
  @IsString()
  public name: string;

  @Expose()
  @IsString()
  @IsEmail()
  public email: string;

  @Expose()
  @IsString()
  @Matches(Regex.PasswordRegex, {
    message: 'Password must contain letters numbers and special characteres',
  })
  public password: string;

  @Expose()
  @IsOptional()
  @IsIn([UserRoles.ADMIN, UserRoles.CLIENT])
  public role: UserRoles;

  public static async new(payload: CreateUserPort): Promise<CreateUserAdapter> {
    const adapter: CreateUserAdapter = plainToClass(CreateUserAdapter, payload);
    await adapter.validate();
    return adapter;
  }
}
