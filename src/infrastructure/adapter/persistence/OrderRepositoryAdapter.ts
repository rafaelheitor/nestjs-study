import { Order } from '@core/domain/order/entity/Order';
import { OrderStatus } from '@core/domain/order/entity/type/OrderStatus';
import { OrderRepositoryPort } from '@core/domain/order/port/persistence/OrderRepositoryPort';

export class OrderRepositoryInMemory implements OrderRepositoryPort {
  saveOrder(order: Order): Promise<Order> {
    throw new Error('Method not implemented.');
  }
  getOrder(id: string): Promise<Order> {
    throw new Error('Method not implemented.');
  }
  getUserOrders(userId?: string): Promise<Order[]> {
    throw new Error('Method not implemented.');
  }
  getAllOrders(): Promise<Order[]> {
    throw new Error('Method not implemented.');
  }
  editOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    throw new Error('Method not implemented.');
  }
}
