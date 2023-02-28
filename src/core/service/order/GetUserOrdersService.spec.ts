import { Order } from '@core/domain/order/entity/Order';
import { OrderRepositoryPort } from '@core/domain/order/port/persistence/OrderRepositoryPort';
import { GetUserOrdersPort } from '@core/domain/order/port/usecase/GetUserOrdersPort';
import { OrderUseCaseDto } from '@core/domain/order/usecase/dto/OrderUseCaseDto';
import { GetUserOrdersUseCase } from '@core/domain/order/usecase/GetUserOrdersUseCase';
import { Product } from '@core/domain/product/entity/Product';
import { OrderRepositoryInMemory } from '@infrastructure/adapter/persistence/OrderRepositoryAdapter';
import { Test, TestingModule } from '@nestjs/testing';

export class GetUserOrdersService implements GetUserOrdersUseCase {
  constructor(private readonly orderRepository: OrderRepositoryPort) {}

  async execute(port?: GetUserOrdersPort): Promise<OrderUseCaseDto[]> {
    const orders: Order[] = await this.orderRepository.getUserOrders(
      port.userId,
    );

    return OrderUseCaseDto.newListFromOrder(orders);
  }
}

describe('GetUserOrdersService', () => {
  let getUserOrdersUseCase: GetUserOrdersUseCase;
  let orderRepository: OrderRepositoryPort;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'OrderRepository',
          useClass: OrderRepositoryInMemory,
        },
        {
          provide: 'GetUserOrdersUseCase',
          useFactory: (orderRepository) =>
            new GetUserOrdersService(orderRepository),
          inject: ['OrderRepository'],
        },
      ],
    }).compile();
    getUserOrdersUseCase = module.get<GetUserOrdersUseCase>(
      'GetUserOrdersUseCase',
    );
    orderRepository = module.get<OrderRepositoryPort>('OrderRepository');
  });

  test('Should return all orders of a given user', async () => {
    const product: Product = await createProduct();

    const mockOrder: Order = await Order.new({
      userId: 'Mock user Id',
      products: [product],
    });

    jest
      .spyOn(orderRepository, 'getUserOrders')
      .mockImplementation(async () => {
        return [mockOrder];
      });

    const expectedOrderUseCaseDto: OrderUseCaseDto[] =
      OrderUseCaseDto.newListFromOrder([mockOrder]);

    const resultOrderUseCaseDto: OrderUseCaseDto[] =
      await getUserOrdersUseCase.execute({
        userId: mockOrder.getUserId(),
      });

    expect(resultOrderUseCaseDto).toStrictEqual(expectedOrderUseCaseDto);
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
