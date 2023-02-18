import { Product } from '@core/domain/product/entity/Product';
import { ProductUseCaseDto } from '@core/domain/product/usecase/dto/ProductUseCaseDto';
import { Order } from '../../entity/Order';
import { Payment } from '../../entity/type/PaymentEnum';
import { OrderUseCaseDto } from './OrderUseCaseDto';

describe('OrderUseCaseDto', () => {
  test('Should create OrderUseCaseDto', async () => {
    const product: Product = await createProduct();
    const mockProductList: Product[] = [product];

    const mockOrder = await Order.new({
      userId: 'Mock user id',
      paymentMethod: Payment.CREDITCARD,
      products: mockProductList,
    });

    const orderUseCaseDto: OrderUseCaseDto =
      OrderUseCaseDto.newFromOrder(mockOrder);

    const mockProductDto: ProductUseCaseDto[] =
      ProductUseCaseDto.newListFromProduct(mockOrder.getProducts());

    expect(orderUseCaseDto.id).toBe(mockOrder.getId());
    expect(orderUseCaseDto.userId).toBe(mockOrder.getUserId());
    expect(orderUseCaseDto.products).toStrictEqual(mockProductDto);
    expect(orderUseCaseDto.paymentMethod).toBe(mockOrder.getPaymentMethod());
    expect(orderUseCaseDto.status).toBe(mockOrder.getStatus());
  });

  test('Should create a new list from OrderUsecaseDto', async () => {
    const product: Product = await createProduct();

    const mockOrder: Order = await Order.new({
      userId: 'Mock User id',
      paymentMethod: Payment.CREDITCARD,
      products: [product],
    });

    const mockOrderList: Order[] = [mockOrder];

    const mockProductDto: ProductUseCaseDto[] =
      ProductUseCaseDto.newListFromProduct(mockOrder.getProducts());

    const orderListUseCaseDto: OrderUseCaseDto[] =
      OrderUseCaseDto.newListFromOrder(mockOrderList);

    expect(orderListUseCaseDto[0].id).toBe(mockOrder.getId());
    expect(orderListUseCaseDto[0].userId).toBe(mockOrder.getUserId());
    expect(orderListUseCaseDto[0].products).toStrictEqual(mockProductDto);
    expect(orderListUseCaseDto[0].paymentMethod).toBe(
      mockOrder.getPaymentMethod(),
    );
    expect(orderListUseCaseDto[0].status).toBe(mockOrder.getStatus());
  });
});

async function createProduct(): Promise<Product> {
  return Product.new({
    id: 'Mock Id',
    name: 'Product name',
    image: 'Product Image',
    price: 10,
    quantity: 20,
  });
}
