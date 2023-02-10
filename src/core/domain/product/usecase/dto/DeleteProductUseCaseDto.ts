import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';
import { Product } from '../../entity/Product';

@Exclude()
export class DeleteProductUseCaseDto {
  @Expose()
  @IsString()
  id: string;

  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsDate()
  removedAt: Date;

  static newFromProduct(product: Product): DeleteProductUseCaseDto {
    const deleteProductUseCaseDto: DeleteProductUseCaseDto = plainToClass(
      DeleteProductUseCaseDto,
      product,
    );
    return deleteProductUseCaseDto;
  }
}
