import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';
import { UseCaseValidatableAdapter } from '@core/common/adapter/usecase/UseCaseValidatableAdapter';
import { DeleteUserPort } from '@core/domain/user/port/useCase/DeleteUserPort';

@Exclude()
export class DeleteUserAdapter
  extends UseCaseValidatableAdapter
  implements DeleteUserPort
{
  @Expose()
  @IsEmail()
  public email: string;

  public static async new(payload: DeleteUserPort): Promise<DeleteUserAdapter> {
    const adapter: DeleteUserAdapter = plainToClass(DeleteUserAdapter, payload);
    await adapter.validate();
    return adapter;
  }
}
