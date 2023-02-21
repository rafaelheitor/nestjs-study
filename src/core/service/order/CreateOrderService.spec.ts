import { ProductModule } from '@application/di/ProductModule';
import { Code } from '@core/common/code/Code';
import { Exception } from '@core/common/exception/Exception';
import { CoreAssert } from '@core/common/util/assert/CoreAssert';
import { Order } from '@core/domain/order/entity/Order';
import { OrderStatus } from '@core/domain/order/entity/type/OrderStatus';
import { OrderRepositoryPort } from '@core/domain/order/port/persistence/OrderRepositoryPort';
import { CreateOrderPort } from '@core/domain/order/port/usecase/CreateOrderPort';
import { CreateOrderUseCase } from '@core/domain/order/usecase/CreateOrderUseCase';
import { OrderUseCaseDto } from '@core/domain/order/usecase/dto/OrderUseCaseDto';
import { ProductDITokens } from '@core/domain/product/di/ProductDITokens';
import { Product } from '@core/domain/product/entity/Product';
import { ProductRepositoryPort } from '@core/domain/product/port/persistence/ProductRepositoryPort';
import { ProductRepositoryInMemory } from '@infrastructure/adapter/persistence/ProductRepositoryAdapter';
import { Test, TestingModule } from '@nestjs/testing';
import { json } from 'stream/consumers';

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

describe('CreateOrderService', () => {
  let createOrderUseCase: CreateOrderUseCase;
  let orderRepository: OrderRepositoryPort;
  let productRepository: ProductRepositoryPort;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ProductDITokens.ProductRepository,
          useClass: ProductRepositoryInMemory,
        },
        {
          provide: 'OrderRepository',
          useClass: OrderRepositoryInMemory,
        },
        {
          provide: 'CreateOrderUseCase',
          useFactory: (orderRepository, productRepository) =>
            new CreateOrderService(orderRepository, productRepository),
          inject: ['OrderRepository', ProductDITokens.ProductRepository],
        },
      ],
    }).compile();

    createOrderUseCase = module.get<CreateOrderUseCase>('CreateOrderUseCase');
    orderRepository = module.get<OrderRepositoryPort>('OrderRepository');
    productRepository = module.get<ProductRepositoryPort>(
      ProductDITokens.ProductRepository,
    );
  });

  test('Should create Order', async () => {
    const product = await createProduct();
    const createOrderPort: CreateOrderPort = {
      userId: 'Mock UserID',
      products: [{ productId: product.getId() }],
    };
    const mockOrder: Order = await Order.new({
      userId: createOrderPort.userId,
      products: [product],
    });

    jest.spyOn(productRepository, 'getProduct').mockImplementation(async () => {
      return product;
    });

    jest.spyOn(orderRepository, 'saveOrder').mockImplementation(async () => {
      return mockOrder;
    });

    const expectedOrderUseCaseDto: OrderUseCaseDto =
      OrderUseCaseDto.newFromOrder(mockOrder);

    const result: OrderUseCaseDto = await createOrderUseCase.execute(
      createOrderPort,
    );

    Reflect.set(result, 'createdAt', expectedOrderUseCaseDto.createdAt);
    Reflect.set(
      result.products,
      'createdAt',
      expectedOrderUseCaseDto.products[0].createdAt,
    );

    expect(productRepository.getProduct).toHaveBeenCalledWith(
      mockOrder.getProducts()[0].getId(),
    );

    expect(JSON.stringify(expectedOrderUseCaseDto)).toStrictEqual(
      JSON.stringify(result),
    );
  });
});

async function createProduct(): Promise<Product> {
  return Product.new({
    name: 'Product name',
    image: 'Product Image',
    price: 10,
    quantity: 20,
  });
}
