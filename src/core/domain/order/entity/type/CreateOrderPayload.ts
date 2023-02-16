import { Product } from '@core/domain/product/entity/Product';
import { OrderStatus } from './OrderStatus';
import { Payment } from './PaymentEnum';

export type CreateOrderPayload = {
  userId: string;
  products: Product[];
  paymentMethod?: Payment;
  status?: OrderStatus;
  createdAt?: Date;
};
