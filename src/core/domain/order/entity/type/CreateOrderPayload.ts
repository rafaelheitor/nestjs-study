import { Product } from '@core/domain/product/entity/Product';
import { Payment } from './PaymentEnum';

export type CreateOrderPayload = {
  userId: string;
  products: Product[];
  paymentMethod?: Payment;
  createdAt?: Date;
};
