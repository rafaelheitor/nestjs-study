import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';
import { UseCaseValidatableAdapter } from '@core/common/adapter/usecase/UseCaseValidatableAdapter';
import { EditUserPort } from '@core/domain/user/port/useCase/EditUserPort';

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
