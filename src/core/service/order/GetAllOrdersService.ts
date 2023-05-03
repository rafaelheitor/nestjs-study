import { Order } from '@core/domain/order/entity/Order';
import { OrderRepositoryPort } from '@core/domain/order/port/persistence/OrderRepositoryPort';
import { OrderUseCaseDto } from '@core/domain/order/usecase/dto/OrderUseCaseDto';
import { GetAllOrdersUseCase } from '@core/domain/order/usecase/GetAllOrdersUseCase';

export class GetAllOrdersService implements GetAllOrdersUseCase {
  constructor(private readonly orderRepository: OrderRepositoryPort) {}

  async execute(): Promise<OrderUseCaseDto[]> {
    const allOrders: Order[] = await this.orderRepository.getAll();

    return OrderUseCaseDto.newListFromOrder(allOrders);
  }
}
