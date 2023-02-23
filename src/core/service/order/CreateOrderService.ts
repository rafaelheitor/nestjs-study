import { Code } from '@core/common/code/Code';
import { Exception } from '@core/common/exception/Exception';
import { CoreAssert } from '@core/common/util/assert/CoreAssert';
import { Order } from '@core/domain/order/entity/Order';
import { OrderRepositoryPort } from '@core/domain/order/port/persistence/OrderRepositoryPort';
import { CreateOrderPort } from '@core/domain/order/port/usecase/CreateOrderPort';
import { CreateOrderUseCase } from '@core/domain/order/usecase/CreateOrderUseCase';
import { OrderUseCaseDto } from '@core/domain/order/usecase/dto/OrderUseCaseDto';
import { Product } from '@core/domain/product/entity/Product';
import { ProductRepositoryPort } from '@core/domain/product/port/persistence/ProductRepositoryPort';

export class CreateOrderService implements CreateOrderUseCase {
  constructor(
    private readonly orderRepository: OrderRepositoryPort,
    private readonly productRepository: ProductRepositoryPort,
  ) {}

  async execute(port?: CreateOrderPort): Promise<OrderUseCaseDto> {
    const filteredProducts: Product[] = [];

    for (const product of port.products) {
      const foundProduct = await this.productRepository.getProduct(
        product.productId,
      );
      CoreAssert.notEmpty(
        foundProduct,
        Exception.new({
          code: Code.ENTITY_NOT_FOUND_ERROR,
          overrideMessage: `Product ${product.productId} was not found`,
        }),
      );
      filteredProducts.push(foundProduct);
    }

    const order: Order = await Order.new({
      userId: port.userId,
      products: filteredProducts,
      paymentMethod: port.paymentMethod,
    });

    this.orderRepository.saveOrder(order);
    return OrderUseCaseDto.newFromOrder(order);
  }
}
