import { Product } from '@core/domain/product/entity/Product';
import { OrderStatus } from '../../entity/type/OrderStatus';
import { Payment } from '../../entity/type/PaymentEnum';

export interface CreateOrderPort {
  userId: string;
  products: Product[];
  paymentMethod: Payment;
  status: OrderStatus;
}
