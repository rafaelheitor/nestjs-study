import { Order } from '@core/domain/order/entity/Order';
import { OrderRepositoryPort } from '@core/domain/order/port/persistence/OrderRepositoryPort';
import { OrderUseCaseDto } from '@core/domain/order/usecase/dto/OrderUseCaseDto';
import { GetAllOrdersUseCase } from '@core/domain/order/usecase/GetAllOrdersUseCase';
import { Product } from '@core/domain/product/entity/Product';
import { OrderRepositoryInMemory } from '@infrastructure/adapter/persistence/OrderRepositoryAdapter';
import { Test, TestingModule } from '@nestjs/testing';
import { GetAllOrdersService } from './GetAllOrdersService';

describe('GetAllOrdersService', () => {
  let getAllOrdersUseCase: GetAllOrdersUseCase;
  let orderRepository: OrderRepositoryPort;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'OrderRepository',
          useClass: OrderRepositoryInMemory,
        },
        {
          provide: 'GetAllOrdersUseCase',
          useFactory: (orderRepository) =>
            new GetAllOrdersService(orderRepository),
          inject: ['OrderRepository'],
        },
      ],
    }).compile();

    getAllOrdersUseCase = module.get<GetAllOrdersUseCase>(
      'GetAllOrdersUseCase',
    );
    orderRepository = module.get<OrderRepositoryPort>('OrderRepository');
  });

  test('Should return all orders saved in repository', async () => {
    const product: Product = await createProduct();
    const mockOrder: Order = await Order.new({
      userId: 'Mock userId',
      products: [product],
    });

    jest.spyOn(orderRepository, 'getAll').mockImplementation(async () => {
      return [mockOrder];
    });

    const expectOrderUseCaseDto: OrderUseCaseDto[] =
      OrderUseCaseDto.newListFromOrder([mockOrder]);

    const resultOrderUseCaseDto: OrderUseCaseDto[] =
      await getAllOrdersUseCase.execute();

    expect(expectOrderUseCaseDto).toStrictEqual(resultOrderUseCaseDto);
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
