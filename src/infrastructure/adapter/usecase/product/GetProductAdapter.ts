import { UseCaseValidatableAdapter } from '@core/common/adapter/usecase/UseCaseValidatableAdapter';
import { GetProducPort } from '@core/domain/product/port/usecase/GetProductPort';
import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsString } from 'class-validator';

@Exclude()
export class GetProductAdapter
  extends UseCaseValidatableAdapter
  implements GetProducPort
{
  @Expose()
  @IsString()
  productId: string;

  public static async new(payload: GetProducPort) {
    const adapter = plainToClass(GetProductAdapter, payload);
    await adapter.validate();
    return adapter;
  }
}
