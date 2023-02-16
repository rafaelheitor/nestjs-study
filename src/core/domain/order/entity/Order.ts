import { Entity } from '@core/common/entity/Entity';
import { Product } from '@core/domain/product/entity/Product';
import { IsDate, IsEnum, IsString } from 'class-validator';
import { CreateOrderPayload } from './type/CreateOrderPayload';
import { Payment } from './type/PaymentEnum';

export class Order extends Entity<string> {
  @IsString()
  private userId: string;

  private products: Product[];

  @IsEnum(Payment)
  private paymentMethod: Payment;

  @IsDate()
  private createdAt: Date;

  private constructor(payload: CreateOrderPayload) {
    super();
    this.userId = payload.userId;
    this.products = payload.products;
    this.paymentMethod = payload.paymentMethod || Payment.CASH;
    this.createdAt = payload.createdAt || new Date();
  }

  getId(): string {
    return this.id;
  }

  getUserId(): string {
    return this.userId;
  }

  getProducts(): Product[] {
    return this.products;
  }

  getPaymentMethod(): Payment {
    return this.paymentMethod;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  public static async new(payload: CreateOrderPayload): Promise<Order> {
    const order: Order = new Order(payload);
    await order.validate();
    return order;
  }
}
