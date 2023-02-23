import { Code } from '@core/common/code/Code';
import { Exception } from '@core/common/exception/Exception';
import { ClassValidationDetails } from '@core/common/util/classValidator/ClassValidator';
import { Order } from '@core/domain/order/entity/Order';
import { OrderRepositoryPort } from '@core/domain/order/port/persistence/OrderRepositoryPort';
import { CreateOrderPort } from '@core/domain/order/port/usecase/CreateOrderPort';
import { CreateOrderUseCase } from '@core/domain/order/usecase/CreateOrderUseCase';
import { OrderUseCaseDto } from '@core/domain/order/usecase/dto/OrderUseCaseDto';
import { ProductDITokens } from '@core/domain/product/di/ProductDITokens';
import { Product } from '@core/domain/product/entity/Product';
import { ProductRepositoryPort } from '@core/domain/product/port/persistence/ProductRepositoryPort';
import { OrderRepositoryInMemory } from '@infrastructure/adapter/persistence/OrderRepositoryAdapter';
import { ProductRepositoryInMemory } from '@infrastructure/adapter/persistence/ProductRepositoryAdapter';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateOrderService } from './CreateOrderService';

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

  test('Should throw exception if product was not found in repository', async () => {
    const product = await createProduct();

    const createOrderPort: CreateOrderPort = {
      userId: 'Mock UserID',
      products: [{ productId: product.getId() }],
    };

    jest.spyOn(productRepository, 'getProduct').mockImplementation(async () => {
      return undefined;
    });

    expect.hasAssertions();

    try {
      await createOrderUseCase.execute(createOrderPort);
    } catch (error) {
      const exception: Exception<ClassValidationDetails> =
        error as Exception<ClassValidationDetails>;

      expect(exception).toBeInstanceOf(Exception);
      expect(exception.code).toBe(Code.ENTITY_NOT_FOUND_ERROR.code);
    }
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
