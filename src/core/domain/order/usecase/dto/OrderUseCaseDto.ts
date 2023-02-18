import { ProductUseCaseDto } from '@core/domain/product/usecase/dto/ProductUseCaseDto';
import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsDate, IsEnum, IsString } from 'class-validator';
import { Order } from '../../entity/Order';
import { OrderStatus } from '../../entity/type/OrderStatus';
import { Payment } from '../../entity/type/PaymentEnum';

@Exclude()
export class OrderUseCaseDto {
  @Expose()
  @IsString()
  public id: string;

  @Expose()
  @IsString()
  public userId: string;

  public products: ProductUseCaseDto[];

  @Expose()
  @IsEnum(Payment)
  public paymentMethod: Payment;

  @Expose()
  @IsEnum(OrderStatus)
  public status: OrderStatus;

  @Expose()
  @IsDate()
  public createdAt: Date;

  public static newFromOrder(order: Order): OrderUseCaseDto {
    const dto = plainToClass(OrderUseCaseDto, order);
    const products = order.getProducts();
    dto.products = ProductUseCaseDto.newListFromProduct(products);
    return dto;
  }

  public static newListFromOrder(order: Order[]): OrderUseCaseDto[] {
    return order.map((order) => this.newFromOrder(order));
  }
}
