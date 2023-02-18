import { OrderStatus } from '../../entity/type/OrderStatus';

export interface EditOrderStatusPort {
  id: string;
  status: OrderStatus;
}
