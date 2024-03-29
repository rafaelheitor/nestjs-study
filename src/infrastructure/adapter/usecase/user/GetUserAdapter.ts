import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsString } from 'class-validator';
import { UseCaseValidatableAdapter } from '@core/common/adapter/usecase/UseCaseValidatableAdapter';
import { GetUserPort } from '@core/domain/user/port/useCase/GetUserPort';

@Exclude()
export class GetUserAdapter
  extends UseCaseValidatableAdapter
  implements GetUserPort
{
  @Expose()
  @IsString()
  public id: string;

  public static async new(payload: GetUserPort): Promise<GetUserAdapter> {
    const adapter: GetUserAdapter = plainToClass(GetUserAdapter, payload);
    await adapter.validate();
    return adapter;
  }
}
