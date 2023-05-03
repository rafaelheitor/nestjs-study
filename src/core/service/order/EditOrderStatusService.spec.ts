import { Code } from '@core/common/code/Code';
import { Exception } from '@core/common/exception/Exception';
import { ClassValidationDetails } from '@core/common/util/classValidator/ClassValidator';
import { Order } from '@core/domain/order/entity/Order';
import { OrderStatus } from '@core/domain/order/entity/type/OrderStatus';
import { OrderRepositoryPort } from '@core/domain/order/port/persistence/OrderRepositoryPort';
import { OrderUseCaseDto } from '@core/domain/order/usecase/dto/OrderUseCaseDto';
import { EditOrderStatusUseCase } from '@core/domain/order/usecase/EditOrderStatusUseCase';
import { Product } from '@core/domain/product/entity/Product';
import { OrderRepositoryInMemory } from '@infrastructure/adapter/persistence/OrderRepositoryAdapter';
import { Test, TestingModule } from '@nestjs/testing';
import { EditOrderStatusService } from './EditOrderStatusService';

describe('EditOrderStatusService', () => {
  let editOrderStatusUseCase: EditOrderStatusUseCase;
  let orderRepository: OrderRepositoryPort;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'OrderRepository',
          useClass: OrderRepositoryInMemory,
        },
        {
          provide: 'EditOrderStatusUseCase',
          useFactory: (orderRepository) =>
            new EditOrderStatusService(orderRepository),
          inject: ['OrderRepository'],
        },
      ],
    }).compile();
    editOrderStatusUseCase = module.get<EditOrderStatusUseCase>(
      'EditOrderStatusUseCase',
    );
    orderRepository = module.get<OrderRepositoryPort>('OrderRepository');
  });

  test('Should update order status', async () => {
    const product: Product = await createProduct();
    const mockOrder: Order = await Order.new({
      userId: 'Mock userId',
      products: [product],
    });

    jest.spyOn(orderRepository, 'getOne').mockImplementation(async () => {
      return mockOrder;
    });

    jest.spyOn(orderRepository, 'edit').mockImplementation(async () => {
      return mockOrder;
    });

    const result: OrderUseCaseDto = await editOrderStatusUseCase.execute({
      id: mockOrder.getId(),
      status: OrderStatus.PaymentApproved,
    });

    expect(result.status).toBe(OrderStatus.PaymentApproved);
  });

  test('Should throw exception if Order was not found', async () => {
    const product: Product = await createProduct();
    const mockOrder: Order = await Order.new({
      userId: 'Mock userId',
      products: [product],
    });

    jest.spyOn(orderRepository, 'getOne').mockImplementation(async () => {
      return undefined;
    });

    expect.hasAssertions();

    try {
      await editOrderStatusUseCase.execute({
        id: mockOrder.getId(),
        status: OrderStatus.PaymentApproved,
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
