import { Exclude, Expose, plainToClass } from 'class-transformer';
import { Product } from '../../entity/Product';

@Exclude()
export class ProductUseCaseDto {
  @Expose()
  public id: string;

  @Expose()
  public name: string;

  @Expose()
  public image: string;

  @Expose()
  public price: number;

  @Expose()
  public quantity: number;

  @Expose()
  public createdAt: Date;

  public static newFromProduct(product: Product) {
    return plainToClass(ProductUseCaseDto, product);
  }

  public static newListFromProduct(products: Product[]) {
    return products.map((product) => this.newFromProduct(product));
  }
}
