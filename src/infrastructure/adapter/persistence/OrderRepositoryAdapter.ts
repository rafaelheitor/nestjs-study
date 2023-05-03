import { Order } from '@core/domain/order/entity/Order';
import { OrderStatus } from '@core/domain/order/entity/type/OrderStatus';
import { OrderRepositoryPort } from '@core/domain/order/port/persistence/OrderRepositoryPort';

export class OrderRepositoryInMemory implements OrderRepositoryPort {
  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  save(order: Order): Promise<Order> {
    throw new Error('Method not implemented.');
  }
  getOne(id: string): Promise<Order> {
    throw new Error('Method not implemented.');
  }
  getUserOrders(userId?: string): Promise<Order[]> {
    throw new Error('Method not implemented.');
  }
  getAll(): Promise<Order[]> {
    throw new Error('Method not implemented.');
  }
  edit(id: string, status: OrderStatus): Promise<Order> {
    throw new Error('Method not implemented.');
  }
}
