import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsEmail, IsString, Matches } from 'class-validator';
import { UseCaseValidatableAdapter } from '@core/common/adapter/usecase/UseCaseValidatableAdapter';
import { CreateUserPort } from '@core/Domain/user/port/useCase/CreateUserPort';

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
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/, {
    message: 'Password must contain letters numbers and special characteres',
  })
  public password: string;

  public static async new(payload: CreateUserPort): Promise<CreateUserAdapter> {
    const adapter: CreateUserAdapter = plainToClass(CreateUserAdapter, payload);
    await adapter.validate();
    return adapter;
  }
}
