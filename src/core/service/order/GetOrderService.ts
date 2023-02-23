import { Code } from '@core/common/code/Code';
import { Exception } from '@core/common/exception/Exception';
import { CoreAssert } from '@core/common/util/assert/CoreAssert';
import { Order } from '@core/domain/order/entity/Order';
import { OrderRepositoryPort } from '@core/domain/order/port/persistence/OrderRepositoryPort';
import { GetOrderPort } from '@core/domain/order/port/usecase/GetOrderPort';
import { OrderUseCaseDto } from '@core/domain/order/usecase/dto/OrderUseCaseDto';
import { GetOrderUseCase } from '@core/domain/order/usecase/GetOrderUseCase';

export class GetOrderService implements GetOrderUseCase {
  constructor(private readonly orderRepository: OrderRepositoryPort) {}

  async execute(port?: GetOrderPort): Promise<OrderUseCaseDto> {
    const order: Order = CoreAssert.notEmpty(
      await this.orderRepository.getOrder(port.id),
      Exception.new({
        code: Code.ENTITY_NOT_FOUND_ERROR,
        overrideMessage: `Order ${port.id} was not found`,
      }),
    );

    return OrderUseCaseDto.newFromOrder(order);
  }
}
