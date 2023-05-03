import { AbstractRepository } from '@core/common/persistence/Repository';
import { Order } from '../../entity/Order';
import { OrderStatus } from '../../entity/type/OrderStatus';

export interface OrderRepositoryPort extends AbstractRepository<Order> {
  getUserOrders(userId?: string): Promise<Order[]>;
  edit(id: string, status: OrderStatus): Promise<Order>;
}
