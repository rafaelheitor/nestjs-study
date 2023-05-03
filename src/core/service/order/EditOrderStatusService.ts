import { Code } from '@core/common/code/Code';
import { Exception } from '@core/common/exception/Exception';
import { CoreAssert } from '@core/common/util/assert/CoreAssert';
import { Order } from '@core/domain/order/entity/Order';
import { OrderRepositoryPort } from '@core/domain/order/port/persistence/OrderRepositoryPort';
import { EditOrderStatusPort } from '@core/domain/order/port/usecase/EditOrderStautsPort';
import { OrderUseCaseDto } from '@core/domain/order/usecase/dto/OrderUseCaseDto';
import { EditOrderStatusUseCase } from '@core/domain/order/usecase/EditOrderStatusUseCase';

export class EditOrderStatusService implements EditOrderStatusUseCase {
  constructor(private readonly orderRepository: OrderRepositoryPort) {}

  async execute(port?: EditOrderStatusPort): Promise<OrderUseCaseDto> {
    const foundOrder: Order = CoreAssert.notEmpty(
      await this.orderRepository.getOne(port.id),
      Exception.new({
        code: Code.ENTITY_NOT_FOUND_ERROR,
        overrideMessage: `Order ${port.id} was not found`,
      }),
    );

    foundOrder.updateStatus({
      status: port.status,
    });

    this.orderRepository.edit(port.id, port.status);
    return OrderUseCaseDto.newFromOrder(foundOrder);
  }
}
