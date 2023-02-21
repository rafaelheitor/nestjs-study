import { OrderStatus } from '../../entity/type/OrderStatus';
import { Payment } from '../../entity/type/PaymentEnum';

export interface CreateOrderPort {
  userId: string;
  products: { productId: string }[];
  paymentMethod?: Payment;
  status?: OrderStatus;
}
