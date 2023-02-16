import { OrderStatus } from '../../entity/type/OrderStatus';

export interface EditOrderStatus {
  id: string;
  status: OrderStatus;
}
