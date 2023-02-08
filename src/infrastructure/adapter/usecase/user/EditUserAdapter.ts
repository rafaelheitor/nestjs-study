import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsEmail, IsString, Matches } from 'class-validator';
import { UseCaseValidatableAdapter } from '@core/common/adapter/usecase/UseCaseValidatableAdapter';
import { EditUserPort } from '@core/domain/user/port/useCase/EditUserPort';
import { Regex } from '@core/common/util/regex/Regex';

@Exclude()
export class EditUserAdapter
  extends UseCaseValidatableAdapter
  implements EditUserPort
{
  @Expose()
  @IsString()
  public name: string;

  @Expose()
  @IsString()
  @Matches(Regex.PasswordRegex, {
    message: 'Password must contain letters numbers and special characteres',
  })
  public password: string;

  @Expose()
  @IsEmail()
  public email: string;

  public static async new(payload: EditUserPort): Promise<EditUserAdapter> {
    const adapter: EditUserAdapter = plainToClass(EditUserAdapter, payload);
    await adapter.validate();
    return adapter;
  }
}
