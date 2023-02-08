import { UseCaseValidatableAdapter } from '@core/common/adapter/usecase/UseCaseValidatableAdapter';
import { CreateProductPort } from '@core/domain/product/port/usecase/CreateProductPort';
import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

@Exclude()
export class CreateProductAdapter
  extends UseCaseValidatableAdapter
  implements CreateProductPort
{
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
    payload: CreateProductPort,
  ): Promise<CreateProductAdapter> {
    const adapter = plainToClass(CreateProductAdapter, payload);
    await adapter.validate();
    return adapter;
  }
}
