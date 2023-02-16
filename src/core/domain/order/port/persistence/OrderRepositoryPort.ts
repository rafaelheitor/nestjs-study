import { Order } from '../../entity/Order';
import { OrderStatus } from '../../entity/type/OrderStatus';

export interface OrderRepositoryPort {
  saveOrder(order: Order): Promise<Order>;
  getOrder(id: string): Promise<Order>;
  getUserOrders(userId?: string): Promise<Order[]>;
  getAllOrders(): Promise<Order[]>;
  editOrderStatus(id: string, status: OrderStatus): Promise<Order>;
}
