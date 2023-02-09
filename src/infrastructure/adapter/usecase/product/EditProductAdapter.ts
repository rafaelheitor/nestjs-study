import { UseCaseValidatableAdapter } from '@core/common/adapter/usecase/UseCaseValidatableAdapter';
import { EditProducPort } from '@core/domain/product/port/usecase/EditProductPort';
import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

@Exclude()
export class EditProductAdapter
  extends UseCaseValidatableAdapter
  implements EditProducPort
{
  @Expose()
  @IsString()
  productId: string;

  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsString()
  image: string;

  @Expose()
  @IsNumber()
  price: number;

  @Expose()
  @IsNumber()
  quantity: number;

  public static async new(
    payload: EditProducPort,
  ): Promise<EditProductAdapter> {
    const adapter = plainToClass(EditProductAdapter, payload);
    await adapter.validate();
    return adapter;
  }
}
