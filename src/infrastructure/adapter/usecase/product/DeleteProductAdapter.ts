import { UseCaseValidatableAdapter } from '@core/common/adapter/usecase/UseCaseValidatableAdapter';
import { DeleteProductPort } from '@core/domain/product/port/usecase/DeleteProductPort';
import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsString } from 'class-validator';

@Exclude()
export class DeleteProductAdapter
  extends UseCaseValidatableAdapter
  implements DeleteProductPort
{
  @Expose()
  @IsString()
  productId: string;

  public static async new(
    payload: DeleteProductPort,
  ): Promise<DeleteProductAdapter> {
    const adapter: DeleteProductAdapter = plainToClass(
      DeleteProductAdapter,
      payload,
    );
    await adapter.validate();
    return adapter;
  }
}
