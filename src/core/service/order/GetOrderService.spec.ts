import { Code } from '@core/common/code/Code';
import { Exception } from '@core/common/exception/Exception';
import { ClassValidationDetails } from '@core/common/util/classValidator/ClassValidator';
import { Order } from '@core/domain/order/entity/Order';
import { OrderRepositoryPort } from '@core/domain/order/port/persistence/OrderRepositoryPort';
import { OrderUseCaseDto } from '@core/domain/order/usecase/dto/OrderUseCaseDto';
import { GetOrderUseCase } from '@core/domain/order/usecase/GetOrderUseCase';
import { Product } from '@core/domain/product/entity/Product';
import { OrderRepositoryInMemory } from '@infrastructure/adapter/persistence/OrderRepositoryAdapter';
import { Test, TestingModule } from '@nestjs/testing';
import { GetOrderService } from './GetOrderService';

describe('GetOrderService', () => {
  let getOrderUseCase: GetOrderUseCase;
  let orderRepository: OrderRepositoryPort;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'OrderRepository',
          useClass: OrderRepositoryInMemory,
        },
        {
          provide: 'GetOrderUseCase',
          useFactory: (orderRepository) => new GetOrderService(orderRepository),
          inject: ['OrderRepository'],
        },
      ],
    }).compile();

    getOrderUseCase = module.get<GetOrderUseCase>('GetOrderUseCase');
    orderRepository = module.get<OrderRepositoryPort>('OrderRepository');
  });

  test('Should return order if was found in repository', async () => {
    const product: Product = await createProduct();

    const mockOrder: Order = await Order.new({
      userId: 'Mock userId',
      products: [product],
    });

    jest.spyOn(orderRepository, 'getOrder').mockImplementation(async () => {
      return mockOrder;
    });

    const expectedOrderUseCaseDto: OrderUseCaseDto =
      OrderUseCaseDto.newFromOrder(mockOrder);

    const foundOrder: OrderUseCaseDto = await getOrderUseCase.execute({
      id: mockOrder.getId(),
    });

    expect(foundOrder).toStrictEqual(expectedOrderUseCaseDto);
  });

  test('Should throw exception if order was not found', async () => {
    const product: Product = await createProduct();
    const mockOrder: Order = await Order.new({
      userId: 'Mock userId',
      products: [product],
    });

    jest.spyOn(orderRepository, 'getOrder').mockImplementation(async () => {
      return undefined;
    });

    expect.hasAssertions();

    try {
      await getOrderUseCase.execute({
        id: mockOrder.getId(),
      });
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
